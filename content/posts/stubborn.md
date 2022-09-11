---
title: "Stubbornness and programming"
date: 2022-09-11T16:28:14-04:00
draft: false
---

Every now and then, there will be the type of problem to solve where I know it
will require an extra cup of coffee, a long block of dedicated time, and a lot
of careful reading, debugging, note taking, and going for walks to think.

This is often "subtle bugs that are hard to repro but we need to fix"
territory; it's not fun greenfield development with a lot of brand new code
(which, of course, would be a problem-free fresh start...), but instead,
probably a small PR with only a few lines changed that completely undersells the
deep investigation required.

It's like the old joke: $5 for the hammer and $95 for knowing where to hit the
machine with the hammer.

There's some sort of stubbornness that helps with these. Not stubborn like "I'm
always right and won't listen to your opinion", but stubborn like "it's hour 3
of debugging and I'm slowly getting closer and I still want to keep digging
until I find that needle in the haystack". Persistence, maybe? Focus?
Perseverance? Motivation from a quick glance at your paycheck? Whatever it is,
it's some amount of ability to stick with it and keep digging — whatever gets
you slowly closer to a solution, until finally you shine some light on that
small subtlety that was out of place.

It's the computers that are the obstinate ones, inflexibly doing _exactly_ what
you tell them to do. They're the ones not bending; in order to work together,
it's our job to take our human minds and make ourselves think the way the
computers think. It's that weird layer between our abstract and the computer's
specificity, mentally translating what _should happen_ into those careful
instructions for the machine to follow.

Very rude of them, when you think about it.

This kind of perseverance can be very helpful when working with computers. You
build it up naturally over time, starting with your own little programs, then
larger ones, then ones other people wrote, then maybe even ones other people
wrote over many years and ones that work across many computers. You can get
better at it too, much like anything else, with practice, focus on the process,
and some metacognition as you think about how your brain works as you go through
the process. At the risk of recommending Julia Evans' zines and site in every
post, I highly recommend her
[*Some ways to get better at debugging*](https://jvns.ca/blog/2022/08/30/a-way-to-categorize-debugging-skills/).

I wonder if there's some room for more focused learning around debugging.
Imagine something like a class-like program where you're given a code base that
has a number of bugs in it. Much like a developer ramping up on a project, you
could go through the ramp-up process, starting by fixing a few trivial starter
bugs, then working on larger and larger bugs. One of the things I didn't see too
much of in the CS classes I've taken is the experience of working through other
peoples' code, and I wonder if something like this would be a good way to build
those skills (or at least to give some preview of the nitty gritty you'll get to
deal with on the job).

Another interesting shift I've seen recently is some amount of focus on
debugging and working with realistic scenarios as part of the job interview
process. It seems like it's much harder to quantify, but given that it's such a
big part of what we do, it's an interesting area to explore.
