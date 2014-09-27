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
		var number 			= req.param('number');
		var storyName 		= req.param('storyName');
		var chapterName 	= req.param('chapterName');
		var content 		= req.param('content');

		Story.findOneByName(storyName)
		.done(function createFindStory(err, story) {
				if(err) {
					// We set an error header here,
		    		// which we access in the views an display in the alert call.
		    		res.set('error', 'DB Error');
		    		// The error object sent below is converted to JSON
		    		res.send(500, { error: "DB Error" });
				} else if(story) {
					Chapter.create({number: number, name: chapterName, content: content, story_id: story.id})
					.done(function createCreateChapter(err, chptr) {
						if(err) {
							// Set the error header
		        			res.set('error', 'DB Error');
		        			res.send(500, { error: "DB Error" });
						} else {
							// console.log(chptr);
							res.send(chptr);
							res.redirect('/story/edit?name=' + storyName);
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

	update: function(req, res) {
		//TODO: Implement logic
	},

	delete: function(req, res) {
		// DELETE ALL CHAPTERS
		// Chapter.find()
		// .done(function deleteShit(err, chptrs) {
		// 	Chapter.destroy()
		// 	.exec(function (error, chapters) {
		// 		if(error) {
		// 			console.log('Error deleting!');
		// 		} else {
		// 			console.log('Chapters deleted!');
		// 			res.send(chapters);
		// 		}
		// 	})
		// });

		
	},

};

module.exports = ChapterController;
