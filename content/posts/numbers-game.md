---
title: "\"I don't know the numbers\": a math puzzle"
date: 2022-05-08T15:29:23-04:00
draft: false
---

I saw a math puzzle the other day on [Hacker News](https://news.ycombinator.com/item?id=31293611). It reads as follows:

> Two numbers are chosen randomly, both are positive integers smaller than 100. Sandy is told the sum of the numbers, while Peter is told the product of the numbers.
>
> Then, this dialog occurs between Sandy and Peter:
>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
> Peter: I don't know the numbers. <br>
> Sandy: I don't know the numbers. <br>
>
> Peter: I do know the numbers.
>
> What are the numbers?



At first glance this looks impenetrable, but I'd encourage you to give it a think if you'd like to. I'll be walking through exactly how it works and how to solve it (with the help of a computer).

*Spoilers below, be warned*

-----


Again, at first glance, it doesn't look like any of this information would be helpful, but the trick is that each time they say they don't know the answer, the other party is able to narrow down the options for what the numbers could be. If you do this enough times, there's only one pair of numbers left, at which point Peter knows the answer.

I found it helpful to think about this in a few different ways. First, let's say we have a list of all of the pairs of numbers - we can think about those as our candidates. To simplify, let's say that the order doesn't matter (`(1, 2)` is the same as `(2, 1)`) and we just keep track of one of the duplicates.

```python

candidates: [
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  ...
  (99, 99)
]

```

Let's also imagine a big representation of all of the possible **sums** and **products** and the pairs of numbers that make up those sums and products. Let's say they're maps, where the keys are the sums/products and the values are lists of the pairs that make up those sums/products. Furthermore, let's say that both Sandy and Peter have full knowledge of these maps.

```python

sums: {
  2: [(1, 1)],  # The only pair that adds up to 2 is (1, 1)
  3: [(1, 2)],
  4: [(1, 3), (2, 2)],  # For 4, we have two pairs: (1, 3) and (2, 2)
  5: [(1, 4), (2, 3)],
  6: [(1, 5), (2, 4), (3, 3)],
  # And so on.
  ...
  198: [(99, 99)]
}

products: {
  1: [(1, 1)],  # The only pair that multiply together to make 1 is (1, 1)
  2: [(1, 2)],
  3: [(1, 3)],
  4: [(1, 4), (2, 2)],  # For 4, we have two pairs: (1, 4) and (2, 2)
  # And so on.
  ...
  9801: [(99, 99)]
}

```

The trick is in those entries that are only made up of a single pair.

Let's look at Peter first. Peter knows the product of the two numbers. Peter can look up this product in the `products` map - if there is only one pair that makes up that product, then those _must_ be the numbers! When Peter tells us that he doesn't know the numbers, it means that the product _must not be any product that only has one pair_. This means that every time Peter doesn't know, we can remove each pair that is the only pair for a product, and those pairs can be removed from the list of potential candidates.

Let's look at those above lists and Peter's first claim. At the start, we have a full list of candidate pairs, a full `sums` map, and a full `products` map. Because Peter knows the product, when he says "I don't know the numbers", it means that he looked at the possible pairs that made up this product and found multiple potential pairs - otherwise he would immediately know the numbers. This means that we can then disqualify products that are made up of one pair. `1` as a product, for instance, is only made from multiplying the pair `(1, 1)`. Since we know that Peter doesn't immediately know it as the solution, it means that it can't be `(1, 1)`.

Similarly, if the product was `9801`, Peter would have immediately known the pair was `(99, 99)`. Because he can't yet say for certain, it means that the numbers must not be `(99, 99)`.

We're able to now remove all candidates that were the only factors that made up a product. For the first round, this is notably `1` times each prime and each prime multiplied by another prime that results in a number greater than 100. Importantly, we can also remove them and their products/sums from the `products` map _and_ the `sums` map.


```python

# After culling the candidates from the first round
candidates: [
  (̶1̶,̶ ̶1̶)̶,̶
  (̶1̶,̶ ̶2̶)̶,̶
  (̶1̶,̶ ̶3̶)̶̶,̶
  (1, 4),
  ...
  (̶9̶9̶,̶ ̶9̶9̶)̶
 ]

sums: {
  2̶:̶ ̶[̶(̶1̶,̶ ̶1̶)̶]̶,
  3̶:̶ ̶[̶(̶1̶,̶ ̶2̶)̶]̶,
  4: [(̶1̶,̶ ̶3̶)̶, (2, 2)],
  5: [(1, 4), (2, 3)],
  6: [(̶1̶,̶ ̶5̶)̶, (2, 4), (3, 3)],
  # And so on.
  ...
  198: [(99, 99)]
}

products: {
  1̶:̶ ̶[̶(̶1̶,̶ ̶1̶)̶]̶,̶
  2̶:̶ ̶[̶(̶1̶,̶ ̶2̶)̶]̶,̶
  3̶:̶ ̶[̶(̶1̶,̶ ̶3̶)̶]̶,̶
  4: [(1, 4), (2, 2)],
  # And so on.
  ...
  9̶8̶0̶1̶:̶ ̶[̶(̶9̶9̶,̶ ̶9̶9̶)̶]̶
}

# Note: the above uses strikethrough code - if it looks funny on your screen, I apologize!
# In that case, the culling is an exercise left to the reader.

```

This is the trick. Because the space of possible candidates has been reduced, it means the possible candidates that make up each sum and product have also been reduced. Let's look at the updated `candidates`, `sums`, and `products`, filling in a few more previously omitted values:

```python

candidates: [
  (1, 4),
  (1, 6),
  (1, 8),
  ...
  (88, 90)
]

sums: {
  4: [(2, 2)],
  5: [(1, 4), (2, 3)],
  6: [(2, 4), (3, 3)],
  # And so on.
  ...
  178: [(88, 90)]
  179: [(80, 99)]
}

products: {
  4: [(1, 4), (2, 2)],  # For 4, we have two pairs: (1, 4) and (2, 2)
  # And so on.
  ...
  7920: [(88, 90), (80, 99)]
}

```

Now, it's Sandy's turn to say that she doesn't know the numbers. Because Sandy knows the **sum**, again it must mean that the sum can't be any sum with only one pair as an option in `sums`, so we can again cull those pairs. In the updated `sums` structure, we can see that 4 is now only made up of a single candidate pair, `(2, 2)`. If the sum was 4, Sandy would know immediately what the pair was, but since she doesn't, it means the pair cannot be `(2, 2)`, and we can remove it from the candidates.

Every round, we're disqualifying potential candidates. Because we're also able to remove them from the `sums` and `products` as potential options, it means that each protagonist is working on a new collection every time, giving a little more information every time they say they don't know the number.

This pattern will continue, with a certain number of options being removed every time. At some point, Peter finally says that he does know the numbers - finally, there is only one product left with one potential pair, and that is the answer. Importantly, it has to go down to a single product - otherwise there would be multiple answers! That's why this version has Peter claiming to know after 14 rounds, because it limits the answer to a single pair (although there are other options - see later).

-----

This would be a little rough to do by hand, but luckily we can have the computer do it for us.

<br>

```python

N = 100


# Helper functions to regenerate the sums/products data structures every round.
# Not optimal but hey this is for fun.
def generate_sums(candidate_pairs):
    sums = {}
    for tuple_pair in candidate_pairs:
        (i, j) = tuple_pair
        sum = i + j
        if sum not in sums:
            sums[sum] = [tuple_pair]
        else:
            sums[sum].append(tuple_pair)
    return sums


def generate_products(candidate_pairs):
    products = {}
    for tuple_pair in candidate_pairs:
        (i, j) = tuple_pair
        product = i * j
        if product not in products:
            products[product] = [tuple_pair]
        else:
            products[product].append(tuple_pair)
    return products


def find_pairs():
    # First, generate all possible pairs from (1, 1) to (N-1, N-1).
    candidate_pairs = set()
    for i in range(1, N):
        for j in range(i, N):
            candidate_pairs.add((i, j))

    # Swap between hearing from Peter or Sandy every round (product or sum)
    do_not_know_product = True
    round = 1
    while True:
        sums = generate_sums(candidate_pairs)
        products = generate_products(candidate_pairs)
        # First, check if there's a single product left with one pair.
        if round == 15:
            for product in products:
                if len(products[product]) == 1:
                    print('Peter: I do know the numbers')
                    print(products[product][0])
                    return

        if do_not_know_product:
            print('Peter: I don\'t know the numbers')
            # Go through products. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for product in products:
                if len(products[product]) == 1:
                    tuple_pair = products[product][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = False
        else:
            print('Sandy: I don\'t know the numbers')
            # Go through sums. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for sum in sums:
                if len(sums[sum]) == 1:
                    tuple_pair = sums[sum][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = True
        round += 1


if __name__ == '__main__':
    find_pairs()

```

Running that leads to the following, just like the puzzle, though now it includes an answer:

```none

Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I don't know the numbers
Sandy: I don't know the numbers
Peter: I do know the numbers
(77, 84)

```

There's the pair! 77 and 84.

Interestingly, as part of debugging this solution, I found that there could be different answers at different numbers of rounds. As long as there is a single product made up of a single pair, that could be the answer. We can update the `find_pairs` function to check for potential solutions at various round lengths (and stop before we go to infinity):

```python

def find_pairs():
    # First, generate all possible pairs from (1, 1) to (N-1, N-1).
    candidate_pairs = set()
    for i in range(1, N):
        for j in range(i, N):
            candidate_pairs.add((i, j))

    # Swap between hearing from Peter or Sandy every round (product or sum)
    do_not_know_product = True
    round = 1
    while True:
        sums = generate_sums(candidate_pairs)
        products = generate_products(candidate_pairs)
        name = 'Peter:' if do_not_know_product else 'Sandy:'

        potential_final = None
        # First, check if there's a single product left with one pair.
        if do_not_know_product:
            count_unique_product_pairs = 0
            for product in products:
                if len(products[product]) == 1:
                    count_unique_product_pairs += 1
                    potential_final = products[product][0]
            if count_unique_product_pairs == 1:
                print(name, 'I could know the numbers after',
                      round, 'rounds:', potential_final)
        else:
            count_unique_sum_pairs = 0
            for sum in sums:
                if len(sums[sum]) == 1:
                    count_unique_sum_pairs += 1
                    potential_final = sums[sum][0]
            if count_unique_sum_pairs == 1:
                print(name, 'I could know the numbers after',
                      round, 'rounds:', potential_final)

        num_candidates_before_cull = len(candidate_pairs)
        if do_not_know_product:
            # Go through products. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for product in products:
                if len(products[product]) == 1:
                    tuple_pair = products[product][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = False
        else:
            # Go through sums. For any product that only has a single pair,
            # we can remove those from the candidates for the next round.
            for sum in sums:
                if len(sums[sum]) == 1:
                    tuple_pair = sums[sum][0]
                    # Remove from candidates.
                    candidate_pairs.remove(tuple_pair)
            do_not_know_product = True
        round += 1
        # If we didn't remove any pairs, we may be in an infinite loop and want
        # to stop.
        if len(candidate_pairs) == num_candidates_before_cull:
            return

```

Using this version, we now get the following:

```none

Sandy: I could know the numbers after 6 rounds: (72, 99)
Peter: I could know the numbers after 7 rounds: (81, 88)
Sandy: I could know the numbers after 8 rounds: (70, 99)
Peter: I could know the numbers after 9 rounds: (77, 90)
Sandy: I could know the numbers after 10 rounds: (72, 95)
Peter: I could know the numbers after 11 rounds: (76, 90)
Sandy: I could know the numbers after 12 rounds: (70, 96)
Peter: I could know the numbers after 13 rounds: (80, 84)
Sandy: I could know the numbers after 14 rounds: (66, 98)
Peter: I could know the numbers after 15 rounds: (77, 84)

```

This means that the puzzle could be a number of different round combinations, with either Sandy or Peter saying they know the answer! In my opinion, showing 15 "I don't know"s makes the puzzle all the more confuddling, which adds to the puzzleness.


-----

How many rounds does it go? Here, we see that it can progress until there are no culled candidates - for `N = 100`, we go 15 rounds before we stop. What does that look like for a different value of N? We can explore that easily, and I think there's a fun question here: what's the lowest value of N that has an answer?

For the lowest, we can just do the following, adding `n` as an argument:

```python

def find_pairs(n):
    # First, generate all possible pairs from (1, 1) to (N-1, N-1).
    candidate_pairs = set()
    for i in range(1, n):
        for j in range(i, n):
            candidate_pairs.add((i, j))
    # ... everything else the same


if __name__ == '__main__':
    for i in range(100):
        print('N =', i)
        find_pairs(i)
        print('*****')
```


```none
N = 0
*****
N = 1
*****
N = 2
Peter: I could know the numbers after 1 rounds: (1, 1)
*****
N = 3
*****
N = 4
*****
N = 5
*****
N = 6
*****
N = 7
*****
N = 8
*****
N = 9
*****
N = 10
Peter: I could know the numbers after 3 rounds: (1, 4)
Sandy: I could know the numbers after 4 rounds: (2, 3)
Peter: I could know the numbers after 5 rounds: (1, 6)
Sandy: I could know the numbers after 6 rounds: (3, 4)
Peter: I could know the numbers after 7 rounds: (2, 6)
Sandy: I could know the numbers after 8 rounds: (4, 4)
Peter: I could know the numbers after 9 rounds: (2, 8)
*****
... a lot more
```

It looks like the lowest is `N = 2`, which is not a lot of fun, because the only pair is `(1, 1)`. Not a very interesting puzzle! The next one is `N = 10` for values 1-9, which can be done in 3-9 turns. That's pretty interesting, since we could formulate the riddle differently, though the large number of numbers and rounds makes it all the more befuddling.

I think the other interesting thing here is that for some values of N, there is no solution! Let's look at `N = 4`, where the numbers are 1-3. These tables are pretty easy to write out by hand:


```python

candidates: [
  (1, 1),
  (1, 2),
  (1, 3),
  (2, 2),
  (2, 3),
  (3, 3)
]

sums: {
  2: [(1, 1)],
  3: [(1, 2)],
  4: [(2, 2), (1, 3)],
  5: [(2, 3)],
  6: [(3, 3)]
}

products: {
  1: [(1, 1)],
  2: [(1, 2)],
  3: [(1, 3)],
  4: [(2, 2)],
  6: [(2, 3)],
  9: [(3, 3)]
}

```

OK shoot, if we remove all of the products that are made up of a single pair, we don't have any pairs left, which makes sense. Because not all values of N lead to a solution, this also means that trying to reason through the problem for low values of N is extra tricky, since it doesn't actually lead you to a solution!

-----

Overall, a fun puzzle. Here are a few closing extra credit questions for you:

- Does it matter whether Peter or Sandy talks first?
- What would happen if we had a third person that knew the absolute value of the numbers subtracted from each other? Would the order of the three matter?
- What if that third person knew the numbers subtracted, where the order of the numbers mattered?

