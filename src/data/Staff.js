const ref = require('../reference.js');

let clean;

/**
* Represents a Staff member
* A Staff member is a person who contributed in some way to a Visual Novel
* @class
* @prop {number} id Staff ID
* @prop {string|null} name Primary (romaji) staff name
* @prop {string|null} original Primary original name
* @prop {string|null} gender Staff's gender.  'm' for Male, 'f' for Female, 'b' for Both
* @prop {string|null} language Primary language
* @prop {Object|null} links External links
* @prop {string|null} links.homepage Official homepage
* @prop {string|null} links.wikipedia Title of the related article on English Wikipedia
* @prop {string|null} links.twitter Twitter handle
* @prop {string|null} links.anidb [AniDB]{@link http://anidb.net/} creator ID
* @prop {string|null} description Description/notes of the staff member.  Can include formatting codes as described in [d9.3]{@link https://vndb.org/d9.3}
* @prop {Array<Array>|null} aliases List of names and aliases
* @prop {number} aliases.0 Alias ID
* @prop {string|null} aliases.1 Name (romaji)
* @prop {string|null} aliases.2 Original name
* @prop {number|null} main_alias
* @prop {Array<Object>|null} vns List of visual novels that this staff entry has been credited in (excluding voice)
* @prop {number} vns.id Visual Novel ID
* @prop {number} vns.aid Alias ID of this staff entry
* @prop {string} vns.role
* @prop {string|null} vns.note Description/notes of the role
* @prop {Array<Object>|null} voiced
* @prop {number} voiced.id Visual Novel ID
* @prop {number} voiced.aid Alias ID of this staff entry
* @prop {number} voiced.cid Character ID
* @prop {string|null} voiced.note Description/notes of the role
**/
class Staff {
  /**
  * Create a Staff member
  * @constructor
  * @param {Object} data A VNDB Staff object
  */
  constructor(data) {
    this.id = data.id;
    this.name = data.name != null ? data.name : null;
    this.original = data.original != null ? data.original : null;
    this.gender = data.gender != null ? data.gender : null;
    this.language = data.language != null ? data.language : null;
    this.links = data.links != null ? data.links : null;
    this.description = data.description != null ? data.description : null;
    this.aliases = data.aliases != null ? data.aliases : null;
    this.main_alias = data.main_alias != null ? data.main_alias : null;
    this.vns = data.vns != null ? data.vns : null;
    this.voiced = data.voiced != null ? data.voiced : null;
  }

  /**
  * Generate a link to the related Staff page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/s${this.id}`;
  }

  /**
  * Generates a cleaned version of the Staff data
  * @type {Object}
  * @prop {number|null} id Staff ID
  * @prop {string|null} name Primary (romaji) staff name
  * @prop {string|null} original Primary original name
  * @prop {string|null} gender **[Altered]** Staff's gender.  'Male', 'Female', or 'Both'
  * @prop {string|null} language **[Altered]** Primary language, expanded into full words
  * @prop {Object|null} links External links
  * @prop {string|null} links.homepage Official homepage
  * @prop {string|null} links.wikipedia **[Altered]** Full URL of the related article on English Wikipedia
  * @prop {string|null} links.twitter **[Altered]** Full URL to Twitter page
  * @prop {string|null} links.anidb **[Altered]** Full URL to AniDB creator page
  * @prop {string|null} description **[Altered]** Description/notes of the staff member.  Should have formatting codes removed
  * @prop {Array<Array>|null} aliases List of names and aliases
  * @prop {number} aliases.0 Alias ID
  * @prop {string|null} aliases.1 Name (romaji)
  * @prop {string|null} aliases.2 Original name
  * @prop {number|null} main_alias
  * @prop {Array<Object>|null} vns **[Altered]** List of visual novels that this staff entry has been credited in (excluding voice)
  * @prop {number} vns.id Visual Novel ID
  * @prop {number} vns.aid Alias ID of this staff entry
  * @prop {string} vns.role
  * @prop {string|null} vns.note Description/notes of the role
  * @prop {string} vns.link **[Added]** Link to related VN page
  * @prop {Array<Object>|null} voiced
  * @prop {number} voiced.id Visual Novel ID
  * @prop {number} voiced.aid Alias ID of this staff entry
  * @prop {number} voiced.cid Character ID
  * @prop {string|null} voiced.note Description/notes of the role
  * @prop {Object} voiced.links **[Added]** Object of links to related VNDB pages
  * @prop {string} voiced.links.vn **[Added]** Link to related VN page
  * @prop {string} voiced.links.character **[Added]** Link to related Character page
  **/
  get clean() {
    if (clean !== undefined) return clean;

    const results = {
      id: this.id,
      name: this.name,
      original: this.original,
      aliases: this.aliases,
      main_alias: this.main_alias,
      links: {}
    };

    if (this.gender !== null) {
      results.gender = ref.gender[this.gender] || this.gender;
    }

    if (this.language !== null) {
      results.language = ref.languages[this.language] || this.language;
    }

    results.links.homepage = this.links.homepage !== null
      ? this.links.homepage
      : null;

    results.links.wikipedia = this.links.wikipedia !== null
      ? `http://en.wikipedia.org/wiki/${this.links.wikipedia}`
      : null;

    results.links.twitter = this.links.twitter !== null
      ? `https://twitter.com/${this.links.twitter}`
      : null;

    results.links.anidb = this.links.anidb !== null
      ? `http://anidb.net/perl-bin/animedb.pl?show=creator&creatorid=${this.links.anidb}`
      : null;

    if (this.description !== null) {
      results.description = this.description
        .replace(/\[url.+?\]|\[\/url\]|\[|\]/g, '') // remove bbcode links
        .replace(/^\s+|\s+$/g, '') // removes excess whitespace at beginning or end
        .replace(/\n+/g, '\n'); // removes excessive newlines
    }

    if (this.vns !== null) {
      results.vns = this.vns.map((vn) => {
        return {
          id: vn.id,
          aid: vn.aid,
          role: vn.role,
          note: vn.note,
          link: `https://vndb.org/v${vn.id}`
        };
      });
    }

    if (this.voiced !== null) {
      results.voiced = this.voiced.map((role) => {
        return {
          id: role.id,
          aid: role.aid,
          cid: role.cid,
          note: role.note,
          links: {
            vn: `https://vndb.org/v${role.id}`,
            character: `https://vndb.org/c${role.cid}`
          }
        };
      });
    }

    clean = results;
    return results;
  }
}

module.exports = Staff;
