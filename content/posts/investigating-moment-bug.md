---
title: "Investigating a Bug in Moment.js"
date: 2018-01-06T11:37:37-05:00
tags: ["Open Source", "JavaScript"]
draft: false
---


### Investigating a bug in Moment.js

In this post, I walk through the steps I took while investigating a bug in Moment.js, an open source JavaScript library for dealing with dates and times.

Rather than write about what would have ideally happened (the steps of which would look like 1) see bug, 2) know issue, 3) investigate fix, 4) open PR), I wanted to include the entire process, which included some roundabout work.  When reading about someone else's work, I've found that it's very valuable to see both what worked *and* what didn't work.

One of my recent goals has been to contribute more to open source.  OSS makes my life easier, and the least I can do is to give back with small bug fixes or documentation updates.

I've used Moment.js a number of times, both for side projects and for my day job.  Recently, I've been occasionally visiting the issues page to see if there was anything I could help out with.  Since I work with JavaScript a lot, I figured something like this would be the most approachable for me.  I also wanted to learn about how it works internally, and I knew that this would be a great chance to dig through the code and learn more.

#### The issue

The other day, I came across [this issue](https://github.com/moment/moment/issues/4386) marked as a bug:
```
Hello,
I'm reviewing tutorial
https://momentjs.com/docs/#/i18n/locale-data/

I got an issue for the following:
localeData = moment.localeData();
localeData.longDateFormat();
Uncaught TypeError: Cannot read property 'toUpperCase' of undefined

Also recently found.
localeData.relativeTime();
Uncaught TypeError: Cannot read property 'replace' of undefined

localeData.week();
Uncaught TypeError: Cannot read property 'year' of undefined

Please resolve this issue.
Thank you.
```

This looked like something I could investigate!  I wasn't sure if I could completely fix it or if it was a good first bug, but I decided to see what I could do with it.

I started by reproducing the issue on a jsfiddle:
<script async src="//jsfiddle.net/efe9L98p/1/embed/"></script>

If you click on Result and check your console, you'll see the TypeError.  This was good to confirm that the error existed.  I next confirmed the error appeared for `relativeTime()` and for `week()`.  Both of those appeared as well, so I was confident the error was real.  I also checked the linked Moment docs and confirmed that the method signatures at that link were indeed `localeData.longDateFormat()`, `localeData.relativeTime()`, and `localeData.week()`.

(At this point, how would you debug further?  I missed a few things here that seem obvious in retrospect and went on a longer route, and I'll review the different paths towards the end.)

I then forked and cloned the Moment repository so that I could have a local copy.  This let me dig around in the code and search for specific things.

As a quick check, I searched for a few things using `grep` to see how often they came up.  `localeData`, `.replace`, and `.year` appeared often, but `toUpperCase()` appeared only twice:
```
moment: $ grep -r toUpperCase src
src/lib/locale/formats.js:        formatUpper = this._longDateFormat[key.toUpperCase()];
src/test/moment/normalize_units.js:        fullKeyCaps = fullKey.toUpperCase();
```

Two results is much easier to look through!  Since I was already on the lookout for `lognDateFormat`, I took a look at `src/lib/locale/formats.js` and saw the following function:
```
/*
  src/lib/locale/formats.js
*/
...
export function longDateFormat (key) {
    var format = this._longDateFormat[key],
        formatUpper = this._longDateFormat[key.toUpperCase()];

    if (format || !formatUpper) {
        return format;
    }

    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
        return val.slice(1);
    });

    return this._longDateFormat[key];
}
...
```

Since the TypeError said `Cannot read property 'toUpperCase' of undefined`, my guess was that `longDateFormat` was getting an undefined `key` passed to it, which would throw the error when formatUpper is being assigned.  This looked promising! I wrote it down to later investigate who was calling `longDateFormat` with what argument as I went through the rest of the code.

-----

I started to really dig in by opening `src/moment.js`, the main file for the project.  Taking a look at what it imports, I saw the following:
```
/*
  src/moment.js
*/
...
import {
    defineLocale,
    updateLocale,
    getSetGlobalLocale as locale,
    getLocale          as localeData,
    listLocales        as locales,
    listMonths         as months,
    listMonthsShort    as monthsShort,
    listWeekdays       as weekdays,
    listWeekdaysMin    as weekdaysMin,
    listWeekdaysShort  as weekdaysShort
} from './lib/locale/locale';
...
```

This let me know that `localeData` comes from `getLocale`, which lives in `src/lib/locale/locale.js`.  Warmer!

I also noticed that there was another locale directory with the various configurations for different locales.  The first one, `af.js`, is the Afrikaans configuration.  The files in this directory were all similarly named, so the `localeData` code probably wouldn't live in there.

Here's part of `src/lib/locale/locale.js`:
```
/*
  src/lib/locale/locale.js
*/
...
import {
    getSetGlobalLocale,
    defineLocale,
    updateLocale,
    getLocale,
    listLocales
} from './locales';
...
```

`src/lib/locale/locale.js` didn't have much in it, but `getLocale`, which `src/moment.js` imports as our friend `localeData`, is imported from `src/lib/locale/locales.js`.  Note the "s" on the end!  Definitely made me double check what file I had open a few times.

Inside `src/lib/locale/locales.js`, I found the `getLocale` function I had been looking for:
```
/*
  src/lib/locale.locales.js
*/
...
// returns locale data
export function getLocale (key) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}
...
```

At first glance, I didn't see anything particularly helpful in there.  I knew that when I had been calling `moment.localeData()`, I hadn't been passing in any argument, so the key for `getLocale` would be undefined.  That meant it would return `globalLocale` about halfway through the function.  Not super helpful, but let's take a look at `globalLocale`.  I did a quick search, and the only reference not in another function was at the top:

```
/*
  src/lib/locale.locales.js
*/
...
var globalLocale;
...
```

Hmm, not very helpful.  At this point, I was thinking that I must be missing something.  `moment.localeData()` was clearly not returning undefined, as I was able to call `localeData.week()` and others, although not successfully.

------

My next step was to take a break from digging and write a failing test to confirm that this error was happening locally.  I took a look in the tests, and I found `src/test/moment/locale.js`, which had a few tests for `localeData`:
```
/*
  src/test/moment/locale.js
*/
...
test('library localeData', function (assert) {
    moment.locale('en');

    var jan = moment([2000, 0]);

    assert.equal(moment.localeData().months(jan), 'January', 'no arguments returns global');
    assert.equal(moment.localeData('zh-cn').months(jan), '一月', 'a string returns the locale based on key');
    assert.equal(moment.localeData(moment().locale('es')).months(jan), 'enero', 'if you pass in a moment it uses the moment\'s locale');
});
...
```

Since I figured it would throw an error anyways, I wasn't too worried about having a perfect test written.  I added `assert.equal(moment.localeData().week(), 1, 'Quick week test')` and ran the tests:

```
Errors:

Module: locale Test: library localeData
Died on test #1     at global.test.QUnit.test (/path/to/moment/node_modules/qunit/lib/child.js:146:21)
    at /path/to/moment/build/umd/test/moment/locale.js:239:1
    at i (/path/to/moment/build/umd/test/moment/locale.js:4:43)
    at Object.<anonymous> (/path/to/moment/build/umd/test/moment/locale.js:7:2)
    at Module._compile (module.js:556:32)
    at Object.Module._extensions..js (module.js:565:10)
    at Module.load (module.js:473:32)
    at tryModuleLoad (module.js:432:12): Cannot read property 'year' of undefined
TypeError: Cannot read property 'year' of undefined
    at weekOfYear (/path/to/moment/build/umd/moment.js:1204:41)
    at Locale.localeWeek [as week] (/path/to/moment/build/umd/moment.js:1262:12)
    at Object.<anonymous> (/path/to/moment/build/umd/test/moment/locale.js:244:38)

Global summary:
┌───────┬───────┬────────────┬────────┬────────┬─────────┐
│ Files │ Tests │ Assertions │ Failed │ Passed │ Runtime │
├───────┼───────┼────────────┼────────┼────────┼─────────┤
│ 1     │ 3262  │ 130247     │ 1      │ 130246 │ 25097   │
└───────┴───────┴────────────┴────────┴────────┴─────────┘
Warning: 1 tests failed Use --force to continue.

```

Nice! So this was happening locally too.  I took a look at `build/umd/moment.js` at lines 1204 and 1262:

```
/*
  build/umd/moment.js
*/
...
function weekOfYear(mom, dow, doy) { // Line 1204
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}
...
function localeWeek (mom) { // Line 1262
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}
...
```

Interesting! Not super helpful to view it in the built code, so I `grep`ped `localeWeek` and found these results (along with others):

```
moment: $ grep localeWeek -r src
src/lib/locale/prototype.js:import { localeWeek, localeFirstDayOfYear, localeFirstDayOfWeek } from '../units/week';
src/lib/locale/prototype.js:proto.week = localeWeek;
```

Getting warmer!  I opened up `src/lib/locale/prototype.js`.
```
/*
  src/lib/locale/prototype.js
*/
import { Locale } from './constructor';

var proto = Locale.prototype;
...
// Week
import { localeWeek, localeFirstDayOfYear, localeFirstDayOfWeek } from '../units/week';
proto.week = localeWeek;
proto.firstDayOfYear = localeFirstDayOfYear;
proto.firstDayOfWeek = localeFirstDayOfWeek;
...
```

I can see here that `prototype` is importing a function named `localeWeek` from `src/lib/units/week.js` and assigning it to the `week` key.  This is where the structure started to make more sense.  `prototype.js` defined the methods available to the `Locale` constructor, so that when the Locale is created, it has access to everything defined here.  The default locale must create a Locale object that we then can call `.week()` from.  That makes more sense!

The question remains why the `.week()` function isn't firing right. I opened up `src/lib/units/week.js` and found the `localeWeek` function in question:

```
/*
  src/lib/units/week.js
*/
...
// LOCALES

export function localeWeek (mom) {
    return weekOfYear(mom, this._week.dow, this._week.doy).week;
}
...
```

Alright, we've seen this one before! So this is the function being given to the prototype, which is accessible to the localeData as `.week()`.  The only problem is that `localeWeek` is called with a `mom` argument, and it passes it to `weekOfYear`, which appears in `src/lib/units/week-calendar-utils.js` :.

```
/*
  src/lib/units/week-calendar-utils.js
*/
...
export function weekOfYear(mom, dow, doy) {
    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
        resWeek, resYear;

    if (week < 1) {
        resYear = mom.year() - 1;
        resWeek = week + weeksInYear(resYear, dow, doy);
    } else if (week > weeksInYear(mom.year(), dow, doy)) {
        resWeek = week - weeksInYear(mom.year(), dow, doy);
        resYear = mom.year() + 1;
    } else {
        resYear = mom.year();
        resWeek = week;
    }

    return {
        week: resWeek,
        year: resYear
    };
}
...
```

So here, we see that the `mom` being passed in is used in the first line, where it is accessed with `mom.year()`. This means that when we call `localeData.week()` without an argument, `week`'s `mom` parameter is undefined, so that when it passes it to `weekOfYear`, `weekOfYear` calls `mom.year()`, which is really `(undefined).year()`, which causes the `Uncaught TypeError: Cannot read property 'year' of undefined`.  This makes sense!  We're missing the argument in `week()`.

It took me longer than it should have to realize that `mom` meant a Moment object.  I confirmed this in the jsfiddle:
<script async src="//jsfiddle.net/efe9L98p/2/embed/"></script>

Clicking on result should successfully alert `1`, which makes sense.  It's current January 6 for me, and in the default locale, `en`, this is the first week.  This will change accordingly if you're reading this in a later week of the year.

I investigated `longDateFormat()` and `relativeTime()` in a similar way (left as an exercise for the reader), and I found that `longDateFormat` should have a date format string passed to it (like `longDateFormat(String)`), and `relativeTime` should be called with a number, a withoutSuffix boolean, a key string, and an isFuture boolean (like `relativeTime(Number, Boolean, String, Boolean)`).

Armed with this new knowledge, I returned to the GitHub issue and wrote up a response detailing that it was an error in the docs, not an error in the code, and that I would be more than happy to update the docs.  Right before I hit submit, I checked the docs one more time.  To my dismay, I noticed the following information a couple of mouse scrolls below the method signatures:

```
localeData.longDateFormat(dateFormat);  // returns the full format of abbreviated date-time formats LT, L, LL and so on
localeData.relativeTime(number, withoutSuffix, key, isFuture);  // returns relative time string, key is on of 's', 'm', 'mm', 'h', 'hh', 'd', 'dd', 'M', 'MM', 'y', 'yy'. Single letter when number is 1.
localeData.week(aMoment);  // returns week-of-year of aMoment
```

In these three lines we have the info I just found through investigating the code.  This was one of the steps I mised earlier!  I'm not sure how I missed this the first time around, but the answer was right there.  This did confirm what I found though, and the fact that it didn't match the above method signatures was a sign that the docs were indeed lacking.  If this new user could make this mistake, followed by me making the mistake, then something could be improved.


I ended up replying to the issue, opening an issue in the Moment.js docs repository, and submitting a PR with updated method signatures.  Since I knew where to look for these functions, I was able to confirm my understanding of any unclear types in the code.

-----


#### Postmortem

Digging through the code did give me a better feel for how the library works, and it was great to practice contributing to a project.  While looking through for `localeData`, I was able to get a feel for how the library is put together.  I'll also be better prepared for future issues in this library, as I'll already have my basic mental model for the library and can write tests and investigate earlier.

I did miss the docs, and I also realized that I could have followed the TypeError console traceback after recreating the issue in a jsfiddle.  This would have led me directly to `longDateFormat` attempting to call `toUpperCase()` on `key`.  I ended up getting there anyways, but it did take me a bit longer.  Debugging takes practice, and I'll have to keep these in mind the next time I'm digging through an issue.

#### Moving Forward

I didn't end up submitting a PR for the code itself, but I was able to contribute to the documentation and learn more about the library.  Throughout the search, I had that uncomfortable feeling of "I don't know what's going on in this library", especially when I switched from investigating `localeData` to creating the temporary test.  I know that the uncomfortable feeling is a signal that I'm learning, and although it isn't easy, embracing that feeling lets me know that I'm pushing my comfort zone in the right direction.

You can check out the Moment.js code [here](https://github.com/moment/moment) and [read through the docs here](https://momentjs.com/).

#### Update April 4, 2018

My PR got merged today, and the docs should be updated with their next release.  Great!


