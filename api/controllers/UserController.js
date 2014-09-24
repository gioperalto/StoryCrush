/**
 * UserController
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

var UserController = {

	create: function(req, res) {
		//TODO: implement create logic
	},

	delete: function(req, res) {
		//TODO: implement delete logic
	},

	update_email: function(req, res) {
		var email 					= req.param('email');

		User.findOneByEmail(req.session.user.email)
		.done(function updateFindEmail(err, usr) {
			if(err) {
				// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
			} else {
				User.findOneByEmail(email)
				.done(function updateFindDuplicates(error, user) {
					if(error) {
						// We set an error header here,
			    		// which we access in the views an display in the alert call.
			    		res.set('error', 'DB Error');
			    		// The error object sent below is converted to JSON
			    		res.send(500, { error: "DB Error" });
					} else if(user) {
						console.log('Error: User with this email already exists!');
					} else {
						usr.email 			= email;
						req.session.user 	= usr;
						usr.save(function(error) {
							if(error) {
								console.log('Email not saved!');
							} else {
								// console.log(usr);
								res.send(usr);
								res.redirect('/profile');
							}
						});
					}
				});
				
			}
		});
	},

	update_password: function(req, res) {
		var password 				= req.param('password');

		User.findOneByEmail(req.session.user.email)
		.done(function updateFindPassword(err, usr) {
			if(err) {
				// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
			} else {
				var hasher 			= require("password-hash");
		    	password 			= hasher.generate(password);

		    	usr.password 		= password;
		    	req.session.user 	= usr;
		    	usr.save(function(error) {
		    		if(error) {
	    				console.log('Password not saved!');
					} else {
						// console.log(usr);
						res.send(usr);
						res.redirect('/profile');
					}
		    	});
			}
		});
	},

	upgrade: function(req, res) {
		//TODO: Implement upgrade logic
	},

	update_picture: function(req, res) {
		var picture 				= req.param('picture');

		User.findOneByEmail(req.session.user.email)
		.done(function updateFindPicture(err, usr) {
			if(err) {
				// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
			} else {
				usr.picture 		= picture;
				req.session.user 	= usr;
				usr.save(function(error) {
					if(error) {
	    				console.log('Picture not saved!');
					} else {
						// console.log(usr);
						res.send(usr);
						res.redirect('/profile');
					}
				});
			}
		});
	},

	reset_picture: function(req, res) {

		User.findOneByEmail(req.session.user.email)
		.done(function resetFindUser(err, usr) {
			if(err) {
				// We set an error header here,
	    		// which we access in the views an display in the alert call.
	    		res.set('error', 'DB Error');
	    		// The error object sent below is converted to JSON
	    		res.send(500, { error: "DB Error" });
			} else {
				usr.picture 		= '/images/profile/default.jpg';
				req.session.user 	= usr;
				usr.save(function(error) {
					if(error) {
	    				console.log('Picture not reset!');
					} else {
						// console.log(usr);
						res.send(usr);
						res.redirect('/profile');
					}
				});
			}
		});

	},

};

module.exports = UserController;
