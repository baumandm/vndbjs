<p align="center">
  <img src="http://i.imgur.com/trYFXTz.png"/>
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

* Automatically connects and registers
* Optional Pooling mode
  * Automatically allocates connections to incoming requests
  * Reuses connections multiple times
  * Maintains a configurable number of connections at all times
  * Roughly 3x faster than the pool-less mode
* Optional Parsing mode
  * Replaces many pieces of VNDB's data with more usable replacements
  * Includes splitting alias strings, converting language and platform codes, and more
  * Works on all query types
* Configurable ratelimiting

# Installation
**Node v6.0.0 or newer**

`npm install --save vndbjs`

# Links
[Official VNDB Documentation](https://vndb.org/d11)
[Vndbjs Documentation](https://arbauman.gitlab.io/vndbjs/)

# Contributing
This project is developed on [GitLab](https://gitlab.com/arbauman/vndbjs), so check the issue tracker there before reporting an issue.  Reporting issues through GitHub is fine, but kindly submit all PRs to GitLab.  Check the [contribution guide](contributing.md) for help getting started.

# License
Vndbjs is licensed under the [MIT](license) license.  This library is not associated with VNDB.org
