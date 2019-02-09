---
title: "MapReduce in Simple Language"
date: 2019-02-09T00:00:00-05:00
draft: false
---

### MapReduce Explained Using the Ten Hundred Words People Use Most Often

MapReduce is a good way to take a big job that would take a long time on one computer and break it up into smaller jobs that can be done by simple computers.

If you can break down a big job into smaller jobs, you can run the smaller jobs on many simple computers.  If you have a lot of simple computers, you can do a lot of the smaller jobs at the same time, and this can make your job go a lot faster.  This can also help if your computers ever break.  Instead of having to get a new big computer, if one of your simple computers breaks, you can just get another simple computer.  This can help you save money.

The problem of breaking down a big job into smaller jobs is not simple though.  How do you decide how to break up the big job?  How do you decide when to send the jobs to the simple computers, and who plans it?  This can be hard.

MapReduce is one way to do this.  It does the planning and the sending for you, and it lets you say what the smaller jobs look like and what to do with them.  Since it takes care of the hard parts, breaking up a big job is much easier.

***

### The Cat Saw The Dog

What if we were given a book and we had to count the number of times each word appears?  What if we had a lot of books to count words in?  This a good problem for MapReduce because doing it by hand would be very boring, and although a single computer could probably do it, if we had a big number of books to look through, it could take a long time.

Let's say we have a very simple book that is made up only of the words **"the cat saw the dog."**  Counting the words would give us this:

```
the: 2
cat: 1
saw: 1
dog: 1
```

To do this in smaller jobs, we could do something like this:

1. Break up the book into pages
2. For each page, for each word, make a card with that word on it
3. Group all the cards by word
4. For each word pile, count how many cards are in the pile
5. Write down the final count for each word

How would we give these to simple computers?  It would be nice to have each simple computer work on one page (or even smaller parts).  This means that we could break up the work between them to get it all done faster.  It would also be nice if they could do the counting for each word, because then we could break that up too.  If we're able to break these down into small jobs, we can spread out the jobs to many simple computers, and these computers can work together to finish the big job much faster than if we had to do it on one computer (and a lot faster than doing it by hand).

MapReduce is a way to break this job down into small jobs that simple computers can do easily, and it takes care of the hard parts here, which are breaking up the book into pages (step 1), grouping all the cards by words (step 3), and writing down the end count for each word (step 5).  The other hard part is making sure everything happens at the right time, which is not written down above; how do we know which simple computer to give what page, and when? How does the simple computer know what to do?  When should a computer get cards to count, and how does it get a new pile when it has finished?  MapReduce does this too, which is nice.

What about steps 2 and 4?  These are the things we have to tell it about, and they are called the map and the reduce (this is why it is called MapReduce).  We just have to tell it how to do these two jobs.  It tells the simple computers how to do their jobs, and it figures out which computers do which jobs.

Step 2 is the map, and it has to say what to do with what is put in and how to give the answer as pairs that can be grouped and later used by the reduce.  In the case above, you would be making a single card each time a word happens.  It takes a page, and it gives a group of pairs made up of the key (the word) and count (the card, which acts as a 1 for counting).

Let's see that:
```
'the cat saw the dog' -> [('the', 1), ('cat', 1), ('saw', 1), ('the', 1), ('dog', 1)]
```

MapReduce then groups the words before sending them to the computers that are doing the reduce.  It knows that the first `('the', 1)` and the second `('the', 1)` are both for the same word, so it can group them together as the word and all of its counts: `('the', [1, 1])`. This is like sorting the word cards into one pile for each word.

Step 4 is the reduce, and it has to say what to do with all of the things that came from the map for a single key.  It takes a key (in this case, the pile's word) and a group of things from the map (here, a pile of cards) and gives out what you want for that key (here, the number of cards in the pile).

Let's see our reduce for a pile of two "the" cards (really, two "1" counts):
```
('the', [1, 1]) -> ('the', 2)
```

Once we had the counts, we could just write them all down and we'd be done.  This would let us break up the job and count words in a lot of books really fast.

***

### Looking for things

The word counting is not too exciting, and we could do even more interesting things.  Let's look at how we could do something like searching for every time a word appears in a book.  This is another job that could take a while on one computer for a big number of books; let's give it to the simple computers!

Let's look through this book:

```
’Twas brillig, and the slithy toves
      Did gyre and gimble in the wabe:
All mimsy were the borogoves,
      And the mome raths outgrabe.
```

And let's look for the lines that have the word "and."  Here's one way to do the map and the reduce to do this job:

Map: Take in a line from the book, and if the word appears in the line, give the line and a 1 (key: line, message: 1). Since we aren't counting, we can call this a message, because it's more of a sign that we have it.  If the line doesn't have the word, we don't give anything.

```
'Did gyre and gimble in the wabe' -> [('Did gyre and gimble in the wabe', 1)]
'All mimsy were the borogoves,' -> []
```

MapReduce then groups all of the line/message pairs, but since each line that has the word will be the key, they end up in piles of 1.  If we had two lines that are the same, we could also put their line number in the key to make sure we don't group them together.

Reduce: Take in a line and just return the line.

```
('Did gyre and gimble in the wabe', [1]) -> 'Did gyre and gimble in the wabe'
```

What would we get at the end?  Since our map would only give out the line if the word appears in the line, only lines with that word would be sent to the reduce.  Our reduce just gives what it gets, so we'd end up with the lines that have the word in them.

This would allow us to break down a large number of books into many lines and give them to many computers.  If we have a lot of computers, we could do this very quickly!

***

### How many of you are there?

What about something like seeing how often people go on our home page and other pages?  Maybe we have a simple history of people going to pages like this:

```
alexanderell.is           01/01/2017
alexanderell.is           01/01/2017
alexanderell.is/about     01/01/2017
alexanderell.is           01/02/2017
alexanderell.is/about     01/02/2017
alexanderell.is           01/02/2017
```

It would be interesting to see how many times people went to each page.  This would be very possible with MapReduce!

Map: Take in a line from the history and send out a 1 for each page (key: page, count: 1).

```
'alexanderell.is           01/01/2017' -> [('alexanderell.is', 1)]
```

Reduce: Take in a page and the group of counts of people going to it (that MapReduce grouped for us) and give out the whole count.

```
('alexanderell.is', [1, 1, 1, 1]) -> ('alexanderell.is', 4)
```

This would let us count it all very fast.

***

### Why is this good?

Showing simple jobs for this can be boring, since they wouldn't be hard to do even by hand.  It gets interesting when you're working with big, big numbers.  What if there were more lines of the book?  What if there were a hundred books?  What if there were ten hundred?  Ten hundred times more than that?  What about ten hundred times more than *that*? And ten times more?  That's more books than there are people on Earth.  My computer does a lot for me, but it would take a long time to look through that many things!

If you're working with a very large number of things, that's when breaking it up and giving it to the smaller computers works the best.  MapReduce does the hard parts and lets you do just the two simple map and reduce parts, which lets you work on what you want to do and not worry about how exactly it gets done.

***

### [/simple]

I highly recommend reading through the original paper, and you can find it [here](https://research.google.com/archive/mapreduce-osdi04.pdf).

This was done using the [XKCD SimpleWriter](https://xkcd.com/simplewriter/) with the only non-simple words being "MapReduce" and "reduce." I couldn't think of a good way to replace "reduce," given that it's in the name, but if you can think of a good way to do it, please let me know!
