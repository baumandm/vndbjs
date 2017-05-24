Vndbjs returns data in a slightly different format from what VNDB provides.  This is done to allow client applications to more easily access the data without having to split and parse it themselves.  This is what VNDB's raw responses look like.

## VNDB response
```JSON
results {"items":[{"links":{"wikipedia":"Muv-Luv","encubed":null,"renai":null},"orig_lang":["ja"],
"length":4,"aliases":"MUV-LUV Save in the name of true love","description":"This game consists of two parts:
Muv-Luv Extra and Muv-Luv Unlimited. Unlimited is unlocked after you get the endings of the two main heroines
(Sumika and Meiya) in Extra.\n\nMuv-Luv Extra:\nShirogane Takeru is a typical high school student with a lazy
attitude and a love for the virtual reality mecha battle game Valgern-on. Even though he didn't really wanted
it, he is popular in school mainly due to his daily fights with his osananajimi (Sumika) attracting too much
attention. His life takes an unexpected turn when he finds a girl (Meiya) he doesn't remember ever meeting in
his bed one morning. Whom later revealed to be the heiress of one of the biggest zaibatsu. She immediately moves
to his house and starts changing his life for the good with her one-track-mind and unlimited resources...\n\n
Muv-Luv Extra, the main part of Muv-Luv, takes place in the same world (and general area) as Kimi ga Nozomu Eien
and Kimi ga Ita Kisetsu. The Sky Temple family restaurant is mentioned and visited, and Suzumiya Akane makes an
appearance.\n\nMuv-Luv Unlimited:\nOne day Takeru wakes up late, wondering why Sumika or Meiya didn't wake him up
this morning. Not seeing any signs of them he gets a bit worried and goes out of his house to only see the town he
lived all his life in ruins. After getting past the initial shock he decides that this must be a dream and decides
to enjoy it as much as he can...\n\n[Partially from [url=http://en.wikipedia.org/wiki/Muv-Luv]Wikipedia
[/url]]","released":"2003-02-28","image":"https://s.vndb.org/cv/75/24275.jpg","id":93,"image_nsfw":false,
"original":"マブラヴ","languages":["en","ja","zh"],"platforms":["win","ps3","psv","xb3"],"title":"Muv-Luv"}],
"num":1,"more":false}\x04
```

A keyword is followed by a space and a string of JSON, ending in the End-of-line character `\x04`.  Vndbjs automatically converts this into a more readible and immediately usable form, as shown below.

## vndbjs format
```js
{ status: 'results',
  metadata: { raw: 'get vn basic,details (id = 93)', type: 'vn' },
  num: 1,
  more: false,
  items:
    [ Vn {
       id: 93,
       title: 'Muv-Luv',
       original: 'マブラヴ',
       released: '2003-02-28',
       languages: [Object],
       orig_lang: [Object],
       platforms: [Object],
       aliases: 'MUV-LUV Save in the name of true love',
       length: 4,
       description: 'This game consists of two parts: Muv-Luv Extra and Muv-Luv Unlimited. Unlimited is unlocked after you get the endings of the two main heroines (Sumika and Meiya) in Extra.\n\nMuv-Luv Extra:\nShirogane Takeru is a typical high school student with a lazy attitude and a love for the virtual reality mecha battle game Valgern-on. Even though he didn\'t really wanted it, he is popular in school mainly due to his daily fights with his osananajimi (Sumika) attracting too much attention. His life takes an unexpected turn when he finds a girl (Meiya) he doesn\'t remember ever meeting in his bed one morning. Whom later revealed to be the heiress of one of the biggest zaibatsu. She immediately moves to his house and starts changing his life for the good with her one-track-mind and unlimited resources...\n\nMuv-Luv Extra, the main part of Muv-Luv, takes place in the same world (and general area) as Kimi ga Nozomu Eien and Kimi ga Ita Kisetsu. The Sky Temple family restaurant is mentioned and visited, and Suzumiya Akane makes an appearance.\n\nMuv-Luv Unlimited:\nOne day Takeru wakes up late, wondering why Sumika or Meiya didn\'t wake him up this morning. Not seeing any signs of them he gets a bit worried and goes out of his house to only see the town he lived all his life in ruins. After getting past the initial shock he decides that this must be a dream and decides to enjoy it as much as he can...\n\n[Partially from [url=http://en.wikipedia.org/wiki/Muv-Luv]Wikipedia[/url]]',
       links: [Object],
       image: 'https://s.vndb.org/cv/75/24275.jpg',
       image_nsfw: false,
       anime: null,
       relations: null,
       tags: null,
       popularity: null,
       rating: null,
       votecount: null,
       screens: null,
       staff: null} ]
}
```

* The keyword is moved to the `status` field
* Misc metadata is added to the `metadata` field.  Some of this is used internally by vndbjs
* Each element in `items` is replaced with an instance of the appropriate data class
* Each data class includes getters that let you clean its data on the fly, or not

# Errors

## VNDB

```
error {"msg":"Invalid arguments to get command","id":"parse"}
```

## vndbjs

```js
{
  status: 'error',
  metadata: { raw: 'get vn {"priority": 0}' },
  id: 'parse',
  msg: 'Invalid arguments to get command'
}
```

# dbstats

## VNDB

```
dbstats {"traits":2137,"threads":8434,"posts":98139,"tags":2205,"users":115544,"staff":12872,"releases":49093,"vn":20308,"producers":6390,"chars":60359}
```

## vndbjs

```js
{
  status: 'dbstats',
  metadata: { raw: 'dbstats' },
  releases: 49429,
  producers: 6467,
  traits: 2149,
  threads: 8549,
  posts: 99150,
  tags: 2205,
  staff: 13176,
  users: 116727,
  vn: 20411,
  chars: 60982
}
```
