const ref = require('../reference.js');

/**
* Represents a VNlist
* A VNlist is a user's list VNs they are playing or have played
* @class
* @prop {number} vn VN ID
* @prop {number} status 0=Unknown, 1=playing, 2=finished, 3=stalled, 4=dropped
* @prop {number} added Unix timestamp of when this item has been added
* @prop {string|null} notes User-set notes
**/
class Vnlist {
  /**
  * Create a VNlist
  * Note: despite the name, this class only represents a single entry in a VNlist, not the entire list
  * @constructor
  * @param {Object} data A VNDB VNlist object
  **/
  constructor(data) {
    this.vn = data.vn;
    this.status = data.status;
    this.added = data.added;
    this.notes = data.notes;
  }

  /**
  * Generates a cleaned version of the VNlist data
  * @type {Object}
  * @prop {number} vn VN ID
  * @prop {string} status **[Altered]** 'Unknown', 'Playing', 'Finished', 'On Hold', or 'Dropped'
  * @prop {number} added Unix timestamp of when this item has been added
  * @prop {string|null} notes User-set notes
  **/
  get clean() {
    return {
      vn: this.vn,
      status: ref.listStatus[this.status],
      added: this.added,
      notes: this.notes
    };
  }
}

module.exports = Vnlist;
