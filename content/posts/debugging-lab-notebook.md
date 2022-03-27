---
title: "Keeping a debugging lab notebook"
date: 2022-03-27T13:09:00-04:00
draft: false
---

I like to keep a debugging lab notebook when I'm working through a particularly tricky problem.

It's nothing fancy, just a new tab visit to [`docs.new`](https://docs.new) and a quick `@today` to add today's date. I usually try to describe the problem and the specific issue I'm having, including any reproduction steps or screenshots (frequently copied over from the issue tracker). I try to summarize the issue and my understanding of how things work, though this frequently leads to a handful of open questions for me to go through to really understand what's happening.

What usually follows is a freeform jumble of writing down hypotheses, results, error messages, screenshots, explanations, and log statements (something like `print('alex here 7.5')` is a classic, since if you add another log statement between existing ones, you can add another decimal place to show you're in between). I try to err on the side of including too much information so that I can shift everything out of my immediate working memory onto something a little more permanent, giving a clear history of what I've attempted as I work through the problem, but also importantly, what open questions remain and what things I should attempt next.

-----

This helps me in two main ways. First, it encourages me to take a minute to explain in writing what I'm seeing — if I can't explain it, I probably don't fully understand it. Much like rubber duck debugging, this makes me think it through and work through what's happening, which is frequently enough to help me realize an important insight.

The second main benefit ties into this as well, as the process of working through and writing things down encourages me to be more deliberate about the debugging path I take. It can be so tempting to just make a quick edit as a shot in the dark and rerun the test, and I've definitely done this plenty of times before. I find that I'm much more effective when I'm more deliberate about things, taking the time to explore each result and the next potential steps before moving forward.

It's like the joke about the best way a junior engineer can level up: actually reading the error messages!

Many of these benefits show up as well when you're pair programming or even just explaining the issue to your rubber duck (or curious pet). The other thing I like about this written approach is that it's saved for you. When you come back to it later, you can retrace your steps, copy the same saved output or rerun a test, and page the context back into your working memory. My brain works much better as a processing machine than as a storage device, and the more I can keep written down and off of my busy brain's responsibilities, the better.

-----

At some point, finally, the problem clicks, and you realize the key insight that helps you solve it. You write up a quick summary, update the issue, and throw a quick explanation into the PR. The working notebook, full of roundabout exploration and steps taken down many false paths, has done its job. Occasionally I'll look up how I solved a similar problem before or ran a test in a certain way, but generally, I rarely ever come back to them. For these debugging logs, that's ok; it's much more about how they've helped with the journey through.

