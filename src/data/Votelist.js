/**
* Represents a Votelist
* A Votelist is a list of Visual Novels a user has voted on
* @class
* @prop {number} vn VN ID
* @prop {number} vote In the range of 10 (lowest) to 100 (highest). These are displayed on the site as a fractional number between 1 and 10
* @prop {number} added Unix timestamp of when this vote has been added
**/
class Votelist {
  /**
  * Create a Votelist
  * Note: despite the name, this class only represents a single entry in a Votelist, not the entire list
  * @constructor
  * @param {Object} data A VNDB Votelist object
  **/
  constructor(data) {
    this.vn = data.vn;
    this.vote = data.vote;
    this.added = data.added;
  }

  /**
  * Generates a cleaned version of the Votelist data
  * @type {Object}
  * @prop {number} vn VN ID
  * @prop {number} vote **[Altered]** In the range of 1 (lowest) to 10 (highest)
  * @prop {number} added Unix timestamp of when this vote has been added
  **/
  get clean() {
    return {
      vn: this.vn,
      vote: this.vote / 10,
      added: this.added
    };
  }
}

module.exports = Votelist;
