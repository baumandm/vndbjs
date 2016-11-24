# Example

Before you begin, make sure you have **at least** Node v6.0 installed on your system.  Typing in both `node -v` and `npm -v` into the terminal should provide a version number if they are installed correctly.  

## Getting started

Install vndbjs to your project by navigating to your project's main directory in a terminal.  Type `npm install -S vndbjs` to install.  

To begin using vndbjs in your project, you need to require and instantiate it.  

```js
const _vndb = require('vndbjs');
const vndb = new _vndb('client_name', {options});
```

The constructor takes two parameters:

| Parameter | Type | Default Value | Optional | Description |
|-----|-----|-----|-----|-----|
| clientName | string | N/A | false | The name of your project.  Will be used as a unique ID when logging into VNDB.org.  Login will fail if not unique. |
| options | object | {} | true | Contains several possible options to configure vndbjs.  Changing these can break vndbjs. |
  | options.uri | string | 'api.vndb.org' |true| The database host address |
  | options.port | integer | 19534 |true | The port number |
  | options.encoding | string | 'utf8' |true| The encoding setting for data |
  | options.pool.min | integer | 1 |true| The minimum number of connections vndbjs will keep active and ready to take requests. |
  | options.pool.max | integer | 10 | true| The maximum number of connections vndbjs will use.  Note that VNDB.org only permits up to 10 connections per IP, so setting this higher is not advised without emailing them first. |
  | options.pool.idleTimeoutMillis | integer | 30000 |true| The time, in milliseconds, that vndbjs will keep an idle connection alive before killing it.   |
  | options.log | boolean | false |true| If true, vndbjs will console.log verbose logs.  Not recommended unless bugfixing. |

## Making a request

Now that vndb is properly instantiated, it can be used to make a request.  Doing this is simple.

```js
vndb.get({
    type: 'vn',
    filters: ['id = 17']
})
```

The results of this request will be returned as a Javascript Promise.  So to use the results, the above code would be changed to look like this.

```js
vndb.get({
    type: 'vn',
    filters: ['id = 17']
}).then(result => {
    console.log(result);
})
```

The above code will print the following to the console:

```js
{
more: false,
items:
  [ { id: 17,
    languages: [Object],
    title: 'Ever17 -The Out of Infinity-',
    released: '2002-08-29',
    platforms: [Object],
    orig_lang: [Object],
    original: null } ],
num: 1
}
```

*Note regarding filters: String-based filters such as title and search **require** double quotes around the search term.  Failure to include these will result in an error.  In those cases, the filter would look like `[filters: title = "Muv-Luv"]`*

Check the [Reference](get.md) section for more information about each property.
