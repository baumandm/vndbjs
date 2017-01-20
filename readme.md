<p align="center">
  <img src="http://i.imgur.com/ujZTxlz.png"/>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vndbjs"><img src="https://img.shields.io/npm/v/vndbjs.svg?style=flat-square" alt="npm" /></a>
  <a href="https://travis-ci.org/arbauman/vndbjs"><img src="https://img.shields.io/travis/arbauman/vndbjs.svg?style=flat-square" alt="Travis" /></a>
  <a href="https://github.com/arbauman/vndbjs/issues"><img src="https://img.shields.io/github/issues-raw/arbauman/vndbjs.svg?style=flat-square" alt="" /></a>
  <a href="https://codeclimate.com/github/arbauman/vndbjs"><img src="https://img.shields.io/codeclimate/github/arbauman/vndbjs.svg?style=flat-square" alt="Code Climate" /></a>
  <a href="https://codeclimate.com/github/arbauman/vndbjs/coverage"><img src="https://img.shields.io/codeclimate/coverage/github/arbauman/vndbjs.svg?style=flat-square" alt="Code Climate" /></a>
  <a href="http://vndbjs.readthedocs.io/en/latest/?badge=latest"><img src="https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat-square" alt="Documentation Status" /></a>
</p>
A Node.js library for accessing the VNDB.org database.

vndbjs currently does not support logging in to the database with a VNDB account.  This functionality is required for making changes to the database.  This functionality may be included at a later date, but is not planned at the moment.

## Features
* Takes care of connecting and logging in.
* Sets up a pool of connections (up to 10, as allowed by VNDB) and allocates requests automatically.
* All queries are returned as a Promise.
* Database results are returned as JSON objects for easy parsing.

## Installation
`npm install --save vndbjs`

## License
vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org
