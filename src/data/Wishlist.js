const ref = require('../reference.js');

/**
* Represents a Wishlist
* A Wishlist is a list of visual novels that a user plans to play
* @class
* @prop {number} vn VN ID
* @prop {number} priority 0=high, 1=medium, 2=low, 3=blacklist
* @prop {number} added Unix timestamp of when this vote has been added
**/
class Wishlist {
  /**
  * Create a Wishlist
  * Note: despite the name, this class only represents a single entry in a Wishlist, not the entire list
  * @constructor
  * @param {Object} data A VNDB Wishlist object
  **/
  constructor(data) {
    this.vn = data.vn;
    this.priority = data.priority;
    this.added = data.added;
  }

  /**
  * Generates a cleaned version of the Wishlist data
  * @type {Object}
  * @prop {number} vn VN ID
  * @prop {string} priority **[Altered]** 'High', 'Medium', 'Low', or 'Blacklist'
  * @prop {number} added Unix timestamp of when this vote has been added
  **/
  get clean() {
    return {
      vn: this.vn,
      priority: ref.priority[this.priority],
      added: this.added
    };
  }
}

module.exports = Wishlist;
