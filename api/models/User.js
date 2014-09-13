/**
 * Users
 *
 * @module      :: Users
 * @description :: Holds user information.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	username: {
  		type: 'string',
  		maxLength: 20,
  		minLength: 5,
  	},
  	email: {
  		type: 'email',
  		required: true,
  	},
  	password: 'STRING',
  	picture: 'STRING',
    premium: 'BOOLEAN',
  }

};
