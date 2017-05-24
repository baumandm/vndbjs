<p align="center">
  <img src="http://i.imgur.com/trYFXTz.png"/>
</p>
<p align="center">
  <a href="https://gitlab.com/arbauman/vndbjs"><img src="https://img.shields.io/badge/Developed%20on-GitLab-orange.svg?style=flat-square" alt="Developed on Gitlab"></a>
  <a href="https://www.npmjs.com/package/vndbjs"><img src="https://img.shields.io/npm/v/vndbjs.svg?style=flat-square" alt="npm" /></a>
  <a href="https://gitlab.com/arbauman/vndbjs/commits/master"><img alt="build status" src="https://gitlab.com/arbauman/vndbjs/badges/master/build.svg" /></a>
  <a href="https://gitlab.com/arbauman/vndbjs/commits/master"><img alt="coverage report" src="https://gitlab.com/arbauman/vndbjs/badges/master/coverage.svg" /></a>
  <a href="https://arbauman.gitlab.io/vndbjs/"><img src="https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat-square" alt="Documentation Status" /></a>
</p>

A Node.js library for accessing the Visual Novel Database.

# Features

* All query types: vn, release, producer, character, staff, user, votelist, vnlist, and wishlist
* TLS-secure connections and user login
* `dbstats`, `get`, and `set` commands
* Configurable ratelimiting
* Automatic connection pooling
  * Automatically allocates connections to incoming requests
  * Reuses connections multiple times
  * Maintains a configurable number of connections at all times
  * Enables low overhead for commands, reducing latancy
* Data Cleaning

## Connection Pooling

Vndbjs will automatically create a pool of connections to VNDB, allowing you to maintain long-lived connections so that your commands can be sent at a moments notice.

## Cleaning

Vndbjs returns Javascript class instances for each query result.  These instances include getter methods that return cleaned versions of its own data, giving you access to both the raw and enhanced versions freely.

### Raw

```js
Vn {
  released: '2003-02-28',
  languages: [ 'en', 'ja', 'zh' ],
  platforms: [ 'win', 'ps3', 'psv', 'xb3' ],
  aliases: 'MUV-LUV Save in the name of true love',
  length: 4
}
```

### Cleaned
```js
{
  released: { year: '2003', month: '02', day: '28' },
  languages: [ 'English', 'Japanese', 'Chinese' ],
  platforms: [ 'Windows', 'Playstation 3', 'Playstation Vita', 'Xbox 360' ],
  aliases: [ 'MUV-LUV Save in the name of true love' ],
  length: 'Long'
}
```

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
