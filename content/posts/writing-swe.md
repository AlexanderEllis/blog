---
title: "All of the writing I did in a week as a software engineer"
date: 2023-11-18T11:57:12-05:00
draft: false
---


The other day, I was thinking about less-obvious skills that I find helpful for
working as a software engineer. Some skills are obvious, like understanding
technical topics, learning new things, and thinking like a computer, but there's
a separate class of unobvious skills that an outsider may not immediately think
of when they imagine a career in software.[^1]

Empathy and communication are the main ones that come to mind.[^2] [^3]

The other day, I was thinking through what communication looks like for my day
job. Much of it is talking with other people, be it occasional on-site hallway
conversations, 1:1s, meetings, or presentations. A great deal of it is also in
writing, especially as I work from home. I have a general feeling that I do a
lot of writing, but as an experiment, I thought it would be interesting to look
at all of the writing I did in a given week.

Quick caveat that I'm also pretty biased towards writing. I like to write, so I
write more, so I get a lot of practice writing, so I get better at the process,
so it's easier for me to write, and I end up liking it more. You can see where
I'm going with this.

### A day in the life

For a little context on my work, I currently work as a software engineer on the
Cloud Gateway team at Netflix. Our team runs the big proxies at the front door
— we write services that are like automated switchboard operators, routing your
browser's request for `www.netflix.com` to the right place. We have a few
different proxies, and I'm roughly the tech lead for one of them. My time is
split between current work (both as an individual contributor and project lead),
forward looking work, partnerships, mentorship, security, incidents, and
on-call.

Alongside my regular day job work, I was also on call this last week[^4], which
entails answering support questions (our team's immediate users are internal
teams), responding to incidents, and keeping an eye on general software health
for our services. This led to a little more writing than usual, as you'll see.

### cat_typing.gif

In the last week, I wrote:

#### Zero emails

I actually don't write many emails for work, as most of our async communication
is around Slack. This last week, I wrote exactly 0.

#### A few dozen lines of code

This was a pretty light coding week, mostly because 1) I was on call and 2) I'm
currently working on one of those "investigate for a week, then fix with a few
lines of code" problems.[^5] This writing included the code, tests, comments,
and PR descriptions, as well as comments I left in PR reviews.

#### A handful of Jira tickets

We loosely track our work items in Jira, and I added a few, mostly summarizing a
few future work items. I also provided updates on existing tickets. Not much to
write home about here.


#### A feedback form for the new grad on our team

I'm the mentor for a new grad that joined our team in August, and this week I
had to submit a feedback form for their first three months and the new grad
program as a whole. This was pretty straightforward, as we've had plenty of
feedback conversations and much of it was top of mind already.

#### A couple of investigation & debugging docs

I'm a huge fan of taking notes while debugging. They help me be methodical about
my investigations and capture context with what I've seen, my train of thought,
and what I intend to try next (and why). Though they're mostly for myself, I
find it's also helpful for sharing that context with others. I especially like
showing the thought process for folks who are newer to the kind of deep
debugging that we do, just to show one of the ways to dive into a gnarly
problem.

This week I wrote ~15 Google doc pages of investigation notes, with the caveat
that these included many diagrams that padded my page count. I also usually use
the pageless format, since I have lots of images that would otherwise lead to
weird blank space. These docs are a lot of things like *"Here's what I'm seeing.
My current hypothesis is X for these reasons — what about if we try Y? How does
Z work?"*. As I mentioned before, my main work this week was spent mostly
focused on one gnarly problem in an area I wasn't previously super familiar
with, leading to a lot of investigation.

As part of this, I also put together a few diagrams summarizing the system's
architecture, mostly for my own knowledge. This is tangentially writing — it's
more like writing a name in a box, then putting it in the right place and
drawing arrows to its neighbors.

For more on this, see [Julia Evans' masterful zine on debugging](https://jvns.ca/blog/2022/12/21/new-zine--the-pocket-guide-to-debugging/).

#### A few technical docs

I find design documents extremely helpful for thinking through a hard problem
and sharing context and ideas with others. I find that if I can't clearly
explain a problem and my solution, I don't really understand it. Again, this is
probably my bias towards writing, but I find it relatively easy to knock out a
doc, and the benefit for me greatly outweighs the cost.

There are many kinds of technical docs. This week, I wrote the following:
- A forward looking strategy doc for one of our services
- A forward looking "what if we built this feature" doc following a conversation
  with a partner
- A rough draft of a design doc to explain exactly what pieces we'll need for a
  new integration
- A technical design doc exploring a problem we're seeing and some potential
  solutions
- Minor updates to a previous design doc based on feedback

<br>

These added up to ~15 Google doc pages or so total, with some diagrams in there
as well.[^6]

In this category, I'd also include comments on docs, both for documents I've
reviewed and comments I've responded to on my own docs. It's a little hard to
quantify these, but I'd say in the low tens, ranging from one-liners to
paragraphs.

#### 397 Slack messages

Ahh, so this is where my time this week went. We have a Slack-heavy culture, but
400 still seems a lot. The breakdown was as follows:

- 109 messages in our support channels.
  - These are mostly answering questions, explaining things, asking clarifying
    questions, and sharing metrics and traces. This entails a lot of translating
    our team-internal things to folks on other teams.
- 68 messages in our team channel
  - We tend to have a lot of async discussions in our team channel. I also err
    on the side of sharing context with the team, leaving breadcrumbs for
    anyone's future searches.
  - A healthy amount of these were just emojis, too.
- 18 messages in our team's notifications channel, which we use for alerts,
  CI/CD notifications, and general on-call things
- 174 direct messages
  - I'm pretty sure a lot of this is just pasting links or snippets for people
    while I'm in 1:1s with them.
  - This includes 20 messages in a group chat helping to debug a gnarly issue
  - This also includes 10 messages to myself, which I use as a scratchpad for
    saving things for later
- 28 channels in miscellaneous channels

<br>


### Key takeaways

The biggest takeaway is that my split keyboard was a very worthwhile investment.

Other than that, I don't think there are any, really, other than the fact that I
do a lot of thinking and typing. This is just an interesting experiment to see
how much writing I actually do in a given week. This week was weighted pretty
heavily towards Slack (due to the on-call support) and investigation docs, but
it's not out of the ordinary.

I find writing immensely helpful, and I'll always recommend it for thinking
through a problem and sharing your thoughts with others. If you find yourself
wanting to get better at writing, I would absolutely encourage you to do so.
Read a book on it, write more, and edit more.

But do get an ergonomic keyboard setup.

[^1]: It's like explaining to my mom that even though I write code, I still talk
with other humans quite a bit!

[^2]: I'm also of the opinion that the most important part of communication is
empathy, but that's a post for another day.

[^3]: Also maybe stubbornness? But not stubbornness like "I'm right and I have
    to be right and I won't listen to you", but more "I've spent two days
    digging into this slowly making progress and I'm not going to give up"

[^4]: I'm also on call through the rest of the weekend. Please watch Netflix
    responsibly.

[^5]: Again, stubbornness!

[^6]: This is now motivating me to push for being paid by the page, both the
    writing and the on-call.