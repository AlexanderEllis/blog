---
title: "A-Star"
date: 2018-06-04T19:03:58-04:00
draft: true
---


### Informed searching

How do you know where to look for something you're searching for?

If you know some information about what you're looking for, you can take an educated guess.

If you know you're looking for milk at the supermarket, you can look in the dairy aisle.  If you know you had your keys in the living room, you can check there for them.  If you know you're traveling north, you can look for a route that takes you north.

For instance, say you're driving from Boston, MA to Montpelier, VT, and you decide to plot a route without the use of a GPS.  How would you select the roads to take?

Looking at your current position, you could look at the roads you can take that will get you closer to your destination.  This makes sense, as you wouldn't want to drive in the other direction.  By evaluating the roads with this simple metric, you're able to build an educated guess about your path.  "I want to drive north-west, so I will pick roads that are in that direction."

This is immensely helpful.  Imagine the pain of having to evaluate every road.  First, you would have to consider every road going out from your current location.  At every intersection, you'd have to then consider every additional road.  This gets busy fast.

Choosing the best option based on whether or not it's a good guess is the main idea behind informed search.

In the driving example, our rule for whether or not it's a good guess is very simple: does the road go towards Montpelier?  This is called the **heuristic function**.  It allows us to evaluate a choice.

The one from our driving example is very simple: _yes_, the road goes in the direction of Montpelier, or _no_, it does not.  Is this enough to get us there?  It might be, but it doesn't allow for any flexibility.  What if a road first goes north, then another road goes west?  What if we could first go east, then take a faster road north?  What if we have two roads that go north-west and we want to see if one is better than the other?  Only having a boolean _yes_ or _no_ may not allow us to efficiently decide.  For a complicated question like "How do I get there?", there can be many factors that decide whether or not something is a good guess.

### Maze seraching

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

The way we can solve this is to keep track of the options we have for the next square to explore.  When we get to a new square, we can add its new options to our options, see how good they all would be, and then we can always take the best option out of all of our potential options.

Let's try this out on a simple maze:

Let's keep track of our position with an (x, y) position, and let's call our start (1, 1) and the goal (4, 4).

At first, we have one option, (1, 2).  How far is this from the final position? We would need to take 2 steps up and 3 steps to the right for a total of 5 steps.  We can't just take those steps, but that's how we're measuring our distance.

Now, let's look at our options:

Options:
* Go to (1, 2). How good is it? 5 total steps to goal

Well, we only have one option. Let's do it!

Now, we're at (1, 2).  Our only option is (2, 2). It would take 2 steps up and 2 to the right for a total of 4 to get to the goal.  Let's pick our next option:

Options:
* Go back to (1, 1). 6 steps to goal.
* Go to (2, 2). 4 total steps to goal.

Pretty simple! Let's speed up this computer.

At: (2, 2)
Options:
* Go back to (1, 2). 5 steps to goal.
* Go to (3, 2). 3 steps to goal.
* Go to (2, 1). 5 steps to goal.

For the first time, we have a choice!  Looking at our options, we can see that going to (3, 2) will mean that we'll have fewer total ideal steps we could take to get to the goal.  We can pick that one, as it's the better choice.  I'll play computer for the rest:

At: (3, 2)
Options:
* Go back to (2, 2). 4 steps to goal.
* Go to (3, 1). 4 steps to goal.
* Go to (3, 3).  2 steps to goal.

At: (3, 3)
Options:
* Go back to (3, 2). 3 steps to goal.
* Go to (3, 4). 1 step to goal.

At: (3, 4)
Options:
* Go back to (3, 3). 2 steps to goal.
* Go to (4, 4). 0 steps to goal (we made it!)
* Go to (2, 4).  2 steps to goal.

We then pick the option that takes us to the goal, and we have our solution!

** Image of completed path **

** Start @ 1157 words. **

This works pretty well for the most part. But it doesn't solve all of our problems.  What if we had to backtrack before finding a correct maze?  For instance, consider the following:

######
#     B
# ####
# ## #
#    #
#### #
A    #
######


Would our algorithm ever find a path to get to B?  Play computer for a moment and give it a shot.

You may have reached the deadend and not known what to do. That's ok, as we didn't say what we should do.  Computers will still do what they're told.  Let's see what happens right before we get to the dead end:

######
#     B
# ####
# ## #
#   @#
#### #
A    #
######

At: (4, 2)
Options:
* Go back to (4, 1). 5 steps to goal.
* Go to (4, 3). 3 steps to goal (keep in mind our guess doesn't take into account walls)
* Go to (3, 2). 5 steps to goal

Clearly, we should move to (4, 3).  Here's the problem though: when we get to that square, we add the possible movements to our list.

At: (4, 3)
Options:
* Go to (4, 2). 3 steps to goal

Hmm, one option. If we take it, we're right back where we just came from.

At: (4, 2)
Options:
* Go back to (4, 1). 5 steps to goal.
* Go to (4, 3). 3 steps to goal (keep in mind our guess doesn't take into account walls)
* Go to (3, 2). 5 steps to goal

This is a problem.  By looking only at the step that takes us closest to the goal, we end up in a position where we can oscillate between a dead end and the step before it, as each will be the best option from the other.  By being too greedy, we would never allow ourselves to move away from the goal in order to eventually move towards it.

### Smarter maze searching

We can solve this problem by looking at more than just _distance to goal_ when deciding on our next option.  One way to improve is to take into account the total distance traveled to our current position, the cost of moving, _and_ our original heuristic function.

We can add the three to get a better guess.  Let's count each step as costing 1.  This means our evaluation will look like the following:

`value(x) = shortest_path_to(current) + cost_to_go_to(x) + distance_to_goal_from(x)`

We can also be smarter about knowing that we don't want to keep track of returning to a position but instead we want to keep track of the options available from each position.  We can implement this by keeping track of all of our available options, and when we visit a option, we'll remove it from our available options.  If we've already visited it, we won't add it to our options. If we find a better path to an option, we can update it in our available options with the better path.

Let's play computer with the same maze that got us stuck.  It's different, as we won't be revisiting nodes, but here are the steps:

######
#    B
# ####
# ## #
#    #
#### #
A    #
######

At: (1, 1):
Options:
* Go to (2, 1).  0 squares traveled + 1 square to move + 9 squares to goal = 10 total

At: (2, 1):
Options:
* Go to (3, 1).  1 squares traveled + 1 square to move + 8 squares to goal = 10 total

At: (3, 1):
Options:
* Go to (4, 1).  2 squares traveled + 1 square to move + 7 squares to goal = 10 total

(You may see where this is going)

At: (4, 1):
Options:
* Go to (5, 1).  3 squares traveled + 1 square to move + 6 squares to goal = 10 total

At: (5, 1):
Options:
* Go to (5, 2).  4 squares traveled + 1 square to move + 5 squares to goal = 10 total

At: (5, 2):
Options:
* Go to (5, 3).  5 squares traveled + 1 square to move + 4 squares to goal = 10 total

(Last tedious step, I promise. Who designed this maze?)

At: (5, 3):
Options:
* Go to (5, 4).  6 squares traveled + 1 square to move + 3 squares to goal = 10 total
* Go to (4, 3).  6 squares traveled + 1 square to move + 5 squares to goal = 12 total

Finally, an interesting choice.  Not extremely interesting, but our hand is not forced.  Note that (5, 4) is still the best option, so we travel to it.  Now once we look at the options, we see we have already visited (5, 3) and don't add it to the list!

At: (5, 4):
Options:
* Go to (4, 3).  6 squares traveled + 1 square to move + 5 squares to goal = 12 total

Note that we aren't cheating by jumping from (5, 4) to (4, 3).  This is the change from thinking about our path as a "route we take through the maze" and more "finding the best route through the maze" coming into play.  We just found that (5, 4) is a dead end and that (4, 3) is the route we should have taken. We can continue to build our path from there, and it will eventually solve the maze.

### A-star

This algorithm is called **A-star**.  You'll see the list of options referred to as the **frontier**, as they're the outskirts of the area we've already discovered.  The frontier is usually implemented using a priority queue that keeps the lowest total cost at the front for easy access.  Here's the algorithm in pseudocode, which looks a lot like Python. Or maybe the other way around?

```python
def a_star(problem):
  # Initialize frontier as priority queue based on path_to(c) + cost + heuristic(c)
  frontier = initialize_frontier(problem.initial_state)
  while frontier not empty:
    next_choice = frontier.remove_min()

    if is_goal(next_choice):
      return follow_path_to_start(next_choice)

    for next_option in next_choice.options:
      if next_option not in frontier and next_option is not visited:
        frontier.insert(next_option)
      else if next_option in frontier and next_option.cost < option_in_frontier.cost:
        replace next_option in frontier

  # If the frontier is empty before we've found the goal, we can't do it
  return False
```

Methods like `remove_min`, `initialize_frontier`, `insert`, `option_in_frontier`, and `replace next_option` are left to the reader as exercise.

One last detail: for a heuristic function to always give you an answer and always give the best answer first, it will need to be _admissible_ (it never overestimates the real cost to get to the goal) and _consistent_ (if you can go from position _a_ to position _b_, the estimate for _a_ -> _goal_ can never be more than the real cost of going _a_ -> _b_ plus the estimated cost of _b_ -> _goal_).  Did our distance heuristic function cover these?

The applications of this algorithm get more interesting as you complicate the problem.  If you're searching for the solution to a [sliding-8 problem](TODO: add link to sliding 8), you can come up with a heuristic to find the fastest way to win.  If you're [flipping pancakes](TODO: add link to pancake problem) like [Bill Gates](TODO: link to Gates pancake flipping heuristic), you can come up with a cost function and a heuristic that will get you to the proper stack as soon as possible.  And if you're searching for the best way to get to Montpelier, it can help you find the way.

Stopped at 2517 words.

# TODO: update URLS
# TODO: rewrite second draft