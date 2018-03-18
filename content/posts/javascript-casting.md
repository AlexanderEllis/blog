---
title: "Investigating JavaScript Casting Behavior"
date: 2018-03-18T11:14:19-04:00
tags: ["JavaScript"]
draft: false
---



The disconnect between "what seems like it should happen" and "what happens" causes you to push doors that are to be pulled, tap ads that load in the place of content, and cast `null` into 0 by accident in JavaScript.

For more on JavaScript's unintuitive behavior, please watch (or rewatch) [wat](https://www.destroyallsoftware.com/talks/wat).

Much of this behavior can be explained by JavaScript's casting.  From ECMAScipt: "The ECMAScript language implicitly performs automatic type conversion as needed."  Since knowing is half the battle, I've found it helpful to know of the unexpected behavior so that it's in the back of my mind when writing new code.


-------

I've worked with and am reasonably comfortable with JavaScript, but occasionally unintuitive behavior will still show up unannounced.  For instance, I recently ran into the following unexpected code:

```
> 0 == null
false
> 0 === null
false
> 0 < null
false
> 0 <= null
true
```

At first glance, not knowing the exact casting behavior, this seems to make no sense at all (especially without an idea of what's going on under the hood).  If 0 isn't equal to null, either with equality or strict equality, and 0 is not less than null, why would `0 <= null` be true?

[Diving into the ECMAScript docs](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-relational-operators-runtime-semantics-evaluation) tells us more:

```
RelationalExpression:RelationalExpression<=ShiftExpression

1) Let lref be the result of evaluating RelationalExpression.
2) Let lval be ? GetValue(lref).
3) Let rref be the result of evaluating ShiftExpression.
4) Let rval be ? GetValue(rref).
5) Let r be the result of performing Abstract Relational Comparison rval < lval with LeftFirst equal to false.
6) ReturnIfAbrupt(r).
7) If r is true or undefined, return false. Otherwise, return true.
```

So this evaluates the left side, gets the value, evaluates the right side, gets the value, and performs *[Abstract Relational Comparison rval < lval with LeftFirst equal to false](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-abstract-relational-comparison)*.

Note how the right and left values are swapped in the Abstract Relational Comparison.  This uses the idea that `a <= b` is the same as `!(b < a)`.  If `b` is not less than `a`, it must be greater than or equal to `a`, or flipped, `a` must be less than or equal to `b`.

Let's take a look at the Abstract Relational Comparison x < y:

```
Abstract Relational Comparison x < y

1. If the LeftFirst flag is true, then
    a. Let px be ? ToPrimitive(x, hint Number).
    b. Let py be ? ToPrimitive(y, hint Number).

2. Else the order of evaluation needs to be reversed to preserve left to right evaluation,
    a. Let py be ? ToPrimitive(y, hint Number).
    b. Let px be ? ToPrimitive(x, hint Number).

3. If both px and py are Strings, then
    a. If py is a prefix of px, return false. (A String value p is a prefix of String value q if q can be the result of concatenating p and some other String r. Note that any String is a prefix of itself, because r may be the empty String.)
    b. If px is a prefix of py, return true.
    c. Let k be the smallest nonnegative integer such that the code unit at index k within px is different from the code unit at index k within py. (There must be such a k, for neither String is a prefix of the other.)
    d. Let m be the integer that is the code unit value at index k within px.
    e. Let n be the integer that is the code unit value at index k within py.
    f. If m < n, return true. Otherwise, return false.

4. Else,
    a. Let nx be ? ToNumber(px). Because px and py are primitive values evaluation order is not important.
    b. Let ny be ? ToNumber(py).
    c. If nx is NaN, return undefined.
    d. If ny is NaN, return undefined.
    e. If nx and ny are the same Number value, return false.
    f. If nx is +0 and ny is -0, return false.
    g. If nx is -0 and ny is +0, return false.
    h. If nx is +∞, return false.
    i. If ny is +∞, return true.
    j. If ny is -∞, return false.
    k. If nx is -∞, return true.
    l. If the mathematical value of nx is less than the mathematical value of ny —note that these mathematical values are both finite and not both zero—return true. Otherwise, return false.
```

For our case comparing `0 <= null`, the inputs are evaluated in the second step (as LeftFirst was passed in as false) with **ToPrimitive** with a hint of `Number`.  Since they aren't both strings, step 3 is skipped, and and later **ToNumber** is called on them in step 4.  This seems promising!

Let's take a look at [ToPrimitive](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-toprimitive) to see what's happening here:

```
ToPrimitive ( input [ , PreferredType ] )

1. Assert: input is an ECMAScript language value.
2. If Type(input) is Object, then

    a. If PreferredType was not passed, let hint be "default".
    b. Else if PreferredType is hint String, let hint be "string".
    c. Else PreferredType is hint Number, let hint be "number".
    d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
    e. If exoticToPrim is not undefined, then
        i. Let result be ? Call(exoticToPrim, input, « hint »).
        ii. If Type(result) is not Object, return result.
        iii. Throw a TypeError exception.

    f. If hint is "default", set hint to "number".
    g. Return ? OrdinaryToPrimitive(input, hint).

3. Return input.
```

I expected the `Number` hint to be the smoking gun after seeing it before (and referenced on StackOverflow), but I don't think that's what's causing this behavior.  When `null` is passed to `ToPrimitive`, the first step correctly asserts that it's a language value.  The second step conditional, however does not evaluate as true, as null is [**the Null type**](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-ecmascript-data-types-and-values), not the Object type.  (TODO: future blog post on why `typeof(null)` evaluates to `'object'`.)

So it actually looks like ToPrimitive immediate goes to step 3, where it just returns `null`.  This means we can look back at the 4th step in Abstract Relational Comparison.  The next call is `Let nx be ? ToNumber(px)`.  This is where the magic is happening.  [**ToNumber**](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-tonumber) does what you'd (mostly) expect and returns `+0` for an argument type of `Null`, which is what we've passed in with `null`.

This is finally where we're comparing 0 and +0.  +0 is not less than 0, so our call to Abstract Relational Comparison returns false, and our original <= RelationalExpression returns true, evaluating `0 <= null` as true.

Returning to our original troublesome code, we can connect why this leads to our `0 <= null` being true.  The only things left to look at are the [**equality comparisons**](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-abstract-relational-comparison).

```
Abstract Equality Comparison

The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1. If Type(x) is the same as Type(y), then
    a. Return the result of performing Strict Equality Comparison x === y.
2. If x is null and y is undefined, return true.
3. If x is undefined and y is null, return true.
4. If Type(x) is Number and Type(y) is String, return the result of the comparison x == ToNumber(y).
5. If Type(x) is String and Type(y) is Number, return the result of the comparison ToNumber(x) == y.
6. If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
7. If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
8. If Type(x) is either String, Number, or Symbol and Type(y) is Object, return the result of the comparison x == ToPrimitive(y).
9. If Type(x) is Object and Type(y) is either String, Number, or Symbol, return the result of the comparison ToPrimitive(x) == y.
10. Return false.
```

```
Strict Equality Comparison

The comparison x === y, where x and y are values, produces true or false. Such a comparison is performed as follows:

1. If Type(x) is different from Type(y), return false.
2. If Type(x) is Number, then
    a. If x is NaN, return false.
    b. If y is NaN, return false.
    c. If x is the same Number value as y, return true.
    d. If x is +0 and y is -0, return true.
    e. If x is -0 and y is +0, return true.
    f. Return false.
3. Return SameValueNonNumber(x, y).
```


For the Abstract Equality, we can see that there is no ToNumber call that would make `null` +0, and we can also see that the Strict Equality immediately returns false when Type(0), **Number**, is different from Type(null), **Null**.

```
> 0 == null
false // No casting in Abstract Equality
> 0 === null
false // No casting in Strict Equality
> 0 < null
false // Similar casting as above, and 0 < +0 is false
> 0 <= null
true // Main casting question, and 0 <= +0
```

Definitely tricky, but good to keep in the back of your mind!
