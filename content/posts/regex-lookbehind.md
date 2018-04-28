---
title: "Investigating JavaScript's RegExp Lookbehind"
date: 2018-04-28T13:22:25-04:00
tags: ['JavaScript', 'Investigations']
draft: false
---

> Some people, when confronted with a problem, think “I know, I'll use regular expressions.”  Now they have two problems.

[_Jamie Zawinski_](http://regex.info/blog/2006-09-15/247)

### Regular Expression Lookbehinds

I recently came across an interesting regular expressions use case that led to an interesting look into regular expressions, JavaScript engines, and release versions.

In particular, I was trying to find a certain substring from a string that did not contain a substring preceding it.

Let's say I have the strings `'aabbcc'` and `'bbccdd'`.  I might want to be able to locate the substring `'cc'` only if it occured at some point after the substring `'aa'`.  This is called a **positive lookbehind**, and this would only match the `'cc'` in the first string.

On the other hand, if I wanted to match `'cc'` only if it does not come after `'aa'`, this would be a **negative lookbehind**.  This would only match the `'cc'` in the second string.

### Using lookbehinds in JavaScript

If you're using Chrome 62 or higher, Node 6.0.0 or higher (with the `--harmony` flag), or Node 8.1.10 or higher (see below for finding these details), you can use negative lookbehinds through Google's V8 engine.  Here's how you would do those cases above:

```
~: $ nvm use 8.10.0
Now using node v8.10.0 (npm v5.6.0)

~: $ node

// Positive lookbehind checking 'aabbcc' for 'cc' preceded by 'aa' at some point
> /(?<=aa.*)cc/.exec('aabbcc')
[ 'cc', index: 4, input: 'aabbcc' ]

// Positive lookbehind checking 'bbccdd' for 'cc' preceded by 'aa' at some point
> /(?<=aa.*)cc/.exec('bbccdd')
null

// Negative lookbehind checking 'aabbcc' for 'cc' not preceded by 'aa' at some point
> /(?<!aa.*)cc/.exec('aabbcc')
null

// Negative lookbehind checking 'bbccdd' for 'cc' not preceded by 'aa' at some point
> /(?<!aa.*)cc/.exec('bbccdd')
[ 'cc', index: 2, input: 'bbccdd' ]
```


### Looking into compability

In my case, I was trying to do a negative lookbehind for my replacement.  I was also attempting to do so with just a regular expression and no additional parsing through a function, as I was passing it to another module.  After a few attempts by hand, I did some searching to see if it was possible.  The results were not encouraging, mostly indicating in older posts that it was not supported but there were many hacks to work around it.

I then came across [2ality's blog post on negative lookbehinds](http://2ality.com/2017/05/regexp-lookbehind-assertions.html), which looked much more promising.

>The proposal “RegExp Lookbehind Assertions” by Gorkem Yakin, Nozomu Katō, Daniel Ehrenberg is at stage 4. This blog post explains it.

This post featured a great explanation, and of note, an interesting link to a Feb 2016 blog post from the Google V8 team at the bottom: [V8 JavaScript Engine: RegExp lookbehind assertions](https://v8project.blogspot.de/2016/02/regexp-lookbehind-assertions.html).  The gist of that post is that the lookbehind assertions were very valuable, and although the TC39 proposal was in its early stages, it was already being rolled out in V8 version 4.9 and Chrome 49.

At this point, I tried the posted examples in both my local Node (version 6.11.1) and Chrome (66).  They threw an error in Node, but worked in Chrome.  My usecase was part of a Node build script, so although the version was throwing an error, it seemed there was hope for a later version.  At this point, I could have just used the most recent version of Node or used the `--harmony` flag, but I wanted to confirm versions to ensure that I was able to be exact about the required version for future use.

I then found a more recent [blog post by the V8 team from July 2017 featuring upcoming features](https://v8project.blogspot.com/2017/07/upcoming-regexp-features.html).  In particular:

>Lookbehind Assertions
>
>Lookahead assertions have been part of JavaScript’s regular expression syntax from the start. Their counterpart, lookbehind assertions, are finally being introduced. Some of you may remember that this has been part of V8 for quite some time already. We even use lookbehind asserts under the hood to implement the Unicode flag specified in ES2015.

Then, an even more [recent V8 release post from September 2017 for V8 6.2](https://v8project.blogspot.com/2017/09/v8-release-62.html):

>More regular expressions features
>
> ...
>
>Lookbehind assertions, another new regular expression feature, are now available by default.

This meant that V8 6.2 had them available, which is why it worked in my Chrome 66.  The next check was to the [Node releases page](https://nodejs.org/en/download/releases/).  Here's the relevant section:

| Version        | LTS    | Date       | V8         |
|----------------|--------|------------|------------|
|
| Node.js 8.10.0 | Carbon | 2018-03-06 | 6.2.414.50 |
| Node.js 8.9.4  | Carbon | 2018-01-02 | 6.1.534.50 |
|
| Node.js 6.0.0 | | 2016-04-26 | 5.0.71.35 |
| Node.js 5.12.0 | | 2016-06-23 | 4.6.85.32 |


This means that V8 version 6.2 made it into Node on March 6, 2018 in version 8.10.0, and V8 version 4.9 (allowing this with the `--harmony` flag) made it into Node 6.0.0.  After switching to 8.10.0, my negative lookbehinds successfully ran on Node, and I was able to finish the build script.
