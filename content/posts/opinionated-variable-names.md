---
title: "Opinionated Variable Names"
date: 2022-04-17T13:08:57-04:00
draft: false
---

I think a lot about the human part of code, especially the work our brains do when writing and reading it and interfacing with the computer. Rachelbythebay had a great take on a way to inject some brain-processing into a technical task - when you're running a command to affect `n` servers, maybe it would be good to type that number in manually.

> The idea is to force you to take in that number through your usual input devices (I'd say eyes, but some people are using text-to-speech stuff or similar, and they count too), chew on it with your wetware, and then feed it back into the computer somehow. Adding a few extra steps like this will hopefully activate enough of your brain to make you stop short before blowing off your entire leg with a giant foot-gun.
>
> [Rachelbythebay: *Type in the exact number of machines to proceed*](https://rachelbythebay.com/w/2020/10/26/num/)


I like this idea about a mental check, even if it's just a quick second of consideration, and it's interesting to see how it can show up in naming, as well.

Take `dangerouslySetInnerHtml`, for instance. It's a function in React that, as the name implies, sets the inner HTML of an HTML element on the page. As the name also implies, this is generally scary and discouraged because of how easy it makes it to accidentally surface attack vectors for cross-site scripting. By prepending that adverb and explicitly calling it out as a potential footgun, it (hopefully) adds a layer of self-reflection when typing it in to use it, and it helps to raise a red flag that's easy to pick up on when reviewing changes.

It doesn't all have to be so serious, though. One of Google's helpful frameworks for building websites is named after a character from the Wizard of Oz universe. When running your local development server, when the server was ready, it would print an ASCII drawing of that character to your terminal. It even scaled the drawing to your terminal size, though the drawing was a little more abstract at smaller sizes. You could disable the drawing if you wanted to though, using an aptly named flag that was something like `--my_terminal_space_is_more_important_than_your_artistic_expression`.

Petty? Definitely. Whimsical and lighthearted? Absolutely.

It's fun to think about how these names we type out can impart meaning and context beyond the usual "what it is" or "what it does" naming. Like most things, a healthy serving of moderation is key. I don't want to read every opinion in every function (nor would anyone want to see mine), but it's fun to see from time to time.
