/**
 * StoriesController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */  

var StoryController = {

	// VIEW FOR CREATE ACTION
	add: function(req, res) {
		if(req.session.publisher && req.session.publisher.status == 1) {
			res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
		} else {
 			res.redirect('/find');
		}
	},

	// VIEW FOR UPDATE ACTION
	edit: function(req, res) {
		if(req.session.publisher && req.session.publisher.status == 1) {
			var name 			= req.query.name;

			Story.findOne({
				name: name,
				publisher: req.session.publisher.publishername
			}).done(function readFindStory(err, stry) {
				if(err) {
					// We set an error header here,
			    	// which we access in the views an display in the alert call.
			    	res.set('error', 'DB Error');
			    	// The error object sent below is converted to JSON
				} else if(stry) {
					res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin, story: stry});
				} else {
					res.set('error', 'Story not Found');
			      	res.send(404, { error: "Story not Found"});
				}
			});
		} else {
			res.redirect('/find');
		}
	},

	// CREATES A STORY
	create: function(req, res) {

		var name 			= req.param('name');
		var category		= req.param('category');
		var description 	= req.param('description');
		var full			= '/images/uploads/full/default.jpg';
		var thumb			= '/images/uploads/thumb/default.png';
		
		if(req.session.publisher) {
			// var premium 		= req.param('premium');
		}

		Story.findOneByName(name)
		.done(function createFindStory(err, stry) {
			if(err) {
				// We set an error header here,
		    	// which we access in the views an display in the alert call.
		    	res.set('error', 'DB Error');
		    	// The error object sent below is converted to JSON
		    	res.send(500, { error: "DB Error" });
			} else if(stry) {
				res.set('error', 'A story with this name already exists');
		    	res.send(400, { error: "A story with this name already exists"});
			} else {
				Story.create({ 
					name: name, 
					category: category, 
					description: description, 
					publisher: req.session.publisher.publishername, 
					full: full, 
					thumb: thumb, 
					premium: false, 
					status: 0
				}).done(function createCreateStory(error, story) {
				  if (error) {
			        // Set the error header
			        res.set('error', 'DB Error');
			        res.send(500, { error: "DB Error" });
			      } else {
			      	// console.log(story);
			        res.send(story);
			      }
				});
			}
		});
	},

	// VIEW OF A STORY
	read: function(req, res) {
		//TODO: Add story view validation

		var name 			= req.query.name;
		var list			= '';

		Story.findOneByName(name)
		.done(function readFindStory(err, stry) {
			if(err) {
				// We set an error header here,
		    	// which we access in the views an display in the alert call.
		    	res.set('error', 'DB Error');
		    	// The error object sent below is converted to JSON
			} else if(stry) {
				if(stry.status == 3 || req.session.publisher || req.session.admin) {
					if(req.session.user) {
						List.findOne({
							user_id: req.session.user.id,
							story_id: stry.id
						}).done(function findAssociation(error, assoc) {
							if(error) {
								// We set an error header here,
		    					// which we access in the views an display in the alert call.
		    					res.set('error', 'DB Error');
		    					// The error object sent below is converted to JSON
							} else if(assoc) {
								list = assoc;
							}
						});
					}
					res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin, story: stry, list: list});
				} else {
					res.redirect('/find');
				}
			} else {
				res.set('error', 'Story not Found');
		      	res.send(404, { error: "Story not Found"});
			}
		});
	},

	// UPDATES STORY INFORMATION
	update: function(req, res) {

		var name 			= req.param('name'),
			category 		= req.param('category'),
			description		= req.param('description'),
			full 			= req.files.full,
			thumb 			= req.files.thumb;


		var savedName 		= name.replace(/\s+/g,"-");

		var fullPath		= 'assets/images/uploads/full/' + savedName + full.path.substring(full.path.length - 4,full.path.length),
			thumbPath		= 'assets/images/uploads/thumb/' + savedName + thumb.path.substring(thumb.path.length - 4,thumb.path.length);


		var fs = require('fs');

		// RENAME FULL IMAGE TO LOCAL DIRECTORY
		if(full.name.trim() != '') {
			fs.rename(
				full.path,
				fullPath,
				function (err) {
				  if (err) {
				  	console.log(err);
				  }
				  console.log('File sucessfully uploaded.');
				}
			);
		}

		// RENAME THUMB IMAGE TO LOCAL DIRECTORY
		if(thumb.name.trim() != '') {
			fs.rename(
				thumb.path, 
				thumbPath,
				function (err) {
				  if (err) {
				  	console.log(err);
				  }
				  console.log('File sucessfully uploaded.');
				}
			);
		}

	    Story.findOneByName(name)
	    .done(function updateFindStory(err, story) {
	    	if(err) {
	    		// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
	    	} else {
	    		story.category = category;
	    		story.status = 1;
	    		story.full = fullPath.substring(6, fullPath.length);
	    		story.thumb = thumbPath.substring(6,thumbPath.length);

	    		if(description != null && description.trim() != '') {
	    			story.description = description;
	    		}

	    		story.save(function(error) {
	    			if(error) {
	    				console.log('Story not saved!')
	    			} else {
	    				console.log(story);
	    				res.send(story);
	    				res.redirect('/publish');
	    			}
	    		});
	    	}
	    });
	},

	// DELETES A STORY
	delete: function(req, res) {

		if(req.session.publisher && req.session.publisher.status == 1) {
			var name 			= req.param('name');

			Story.findOne({
				name: name,
				publisher: req.session.publisher.publishername
			}).done(function deleteFindStory(err, stry) {
				if(err) {
					// We set an error header here,
		    		// which we access in the views an display in the alert call.
		    		res.set('error', 'DB Error');
		    		// The error object sent below is converted to JSON
		    		res.send(500, { error: "DB Error" });
				} else if(stry) {
					Story.destroy({name: name})
					.exec(function deleteDeleteStory(error, story) {
						if(error) {
							// Set the error header
		        			res.set('error', 'DB Error');
		        			res.send(500, { error: "DB Error" });
						} else {
							res.send(story);
						}
					});
				} else {
					res.set('error', 'Story not Found');
		      		res.send(404, { error: "Story not found!"});
				}
			});
		} else {
			res.redirect('/find');
		}

	},

	// SUBMITS A STORY FOR APPROVAL
	submit: function(req, res) {
		var name 			= req.param('name');

		Story.findOneByName(name)
	    .done(function submitFindStory(err, story) {
	    	if(err) {
	    		// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
	    	} else {
	    		story.status = 2;

	    		story.save(function(error) {
	    			if(error) {
	    				console.log('Story not submitted!');
	    			} else {
	    				// console.log(story);
	    				res.send(story);
	    			}
	    		});
	    	}
	    });
	},

};

module.exports = StoryController;


