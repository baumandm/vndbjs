/**
* Reference Object converting VNDB data into more useful forms
* @module reference
* @prop {Object} platforms VNDB platform codes
* @prop {Array} length VNDB length codes
* @prop {Object} languages VNDB language codes
* @prop {Object} vnRelations VNDB relation codes between VNs
* @prop {Object} proRelations VNDB relation codes between Producers
* @prop {Object} releaseType VNDB release type codes
* @prop {Object} producerType VNDB producer type codes
* @prop {Object} media VNDB release media codes
* @prop {Object} characterGender VNDB character gender codes
* @prop {Array} listStatus VNDB User VNlist codes
* @prop {Array} priority VNDB User Wishlist codes
**/

module.exports = {
  platforms: {
    win: 'Windows',
    ps3: 'Playstation 3',
    psv: 'Playstation Vita',
    xb3: 'Xbox 360',
    lin: 'Linux',
    mac: 'macOS',
    and: 'Android',
    ios: 'iOS',
    nds: 'Nintendo DS',
    ps2: 'Playstation 2',
    drc: 'Dreamcast',
    psp: 'Playstation Portable',
    gba: 'Gameboy Advance',
    wii: 'Nintendo Wii',
    n3d: 'Nintendo 3DS',
    oth: 'Other',
    dvd: 'DVD Player',
    bdp: 'Blu-ray Player',
    web: 'Browser'
  },
  length: [
    'Very Short',
    'Short',
    'Medium',
    'Long',
    'Very Long'
  ],
  languages: {
    ja: 'Japanese',
    en: 'English',
    ru: 'Russian',
    zh: 'Chinese',
    it: 'Italian',
    fr: 'French',
    de: 'German',
    hu: 'Hungarian',
    es: 'Spanish',
    pl: 'Polish',
    'pt-br': 'Portuguese (Brazil)',
    ca: 'Catalan',
    vi: 'Vietnamese',
    ar: 'Arabic',
    ko: 'Korean'
  },
  vnRelations: {
    preq: 'Prequel',
    char: 'Shares Characters',
    fan: 'Fandisc',
    set: 'Shares Setting',
    ser: 'Shares Series',
    side: 'Side Story',
    seq: 'Sequel',
    alt: 'Alternative Version'
  },
  proRelations: {
    ipa: 'Parent Brand',
    par: 'Parent Producer',
    spa: 'Spawned',
    sub: 'Subsidiary',
    imp: 'Imprint'
  },
  releaseType: {
    complete: 'Complete',
    partial: 'Partial',
    trial: 'Trial'
  },
  producerType: {
    co: 'Company',
    ng: 'Amateur Group',
    in: 'Individual'
  },
  media: {
    blr: 'Blu-ray',
    dvd: 'DVD',
    cd: 'CD',
    in: 'Internet Download'
  },
  characterGender: {
    m: 'Male',
    f: 'Female',
    b: 'Both'
  },
  listStatus: [
    'Unknown',
    'Playing',
    'Finished',
    'On Hold',
    'Dropped'
  ],
  priority: [
    'High',
    'Medium',
    'Low',
    'Blacklist'
  ]
};
