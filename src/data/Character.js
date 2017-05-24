const ref = require('../reference.js');

let clean;

/**
* Represents a Character
* A Character is an actor in one or more Visual Novels
* @class
* @prop {number} id Character ID
* @prop {string|null} name (Romaji) name
* @prop {string|null} original Original/official name
* @prop {string|null} gender Character's gender.  'm' for Male, 'f' for Female, 'b' for Both
* @prop {string|null} bloodt Character's blood type, 'a', 'b', 'ab', 'o'
* @prop {Array<number>|null} birthday Array of two numbers representing Day and Month
* @prop {number|null} birthday.0 Day of the month (1-31)
* @prop {number|null} birthday.1 Month (1-12)
* @prop {string|null} aliases Alternative names, separated by `\n` newlines
* @prop {string|null} description Description/notes of the character.  Can include formatting codes as described in [d9.3]{@link https://vndb.org/d9.3}
* @prop {string|null} image HTTP link to the character image. Always (supposed to be) safe-for-work
* @prop {number|null} bust Character's bust measurement in cm
* @prop {number|null} waist Character's waist measurement in cm
* @prop {number|null} hip Character's hip measurement in cm
* @prop {number|null} height Character's height in cm
* @prop {number|null} weight Character's weight in kg
* @prop {Array<Array>|null} traits (Possibly empty) list of traits linked to this character
* @prop {number} traits.0 Trait ID
* @prop {number} traits.1 Spoiler level 0-2
* @prop {Array<Array>|null} vns List of VNs linked to this character
* @prop {number} vns.0 Visual Novel ID
* @prop {number} vns.1 Release ID
* @prop {number} vns.2 Spoiler level 0-2
* @prop {string} vns.3 Role
* @prop {Array<Object>|null} voiced List of staff that voiced this character, per VN
* @prop {number} voiced.id Staff ID
* @prop {number} voiced.aid Staff Alias ID
* @prop {number} voiced.vid VN ID
* @prop {string} voiced.note Description/note on the staff member
**/
class Character {
  /**
  * Create a Character
  * @constructor
  * @param {Object} data A VNDB Character object
  */
  constructor(data) {
    this.id = data.id;
    this.name = data.name != null ? data.name : null;
    this.original = data.original != null ? data.original : null;
    this.gender = data.gender != null ? data.gender : null;
    this.bloodt = data.bloodt != null ? data.bloodt : null;
    this.birthday = data.birthday != null ? data.birthday : null;
    this.aliases = data.aliases != null ? data.aliases : null;
    this.description = data.description != null ? data.description : null;
    this.image = data.image != null ? data.image : null;
    this.bust = data.bust != null ? data.bust : null;
    this.waist = data.waist != null ? data.waist : null;
    this.hip = data.hip != null ? data.hip : null;
    this.height = data.height != null ? data.height : null;
    this.weight = data.weight != null ? data.weight : null;
    this.traits = data.traits != null ? data.traits : null;
    this.vns = data.vns != null ? data.vns : null;
  }

  /**
  * Generate a link to the related Character page
  * @type {string}
  **/
  get link() {
    return `https://vndb.org/c${this.id}`;
  }

  /**
  * Generates a cleaned version of the Producer data
  * @type {Object}
  * @prop {number} id Character ID
  * @prop {string|null} name (Romaji) name
  * @prop {string|null} original Original/official name
  * @prop {string|null} gender **[Altered]** Character's gender.  'Male', 'Female', or 'Both'
  * @prop {string|null} bloodt **[Altered]** Character's blood type, 'A', 'B', 'AB', 'O'
  * @prop {Object|null} birthday **[Altered]** Object representing character's birthday
  * @prop {number|null} birthday.day Day of the month (1-31)
  * @prop {number|null} birthday.month Month (1-12)
  * @prop {Array<string>|null} aliases **[Altered]** Array of alternative names
  * @prop {Object|null} description **[Altered]** Description/notes of the character
  * @prop {string} description.text **[Added]** Spoiler-free description
  * @prop {string} description.spoilers **[Added]** Any spoilers found in description, or an empty string
  * @prop {string|null} image HTTP link to the character image. Always (supposed to be) safe-for-work
  * @prop {number|null} bust Character's bust measurement in cm
  * @prop {number|null} waist Character's waist measurement in cm
  * @prop {number|null} hip Character's hip measurement in cm
  * @prop {number|null} height Character's height in cm
  * @prop {number|null} weight Character's weight in kg
  * @prop {Array<Array>|null} traits (Possibly empty) list of traits linked to this character
  * @prop {number} traits.0 Trait ID
  * @prop {number} traits.1 Spoiler level 0-2
  * @prop {Array<Object>|null} vns **[Altered]** List of VNs linked to this character
  * @prop {number} vns.id Visual Novel ID
  * @prop {number} vns.rid Release ID
  * @prop {number} vns.spoiler Spoiler level 0-2
  * @prop {string} vns.role Role
  * @prop {Object} vns.links **[Added]** Object of links to related VNDB pages
  * @prop {string} vns.links.vn **[Added]** Link to related VN page
  * @prop {string} vns.links.release **[Added]** Link to related Release page
  * @prop {Array<Object>|null} voiced **[Altered]** List of staff that voiced this character, per VN
  * @prop {number} voiced.id Staff ID
  * @prop {number} voiced.aid Staff Alias ID
  * @prop {number} voiced.vid VN ID
  * @prop {string} voiced.note Description/note on the staff member
  * @prop {Object} voiced.links **[Added]** Object of links to related VNDB pages
  * @prop {string} voiced.links.vn **[Added]** Link to related VN page
  * @prop {string} voiced.links.staff **[Added]** Link to related Staff page
  **/
  get clean() {
    if (clean !== undefined) return clean;

    const results = {
      id: this.id,
      name: this.name,
      description: {},
      bloodt: this.bloodt.toUpperCase(),
      image: this.image,
      bust: this.bust,
      waist: this.waist,
      hip: this.hip,
      height: this.height,
      weight: this.weight,
      traits: this.traits,
      vns: this.vns
    };

    if (this.birthday !== null) {
      results.birthday = {
        day: this.birthday[0],
        month: this.birthday[1]
      };
    }

    if (this.gender !== null) {
      results.gender = ref.gender[this.gender] || this.gender;
    }

    if (this.aliases !== null) {
      results.aliases = this.aliases.split('\n');
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

    if (this.vns !== null) {
      results.vns = this.vns.map((vn) => {
        return {
          id: vn[0],
          rid: vn[1],
          spoiler: vn[2],
          role: vn[3],
          links: {
            vn: `https://vndb.org/v${vn[0]}`,
            release: `https://vndb.org/r${vn[1]}`
          }
        };
      });
    }

    if (this.voiced !== null) {
      results.voiced = this.voiced.map((staff) => {
        return {
          id: staff.id,
          aid: staff.aid,
          vid: staff.vid,
          note: staff.note,
          links: {
            vn: `https://vndb.org/v${staff.vid}`,
            staff: `https://vndb.org/s${staff.id}`
          }
        };
      });
    }

    clean = results;
    return results;
  }
}

module.exports = Character;
