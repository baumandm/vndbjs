const ref = require('../reference.js');

let clean;

/**
* Represents a Visual Novel
* A Visual Novel is a story or work which may be comprised of several Releases
* @class
* @prop {number} id Visual novel ID
* @prop {string|null} title Main title
* @prop {string|null} original Original/official title
* @prop {string|null} released Date of the first release
* @prop {Array<string>|null} languages Languages VN is available in.  Can be an empty array when nothing has been released yet
* @prop {Array<string>|null} orig_lang Language(s) of the first release.  Can be an empty array
* @prop {Array<string>|null} platforms Computer systems VN is available on.  Can be an empty array when unknown or nothing has been released yet
* @prop {string|null} aliases Aliases, separated by `\n` newlines
* @prop {number|null} length Length of the game, 1-5
* @prop {string|null} description Description of the VN. Can include formatting codes as described in [d9.3]{@link https://vndb.org/d9.3}
* @prop {Object|null} links Contains various links related to the VN
* @prop {string|null} links.wikipedia Name of the article on the English Wikipedia
* @prop {string|null} links.encubed The URL-encoded tag used on [encubed]{@link http://novelnews.net/}
* @prop {string|null} links.renai The name part of the URL on [renai.us]{@link http://renai.us/}
* @prop {string|null} image HTTP link to the VN image
* @prop {boolean|null} image_nswf Whether the VN image is flagged as NSFW or not
* @prop {Array<Object>|null} anime (Possibly empty) list of anime related to the VN
* @prop {number} anime.id [AniDB]{@link http://anidb.net/} ID
* @prop {number|null} anime.ann_id [AnimeNewsNetwork]{@link http://animenewsnetwork.com/} ID
* @prop {string|null} anime.nfo_id [AnimeNfo]{@link http://animenfo.com/} ID
* @prop {string|null} anime.title_romaji Title of anime in Romaji
* @prop {string|null} anime.title_kanji Title of anime in Kanji
* @prop {number|null} anime.year Year in which the anime was aired
* @prop {string|null} anime.type Type of anime
* @prop {Array<Object>|null} relations (Possibly empty) list of related visual novels
* @prop {number} relations.id ID of the related VN
* @prop {string} relations.relation Relation to the VN
* @prop {string} relations.title Romaji title
* @prop {string|null} relations.original Original/official title
* @prop {boolean} relations.official If false, is a fanwork
* @prop {Array<Array>|null} tags (Possibly empty) list of tags linked to this VN.  Each tag contains 3 elements
* @prop {number} tags.0 The tag's ID
* @prop {number} tags.1 Score: a number between 0 and 3
* @prop {number} tags.2 Spoiler Level: 0=none, 1=minor, 2=major
* @prop {number|null} popularity Popularity value from 0-100
* @prop {number|null} rating Rating from 1-10
* @prop {number|null} votecount Number of votes
* @prop {Array<Object>|null} screens (Possibly empty) list of screenshots
* @prop {string} screens.image URL of the full-sized screenshot
* @prop {number} screens.rid releaseID
* @prop {boolean} screens.nsfw Inappropriate if true
* @prop {number} screens.height Height of the full-sized screenshot
* @prop {number} screens.width Width of the full-sized screenshot
* @prop {Array<Object>|null} staff (Possibly empty) list of staff related to the VN
* @prop {number} sid Staff ID
* @prop {number} aid Alias ID
* @prop {string} name Name of the staff member
* @prop {original|null} original Original name of the staff member
* @prop {string} role Staff member's role in the VN
* @prop {string|null} note Description of the staff member
**/
class Vn {
  /**
  * Create a VN
  * @constructor
  * @param {Object} data A VNDB VN object
  */
  constructor(data) {
    this.id = data.id;
    this.title = data.title != null ? data.title : null;
    this.original = data.original != null ? data.original : null;
    this.released = data.released != null ? data.released : null;
    this.languages = data.languages != null ? data.languages : null;
    this.orig_lang = data.orig_lang != null ? data.orig_lang : null;
    this.platforms = data.platforms != null ? data.platforms : null;
    this.aliases = data.aliases != null ? data.aliases : null;
    this.length = data.length != null ? data.length : null;
    this.description = data.description != null ? data.description : null;
    this.links = data.links != null ? data.links : null;
    this.image = data.image != null ? data.image : null;
    this.image_nsfw = data.image_nsfw != null ? data.image_nsfw : null;
    this.anime = data.anime != null ? data.anime : null;
    this.relations = data.relations != null ? data.relations : null;
    this.tags = data.tags != null ? data.tags : null;
    this.popularity = data.popularity != null ? data.popularity : null;
    this.rating = data.rating != null ? data.rating : null;
    this.votecount = data.votecount != null ? data.votecount : null;
    this.screens = data.screens != null ? data.screens : null;
    this.staff = data.staff != null ? data.staff : null;
  }

  /**
  * Generate a link to the related VN page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/v${this.id}`;
  }

  /**
  * Generates a cleaned version of the VN data
  * @type {Object}
  * @prop {number} id Visual novel ID
  * @prop {string|null} title Main title
  * @prop {string|null} original Original/official title
  * @prop {Object|null} released **[Altered]** Object representing the date of the first release
  * @prop {string} released.year Year of release
  * @prop {string} released.month Month of release
  * @prop {string} released.day Day of release
  * @prop {Array<string>|null} languages **[Altered]** Languages VN is available in, expanded to full words.  Can be an empty array when nothing has been released yet
  * @prop {Array<string>|null} orig_lang **[Altered]** Language(s) of the first release, expanded to full words.  Can be an empty array
  * @prop {Array<string>|null} platforms **[Altered]** Computer systems VN is available on, expanded to full words.  Can be an empty array when unknown or nothing has been released yet
  * @prop {Array<string>|null} aliases **[Altered]** Array of aliases
  * @prop {string|null} length **[Altered]** Length of the game, from 'Very Short' to 'Very Long'
  * @prop {Object|null} description **[Altered]** Description of the VN
  * @prop {string} description.text Spoiler-free description
  * @prop {string} description.spoilers Any spoilers found in the description, or an empty string
  * @prop {Object|null} links Contains various links related to the VN
  * @prop {string|null} links.wikipedia **[Altered]** The full English Wikipedia URL
  * @prop {string|null} links.encubed **[Altered]** The full [encubed]{@link http://novelnews.net/} URL
  * @prop {string|null} links.renai **[Altered]** The full [renai.us]{@link http://renai.us/} URL
  * @prop {string|null} image HTTP link to the VN image
  * @prop {boolean|null} image_nswf Whether the VN image is flagged as NSFW or not
  * @prop {Array<Object>|null} anime (Possibly empty) list of anime related to the VN
  * @prop {number} anime.id [AniDB]{@link http://anidb.net/} ID
  * @prop {number|null} anime.ann_id [AnimeNewsNetwork]{@link http://animenewsnetwork.com/} ID
  * @prop {string|null} anime.nfo_id [AnimeNfo]{@link http://animenfo.com/} ID
  * @prop {string|null} anime.title_romaji Title of anime in Romaji
  * @prop {string|null} anime.title_kanji Title of anime in Kanji
  * @prop {number|null} anime.year Year in which the anime was aired
  * @prop {string|null} anime.type Type of anime
  * @prop {Array<Object>|null} relations (Possibly empty) list of related visual novels
  * @prop {number} relations.id ID of the related VN
  * @prop {string} relations.relation Relation to the VN, expanded to full words
  * @prop {string} relations.title Romaji title
  * @prop {string|null} relations.original Original/official title
  * @prop {boolean} relations.official If false, is a fanwork
  * @prop {string} relations.link **[Added]** A full URL to the related visual novel
  * @prop {Array<Array>|null} tags (Possibly empty) list of tags linked to this VN.  Each tag contains 3 elements
  * @prop {number} tags.0 The tag's ID
  * @prop {number} tags.1 Score: a number between 0 and 3
  * @prop {number} tags.2 Spoiler Level: 0=none, 1=minor, 2=major
  * @prop {number|null} popularity Popularity value from 0-100
  * @prop {number|null} rating Rating from 1-10
  * @prop {number|null} votecount Number of votes
  * @prop {Array<Object>|null} screens (Possibly empty) list of screenshots
  * @prop {string} screens.image URL of the full-sized screenshot
  * @prop {number} screens.rid releaseID
  * @prop {boolean} screens.nsfw Inappropriate if true
  * @prop {number} screens.height Height of the full-sized screenshot
  * @prop {number} screens.width Width of the full-sized screenshot
  * @prop {string} screens.link **[Added]** A full link to the related Release page
  * @prop {Array<Object>|null} staff (Possibly empty) list of staff related to the VN
  * @prop {number} staff.sid Staff ID
  * @prop {number} staff.aid Alias ID
  * @prop {string} staff.name Name of the staff member
  * @prop {original|null} staff.original Original name of the staff member
  * @prop {string} staff.role Staff member's role in the VN
  * @prop {string|null} staff.note Description of the staff member
  * @prop {string} staff.link **[Added]** A full link to the related Staff page
  **/
  get clean() {
    if (clean !== undefined) return clean;

    const results = {
      id: this.id,
      title: this.title,
      original: this.original,
      links: {},
      image: this.image,
      image_nsfw: this.image_nsfw,
      anime: this.anime,
      tags: this.tags,
      popularity: this.popularity,
      rating: this.rating,
      votecount: this.votecount
    };

    if (this.released !== null) {
      const date = this.released.split('-');
      results.released = {
        year: date[0],
        month: date[1],
        day: date[2]
      };
    }

    if (this.languages !== null) {
      results.languages = this.languages.map((lang) => {
        return ref.languages[lang] || lang;
      });
    }

    if (this.orig_lang !== null) {
      results.orig_lang = this.orig_lang.map((lang) => {
        return ref.languages[lang] || lang;
      });
    }

    if (this.platforms !== null) {
      results.platforms = this.platforms.map((plat) => {
        return ref.platforms[plat] || plat;
      });
    }

    if (this.aliases !== null) {
      results.aliases = this.aliases.split('\n');
    }

    if (this.length !== null) {
      results.length = ref.length[this.length - 1];
    }

    if (this.description !== null) {
      results.description = {};
      results.description.text = this.description
      .replace(/\[spoiler\].+\[\/spoiler\]/gi, '')
      .replace(/\[url.+?\]|\[\/url\]|\[|\]/g, '') // remove bbcode links
      .replace(/^\s+|\s+$/g, '') // removes excess whitespace at beginning or end
      .replace(/\n+/g, '\n');
      const spoilers = this.description.match(/\[spoiler\](.+)\[\/spoiler\]/i);
      if (spoilers !== null) {
        results.description.spoilers = spoilers[1]
        .replace(/\[url.+?\]|\[\/url\]|\[|\]/g, '') // remove bbcode links
        .replace(/^\s+|\s+$/g, '') // removes excess whitespace at beginning or end
        .replace(/\n+/g, '\n');
      } else {
        results.description.spoilers = '';
      }
    }

    if (this.links !== null) {
      results.links.wikipedia = this.links.wikipedia !== null
      ? `http://en.wikipedia.org/wiki/${this.links.wikipedia}`
      : null;

      results.links.renai = this.links.renai !== null
      ? `http://renai.us/game/${this.links.renai}`
      : null;

      results.links.encubed = this.links.encubed !== null
      ? `http://novelnews.net/tag/${this.links.encubed}/`
      : null;
    }

    if (this.relations !== null) {
      results.relations = this.relations.map((rel) => {
        return {
          id: rel.id,
          relation: ref.vnRelations[rel.relation] || rel.relation,
          title: rel.title,
          original: rel.original,
          official: rel.official,
          link: `https://vndb.org/v${rel.id}`
        };
      });
    }

    if (this.staff !== null) {
      results.staff = this.staff.map((mem) => {
        return {
          sid: mem.sid,
          aid: mem.aid,
          name: mem.name,
          original: mem.original,
          role: mem.role,
          note: mem.note,
          link: `https://vndb.org/s${mem.sid}`
        };
      });
    }

    if (this.screens !== null) {
      results.screens = this.screens.map((scr) => {
        return {
          image: scr.image,
          rid: scr.rid,
          nsfw: scr.nsfw,
          height: scr.height,
          width: scr.width,
          link: `https://vndb.org/r${scr.rid}`
        };
      });
    }

    clean = results;
    return results;
  }
}

module.exports = Vn;
