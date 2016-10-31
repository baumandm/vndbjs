![vndbjs](http://i.imgur.com/ujZTxlz.png)

[![Documentation Status](https://readthedocs.org/projects/vndbjs/badge/?version=latest)](http://vndbjs.readthedocs.io/en/latest/?badge=latest)
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

## License
vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org
