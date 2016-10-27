![vndbjs](http://i.imgur.com/ujZTxlz.png)

[![npm version](https://badge.fury.io/js/vndbjs.svg)](https://badge.fury.io/js/vndbjs)
[![Build Status](https://travis-ci.org/arbauman/vndbjs.svg?branch=master)](https://travis-ci.org/arbauman/vndbjs)
[![Code Climate](https://codeclimate.com/github/arbauman/vndbjs/badges/gpa.svg)](https://codeclimate.com/github/arbauman/vndbjs)
[![Test Coverage](https://codeclimate.com/github/arbauman/vndbjs/badges/coverage.svg)](https://codeclimate.com/github/arbauman/vndbjs/coverage)

[![NPM](https://nodei.co/npm/vndbjs.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vndbjs/)

A Node.js library for accessing the VNDB.org database.

vndbjs currently does not support logging in to the database with a VNDB account.  This functionality is required for making changes to the database.  This functionality may be included at a later date, but is not planned at the moment.

## Features
* Takes care of connecting and logging in.
* Sets up a pool of connections (up to 10, as allowed by VNDB) and allocates requests automatically.
* All queries are returned as a Promise.
* Database results are returned as JSON objects for easy parsing.

## Installation
`npm install --save vndbjs`

## Usage
```js
var _vndb = require('vndbjs');
var vndb = new _vndb('<client name>'); // Unique name for your client program

vndb.getVnByTitle('Ever17 - The Out of Infinity-').then( (output) => {
  { items:
    [ { languages: [Object],
        image: 'https://s.vndb.org/cv/60/24260.jpg',
        orig_lang: [Object],
        rating: 8.66,
        links: [Object],
        image_nsfw: false,
        title: 'Ever17 -The Out of Infinity-',
        votecount: 4345,
        length: 4,
        description: 'Ever17 is the tale of seven individuals who come to be trapped 153 feet within the underwater marine theme park, LeMU. During an apparently normal day at the park, a massive accident happens, placing almost half of the facility underwater. The path to the surface and the communication lines are cut off. In addition, LeMU is under constant assault by severe water pressure, limiting time to find a means of escape to 119 hours. Escape is not the only concern, however; many questions arise as to the legitimacy of the accident and whether or not those trapped there were brought there for a purpose.\n\n[From [url=http://en.wikipedia.org/wiki/Ever_17:_The_Out_of_Infinity]Wikipedia[/url]]',
        aliases: 'Ever 17\nEbaa Sebuntiin\nエバー・セブンティーン\ne17',
        platforms: [Object],
        original: null,
        popularity: 63.5,
        released: '2002-08-29',
        id: 17 } ],
  more: false,
  num: 1 }
});
```

# Documentation
## Templates
These are simplified wrappers designed to provide easy access to the most common queries one might need.  If you have an idea for an additional template, open an issue.

### dbstats()
Returns: JSON object of various stats for vndb.org

### searchVnList(string)
*Note: This command uses the `search ~` filter, not `title =`, so incorrect spelling or punctuation is acceptable.
Though obviously, the more correct the input, the more likely VNDB will return what you're looking for.
All other commands require precise spelling and punctuation.*

Returns: JSON object of matches.

### getVnByTitleFull(string)
Returns: JSON object of all data available for that entry.

### getVnByTitle(string)
Returns: JSON object of basic, details, and stats for that entry.

### getVnByIdFull(int)
Returns: JSON object of all data available for that entry.

### getVnById(int)
Returns: JSON object of basic, details, and stats for that entry.

## Custom Searches
If none of the above functions achieve quite what you want, these functions allow you to request specific results.

### get({options})
This function allows you to pass in an object, which must be formatted as below.  All fields are mandatory except for flags, which will default to `["basic", "details", "stats"]` if none are provided.  

*Note: At this time get() does not yet support the "options" argument, which allows setting values for `page`, `results`, `sort`, and `reverse`.*
```js
get({
    type: vn,
    flags: ['basic', 'details'],
    filter: {
        type: 'search',
        oper: '~',
        value: 'muv-luv'
    }
})
```

### query(string)
This is the most basic function, allowing you to directly input the string which is sent to VNDB.org.  
```js
query('get vn basic,details (search ~ "muv-luv")')
```
Since this option is the simplest and easily customized, it should allow you to request any information accessible through VNDB's API.  Consult [VNDB's documentation](https://vndb.org/d11#5) for more information on how to build your strings.

*Note: The quotes around the strings in the filter section (in this case, "muv-luv") are __necessary__.  Don't forget them, or you'll get an error.*



## License
vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org
