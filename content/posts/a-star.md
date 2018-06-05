---
title: "A-Star"
date: 2018-06-04T19:03:58-04:00
draft: true
---


How do you know where to look?

If you know some information about what you're looking for, you can take an educated guess.

For instance, say you're driving from Boston, MA to Montpelier, VT, and you decide to plot a route without the use of a GPS.  How would you select the roads to take?

Looking at your current position, you could look at the roads you can take that will get you closer to your destination.  This makes sense; why would you drive in the other direction?

By evaluating the roads with this simple metric, you're able to build an educated guess about your path.  "I want to drive north-west, so I will pick roads that are in that direction."

This is immensely helpful.  Imagine the pain of having to evaluate every road.  First, you would have to consider every road going out from your current location.  At every intersection, you'd have to then consider every additional road.  This gets busy fast!

Choosing the best option based on whether or not it's a good guess is the main idea behind informed search.

In the driving example, our rule for whether or not it's a good guess is very simple: does the road go towards Montpelier?  This is called the **heuristic function**.  It allows us to evaluate a choice.

The one from our driving example is very simple: _yes_, the road goes in the direction of Montpelier, or _no_, it does not.  Is this enough to get us there?  It might be, but it doesn't allow for any flexibility.  What if a road first goes north, then another road goes west?  What if we could first go east, then take a faster road north?  What if we have two roads that go north-west and we want to see if one is better than the other?  Only having a boolean _yes_ or _no_ may not allow us to efficiently decide.  For a complicated question like "How do I get there?", there can be many factors that decide whether or not something is a good guess.

Let's consider a much simpler problem: I have a maze, I know where I start, and I know where the end is.  How can I find a path through the maze?

Let's simplify this further.  Here are a few more requirements:

* I can only move Up, Right, Down, or Left. I can't move diagonally.
* If there's a wall in my way, I can't move through it
* I can't leave the maze
* Movement is on a grid.

Here's a very basic maze.


** Maze image with grid **

There are many ways to solve this.  I recommend that you take a moment to solve it yourself.

Solved it? Well done!

Now, take a moment to explain how you did it.  You can explain to me, yourself, your computer, your friend, your pet, or a rubber duck.  What were the exact steps you took?

There are many ways to solve mazes.  One way is very simple: "Follow the wall on your left".  This is easy to do as you walk through a maze: keep one hand touching the wall on your left, and never stop touching it as you walk.  Eventually, you'll finish the maze!

Here's a maze that would do well for:

** Maze where dfs going left works well. Doesn't have to be grid **

Unfortunately, it might not always work well:

** Maze where dfs goes through every path before finishing. Doesn't have to be grid **

For the second one, you might say that you would try the right path first, and I would agree that it would be a good strategy.  Here's one more question: how would you quantify that?  How would you be able to tell a computer to do that?

We can do this using a heuristic function from earlier.  If we know enough about the end of the maze, we can evaluate every choice we make and pick the best one.  This brings up the question from before: what makes a choice the _best_ choice?

Let's use a simple measure, distance.  Since we know we eventually want to make it to the end of the maze, we can say that moving closer to the end of the maze makes for a better choice.  We could measure the distance as a straight line to the goal, or we could measure it as the number of left and right steps it would take if there was nothing in the way.  Let's go with the latter, as it better matches our own movement.  Importantly, let's count the steps as if there was nothing in between.

The way we can solve this is to keep track of the options we have for the next square to explore.  When we get a new option, we can see how good it will be, and then we can always take the best option out of all of our potential options.

Let's try this out on a simple maze:

Let's keep track of our position with an (x, y) position, and let's call our start (1, 1) and the goal (4, 4).

At first, we have one option, (1, 2).  How far is this from the final position? We would need to take 2 steps up and 3 steps to the right for a total of 5 steps.  We can't just take those steps, but that's how we're measuring our distance.

Now, let's look at our options:

Options:
* Go to (1, 2). How good is it? 5 total steps to goal

Well, we only have one option. Let's do it!

Now, we're at (1, 2).  Our only option is (2, 2). It would take 2 steps up and 2 to the right for a total of 4 to get to the goal.  Let's pick our next option:

Options:
* Go to (2, 2). 4 total steps to goal.

Pretty simple! Let's speed up this computer.

At: (2, 2)
Options:
* Go to (3, 2). 3 steps to goal.
* Go to (2, 1). 5 steps to goal.

For the first time, we have a choice!  Looking at our options, we can see that going to (3, 2) will mean that we'll have fewer total ideal steps we could take to get to the goal.  We can pick that one, as it's the better choice.  I'll play computer for the rest:

At: (3, 2)
Options:
* Go to (3, 1). 4 steps to goal.
* Go to (3, 3).  2 steps to goal.

At: (3, 3)
Options:
* Go to (3, 4). 1 step to goal.

At: (3, 4)
Options:
* Go to (4, 4). 0 steps to goal (we made it!)
* Go to (2, 4).  2 steps to goal.

We then pick the option that takes us to the goal, and we have our solution!

** Image of completed path **




