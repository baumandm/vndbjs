![vndb.js](http://i.imgur.com/ujZTxlz.png)

[![npm version](https://badge.fury.io/js/vndb.js.svg)](https://badge.fury.io/js/vndb.js)

A Node.js library for accessing the VNDB.org TCP database.

This library serves as a middle man for node modules wishing to connect with the VNDB database.  The library's API will return results from the database as JSON objects for convenient use in your software.

Current implementation provides a minimal API, requiring the user to send correctly formatted string queries, as described in the [VNDB.org documentation](https://vndb.org/d11).  This may change in the future.

Vndb.js currently does not support the functionality of logging in to the database with a VNDB account.  This functionality is required for various SET tasks.  This functionality may be included at a later date, but is not planned at the moment.

## Installation ##

```npm install --save vndb.js```

## Example ##

```js
var vndb = require('./index.js');

vndb.query(`get vn basic,details,stats (title = "Muv-Luv")`).then( (output) => { //output is a JSON object of database data
    console.log(output);
});
```
