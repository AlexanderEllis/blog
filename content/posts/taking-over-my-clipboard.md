---
title: "Don't touch my clipboard"
subtitle: "You can (but shouldn't) change how people copy text from your website."
date: 2020-02-17T18:01:11-05:00
tags: ["Javascript", "UX"]
draft: false
---

## Looking for an em dash

I was recently trying to find an [em dash](https://en.wikipedia.org/wiki/Dash#En_dash_versus_em_dash) character to use in a piece of writing. Since I don't have the shortcut memorized—for future reference, shift+option+minus on Mac—I did a quick search for it. I didn't see one on the search results page to copy, so I clicked into the first result: "The Punctuation Guide":

![Screenshot of The Punctuation Guide, the website I visited](the-punctuation-guide.png)
*From https://www.thepunctuationguide.com/em-dash.html*

I'm a sucker for a good copy and paste, so I selected the em dash character, copied it, and pasted back into my doc. One problem though:

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit—

From https://www.thepunctuationguide.com/em-dash.html
© 2020 thepunctuationguide.com
```

Immediately suspicious. It looks like this site is overriding the copied text somehow, and though I select a single character, it's augmenting my copied text with a citation and copyright information.

## JavaScript and client-side code

Two of the good things about JavaScript are that it runs on your computer and it's easily inspectable. I've worked with JavaScript quite a bit, but I've never modified a user's copy command. Out of curiousity I inspected the page to see if I could figure how they were doing this.

My first instinct was that they were using some genericly named "copy-copyright" library somewhere, so I inspected the HTML. JavaScript tags usually come at the end of the page, so straight to the bottom.

![Screenshot of the HTML of site with the JS script visible](script-tag.png)

Opening this up shows the 15 responsible lines of JS:

```
// JavaScript Document
function addLink() {

    var selection = window.getSelection(),
        pagelink = '<br /><br /> From ' + document.location.href + '<br />Â© 2020 thepunctuationguide.com',
        copytext = selection + pagelink,
        newdiv = document.createElement('div');


    newdiv.style.position = 'absolute';
    newdiv.style.left = '-99999px';


    document.body.appendChild(newdiv);
    newdiv.innerHTML = copytext;
    selection.selectAllChildren(newdiv);

    window.setTimeout(function () {
        document.body.removeChild(newdiv);
    }, 100);
}

document.addEventListener('copy', addLink);
```
*From https://www.thepunctuationguide.com/js/copyright.js at the time of writing*

This creates a function *addLink* that does the following:

- Get the object that represents the user's current selection
- Build a string of HTML elements with the current page's link and copyright info
- Concatenate the user's selection and that HTML
- Create a new empty div element on the page
- Move it well off the screen to the left
- Add the new div element to the page with that the user's selection and that HTML
- Update the current selection to be the children of that div (aka select the concatenated string of user selection and attribution)
- In 100ms, get rid of that element

It then adds this function as a listener on the copy event, so every time the browser hears that you're copying, this is run first. The magic is from [`window.getSelection()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection), which gives access to the string that the user has selected. It then updates this selection with [`selection.selectAllChildren`](https://developer.mozilla.org/en-US/docs/Web/API/Selection/selectAllChildren), which updates the selected text to be the text in the newly created div.

Now that I know how it's done, another thing makes sense—when I highlight text and hit copy, the highlight goes away. This is because the focus and selection has shifted to that other div.

![GIF of text highlighting going away after I hit copy](highlight-disappears.gif)

Interestingly this function must run before the copy event is bubbled up fully. This means that it's intercepting the copy event, modifying the text that's selected, and passing it on, like a man-in-the-middle attack against your clipboard.

## This is bad

This falls into the category of not respecting the user's actions. Attribution is important, but changing things outside of what the site should change is a bad pattern. It's like smooth scrolling, where the page commandeers the user's scroll actions. I'm strongly of the opinion that you shouldn't do things behind the scenes that diverge from the normal user's expectations.

One other thing I'm curious about is the validity of the copyright for small text selections. I don't know much about copyright, but I'd be curious if an atomic selection from a creative work (like a single character, "—") would fall under the same copyright as the whole work.

### Maybe copy/paste isn't so bad?

Ironically, a little reverse searching reveals that this code was copied verbatim from [this StackOverflow post](https://stackoverflow.com/questions/2026335/how-to-add-extra-info-to-copied-web-text?rq=1) (see "Manipulating the selection" from the top answer).
