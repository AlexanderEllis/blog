---
title: "Launching Breadth First Growth Newsletter"
date: 2017-10-29T17:30:20-04:00
tags: ["just shipping", "MVP"]
draft: false
---


I recently started a weekly newsletter.

I love the idea of growing as a T-shaped developer.  I had seen the term on Hacker News in reference to the *Valve Handbook for New Employees*:

>We value “T-shaped” people.
>
>That is, people who are both generalists (highly skilled at a broad set of valuable things—the top of the T) and also experts (among the best in their field within a narrow discipline—the vertical leg of the T).
>
>This recipe is important for success at Valve. We often have to pass on people who are very strong generalists with-out expertise, or vice versa. An expert who is too narrow has difficulty collaborating. A generalist who doesn’t go deep enough in a single area ends up on the margins, not really contributing as an individual.

It aligns with my goals as a software engineer as well.  I love getting general exposure to a wide variety of subjects (which I've found Hacker News to be great for), but I want to dive deep in some areas to develop expertise.

I have a big backlog of projects to do, and I decided I would try to do one or two small projects every week as time allows.  Since I'm able to focus on growing as a frontend engineer at my day job and learn CS fundamentals through school, my side work lets me try a variety of things that I wouldn't normally encounter. Since I'm growing in the direction of frontend work and CS fundatmentals, I also don't feel any pressure to focus only on these with my side projects, which is a blessing.  This is very different than when I was trying to transition into development!

Take, for example, writing a text editor in C.  I had come across a great tutorial that walked you through a medium-sized 1000 line project, and it was a great chance to step outside of my programming comfort zone to try something I was not as familiar with.

It got me thinking that this might be something other developers would be interested in as well, and I decided to make a simple newsletter out of it.  I called it Breadth First Growth to have a cute reference to breadth first search and underline the idea that this would be for growing horizontally as a developer.

First thing I did was to brainstorm ideas and register the domain name for the next two years.  I was then faced with the prospect of having to do some work that wasn't immediately easy for me (drafting emails, posting about the newsletter to share with others, decide how to word things and pick projects) and promptly stopped doing anything on the project, since it stopped being easy.  These tasks weren't particularly hard, but they were things I hadn't done before and were outside of my comfort zone.

A month or two later, I was reading about bootstrapped SaaS companies, and I felt the similar inspiration that helped me start the project.  This time, instead of focusing on building out everything the idea could be, I decided to focus on the idea of shipping the minimun viable product of the newsletter to get it out the door and force myself to work through the sticking points.

For an MVP, I figured I needed the following for the most basic functionality:

- Website with registration form
- Mailchimp account with first email drafted
- Two tasks to send
- Posts on Reddit to advertise the newsletter

It was actually that night that I got to work.  I started working on getting another domain hosted on the Digital Ocean droplet that serves my personal page, but after running into a bug or two (not being particularly comfortable with configuring nginx) I decided to throw it on a new droplet.  I set up a very basic nginx server with a single static html index file, and I finally forward the domain to it.  We were online!  The page was a simple explanation of the idea and a Mailchimp signup page.

I looked through my project ideas (organized in Trello) and picked the aforementioned text editor in C and an online game to learn some CSS, Flexbox Froggy.  They were two interesting and diverse tasks that would be just fine for the first email.

At this point I wrote out a draft of a post to put on /r/learnprogramming.  I slept on it and had my brother look it over the next day, and once I fixed a few mistakes, I nervously posted it.  I think I was nervous because it was the first time I had tried to do any sort of marketing for a product of mine, and I felt that semi-vulnerable feeling of showing something you've created to other people.  I've gotten a similar feeling the first time I shared code, writing, or art I've made, so I was oddly comfortable with being uncomfortable about it.  Since feedback and sharing is so key, I powered through and figured the worst case scenario would be that people hated the idea and didn't sign up, which wouldn't be too bad!

Turns out the post was promptly shadow-removed, which I only realized later that night when I accidentally logged in with a different Reddit account.  I messaged the mods, and they let me know that it had been flagged by many community members as spam and removed, which helped explained the lack of anything happening with it.  I had also cross-posted to /r/computerscience, and since it wasn't removed there, people saw the post, followed the link, and subscribed to the mailing list.  My brother also posted the link to some local slack groups he was a part of.

Halfway through writing the post, I began thinking it would be helpful to have a space to help anyone that was stuck on the projects, so I made /r/breadthfirstgrowth as an archive/assistance forum.

When I got my first signup from someone I didn't know, it immediately made the next Saturday a true deadline.  I drafted the first email on Friday and scheduled the it to be sent the next morning!

I woke up on Saturday and it had been sent!  With that, the super basic MVP had officially shipped.  I crossposted the email to the subreddit I had made, and went back to Mailchimp to mash f5 to watch people open it.  Overall this is was a tiny launch (12 subscribers!), but it was the first time I had launched something public by myself for other people.

I would say the thing that helped me the most was focusing on shipping.  I wrote down a list of all the things I would love to have for the newsletter and then organized into `Required for MVP` and `Nice to Have`.  That put some nice perspective on what I needed to focus on to get it done.

The main mistake I made was pausing when it became anything other than easy.  This created a two month delay from the easy part (registering the site, registering for Mailchimp) on August 23rd and finally sending the first email on October 28th.  For anything in the future, I think it would be valuable to define an MVP and give myself a date to ship it by.  The public accountability of having subscribers also absolutely helped motivate me to ship on the day I said I would!

As a tiny side project, this was a success!  It got some first project jitters out of the way, and I love the feeling of accomplishment even from shipping a tiny product to 12 subscribers.  Next up for Bread Thirst Growth is to add on some of the `Nice to Haves` and growing the subscriber list.

You can visit Breadth First Growth and sign up [here](https://www.breadthfirstgrowth.com).
