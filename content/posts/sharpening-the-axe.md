---
title: "Sharpening the axe for programming"
date: 2022-08-06T15:46:51-04:00
draft: false
---

> A woodsman was once asked, “What would you do if you had just five minutes to
> chop down a tree?” He answered, “I would spend the first two and a half
> minutes sharpening my axe.”

When it comes to solving a problem with code, I've found a few things that help
make the process more efficient. The code is the output, but like
sharpening the axe, there are a few things I do outside of writing code that
makes it easier. I'll be walking through a few of them below.

Quick note that this isn't a guide to sharpening your own programming axe; that
you'll have to figure out on your own! While I encourage everyone to think
deliberately about how they work, this is just a few things I've found work for
my own brain.

-----

### Explaining myself

I've found that one of the best ways to think through a tricky problem is to
explain it first. Sometimes it's a formal design document for other people to
spread awareness and build consensus. Sometimes, it's a rubber-duck debugging
session as I explain the problem to my dog. Sometimes, it's even a scribbled
diagram on a throwaway piece of paper that helps me visualize the solution.

Putting the problem into words forces you to think through it and requires that
you be exact about it. There's nothing quite like attempting to go through a
detailed explanation to force you to really understand what's going on (extra
points if you're explaining it to someone else), and you quickly uncover areas
you don't fully understand. Those areas you don't understand are the ones that
can make coming up with a solution and implementing it difficult, and working
through them ahead of time can save you from so many later troubles.

Additional extra points if you have someone already familiar with the problem
take a look at what you've written to confirm your understanding. It's a great
way to learn, and it's a strong benefit to going through the writing process.

### Deliberately exploring and chipping away

When working through a tricky problem, it can be so tempting to noodle, and I'd
be lying if I said I had never rerun a test after randomly changing a line or
two without fully thinking through it. I try not to, though. I'm a huge fan of
[keeping a debugging lab notebook](/posts/debugging-lab-notebook/), and I often
find myself writing summaries and updates of what I've tried and what I'm seeing
to help keep my exploration guided, even though no one will ever read them. Most
of the time, they're a winding path of things I uncover and think about as I
work through a problem, including the next steps I'm planning to take.

It's a combination of writing it down (like earlier) and being deliberate that
helps me. Keeping track of what I've done, where I've been, and the immediate
next steps helps me deliberately build my understanding, as I write down
questions and dig in to the answers. It's like a targeted exploration of the
problem, where you take individual steps to build your understanding, explore
the problem, and get closer to a solution.

I really enjoy this Julia Evans comic about debugging: just focus on one
question at a time, and slowly build understanding from there!

{{< tweet user="b0rk" id="1554120424602193921" >}}

<br>

When faced with ambiguous problems and a difficult search space, I find it
helpful to take those individual steps. I write down a few questions, then go
through answering each one. They often result in more questions, but they also
result in progress.

Much like writing notes throughout the day, I find that the best benefit is from
the process and not saving my steps for the future. Usually my debugging
notebooks waste away as bytes on a Google Drive server somewhere, but
occasionally I'll see a similar problem and be able to go back and see what
steps I took before. Like visiting old code, it's also sometimes fun to go back
with my current knowledge and see how I thought about a problem at the time.

### Passing it off to a background thread

One of the best ways for me to make forward progress is to step away from the
computer and [let my brain passively think about the problem](/posts/trust-in-your-unconscious/).
It can be difficult to remember to do sometimes, especially when I'm stuck deep
in a problem whose solution feels like it's right around the corner: what if I
just tried this one other thing?

In the moment, it can feel counterintuitive, especially when you're deep in the
weeds.  I've never regretted taking a break, and more often than not, something
in the background will fire and make a connection that makes sense and helps
uncover some mystery.

> If none of this works, I’ve found that one of the best ways to move forward
> with a problem is to get away from the problem. If it’s halfway through the
> day, going for a walk around the block (importantly, without just going on my
> phone) or going for a swim will often let me realize something I missed that
> proves to be the key when I get back to my desk. If it’s close to the end of
> the day, heading home and letting the problem sit overnight is often enough to
> unblock me for the next morning. I’ve lost track of how many times I’ve
> realized a key insight on the train home, only 15 minutes of unfocused day
> dreaming since I was just looking intently at the code.



-----

Part of the game for me is making it easy for my brain to do the difficult work.
I once saw a question about whether or not typing speed was important to be a
proficient programmer, and I don't think it is. For programming, typing the code
in is the easy part; it's understanding systems and the existing code, deciding
which code to write, and figuring out _how_ to write it that are the hard parts.
Luckily, I've found a few things that make it all easier.
