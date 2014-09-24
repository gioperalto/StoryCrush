/**
 * MainController
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

var MainController = {

	index: function(req, res) {
		var featured = {}, // variable to hold search results
		status = 3; // 3 is status for approved

		Story.find({
			where: {status: status},
			limit: 5,
			sort: 'createdAt DESC'
		}).done(function indexFindStories(err, ftrd) {
 			if(err) {
 				// We set an error header here,
		    	// which we access in the views an display in the alert call.
		    	res.set('error', 'DB Error');
		    	// The error object sent below is converted to JSON
		    	res.send(500, { error: "DB Error" });
 			} else if(ftrd) {
 				// console.log(ftrd);
 				featured = ftrd;
 				// res.send(ftrd);
 			} else {
 				res.set('error', 'Stories not Found');
		      	res.send(404, { error: "Stories not Found"});
 			}
 		});

		res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin, featured: featured});
	},

	coming_soon: function(req, res) {
		res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
	},

	find: function(req, res) {
		res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
	},

	filter: function(req, res) {
		if(req.body.category) {
			var category = req.param('category');

			Story.find({
				where: {
					category: category,
					status: 3
				},
				limit: 60,
				sort: 'createdAt DESC'
			}).done(function filterFindStories(err, strys) {
				if(err) {
					// We set an error header here,
			    	// which we access in the views an display in the alert call.
			    	res.set('error', 'DB Error');
			    	// The error object sent below is converted to JSON
			    	res.send(500, { error: "DB Error" });
				} else if(strys) {
					//TODO: Make more efficient
					// console.log(strys);	
	 				req.session.stories = strys;
	 				res.send(strys);
				} else {
					res.set('error', 'Stories not Found');
			      	res.send(404, { error: "Stories not Found"});
				}
			});
		}
	},

	stories: function(req, res) {
		res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin, stories: req.session.stories});
	},

	pricing: function(req,res) {
		res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
	},

	signup: function (req, res) {
		var username 		= req.param('username');
		var email 			= req.param('email');
		var password 		= req.param('password');
		// User.findByUsername(username)...
		// In v0.9.0 the find method returns an empty array when no results are found
		// when only one result is needed use findOne.
		User.findOne({
			username: username,
			email: email
		}).done(function signupfindUser(err, usr) {
		  if (err) {
		    // We set an error header here,
		    // which we access in the views an display in the alert call.
		    res.set('error', 'DB Error');
		    // The error object sent below is converted to JSON
		    res.send(500, { error: "DB Error" });
		  } else if (usr) {
		    // Set the error header
		    res.set('error', 'Username and/or email is already in use');
		    res.send(400, { error: "Username and/or email is already in use"});
		  } else {
		    var hasher = require("password-hash");
		    password = hasher.generate(password);

		    User.create({ 
		    	username: username, 
		    	email: email, 
		    	password: password, 
		    	picture: '/images/profile/default.jpg', 
		    	premium: false
		    }).done(function signupCreateUser(error, user) {
		      if (error) {
		        // Set the error header
		        res.set('error', 'DB Error');
		        res.send(500, { error: "DB Error" });
		      } else {
		        req.session.user = user;
		        res.send(user);
		        res.redirect('/home');
		      }
		    });
		  }
		});
	},

	login: function (req, res) {
		var email 			= req.param('email');
		var password 		= req.param('password');

		// FINDS ALL USERS
		// User.find()
		// .done(function(err,found) {
		// 	if(err) {
		// 		console.log("Error!");
		// 	} else if(found) {
		// 		console.log(found);
		// 	}
		// 	else {
		// 		console.log("Nothing found!");
		// 	}
		// });

		// FINDS ALL PUBLISHERS
		// Publisher.find()
		// .done(function(err,found) {
		// 	if(err) {
		// 		console.log("Error!");
		// 	} else if(found) {
		// 		console.log(found);
		// 	} else {
		// 		console.log("Nothing found!");
		// 	}
		// });

		// FINDS ALL STORIES
		// Story.find()
		// .done(function(err, found) {
		// 	if(err) {
		// 		console.log("Error!");
		// 	} else if(found) {
		// 		console.log(found);
		// 	} else {
		// 		console.log("Nothing found!");
		// 	}
		// });

		// User.findByEmail(email)...
		// In v0.9.0 the find method returns an empty array when no results are found
		// when only one result is needed use findOne.
		User.findOneByEmail(email)
		.done(function loginfindUser(err, usr) {
		  if (err) {
		    // We set an error header here,
		    // which we access in the views an display in the alert call.
		    res.set('error', 'DB Error');
		    // The error object sent below is converted to JSON
		    res.send(500, { error: "DB Error" });
		  } else {
		    if (usr) {
		      var hasher = require("password-hash");
		      if (hasher.verify(password, usr.password)) {

		        var user = {
		        	username: usr.username,
					email: usr.email,
					picture: usr.picture,
					premium: usr.premium,
					id: usr.id,
		        };

		        req.session.user = user;

		        Publisher.findOneByUser_id(user.id)
		        .done(function loginFindPublisher(error, publisher) {
		        	if(error) {
		        		// We set an error header here,
		    			// which we access in the views an display in the alert call.
		    			res.set('error', 'DB Error');
		    			// The error object sent below is converted to JSON
		    			res.send(500, { error: "DB Error" });
		        	} else if(publisher) {
		        		req.session.publisher = publisher;
		        	}
		        });

		        Admin.findOneByUser_id(user.id)
		        .done(function loginFindAdmin(error, admin) {
		        	if(error) {
		        		// We set an error header here,
		    			// which we access in the views an display in the alert call.
		    			res.set('error', 'DB Error');
		    			// The error object sent below is converted to JSON
		    			res.send(500, { error: "DB Error" });
		        	} else if(admin) {
		        		// console.log(admin);
		        		req.session.admin = admin;
		        	}
		        })

		        res.send(usr);
		        // res.redirect('/home');
		      } else {
		        // Set the error header
		        res.set('error', 'Wrong Password/Email combination');
		        res.send(400, { error: "Wrong Password/Email combination" });
		      }
		    } else {
		      res.set('error', 'Email not Found');
		      res.send(404, { error: "Email not Found"});
		    }
		  }
		});
	},

};

module.exports = MainController;
