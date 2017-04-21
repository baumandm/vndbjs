<p align="center">
  <img src="http://i.imgur.com/ujZTxlz.png"/>
</p>
<p align="center">
  <a href="https://gitlab.com/arbauman/startpage"><img src="https://img.shields.io/badge/Developed%20on-GitLab-orange.svg?style=flat-square" alt="Developed on Gitlab"></a>
  <a href="https://www.npmjs.com/package/vndbjs"><img src="https://img.shields.io/npm/v/vndbjs.svg?style=flat-square" alt="npm" /></a>
  <a href="https://gitlab.com/arbauman/vndbjs/commits/master"><img alt="build status" src="https://gitlab.com/arbauman/vndbjs/badges/master/build.svg" /></a>
  <a href="https://gitlab.com/arbauman/vndbjs/commits/master"><img alt="coverage report" src="https://gitlab.com/arbauman/vndbjs/badges/master/coverage.svg" /></a>
  <a href="https://arbauman.gitlab.io/vndbjs/"><img src="https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat-square" alt="Documentation Status" /></a>
</p>
A Node.js library for accessing the Visual Novel Database.

# Features

## Pool
* Takes care of connecting and logging in
* Sets up a pool of connections (up to 10, as allowed by VNDB) and allocates requests automatically
* Maintains a minumum number of connections at all times, ready to respond to queries at a moment's notice

## No-pool
* No overhead, only active when needed
* Lightwight but functional for occasional VNDB needs

## Both
* The identical interfaces
* All queries are returned as a Promise
* Database results are returned as JSON objects for easy parsing
* Optional parsing mode automatically converts certain results into more usable forms

# Installation
`npm install --save vndbjs`

# License
vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org