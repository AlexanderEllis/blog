---
title: "iPhones and action discoverability, or \"How the hell was I supposed to know?\""
date: 2022-09-24T11:26:15-04:00
draft: false
---

# Discoverability

I spend a lot of my time thinking about UX and design, and I try to consciously
think about it in the wild when I can. One of the things that always catches my
eyes is the idea of discoverability, or how a user is able to discover that
action X does some thing Y.

A basic way to do so is to rely on patterns that we're all familiar with. For example,
[this link is blue, and if you hover over it with your mouse, you can see the cursor change](#it-doesn't-do-anything-but-still).
That is a helpful context clue, since you've probably seen and interacted with
many links before, and because it has the same pattern, you can expect it to do the same
thing.

Sometimes there are things that are new to you but are still intuitive when you
first explore them, like using a touch screen for the first time. We touch
things all the time, and when you first used a good touch screen, you were
probably able to quickly understand how it worked. You moved your finger, the
page scrolled, and that feedback helped you to quickly solidify the connection
between your gestures and the screen's actions. This is like discoverability
through action, where you're able to figure it out as you try it.

I also think about the category of things that aren't intuitive and require some
guidance, like Googling steps to show a cursor in an iOS screencast or putting
together IKEA furniture. Woe is the fool who tries to discover a complicated
IKEA piece through action! (Side note: there should be competitive IKEA furniture
speed runs). This discoverability is aided by a guide, and although the quality
of these guides can vary, sometimes it _is_ helpful to first RTFM.

## What iOS is doing these days

This brings us to a weird area: what about things that are unintuitive and
unguided? Or, as I like to say, how the hell was I supposed to know it would do
that?[^1]

I'd like to present the following features for your consideration, with an
exaggerated pointer to show the interactive actions:

### Deleting a number on the iOS calculator

To delete the last digit from a number you entered in the iOS calculator, you
can **swipe the numbers to delete**.

<div style="max-width: 400px; margin: 0 auto">
{{< video webmSrc="calculator.webm" mp4Src="calculator.mp4" >}}
</div>

<br>
<br>

### Using the spacebar as textbox navigation

To better navigate around a text document, **you can long press the spacebar,
then navigate around**.

<div style="max-width: 400px; margin: 0 auto">
{{< video webmSrc="space-navigate.webm" mp4Src="space-navigate.mp4" >}}
</div>

<br>
<br>

### Switching between Safari pages by swiping the URL bar

To go back and forward in Safari, you can swipe the edges of the screen. To
switch between tabs, you can **swipe the URL bar left and right**.

<div style="max-width: 400px; margin: 0 auto">
{{< video webmSrc="swipe-url-bar.webm" mp4Src="swipe-url-bar.mp4" >}}
</div>

<br>
<br>

### Going back after opening a new Safari tab

This is more of an unintuitive nitpick than a feature, but **when you swipe back
from a new tab, you silently close that tab and return to the old tab**, unless
you've already closed the old tab.

<div style="max-width: 400px; margin: 0 auto">
{{< video webmSrc="new-tab-back.webm" mp4Src="new-tab-back.mp4" >}}
</div>

<br>
<br>

## Undiscoverability

I don't think any of these are intuitive or easily discoverable.  You'll
sometimes see these features pop up in life hack or "I never knew this hidden
feature existed" tweets, and that novelty and surprise is indicative of the lack
of discoverability for these features. They're at an odd intersection of 1) not
following previous expected patterns, 2) not being intuitive, and 3) not being
clearly explained anywhere, unless you happen to stumble upon them.

This is where you frequently see some cliché comments like "Steve Jobs would
fire the people who made these". Yeah maybe, but who am I to make that claim,
much less to argue that it would be a good thing.

Good design for very complicated systems is hard, and these are just a few
points where it fell short. It ends up being a double edged sword as well,
because the complicated features (that must have taken many hours to build,
debug, test, and launch) are hard to discover — how many users end up swiping
their calculator or using the spacebar navigation? I'd love to see those
metrics.

[^1]: As much as I like to point out design shortcomings, it's always funny to me to
think about the number of very, very complicated things we take for granted now,
with things only popping up as notable when they aren't perfect.  It's like
modern front ends — yes it's complicated, but the expectations are very high as
well.
