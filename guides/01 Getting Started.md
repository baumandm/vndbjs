# Overview

To install vndbjs, open a console in the root of your project and type 

```bash
npm install --save vndbjs
```

vndbjs will install. 

To use vndbjs, you must first require and instantiate it.

```js
const Vndb = require('vndbjs');

const options = {
  clientName: 'vndbjsDemo'
}

const vndb = new Vndb(options);
```

You may now use the functions `vndb` provides.  

```js
vndb.query('get vn basic (id = 17)').then((response) => {
  console.log('response');

  //  { 
  //    status: 'results',
  //    more: false,
  //    num: 1,
  //    items: [ {
  //      id: 17,
  //      link: 'https://vndb.org/v17',
  //      title: 'Ever17 -The Out of Infinity-',
  //      original: null,
  //      released: '2002-08-29',
  //      languages: [Object],
  //      orig_lang: [Object],
  //      platforms: [Object]
  //    } ] 
  //  }

}, (err) => {
  console.log(error);
});
```

# Configuration

```js
options = {
  clientName: 'vndbjsDemo',
  pool: true,
  poolMin: 1,
  poolMax: 10,
  poolTimeout: 30000,
  uri: 'api.vndb.org',
  port: 19534,
  encoding: 'utf8',
  parse: true,
  queryLimit: 20,
  queryInterval: 60000
}
```

Vndbjs takes a config object when you instantiate it.  Lets go over the options.

## options.clientName

This will be used to differentiate your application from any others that may be using vndbjs.  VNDB.org will respond with an error if two clients attempt to log in with the same name.  Although vndbjs appends a randomly generated [shortid](https://www.npmjs.com/package/shortid) to every connection it makes, you should still provide a name that accurately represents your particular application.

## options.pool

If set to true, vndbjs will use a [generic pool](https://www.npmjs.com/package/generic-pool) to maintain multiple connections at once.  This allows vndbjs to reuse connections that are already connected and registered to VNDB.org.  If set to false, each query will have to connect and register before the query can be done.  Queries performed in pooled mode are roughly 300% faster than unpooled mode.  I recommend using pooled mode, but the option exists if you want a more lightweight solution.

## options.poolMin

In Pooled Mode, this is the minimum number of connections vndbjs will maintain in the pool.  Even when completely idle, vndbjs will keep this many connections active and ready to respond to a query.

## options.poolMax

In Pooled Mode, this is the maximum number of connections vndbjs will allow in the pool.  If all connections are used up, the pool will queue up the requests until resources can be allocated.  Note that VNDB.org allows no more than 10 open connections at once from any single IP address, so it is not advised to increase this number.

## options.poolTimeout

In Pooled Mode, this is the number of milliseconds that an idle connection will wait in the pool before it is eligible for destruction. A connection will *only* be destroyed if there are more connections than the minimum specified above.

## options.uri

This is the address that vndbjs will attempt to connect to.  There is essentially no reason to ever change this unless VNDB.org changes their API, so it's safe to ignore this setting.

## options.port

This is the port that vndbjs will make a connection to.  Like `uri`, there is limited reason to change this port.  The only reason to do so would be to connect to the more secure TSL port, `19535`, but vndbjs does not support that yet.  When it does, this option will likely change.

## options.encoding

This configures the encoding setting of the socket connection.  `utf8` is currently the only tested encoding setting, so change at your own risk.

## options.parse

This option will configure vndbjs to parse the results that VNDB.org provides and make seamless improvements to the data.  See later sections of the tutorials for examples of the changes

## options.queryLimit and options.queryInterval

Vndbjs will allow [queryLimit] requests within [queryInterval] time.  This is set by default to 20 requests per minute, which maintains a ratio with VNDB's specification of 200 requests per 10 minutes.  Changes made to these settings should take care to not allow too many requests, as being throttled by VNDB may produce undesireable results.