# Overview

To install vndbjs, open a console in the root of your project and type

```bash
npm install --save vndbjs
```

vndbjs will install.

To use vndbjs, you must first require and instantiate it.

```js
const Vndbjs = require('vndbjs');

const options = {
  clientName: 'vndbjsDemo'
}

const vndbjs = new Vndbjs(options);
```

You may now use the functions `vndbjs` provides.  

```js
vndbjs.send('get vn basic (id = 17)').then((response) => {
  console.log('response');

  //  { items:
  //     [ Vn {
  //         id: 17,
  //         title: 'Ever17 -The Out of Infinity-',
  //         original: null,
  //         released: '2002-08-29',
  //         languages: [Object],
  //         orig_lang: [Object],
  //         platforms: [Object],
  //         aliases: null,
  //         length: null,
  //         description: null,
  //         links: null,
  //         image: null,
  //         image_nsfw: null,
  //         anime: null,
  //         relations: null,
  //         tags: null,
  //         popularity: null,
  //         rating: null,
  //         votecount: null,
  //         screens: null,
  //         staff: null } ],
  //    more: false,
  //    num: 1,
  //    status: 'results',
  //    metadata: { raw: 'get vn basic (id = 17)', type: 'vn' } }

}, (err) => {
  console.log(error);
});
```

# Configuration

```js
options = {
  clientName: 'vndbjsDemo',
  encoding: 'utf8',
  rateLimit: 20,
  rateInterval: 60000,
  password: null,
  poolMin: 1,
  poolMax: 10,
  poolTimeout: 30000,
  secure: true,
  username: null
};
```

Vndbjs takes a config object when you instantiate it.  You can find more details about the config [here]{@link Vndbjs}
