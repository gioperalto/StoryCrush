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

 var MemberController = {

 	index: function(req, res) {

 		var storyList = [];

 		if(req.session.user) {
 			List.find({user_id: req.session.user.id})
 			.done(function indexFindList(err, lst) {
 				if(err) {
 					// We set an error header here,
			    	// which we access in the views an display in the alert call.
			    	res.set('error', 'DB Error');
			    	// The error object sent below is converted to JSON
			    	res.send(500, { error: "DB Error" });
 				} else if(lst) {
 					for(var i = 0; i < lst.length; i++) {
	 					Story.findOneById(lst[i].story_id)
	 					.done(function indexFindStories(error, item) {
	 						if(error) {
	 							// We set an error header here,
				    			// which we access in the views an display in the alert call.
				    			res.set('error', 'DB Error');
				    			// The error object sent below is converted to JSON
				    			res.send(500, { error: "DB Error" });
	 						} else if(item) {
	 							storyList.push(item);
	 						} else {
	 							res.set('error', 'Stories not Found');
				      			res.send(404, { error: "Stories not Found"});
	 						}
	 					});
	 				}

	 				// console.log(storyList);
 				} else {
 					res.set('error', 'List not Found');
			      	res.send(404, { error: "List not Found"});
 				}
 			});

			res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin, list: storyList});
		} else {
 			res.redirect('/');
 		}
 	},
 	
 	welcome: function(req, res) {
 		if(req.session.user) {
			res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
		} else {
 			res.redirect('/');
 		}
 	},

 	profile: function(req, res) {
 		if(req.session.user) {
			res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
		} else {
 			res.redirect('/');
 		}
 	},

 	logout: function(req, res) {
 		req.session.user = null;
 		req.session.publisher = null;
 		req.session.admin = null;
 		req.session.stories = null; //TODO: Remove later
 		res.redirect('/');
 	},

 };

 module.exports = MemberController;