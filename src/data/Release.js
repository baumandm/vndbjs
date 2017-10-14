const ref = require('../reference.js');

let clean;

/**
* Represents a Release
* A Release is a particular variant of a Visual Novel.  A single Visual Novel may have several distinct releases
* @class
* @prop {number} id Release ID
* @prop {string|null} title Release title (romaji)
* @prop {string|null} original Original/official title of the release
* @prop {string|null} released Release date
* @prop {string|null} type 'complete', 'partial', or 'trial'
* @prop {boolean|null} patch Flagged as a patch
* @prop {boolean|null} freeware Flagged as freeware
* @prop {boolean|null} doujin Flagged as doujin
* @prop {Array<string>|null} languages Languages the release supports
* @prop {string|null} website Official website URL
* @prop {string|null} notes Misc notes. Can include formatting codes as described in [d9.3]{@link https://vndb.org/d9.3}
* @prop {number|null} minage Age rating.  0 = 'All Ages'
* @prop {string|null} gtin JAN/UPC/EAN code. This is actually an integer, but formatted as a string to avoid an overflow on 32bit platforms
* @prop {string|null} catalog Catalog number
* @prop {Array<string>} platforms Platforms supported by release.  Empty array when platform is unknown
* @prop {Array<Object>|null} media A list of media the release is available on.  Can be empty array
* @prop {string} media.medium The distribution medium
* @prop {number|null} media.qty The quantity.  `null` when not applicable
* @prop {Array<Object>} vn Array of visual novels linked to this release
* @prop {number} vn.id Visual novel ID
* @prop {string|null} vn.title Main visual novel title
* @prop {string|null} vn.original Original/official visual novel title
* @prop {Array<Object>|null} producers (Possibly empty) list of producers involved in this release
* @prop {number} producers.id Producer ID
* @prop {boolean} producers.developer Flagged as developer
* @prop {boolean} producers.publisher Flagged as publisher
* @prop {string} producers.name Romaji name
* @prop {string|null} producers.original Original/official name
* @prop {string} producers.type Producer Type
**/
class Release {
  /**
  * Create a Release
  * @constructor
  * @param {Object} data A VNDB Release object
  */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.original = data.original != null ? data.original : null;
    this.released = data.released != null ? data.released : null;
    this.type = data.type != null ? data.type : null;
    this.patch = data.patch != null ? data.patch : null;
    this.freeware = data.freeware != null ? data.freeware : null;
    this.doujin = data.doujin != null ? data.doujin : null;
    this.languages = data.languages != null ? data.languages : null;
    this.website = data.website != null ? data.website : null;
    this.notes = data.notes != null ? data.notes : null;
    this.minage = data.minage != null ? data.minage : null;
    this.gtin = data.gtin != null ? data.gtin : null;
    this.catalog = data.catalog != null ? data.catalog : null;
    this.platforms = data.platforms != null ? data.platforms : null;
    this.media = data.media != null ? data.media : null;
    this.vn = data.vn != null ? data.vn : null;
    this.producers = data.producers != null ? data.producers : null;
  }

  /**
  * Generate a link to the related Release page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/r${this.id}`;
  }

  /**
  * Generates a cleaned version of the Release data
  * @type {Object}
  * @prop {number} id Release ID
  * @prop {string|null} title Release title (romaji)
  * @prop {string|null} original Original/official title of the release
  * @prop {Object|null} released **[Altered]** Release date
  * @prop {string} released.year Year of Release
  * @prop {string} released.month Month of Release
  * @prop {string} released.day Day of Release
  * @prop {string|null} type 'complete', 'partial', or 'trial'
  * @prop {boolean|null} patch Flagged as a patch
  * @prop {boolean|null} freeware Flagged as freeware
  * @prop {boolean|null} doujin Flagged as doujin
  * @prop {Array<string>|null} languages **[Altered]** Languages the release supports, expanded to full words
  * @prop {string|null} website Official website URL
  * @prop {Object|null} notes **[Altered]** Misc notes
  * @prop {string} notes.text Spoiler-free notes
  * @prop {string} notes.spoilers Any spoilers found in notes, or an empty string
  * @prop {number|null} minage Age rating.  0 = 'All Ages'
  * @prop {string|null} gtin JAN/UPC/EAN code. This is actually an integer, but formatted as a string to avoid an overflow on 32bit platforms
  * @prop {string|null} catalog Catalog number
  * @prop {Array<string>|null} platforms **[Altered]** Platforms supported by release, expanded to full words.  Empty array when platform is unknown
  * @prop {Array<Object>|null} media A list of media the release is available on.  Can be empty array
  * @prop {string} media.medium **[Altered]** The distribution medium, expanded to full words
  * @prop {number|null} media.qty The quantity.  `null` when not applicable
  * @prop {Array<Object>|null} vn Array of visual novels linked to this release
  * @prop {number} vn.id Visual novel ID
  * @prop {string|null} vn.title Main visual novel title
  * @prop {string|null} vn.original Original/official visual novel title
  * @prop {string} vn.link **[Added]** Full URL to the related visual novel page
  * @prop {Array<Object>|null} producers (Possibly empty) list of producers involved in this release
  * @prop {number} producers.id Producer ID
  * @prop {boolean} producers.developer Flagged as developer
  * @prop {boolean} producers.publisher Flagged as publisher
  * @prop {string} producers.name Romaji name
  * @prop {string|null} producers.original Original/official name
  * @prop {string} producers.type **[Altered]** Producer Type, expanded to full words
  * @prop {string} producers.link **[Added]** Full URL to the related Producer page
  **/
  get clean() {
    if (clean !== undefined) return clean;

    const results = {
      id: this.id,
      title: this.title,
      patch: this.patch,
      freeware: this.freeware,
      doujin: this.doujin,
      original: this.original,
      type: this.type,
      website: this.website,
      minage: this.minage,
      gtin: this.gtin,
      catalog: this.catalog
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

    if (this.notes !== null) {
      results.notes = {};
      results.notes.text = this.notes
        .replace(/\[spoiler\].+\[\/spoiler\]/gi, '')
        .replace(/\[url.+?\]|\[\/url\]|\[|\]/g, '') // remove bbcode links
        .replace(/^\s+|\s+$/g, '') // removes excess whitespace at beginning or end
        .replace(/\n+/g, '\n');
      const spoilers = this.notes.match(/\[spoiler\](.+)\[\/spoiler\]/i);
      if (spoilers !== null) {
        results.notes.spoilers = spoilers[1]
          .replace(/\[url.+?\]|\[\/url\]|\[|\]/g, '') // remove bbcode links
          .replace(/^\s+|\s+$/g, '') // removes excess whitespace at beginning or end
          .replace(/\n+/g, '\n');
      } else {
        results.notes.spoilers = '';
      }
    }

    if (this.platforms !== null) {
      results.platforms = this.platforms.map((platform) => {
        return ref.platforms[platform] || platform;
      });
    }

    if (this.media !== null) {
      results.media = this.media.map((med) => {
        med.medium = ref.media[med.medium] || med.medium;
        return med;
      });
    }

    if (this.vn !== null) {
      results.vn = this.vn.map((novel) => {
        return {
          id: novel.id,
          title: novel.title,
          original: novel.original,
          link: `https://vndb.org/v${novel.id}`
        };
      });
    }

    if (this.producers !== null) {
      results.producers = this.producers.map((producer) => {
        return {
          id: producer.id,
          developer: producer.developer,
          publisher: producer.publisher,
          name: producer.name,
          original: producer.original,
          type: ref.producerType[producer.type] || producer.type,
          link: `https://vndb.org/p${producer.id}`
        };
      });
    }

    clean = results;
    return results;
  }
}

module.exports = Release;
