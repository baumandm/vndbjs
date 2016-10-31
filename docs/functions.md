# Interfaces

Vndbjs provides two ways to interact with VNDB.org's database: `get()` and `query()`.  However, `get()` is the means intended for general use, as it will construct the query string by itself based on the options passed to it.

## Stats

`vndb.stats()`

Output: Promise<JSON\>

Stats takes no parameters.  It returns a JSON object of various stats for VNDB.org as a whole.  Below is an example.

```js
{
  "users":49084,
  "threads":3998,
  "tags":1627,
  "releases":28071,
  "producers":3456,
  "chars":14046,
  "posts":52470,
  "vn":13051,
  "traits":1272
}
```
## Get

```js
vndb.get({
  type: 'vn',
  flags: ['basic', 'details'],
  filters: ['search ~ "Muv-Luv"'],
  options: {
    page: 1,
    results: 10,
    sort: 'id',
    reverse: false
  }
})
```

Output: Promise<JSON\>

Get takes one parameter, an object which contains at most 4 properties: `type`, `flags`, `filters`, and `options`.  Specifics on these properties are covered in detail in the [Reference](get.md) section.  In summary:

* Type specifies what kind of information to request.  
* Flags specify various categories of data that should be included in the response.
* Filters are evaluations that are used to narrow down the results.
* Options allows the results to be paginated, sorted, and orders a specific way.

Only `type` and `filters` are required properties. If no flags are specified, vndbjs will default to 'basic'.  If no options are provide, VNDB.org will assume the default options.

## Query

```js
vndb.query(`get vn basic,details (search ~ "Muv-Luv") {options:{page:1,results:10,sort:'id',reverse:false}}`)
```

Output: Promise<JSON\>

If, for some reason, `get()` is insufficient for your needs, `query()` is provided as a fallback.  Query takes one parameter, a string which is sent to VNDB.org.  For more information on how to format this string, consult the [Reference](get.md) section or the [official VNDB.org Documentation](https://vndb.org/d11)
