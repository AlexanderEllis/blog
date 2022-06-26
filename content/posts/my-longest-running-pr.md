---
title: "Long running pull requests"
date: 2022-06-26T11:45:27-04:00
draft: false
---

There's nothing quite like merging a pull request that has been pending for
months. It's so satisfying.

At Google, they have little badges for your internal user profile. One of the
ones you can get celebrates the longest time delta in between creating a change
and submitting it. For example, if you create a PR on August 1st and submit it
on September 1st, you'd probably get the 1-month PR badge.

I think I would have broken my record for a recent pull request I submitted. As
part of my [MSCS thesis work](/posts/mscs), I added native
[OpenTelemetry](https://opentelemetry.io) tracing to
[Envoy](https://www.envoyproxy.io). Even before the PR, there was a ton of work
to write a proposal, chat with folks, ramp up on Envoy tracing internals, ramp
up on OpenTelemetry, figure out the best way to do it, write a prototype, do
some testing, get some metrics, write the actual thesis (a casual sprint
marathon), defend it, and finally, polish the code to production level and write
some solid tests. By nature of it being a side project, the work unfortunately
took a back seat to other priorities, like day-job work that pays the bills.

I finally
[opened a PR on Mar 9, and it was finally merged on June 22](https://github.com/envoyproxy/envoy/pull/20281).
 105 days, 15 weeks, or 3 months and 13 days.

If your brain works anything like mine, a pending pull request lives in the back
of your head, stealing cycles that you'd otherwise spend thinking about other
things. Worse yet is when you don't have the time to work on it — comments and
reviews slip from "I need to do this" territory into "I'm embarrassed I haven't
done this yet" territory. Going back to the code feels like dusting off old
library books — I made notes to myself, but of course with the context I had in
my head at the time.

I also switched jobs in that timeframe. With everything involved taking up more
time (day job, interviewing, wrapping up day job, ramping up at new day job),
the backpressure was real, and the 20% project open source work packets got
dropped.

In case you're new to software, the most obvious problem here is that you never
want to be in a position where your PR takes months. It should be smaller
and self-contained, making the job of reviewing it easy. You should respond to
comments promptly and iterate quickly to avoid losing your context. It's much
better to work consistently, rather than bursting code with weeks of delay in
between. Or, to put it another way, do as I say, not as I do!

This PR was the majority of the work to get this feature in place, and future
PRs will be smaller, more self-contained, and easier to shepherd through the
review process. I'm looking forward to writing those, but I'm just glad to have
this one all set.

-----

As a final note, merging the PR actually broke Envoy at head due to a subtle
issue with an updated field in parsed YAML in a test. Nothing like a quick
[forward fix](https://github.com/envoyproxy/envoy/pull/21842) to keep you on
your toes!
