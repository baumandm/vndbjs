const ref = require('../reference.js');

let clean;

/**
* Represents a Producer
* A Producer is an organization responsible for the creation of a Visual Novel in some way
* @class
* @prop {number} id Producer ID
* @prop {string|null} name (Romaji) producer name
* @prop {string|null} original Original/official name
* @prop {string|null} type Producer type
* @prop {string|null} language Primary language
* @prop {Object|null} links Object of external links
* @prop {string|null} links.homepage Official homepage
* @prop {string|null} links.wikipedia Title of related article on English Wikipedia
* @prop {string|null} aliases Comma-separated list of alternative names
* @prop {string|null} description Description/notes of the producer.  Can include formatting codes as described in [d9.3]{@link https://vndb.org/d9.3}
* @prop {Array<Object>|null} relations (Possibly empty) list of related producers
* @prop {number} relations.id Producer ID
* @prop {string} relations.relation Relation to current producer
* @prop {string} relations.name (Romaji) producer name
* @prop {string|null} relations.original Original/official name
**/
class Producer {
  /**
  * Create a Producer
  * @constructor
  * @param {Object} data A VNDB Producer object
  */
  constructor(data) {
    this.id = data.id;
    this.name = data.name != null ? data.name : null;
    this.original = data.original != null ? data.original : null;
    this.type = data.type != null ? data.type : null;
    this.language = data.language != null ? data.language : null;
    this.links = data.links != null ? data.links : null;
    this.aliases = data.aliases != null ? data.aliases : null;
    this.description = data.description != null ? data.description : null;
    this.relations = data.relations != null ? data.relations : null;
  }

  /**
  * Generate a link to the related Producer page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/p${this.id}`;
  }

  /**
  * Generates a cleaned version of the Producer data
  * @type {Object}
  * @prop {number} id Producer ID
  * @prop {string|null} name (Romaji) producer name
  * @prop {string|null} original Original/official name
  * @prop {string|null} type **[Altered]** Producer type, expanded into full words
  * @prop {string|null} language **[Altered]** Primary language, expanded into full words
  * @prop {Object|null} links Object of external links
  * @prop {string|null} links.homepage Official homepage
  * @prop {string|null} links.wikipedia **[Altered]** Full URL to related article on English Wikipedia
  * @prop {Array<string>|null} aliases **[Altered]** Array of alternative names
  * @prop {Object|null} description **[Altered]** Description/notes of the producer
  * @prop {string} description.text **[Added]** Spoiler-free description
  * @prop {string} description.spoilers **[Added]** Any spoilers found in description, or an empty string
  * @prop {Array<Object>|null} relations (Possibly empty) list of related producers
  * @prop {number} relations.id Producer ID
  * @prop {string} relations.relation Relation to current producer
  * @prop {string} relations.name (Romaji) producer name
  * @prop {string|null} relations.original Original/official name
  * @prop {string} relations.link **[Added]** Full URL to the related Producer page
  **/
  get clean() {
    if (clean !== undefined) return clean;

    const results = {
      id: this.id,
      name: this.name,
      original: this.original,
      description: {},
      links: { homepage: this.links.homepage }
    };

    if (this.type !== null) {
      results.type = ref.producerType[this.type] || this.type;
    }

    if (this.language !== null) {
      results.language = ref.languages[this.language] || this.language;
    }

    results.links.wikipedia = this.links.wikipedia !== null
    ? `http://en.wikipedia.org/wiki/${this.links.wikipedia}`
    : null;

    if (this.aliases !== null) {
      results.aliases = this.aliases.split(',');
    }

    if (this.description !== null) {
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

    if (this.relations !== null) {
      results.relations = this.relations.map((rel) => {
        return {
          id: rel.id,
          relation: ref.proRelations[rel.relation] || rel.relation,
          name: rel.name,
          original: rel.original,
          link: `https://vndb.org/p${rel.id}`
        };
      });
    }

    clean = results;
    return results;
  }
}

module.exports = Producer;
