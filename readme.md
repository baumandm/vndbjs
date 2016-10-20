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
* All queries are returned as a Promise.
* Database results are returned as JSON objects for easy parsing.

## Getting Started
`npm install --save vndbjs`

## Documentation
```js
var _vndb = require('vndbjs');
var vndb = new _vndb("<client name>");

vndb.query(`get vn basic,details,stats (title = "Muv-Luv")`).then( (output) => {
    console.log(output); // Output is a JSON object of database data
    console.log(output.title) // "Muv-Luv"
    console.log(output.original) // "マブラヴ"
});
```
## License
vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org
