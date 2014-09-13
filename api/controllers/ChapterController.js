/**
 * ChaptersController
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

var ChapterController = {

	create: function(req, res) {
		var storyName 		= req.param('storyName');
		var chapterName 	= req.param('chapterName');
		var pages 			= req.param('pages');

		Stories.findOneByName(storyName)
		.done(function findStory(err, story) {
				if(err) {
					// We set an error header here,
		    		// which we access in the views an display in the alert call.
		    		res.set('error', 'DB Error');
		    		// The error object sent below is converted to JSON
		    		res.send(500, { error: "DB Error" });
				} else if(story) {
					Chapter.create({name: chapterName, pages: pages, story_id: story.id})
					.done(function createChapter(err, chptr) {
						if(err) {
							// Set the error header
		        			res.set('error', 'DB Error');
		        			res.send(500, { error: "DB Error" });
						} else {
							console.log(chptr);
							res.send(chptr);
						}
					});
				} else {
					res.set('error', 'Story not Found');
		      		res.send(404, { error: "Story not Found"});
				}
			}
		);
	},

	read: function(req, res) {
		//TODO: Implement logic
	},

};

module.exports = ChapterController;
