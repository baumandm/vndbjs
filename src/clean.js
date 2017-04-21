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
* @param {Object} vn - A single VN
* @returns {Object}
**/
function vnParse(vn) {
  const newVN = {
    id: vn.id,
    link: `https://vndb.org/v${vn.id}`
  };
  if (vn.title !== undefined) {
    newVN.title = vn.title;
  }
  if (vn.original !== undefined) {
    newVN.original = vn.original;
  }
  if (vn.released !== undefined) {
    newVN.released = vn.released;
  }
  if (vn.languages !== undefined) {
    newVN.languages = [];
    vn.languages.forEach((lang) => {
      newVN.languages.push(ref.languages[lang] || lang);
    });
  }
  if (vn.orig_lang !== undefined) {
    newVN.orig_lang = [];
    vn.orig_lang.forEach((lang) => {
      newVN.orig_lang.push(ref.languages[lang] || lang);
    });
  }
  if (vn.platforms !== undefined) {
    newVN.platforms = [];
    vn.platforms.forEach((platform) => {
      newVN.platforms.push(ref.platforms[platform] || platform);
    });
  }
  if (vn.aliases !== undefined) {
    newVN.aliases = vn.aliases !== null
    ? vn.aliases.split('\n')
    : newVN.aliases = null;
  }
  if (vn.length !== undefined) {
    newVN.length = ref.length[vn.length - 1];
  }
  if (vn.description !== undefined) {
    vn.description !== null
    ? newVN.description = vn.description
    .replace(/\[.+\]/g, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n+/g, '\n')
    : newVN.description = null;
  }
  if (vn.links !== undefined) {
    newVN.links = {};
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
        relation: ref.vnRelations[rel.relation] || rel.relation,
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
* Replaces an individual Release with a cleaned version
* @function
* @param {Object} rel - A single release
* @returns {Object}
**/
function releaseParse(rel) {
  const newRel = {
    id: rel.id,
    link: `https://vndb.org/r${rel.id}`
  };
  if (rel.title !== undefined) {
    newRel.title = rel.title;
    newRel.patch = rel.patch;
    newRel.freeware = rel.freeware;
    newRel.doujin = rel.doujin;
  }
  if (rel.original !== undefined) {
    newRel.original = rel.original || null;
  }
  if (rel.released !== undefined) {
    newRel.released = rel.released || null;
  }
  if (rel.type !== undefined) {
    newRel.type = ref.releaseType[rel.type];
  }
  if (rel.languages !== undefined) {
    newRel.languages = [];
    rel.languages.forEach((lang) => {
      newRel.languages.push(ref.languages[lang] || lang);
    });
  }
  if (rel.website !== undefined) {
    newRel.website = rel.website || null;
  }
  if (rel.notes !== undefined) {
    newRel.notes = rel.notes || null;
  }
  if (rel.minage !== undefined) {
    newRel.minage = rel.minage || null;
  }
  if (rel.gtin !== undefined) {
    newRel.gtin = rel.gtin || null;
  }
  if (rel.catalog !== undefined) {
    newRel.catalog = rel.catalog || null;
  }
  if (rel.platforms !== undefined) {
    newRel.platforms = [];
    rel.platforms.forEach((platform) => {
      newRel.platforms.push(ref.platforms[platform] || platform);
    });
  }
  if (rel.media !== undefined) {
    newRel.media = [];
    rel.media.forEach((med) => {
      med.medium = ref.media[med.medium] || med.medium;
      newRel.media.push(med);
    });
  }
  if (rel.vn !== undefined) {
    newRel.vn = rel.vn;
  }
  if (rel.producers !== undefined) {
    newRel.producers = [];
    rel.producers.forEach((producer) => {
      producer.type = ref.producerType[producer.type] || producer.type;
      newRel.producers.push(producer);
    });
  }
  return newRel;
}

/**
* Replaces an individual Producer with a cleaned version
* @function
* @param {Object} pro - A single producer
* @returns {Object}
**/
function producerParse(pro) {
  const newPro = {
    id: pro.id,
    link: `https://vndb.org/p${pro.id}`
  };
  if (pro.name !== undefined) {
    newPro.name = pro.name;
    newPro.type = ref.producerType[pro.type] || pro.type;
    newPro.language = ref.languages[pro.language] || pro.language;
  }
  if (pro.original !== undefined) {
    newPro.original = pro.original || null;
  }
  if (pro.links !== undefined) {
    newPro.links = {
      homepage: pro.links.homepage || null,
      wikipedia: `http://en.wikipedia.org/wiki/${pro.links.wikipedia}` || null
    };
  }
  if (pro.aliases !== undefined) {
    newPro.aliases = pro.aliases !== null
    ? pro.aliases.split('\n')
    : newPro.aliases = null;
  }
  if (pro.description !== undefined) {
    pro.description !== null
    ? newPro.description = pro.description
    .replace(/\[.{0,1}url.*?\]/g, '')
    .replace(/\[.+\]/g, '')
    .replace(/\n+/g, '\n')
    : newPro.description = null;
  }
  if (pro.relations !== undefined) {
    newPro.relations = [];
    pro.relations.forEach((relation) => {
      relation.relation = ref.proRelations[relation.relation] || relation.relation;
      newPro.relations.push(relation);
    });
  }
  return newPro;
}

/**
* Replaces an individual Character with a cleaned version
* @function
* @param {Object} cha - A single character
* @returns {Object}
**/
function characterParse(cha) {
  const newCha = {
    id: cha.id,
    link: `https://vndb.org/c${cha.id}`
  };
  if (cha.name !== undefined) {
    newCha.name = cha.name;
    newCha.birthday = {
      day: cha.birthday[0],
      month: cha.birthday[1]
    };
  }
  if (cha.original !== undefined) {
    newCha.original = cha.original || null;
  }
  if (cha.gender !== undefined) {
    newCha.gender = ref.characterGender[cha.gender] || cha.gender || null;
  }
  if (cha.bloodt !== undefined) {
    cha.bloodt !== null
    ? newCha.bloodtype = cha.bloodt.toUpperCase()
    : newCha.bloodtype = null;
  }
  if (cha.aliases !== undefined) {
    newCha.aliases = cha.aliases !== null
    ? cha.aliases.split('\n')
    : newCha.aliases = null;
  }
  if (cha.description !== undefined) {
    cha.description !== null
    ? newCha.description = cha.description
    .replace(/\[.{0,1}url.*?\]/g, '')
    .replace(/\[.+\]/g, '')
    .replace(/\n+/g, '\n')
    : newCha.description = null;
  }
  if (cha.image !== undefined) {
    newCha.image = cha.image || null;
  }
  if (cha.bust !== undefined) {
    newCha.bust = cha.bust || null;
    newCha.waist = cha.waist || null;
    newCha.hip = cha.hip || null;
    newCha.height = cha.height || null;
    newCha.weight = cha.weight || null;
  }
  if (cha.traits !== undefined) {
    newCha.traits = cha.traits;
  }
  if (cha.vns !== undefined) {
    newCha.vns = cha.vns;
  }
  return newCha;
}

/**
* Replaces an individual User with a cleaned version
* @function
* @param {Object} user - A single user
* @returns {Object}
**/
function userParse(user) {
  const newUser = {
    id: user.id,
    username: user.username,
    link: `https://vndb.org/u${user.id}`
  };
  return newUser;
}

/**
* Replaces an individual Votelist with a cleaned version
* @function
* @param {Object} list - A single votelist
* @returns {Object}
**/
function votelistParse(list) {
  const newList = {
    vn: list.vn,
    vote: list.vote / 10,
    added: list.added
  };
  return newList;
}

/**
* Replaces an individual VNlist with a cleaned version
* @function
* @param {Object} list - A single VNlist
* @returns {Object}
**/
function vnlistParse(list) {
  const newList = {
    vn: list.vn,
    status: ref.listStatus[list.status],
    added: list.added,
    notes: list.notes
  };
  return newList;
}

/**
* Replaces an individual Wishlist with a cleaned version
* @function
* @param {Object} list - A single wishlist
* @returns {Object}
**/
function wishlistParse(list) {
  const newList = {
    vn: list.vn,
    priority: ref.priority[list.priority],
    added: list.added
  };
  return newList;
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
  },

  /**
  * Cleans data from a Release
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  release(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.items = data.items.map((release) => {
        return releaseParse(release);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a Producer
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  producer(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.items = data.items.map((producer) => {
        return producerParse(producer);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a Character
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  character(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.items = data.items.map((character) => {
        return characterParse(character);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a User
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  user(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.items = data.items.map((user) => {
        return userParse(user);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a Votelist
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  votelist(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.link = `https://vndb.org/u${data.searchID}/votes`;
      response.items = data.items.map((votelist) => {
        return votelistParse(votelist);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a VNlist
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  vnlist(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.link = `https://vndb.org/u${data.searchID}/list`;
      response.items = data.items.map((vnlist) => {
        return vnlistParse(vnlist);
      });
      resolve(response);
    });
  },

  /**
  * Cleans data from a Wishlist
  * @function
  * @param {Object} data - The unparsed results
  * @returns {Promise<Object>}
  **/
  wishlist(data) {
    return new Promise((resolve) => {
      const response = prepHeader(data);
      response.link = `https://vndb.org/u${data.searchID}/wish`;
      response.items = data.items.map((wishlist) => {
        return wishlistParse(wishlist);
      });
      resolve(response);
    });
  }
};
