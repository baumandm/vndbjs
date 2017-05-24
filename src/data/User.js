/**
* Represents a User
* A User is a registered member of VNDB.org
* @class
* @prop {number} id User ID
* @prop {string} username User's username
**/
class User {
  /**
  * Create a User
  * @constructor
  * @param {Object} data A VNDB User object
  **/
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
  }

  /**
  * Generate a link to the related User page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/u${this.id}`;
  }
}

module.exports = User;
