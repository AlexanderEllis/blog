---
title: "Pumping Lemma"
date: 2018-11-11T11:59:18-05:00
draft: true
---

# General purpose and idea


The main purpose of this article is to create a clear explanation of the pumping lemma and to fortify my own understanding of it.

If I can explain it well and can teach it, I'll understand it. Maybe I'll even do it for the Wednesday meetings.

I also want to practice writing, and the more I do, the better.

The main idea of the pumping lemma is that you have to repeat some steps, and since you can choose a string, if you choose the right string, you can show that you can't have a simple FSA for a string type.  For example, (^n )^n or a^n b^n.

I bet it will take me ~1 hour to get a first draft written. I have a fairly good understanding of the topic, but the hard part will be explaining it.

Took me much longer than an hour.


# The Pumping Lemma: "Don't try to write a regex for that"

## Regular Expressions

_"Some people, when confronted with a problem, think 'I know, I'll use regular expressions.' Now they have two problems."_
- Jamie Zawinski

How would you write a regular expression to ensure that a string of parentheses had a corresponding closing one for every opening parenthesis?

For instance, "()()" would be valid.
"()()()" and "((()))" would also be valid.
"((())" would not be valid, as it has one too many opening parentheses.

This is an impossible problem masquerading as a solvable one, and it's tempting to try to solve.  In the hopes that you won't spend your time trying, I'll walk through why it's not possible.

## Regularity

For some types of strings, you can build a simple state machine to walk through to see if they're valid, and this is essentially what a regular expression is.  Here's a state machine that checks if the input string is "aba":

[INSERT DIAGRAM OF aba here]

From the start, you can go character by character through an input string and go to the corresponding next state.  At the end of your string, if you're at an accept state, your input is accepted! If not, it's rejected.  We can see this with "aba": from the start, an "a" takes us into state 1. A subsequent "b" takes us into state 2, and a final "a" takes us into state 3, which is an accept state.  Our string is finished, and since we're in an accept state, our string is valid.

If our input was only the string "ab", we would be finished with our input when in state 2, and since that isn't an accept state, we would be able to confirm that the input is not valid.  This makes sense, as "ab" is decidedly not "aba".

What would happen with an input string "baa"? It doesn't match the string "aba", so it shouldn't be accepted.  Walk through the diagram character by character to confirm!

The group of inputs that are accepted by this machine is called a *language*.  In this case, our language is made up of just the string "aba".  If our state machine accepts and rejects inputs correctly, it *recognizes* the language.  In this case, our state machine recognizes the language made up of the string "aba".

If we wanted to, we could make it a little more complicated.  What if we wanted to check if the input string is an "a" followed by some number of "b"s and finally an "a"? For instance, "aba", "abbba", and "abbbbbbba" should all be good, while "ab", "bab", and "aab" should not be accepted.

Here's one such state, and try walking through with the above examples to make sure they are accepted or rejected accordingly.

[Insert diagram of a b^n a]

The language recognized by this can be written as as a b^n a, where n >= 0.  This means we have an "a", some number of "b"s greater than one, and one final "a".

In general, if a language can be recognized by a state machine like the ones above, it is called *regular*.  This is where the regular in regular expression comes from.

This is going well!  We can create our simple state machines and walk through them, and we've already handled any number of b's in our string.

What if we tried something like a number of "a"s followed by the same number of "b"s?  This would be of the form "a^n b^n".  For instance, "ab" would be good, as would be "aabb", "aaabbb", and "aaaaabbbbb".

It turns out that this problem isn't solvable with our simple machines, and this is where it gets tricky.

## The Pumping Lemma

Proofs allow us to show that something is not possible, and we can prove that we can't build a regular expression for the above string.  We'll be doing so with the Pumping Lemma, which is essentially a few things we know for certain about the state machines that we're able to build.

The main idea behind the pumping lemma is that a long enough input forces us to repeat some part of the state machine, as our state machine must have a finite number of states to go to.

Let's return to the previous example "a b^n a".  Here's that state machine:

[Diagram for "a b^n a"]

Let's see the path through this machine for a few different inputs.

If we check the input string "aba", we visit each state once.

[Diagram for going through w/ "aba"]

If we check the string "aa", we don't visit state 2.

[Diagram for going through with "aa"]

Finally, if we check the string "abba", we visit state 2 twice (once for each "b").

[Diagram for going through with "abba"]

What's interesting here is that there's some input length that requires us to revisit a state.  In this case, "aba" is the shortest accepted string that requires us to visit state 2 twice.  We can think of state 2 as the looping state, as it forms a closed loop with itself that allows the input to grow.

This means that for any accepted input longer than "aba", the path through the state machine must visit state 2 multiple times.  If we add another "b" to the middle of an accepted string, we will visit state 2 an additional time, and if we take a "b" away from an accepted string longer than "aba", we will visit state 2 one fewer time.

Here's a state machine for a (bab)^n a.  It will behave in a similar manner, except now the loop is the extended "bab" section.

[Diagram for a (bab)^n a]

We can generalize this by considering a state machine with some number of states before the loop, a loop with some number of steps, and some section after the loop.

[Diagram of generalized state machine]

As before, we want to think about some input length _p_ that will cause us to go through this loop once on its path to acceptance.  No matter how long our state machine is, we're able to have this _p_, as the state machine is finite.  We'll call this length _p_ the *pumping length*.

[Diagram of generalized state machine with _p_ length]

This means that in a recognized input string of at least length _p_, we can divide the string into three sections:
  * x, the section before the loop
  * y, the looping section
  * z, the section after the loop

[Diagram of x, y, and z]

This division into x, y, and z means a few things for any accepted string that is at least length _p_:

1. We can go around the loop any different number of times, and our string *must* still be accepted (aka in the language)
  * For instance, "aba" with the middle "b" loop could instead be accepted with 0 b's ("aa") or with an additional "b" ("abba")
2. The length of the looping section, y, must be greater than zero
  * Above, the looping section for "abbba" could be "b".
3. The combination of the section before the loop and the looping section must be at most _p_.
  * Above, for the accepted input "abbba", the section after the loop cannot be the final "a", as it's past _p_ characters in the input.

## Using the pumping lemma

All of this tells us about how we can divide a string, and we can use this.  We'll do so with a proof by contradiction, where the formula is as follows:
* Assume that a language is regular and thus has a pumping length _p_.
* Find a string that we can pump (change the number of times we're going around the loop) but will not be in the language post-pump

This sounds abstract, so let's look at our original example.

## a^n b^n

Let's show that this language isn't regular, i.e. we cannot create a regular expression or a state machine for it.

As with proofs by contradiction, we'll begin by assuming that the language *is* regular and has a pumping length _p_.

We need an input string that will cause problems, and this can usually be done by picking something that is uniform for the first _p_ characters.  Let's choose a^p b^p, or _p_ a's followed by _p_ b's.

Now, we can look at the three requirements earlier.  From the third point, we know that the combination of x (the section before the loop) and y (the looping section) must happen in the first _p_ characters.  This means that no matter what the section before the loop is, our looping section must be comprised of some number _n_ "a" characters.

The first point tells us that we can loop any number of times, which means that for our y, we can either take it away or add additional looping sections in.  For this example, we can go either direction, but let's say that we go around the looping section again, that is to say we have an additional _n_ characters in our string.

Our new string is a^(p + n) b^n.  Our original language is the strings comprised of some number of a's followed by the same number of b's, but since we know we must have added at least 1 "a" (second point above), our modified string isn't in our langauge.  Our pumping lemma tells us that changing the number of loops taken *must* result in a string that is also accepted and in our language, but this can't be the case!  Since we have reached a contradiction, our original assumption is invalid, and this language is not regular.

Here are those same steps:

[Diagram of proof]

## Parentheses

The parentheses problem asks if we have a matching number of ")" characters for each "(" character, and it can be thought of as the same problem we just worked through, except with "(" and ")" instead of "a" and "b".  How would you write a state machine to see if (^p )^p was valid?  The answer is that you cannot and that you require an additional tool (namely a stack) to do so.
