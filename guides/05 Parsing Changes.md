In parsing mode, the results VNDB returns are modified in various places with the intent of providing more relevant and helpful information than the defaults.  Often this involves converting ambiguous data representations into their definite counterparts.  Occasionally, but rarely, key results may be changed for the sake of clarity.  Generally, it's recommended to build your client application with the intention to either use parsing mode or not.  

Below are the changed values as they differ from the defaults VNDB.org provides.  Keep in mind that generally, the root of the Object remains the same.  The parsed changes occur within each object inside the `items` Array. Most Objects returned follow this format.

```js
{
  status: 'results',
  more: {boolean},
  num: {number},
  items: {Array<Objects>}
}
```

**NOTE** *Votelist, VNlist, and Wishlist have an additional field `link` in the root of the object, which links to the appropriate page of the user searched for.*

Below are the changed or added fields for every data type.  Keep in mind that these examples only represent a single Object inside the `items` Array. Added fields are in **bold**.

## VN

* **link**: A link to the VN's VNDB page
* languages: Language abbreviations are replaced with the full name of the language
* orig_lang: Language abbreviations are replaced with the full name of the language
* platforms: Platform abbreviations are replaced with the full name of the platform
* aliases: Formerly a string of newline-separated strings.  Now an array of alias strings
* description: BBcode tags removed, duplicate newlines replaced with a single newline
* links: Formerly only link endings.  Now replaced with full links
* relations
  * relation: Relation abbreviations are replaced with their corresponding words
  * **link**: A link to the related VN

## Release

* **link**: A link to the Release's VNDB page
* type: Capitalized
* languages: Language abbreviations are replaced with the full name of the language
* platforms: Platform abbreviations are replaced with the full name of the platform
* media
  * medium: Medium abbreviations are replaced with their corresponding meaning
* vn
  * **link**: A link to the related VN's VNDB page
* producers
  * type: Producer type abbreviations are replaced with their correspoding meaning
  * **link**: A link to the related Producer's VNDB page

## Producer

* **link**: A link to the Producer's VNDB page
* type: Producer type abbreviations are replaced with their corresponding words
* language: Language abbreviations are replaced with the full name of the language
* links
  * wikipedia: Formerly just the ending to the url, now the full url
* aliases: Formerly a comma-separated string of aliases, now an Array of aliases
* description: BBcode tags removed, duplicate newlines replaced with a single newline
* relations
  * relation: Relation abbreviations are replaced with their meaning
  * **link**: A link to the related Producer's VNDB page

## Character

* **link**: A link to the Character's VNDB page
* birthday: formerly an array of numbers, now an object
  * **day**: The day the character was born
  * **month**: The month the character was born
* gender: Gender abbreviations are replaced with their meanings
* bloodt: **CHANGED**
* ***bloodtype***: Capitalized
* description: BBcode tags removed, duplicate newlines replaced with a single newline

## User

* **link**: A link to the User's VNDB page

## Votelist

***Reminder****: The root of this Object has an additional `link` field, with a url to the user's votelist*

* vote: Formerly a value out of 100, now a value out of 10, as shown on the site.

## VNlist

***Reminder****: The root of this Object has an additional `link` field, with a url to the user's VNlist*

* status: VNlist status numbers are converted to their corresponding meanings

## Wishlist

***Reminder****: The root of this Object has an additional `link` field, with a url to the user's Wishlist*

* priority: Wishlist priority numbers are converted to their corresponding meanings