---
title: "Spaced Repetition Motivation"
date: 2017-08-13T20:47:45-04:00
draft: false
tags: ["studying"]
---

I've been kicking around the idea of a spaced repetition app for a while now, and I'd like to explore some of the motivation behind this project.

With anything, the key to getting better is practice and repetition.  The goal is deliberate practice and spaced repetition.

For me, one key to learning and getting better is making it easy to get to the uncomfortable state where I'm improving.  This means very little analysis of what I should be studying and more time spent working.  It's easy for me to get stuck on analyizing what I should work on instead of working, especially when there's just so much out there.  Even zooming in from computer science to web development to front end web development, there's still so much!

I'd like to make it easy for myself.  Specifically, I'd like to be able to keep track of what I've studied, when I studied it, and when I will need to study it again.

### Spaced Repetition

Here's what I want:

- List of items to study
- Ability to add and remove items
- For each item, option of having a prompt and an answer (quiz style) or just prompt (summary style)
- For each item, date to next review it
- Ability to change date depending on how well I review it
- Ability to review the top n items due for today (i.e. the list needs to be sorted)
- Different lists for different subjects


#### Index cards

First thing that comes to mind is a classic stack of index cards.  I could make a stack for items to study.  I could make new cards or throw away old cards.  On one side, I could write the prompt, and on the other, the answer.  I could write the due date on each card, and once I review it, I could update the date.  I'd be able to have different stacks for different subjects.

The best aspect of this approach is the physical part of having index cards.  It's a visual reminder to review them if you put them where you'll see them.  You'll be able to slow down and write content by hand to further reinforce concepts.  You'll add in the spatial component for remembering.

Physicality aside, there are many cons to this approach. Cards get worn. Crossing out dates and rewriting is messy. You would have to calculate the dates by hand every time. Shuffling could be a pain. It would take longer to make them. They would not be very portable, and you’d have to bring all of your cards everywhere. Keeping track of 100 cards is no joke for me. Rubber bands, or maybe a lunch box?

The biggest drawback to me is the idea of sorting in order to select those that are due today.  This would occur both when adding a new item, when you update the date, and when you want to select just today's.  This sounds pretty lazy, but my goal is to make everything around the work easy.

#### Spreadsheet approach

I then worked through the next iteration, a spreadsheet.  In one column, I could have the title or prompt.  In the next, I could have the answer or description.  In the last column, I could have the date to review.

Getting better!  This knocks out a few of the drawbacks of the index cards.  You lose the physical relationship with the cards, so there's a smaller mental connection to the card and stack itself, but you do let the computer handle more of the work.  It stores them, so you wouldn't have to worry about them.  It would be very easy to replace the date with a new date.  It could even sort them so you wouldn't have to, saving time and mental energy.  Let's be lazy here.  Typing in the content would be fast, and you would be able to have simple organization with different spreadsheets for different topics.

One drawback is that I don't have any spreadsheet apps that aren't heavy to load and use, which limits how accessible the method would be both for desktop and on mobile.  Another drawback here is that the updating would have to be done manually.  I would need to manually decide how far in the future I would want to review.  Even if I had three selections, I would have to edit the review date for each one to the correct date in the future.  There's no natural flashcard UI system, and since we wouldn't have the stack of cards, we wouldn't have any integrated reminder/notification.  Still not the easiest.

#### App

Next up is solving my problem through an app.  Many spaced repetition apps exist, but so far I haven't been able to find one that I liked, and even as a developer, I'm not interested in spending $25 for Anki.  I think I can make something good enough for what I need.

The good news is that I already have my own requirements as user stories, with some changes:

- List of items to study
- Ability to add and remove items
- For each item, option of having a prompt and an answer (quiz style) or just prompt (summary style)
- For each item, date to next review it
- Ability to *automatically* change date depending on how well I review it
- Ability to review the top n items due for today (ie the list needs to be *automatically* sorted)
- Different lists for different subjects
- *Easily accessible for fast access on desktop or mobile* 


Not a bad start.  My next step is to lay out the application and work through some of the initial concepts.