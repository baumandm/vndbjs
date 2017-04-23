***Note***:*VNDB's API is beyond the control of this libary, and may change.  Be sure to consult the [Official Documentation](https://vndb.org/d11) if you have any issues.*

To get information from VNDB, you must use the `.query()` function.  This function takes one argument: a VNDB-compatible query string.  The format for this string can be broken into 5 parts.

```md
get [type] [flags] [filters] [options]
```

For example:

```js
get vn basic,details,stats (search ~ "Muv Luv") { "sort": "rating", "reverse": true }
```

### Type

Type indicates what sort of data you wish to recieve. Currently the types are:

1. vn
2. release
3. producer
4. character
5. user
6. votelist
7. vnlist
8. wishlist

### Flags

Flags set which 'categories' of information you would like.  Each type has different flags, so consult the [Official Documentation](https://vndb.org/d11) for a full list of which flags are allowed for a particular type.  Each flag is chained together, separated by commas with no spaces.

### Filters

Filters are one or more logical expressions, surrounded by parethesis. Reading the documentation section on [filters](https://vndb.org/d11#2) is heavily recommended.  Each Type allows filtering on different fields, and each field allows different operators.  For example, `(id = 17)` is allowed, but `(id ~ 17)` is not, because the id field only allows the `=` operator.  However, `(title ~ "Muv Luv")` is allowed, as the `~` operator is permitted by the title field.

It's also important to note that the right side of each expression, the *value*, is always written as a JSON value.  This means that strings (such as Muv Luv above) *must* be written with double quotes around it.  Numbers, on the other hand, *must not*.  Keep this in mind to avoid errors.

### Options

This is an optional section, with four options.  This section is formatted entirely as a JSON string, and can contain any combination of elements.

#### page
*default: 1*

The page of the results to be recieved.  This allows you to paginate through the results.

#### results
*default: 10*

This value will be used to set the number of results returned per page.

#### sort
*default: id*

This accepts a string that corresponds to one of the fields of the Type you're searching for.  Consult the [Official Documentation](https://vndb.org/d11) for more information regarding which fields may be searched on.  Note that the particular field does not have to be returned in the results for it to be sorted by.  That is, you can sort by `rating` even if you have not included the `stats` flag in your query.

#### reverse
*default: false*

This is a boolean, which simply reverses the order of the results.  Setting to true while sorting by rating returns highest ratings first, while setting to false returns lowest ratings first.
