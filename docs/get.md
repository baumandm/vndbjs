*Much of this information is similar to what can be found at [VNDB.org](https://vndb.org/d11.5).  However, I've included a slightly modified version here for the sake of convinience, since it's relevant for the operation of vndbjs.  If you find the information here to be giving you errors, check VNDB.org's documentation to see if they made changes, and please let me know.*

## Overview

Get is used to fetch data from the database. It accepts 4 arguments: 

* the type of data to fetch (e.g. visual novels or producers)
* what part of that data to fetch (e.g. only the VN titles, or the descriptions and relations as well)
* a filter expression
* some options

`type` and `flags` are unescaped strings. The accepted values for type are documented below. 

`flags` is a comma-separated list of flags indicating what info to fetch. 

The filters, available flags and their meaning are documented separately for each type. 

The last options argument is optional, and influences the behaviour of the returned results. When present, options should be a JSON object with the following members (all are optional):

|  |  |
|-----|-----|
| page | integer, used for pagination. Page 1 (the default) returns the first 10 results (1-10), page 2 returns the following 10 (11-20), etc. (The actual number of results per page can be set with the "results" option below). |
| results | integer, maximum number of results to return. Also affects the "page" option above. For example: with "page" set to 2 and "results" set to 5, the second five results (that is, results 6-10) will be returned. Default: 10. |
| sort | string, the field to order the results by. The accepted field names differ per type, the default sort field is the ID of the database entry. |
| reverse | boolean, default false. Set to true to reverse the order of the results. |

The following example will fetch basic information and information about the related anime of the visual novel with id = 17:

`get vn basic,anime (id = 17)`

The server will reply with a 'results' message, this message is followed by a JSON object describing the results. This object has three members: 'num', which is an integer indicating the number of results returned, 'more', which is true when there are more results available (i.e. increasing the page option described above will give new results) and 'items', which contains the results as an array of objects. 

*Bolded properties can be used to sort results.*

## VN

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **id** | - | integer | no | Visual novel ID |
| **title** | basic | string | no | Main title |
| original | basic | string | yes | Original/Official title |
| **released** | basic | date(string) | yes | Date of the first release |
| languages | basic | array of strings | no | Can be an empty array when nothing has been released yet |
| orig_lang | basic | array of strings | no | Language(s) of the first release.  Can be an empty array |
| platforms | basic | array of strings | no | Can be empty array when unknown or nothing has been released |
| aliases | details | string | yes | Aliases, separated by newlines |
| length | details | integer | yes | Length of the game, 1-5 |
| description | details | string | yes | Description of the VN.  Can include formatting codes as described in [d9.3](https://vndb.org/d9.3) |
| links | details | object | no | Contains the following members:<br>"wikipedia", string, name of the related article on the English Wikipedia<br>"encubed", string, the URL-encoded tag used on encubed<br>"renai", string, the name part of the url on renai.us<br>All members can be **null** when no links are available or known |
| image | details | string | yes | HTTP link to the VN image |
| image_nsft | details | boolean | no | whether the VN image is flagged as NSFW or not |
| anime | anime | array of objects | no | (Possibly empty) list of anime related to the VN, each object has the following members:<br>"id", integer, AniDB ID<br>"ann_id", integer, AnimeNewsNetwork ID<br>"nfo_id", string, AnimeNfo ID<br>"title_romaji", string<br>"title_kanji", string<br>"year", integer, year in which the anime was aired<br>"type", string<br>All members except the "id" can be null. Note that this data is courtesy of AniDB, and may not reflect the latest state of their information due to caching. |
| relations | relations | array of objects | no | (Possibly empty) list of related visual novels, each object has the following members:<br>"id", integer<br>"relation", string, relation to the VN<br>"title", string, (romaji) title<br>"original", string, original/official title, can be null<br>"official", boolean. |
| tags | tags | array of arrays | no | (Possibly empty) list of tags linked to this VN. Each tag is represented as an array with three elements:<br>tag id (integer),<br>score (number between 0 and 3),<br>spoiler level (integer, 0=none, 1=minor, 2=major)<br>Only tags with a positive score are included. Note that this list may be relatively large - more than 50 tags for a VN is quite possible.<br>General information for each tag is available in the [tags dump](https://vndb.org/d14.2). Keep in mind that it is possible that a tag has only recently been added and is not available in the dump yet, though this doesn't happen often. |
| **popularity** | stats | number | no | Between 0 (unpopular) and 100 (most popular) |
| **rating** | stats | number | no | Bayesian rating, between 1 and 10 |
| **votecount** | stats | integer | no | Number of votes |
| screens | screens | array of objects | no | (Possibly empty) list of screenshots, each object has the following members:<br>"image", string, URL of the full-size screenshot<br>"rid", integer, release ID<br>"nsfw", boolean<br>"height", integer, height of the full-size screenshot<br>"width", integer, width of the full-size screenshot |

### VN Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| id | integer<br> array of integers | = != > >= < <=<br> = != | If you need information on several VNs, it's best to <br>do it all at once (id = [17,8,29]) |
| title | string | = != ~ |  |
| original | null <br>  string | = != <br>  = != ~ |  |
| firstchar | null <br> string | = != <br> = !=  | Filter by the first character of the title, similar to <br>the VN browser interface. The character must <br>either be a lowercase 'a' to 'z', or null to match <br>all titles not starting with an alphabetic character. |
| released | null <br> date(string) | = != <br> = != > >= < <= | Note that matching on partial dates <br>(released = "2009") doesn't do what you want, use <br>ranges instead, e.g. (released > "2008" and <br>released <= "2009"). |
| platforms | null <br>string <br>array of strings | = != |  |
| languages | null <br>string <br>array of strings | = != |  |
| orig_lang | string <br>array of strings | = != |  |
| search | string | ~ | This is not an actual field, but performs a search <br>on the titles of the visual novel and its releases. <br>Note that the algorithm of this search may change <br>and that it can use a different algorithm than the <br>search function on the website. |
| tags | int <br>array of ints | = != | Find VNs by tag. When providing an array of ints, <br>the '=' filter will return VNs that are linked to any <br>(not all) of the given tags, the '!=' filter will return <br>VNs that are not linked to any of the given tags. <br>You can combine multiple tags filters with 'and' <br>and 'or' to get the exact behavior you need. This <br>filter may used cached data, it may take up to 24 <br>hours before a VN will have its tag updated with <br>respect to this filter. Be warned that this filter <br>ignores spoiler settings, fetch the tags associated <br>with the returned VN to verify the spoiler level. |

## Release

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **id** | - | integer | no | Release ID |
| **title** | basic | string | no | Release Title (romaji) |
| original | basic | string | yes | Original/official title of the release |
| **released** | basic | date(string) | yes | Release date |
| type | basic | string | no | "complete", "partial", or "trial" |
| patch | basic | boolean | no |  |
| freeware | basic | boolean | no |  |
| doujin | basic | boolean | no |  |
| languages | basic | array of strings | no |  |
| website | details | string | yes | Official website URL |
| notes | details | string | yes | Random notes, can contain formatting codes as described in [d9.3](https://vndb.org/d9.3) |
| minage | details | integer | yes | Age rating, 0 = all ages |
| gtin | details | string | yes | JAN/UPC/EAN code.  This is actually an integer, but formatted as a string to avoid an overflow on 32 bit platforms |
| catelog | details | string | yes | Catalog number |
| platforms | details | array of strings | no | Empty array when platform is unknown |
| media | details | array of objects | no | Objects have the following two members:<br> "medium", string<br> "qty", integer, the quantity.  **null** when it is not applicable for the medium<br> An empty array is returned when the media are unknown |
| vn | vn | array of objects | no | Array of visual novels linked to this release.  Objects have the following members: id, title, and original.  These are the same as the members of the "get vn" command. |
| producers | producers | array of objects | no | (Possibly empty) list of producers involved in this release. Objects have the following members:<br> "id", integer<br> "developer", boolean,<br> "publisher", boolean,<br> "name", string, romaji name<br> "original", string, official/original name, can be null<br> "type", string, producer type |

### Release Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| id | integer<br> array of integers | = != > >= < <=<br> = != |  |
| vn | integer | = | Find releases linked to the given visual novel ID |
| producer | integer | = | Find releases linked to the given producer ID |
| title | string | = != ~ |  |
| original | null<br> string | = !=<br> = != ~ |  |
| released | null<br> date(string) | = !=<br> = != > >= < <= | Note about released filter for the vn type also applies here. |
| patch | boolean | = |  |
| freeware | boolean | = |  |
| doujin | boolean | = |  |
| type | string | = != |  |
| gtin | integer | = != | Value can also be escaped as a string (if you risk an integer <br>overflow otherwise) |
| catelog | string | = != |  |
| languages | string<br> array of strings | = != |  |

## Producer

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **id** | - | integer | no | Producer ID |
| **name** | basic | string | no | (romaji) producer name |
| original | basic | string | yes | Original/official name |
| type | basic | string | no | Producer type |
| language | basic | string | no | Primary Language |
| links | details | object | no | External links, object has the following members:<br> "homepage", official homepage,<br> "wikipedia", title of the related article on the English wikipedia.<br> Both values can be null. |
| aliases | details | string | yes | Comma-separated list of alternative names |
| description | details | string | yes | Description/notes of the producer, can contain formatting codes as described in [d9.3](https://vndb.org/d9.3) |
| relations | relations | array of objects | no | (possibly empty) list of related producers, each object has the following members:<br> "id", integer, producer ID,<br> "relation", string, relation to the current producer,<br> "name", string,<br> "original", string, can be null |

### Producer Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| id | integer<br> array of integers | = != > >= < <=<br> = != |  |
| name | string | = != |  |
| original | null<br> string | = !=<br> = != ~ |  |
| type | string | = != |  |
| language | string<br> array of strings | = != |  |
| search | string | ~ | Not an actual field.  Performs a search on the name, <br>original, and aliases fields. |

## Character

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **id** | - | integer | no | Character ID |
| **name** | basic | string | no | (romaji) name |
| original | basic | string | yes | Original (kana/kanji) name |
| gender | basic | string | yes | "m" (male), "f" (female), or "b" (both) |
| bloodt | basic | string | yes | Blood type, "a", "b", "ab", or "o" |
| birthday | basic | array | no | Array of two numbers: day of the month (1-31) and the month (1-12).  Either can be null |
| aliases | details | string | yes | Alternative names, separated with a newline |
| description | details | string | yes | Description/notes of the producer, can contain formatting codes as described in [d9.3](https://vndb.org/d9.3) May also include [spoiler] tags! |
| image | details | string | yes | HTTP link to the character image.  Always (supposed to be) SFW |
| bust | meas | integer | yes | cm |
| waist | meas | integer | yes | cm |
| hip | meas | integer | yes | cm |
| height | meas | integer | yes | cm |
| weight | meas | integer | yes | kg |
| traits | traits | array of arrays | no | (Possibly empty) list of traits linked to this character. Each trait is represented as an array of two elements: The trait id (integer) and the spoiler level (integer, 0-2). General information for each trait is available in the [traits dump](https://vndb.org/d14.3). |
| vns | vns | array of arrays | no | List of VNs linked to this character. Each VN is an array of 4 elements: <br> VN id, <br> release ID (0 = "all releases"), <br> spoiler level (0-2)<br> role (string).Available roles: "main", "primary", "side" and "appears". |

### Character Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| id | integer<br> array of integers | = != > >= < <=<br> = != |  |
| name | string | = != ~ |  |
| original | null<br> string | = != <br> = != ~ |  |
| search | string | ~ | Not an actual field.  Performs a search on the name, <br>original, and alias fields. |
| vn | integer<br> array of integers | = | Find characters linked to the given visual novel ID(s).<br>Note that this may also include characters that are <br>normally hidden by spoiler settings. |

## User

| Property | Flag | Tyle | null | Description |
|-----|-----|-----|-----|-----|
| **id** | basic | integer | no | User ID |
| username | basic | string | no |  |

### User Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| id | integer<br> array of integers | = | This filter must be present.  The special value '0' is recognized as the currently logged in user |

## Votelist

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **vn** | basic | integer | no | Visual Novel ID |
| note | basic | integer | no | In the range of 10 (lowest) to 100 (highest).  These are displayed on the site as a fractional number between 1 and 10 |
| added | basic | integer | no | Unix timestamp of when this vote has been added |

### Votelist Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| uid | integer | = | This filter must be present.  The special value '0' is recognized as the currently logged in user |

## VNlist

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **vn** | basic | integer | no | Visual Novel ID |
| status | basic | integer | no | 0=Unknown, 1=playing, 2=finished, 3=stalled, 4=dropped |
| added | basic | integer | no | Unix timestamp of when this item has been added |
| notes | basic | string | yes | User-set notes |

### VNlist Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| uid | integer | = | This filter must be present. The special value '0' is recognized as the currently logged in user. |

## Wishlist

| Property | Flag | Type | null | Description |
|-----|-----|-----|-----|-----|
| **vn** | basic | integer | no | Visual Novel ID |
| priority | basic | integer | no | 0=high, 1=medium, 2=low, 3=blacklist |
| added | basic | integer | no | Unix timestamp of when this item has been added |

### Wishlist Filters

| Field | Value | Operators |  |
|-----|-----|-----|-----|
| uid | integer | = | This filter must be present. The special value '0' is recognized as the currently logged in user. |
