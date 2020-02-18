---
title: "System Design problems: Amazon's Dynamo"
title: "Some of the problems solved in the design of Dynamo"
date: 2019-12-08T17:51:03-05:00
tags: ['System Design', 'Distributed']
draft: true
---

In this post, I'll be exploring and explaining some of the problems and solutions in the design of Dynamo.

Much like code, there's no better source than [reading the original](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf).

### A list of techniques used in Dynamo

I'll basically be exploring Table 1 from the paper, an extract of which is as follows:

| Problem                            | Technique                                              |
|------------------------------------|--------------------------------------------------------|
| Partitioning                       | Consistent Hashing                                     |
| High Availability for writes       | Vector clocks with reconciliation during reads         |
| Handling temporary failures        | Sloppy Quorum and hinted handoff                       |
| Recovering from permanent failures | Anti-entropy using Merkle trees                        |
| Membership and failure detection   | Gossip-based membership protocol and failure detection |


### Motivation

When in doubt, read through some problems some other people solved. Store them away in the back of your head, and maybe [when you're napping through a problem in the future](trust-in-your-unconscious), some inkling of a thought will drift up from the depths to help you out.

I've also found that one of the best ways to understand something deeply is to explain it, which is what I'm doing here. You, the reader, have been co-opted into my learning exercise.

If you find I've made any mistakes, please feel free to [submit a PR](https://github.com/AlexanderEllis/blog). One of the best things about keeping my blog on Github pages.

