/* eslint no-unused-expressions: "off" */
const ref = require('./reference.js');

/**
* A helper function to create the base of the results object
* @function
* @param {Object} data - The unparsed results
* @returns {Object}
**/
function prepHeader(data) {
  return {
    status: data.status,
    more: data.more,
    num: data.num
  };
}

/**
* Replaces an individual VN with a cleaned version
* @function
* @param {Object} vn - A single VN's data
* @returns {Object}
**/
function vnParse(vn) {
  const newVN = {
    id: vn.id,
    links: {}
  };
  if (vn.title !== undefined) {
    newVN.title = vn.title;
  }
  if (vn.original !== undefined) {
    newVN.original = vn.original || null;
  }
  if (vn.released !== undefined) {
    newVN.released = vn.released || null;
  }
  if (vn.languages !== undefined) {
    newVN.languages = [];
    vn.languages.forEach((lang) => {
      newVN.languages.push(ref.vn.languages[lang] || lang);
    });
  }
  if (vn.orig_lang !== undefined) {
    newVN.orig_lang = [];
    vn.orig_lang.forEach((lang) => {
      newVN.orig_lang.push(ref.vn.languages[lang] || lang);
    });
  }
  if (vn.platforms !== undefined) {
    newVN.platforms = [];
    vn.platforms.forEach((platform) => {
      newVN.platforms.push(ref.vn.platforms[platform] || platform);
    });
  }
  if (vn.aliases !== undefined) {
    newVN.aliases = vn.aliases !== null ? vn.aliases.split('\n') : null;
  }
  if (vn.length !== undefined) {
    newVN.length = ref.vn.length[vn.length - 1];
  }
  if (vn.description !== undefined) {
    vn.description !== null
    ? newVN.description = vn.description
    .replace(/\[.+\]/, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n+/g, '\n')
    : 'None';
  }
  if (vn.links !== undefined) {
    vn.links.wikipedia !== null
    ? newVN.links.wikipedia = `http://en.wikipedia.org/wiki/${vn.links.wikipedia}`
    : newVN.links.wikipedia = null;

    vn.links.renai !== null
    ? newVN.links.renai = `http://renai.us/game/${vn.links.renai}.shtml`
    : newVN.links.renai = null;

    vn.links.encubed !== null
    ? newVN.links.encubed = `http://novelnews.net/tag/${vn.links.encubed}/`
    : newVN.links.encubed = null;
  }
  newVN.links.vndb = `https://vndb.org/v${vn.id}`;
  if (vn.image !== undefined) {
    newVN.image = vn.image || null;
    newVN.image_nsfw = vn.image_nsfw;
  }
  if (vn.anime !== undefined) {
    newVN.anime = vn.anime;
  }
  if (vn.relations !== undefined) {
    newVN.relations = vn.relations.map((rel) => {
      return {
        id: rel.id,
        relation: ref.vn.relations[rel.relation] || rel.relation,
        title: rel.title,
        original: rel.original,
        official: rel.official,
        link: `https://vndb.org/v${rel.id}`
      };
    });
  }
  if (vn.tags !== undefined) {
    newVN.tags = vn.tags;
  }
  if (vn.popularity !== undefined) {
    newVN.popularity = vn.popularity;
    newVN.rating = vn.rating;
    newVN.votecount = vn.votecount;
  }
  if (vn.screens !== undefined) {
    newVN.screens = vn.screens;
  }
  return newVN;
}

/**
* A helper module for parsing results
* @module clean
**/
module.exports = {

  /**
  * Cleans data from a VN
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  vn(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.items = data.items.map((vn) => {
        return vnParse(vn);
      });
      resolve(response);
    });
  }
};
