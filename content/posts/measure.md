---
title: "Things that are hard to measure, things that are easy to measure"
date: 2023-02-26T15:29:21-05:00
draft: false
---


There are things that are hard to measure, and there are things that are easy to measure. I think about this duality a
lot when it comes to software engineering, especially when it comes to the difficult task of measuring developer
productivity and engineer effectiveness[^1].

Taking a very naive approach, there are many easily measurable aspects of the job that you _could_ use[^2]:

- Jira tickets closed
- Number of pull requests submitted (or reviewed)
- Number of lines of code
- Number of interviews given
- Number of design documents written
- Features shipped
- Money coming in because of those features (if there's a direct connection)
- Time engineer spends at the office

<br>

What about the parts of the job that are harder to measure?

- The quality of those PRs, PR reviews, lines of codes, or interviews
- How well those features are built
- Mentoring and helping other engineers grow
- Giving technical talks and spreading knowledge
- Reducing technical debt
- Deciding to _not_ build features (when appropriate)
- The monetary value of engineering that's not directly connected to revenue
- The knowledge accumulated by building an initial feature that you can use as a foundation for future work
- Even just the value of two team members just sitting down for coffee

<br>

Some of these can be correlated to things across the divide. If you're an effective engineer shipping new features, you
may write a fair bit of code. If you're able to effectively build consensus about solving a difficult problem with
cross team buy-in, you may end up writing a few design documents. If you're able to narrow down your team's focus to
just those features the team can (and should) build, you'll likely be able to better ship those features.

But, this positive relationship doesn't hold up in the other direction, and that's the danger. The number of
lines of code an engineer writes is not indicative of the value of that code — we're in the business of _elegant_
solutions to complex problems after all. You can't build consensus by sheer volume of documents and meetings alone,
unless you're hoping that the other party resigns out of fatigue by the time the decision has to be made. If you do a
bunch of interviews, is it valuable if you're a jerk in those interviews?

On the other hand, does the negative relationship hold up in the other direction? Well, it's nuanced. Maybe the project was
exploration-heavy, and that didn't translate to many PRs. Maybe it was a critical one line fix, but it took a month of
intensive investigation to find it. Or, maybe I really do have a second remote job,
and I've been too busy with it this quarter to get to all of my Jira tickets[^3].

It's not possible to measure the full picture by just the easily measured metrics alone. Doing so ignores the real
depth of the job.

More so, if 1) you're just using the easy ones and 2) the way you evaluate is visible to the engineers under review[^4],
they're going to game it. How could they not? If they're being evaluated on the number of new features they ship and
this evaluation has a direct relationship to the money they receive or their career trajectory, of course they're going
to optimize their time and effort towards the new features. It's your fault for hiring a bunch of smart cookies!

-----

So how do you measure how effective an engineer is? This is where I'm going to take the easy way out — that's well
beyond the scope of this short post, written by a lowly engineer. All that I ask is that if you're in the position where
you're evaluating engineers, you look beyond the easy-to-measure metrics, as there's so much more to the work. It's
hard, but this is the way.

[^1]: Though I'm not convinced it's a decidable problem.
[^2]: Quick caveat that neither of these are exhaustive lists.
[^3]: Quick caveat that I don't have a second remote job.
[^4]: As it should be.
