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
 		if(req.session.user) {
			res.view({user: req.session.user, publisher: req.session.publisher, admin: req.session.admin});
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