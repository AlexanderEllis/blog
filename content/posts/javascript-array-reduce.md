---
title: "JavaScript: Writing your own Array.reduce"
date: 2018-04-01T09:51:00-04:00
draft: false
tags: ['JavaScript']
---


I've found that one of the best ways for me to really understand anything is to implement it myself.  Between the ECMAScript spec and a few lines of JavaScript, you can build a chunk of knowledge for a very specific area of JavaScript.  Doing this often is a great way to gain a deeper understanding of the language, and it's a great exercise in reading the docs, reading code, and creating your own solution.

In this post, I'll walk through `Array.reduce` and my own implementation.  Although it's easy to read my code, I highly recommend that you go through this process yourself.

Deep knowledge of how `Array.reduce` works is useful to have in your JavaScript toolkit.  It allows you to succinctly break down an array using a function of your choice.  The idea of reducing, especially when paired with mapping, is a common one that can be found in [MapReduce](https://en.wikipedia.org/wiki/MapReduce), [Redux](https://redux.js.org/), [mongoDB](https://docs.mongodb.com/manual/core/map-reduce/), and many other areas.

Let's start by [looking at the spec](https://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.reduce) for `Array.reduce`:

```
22.1.3.18 Array.prototype.reduce ( callbackfn [ , initialValue ] )

NOTE callbackfn should be a function that takes four arguments. reduce calls the callback, as a function, once for each element present in the array, in ascending order.

When the reduce method is called with one or two arguments, the following steps are taken:

1. Let O be ToObject(this value).
2. ReturnIfAbrupt(O).
3. Let len be ToLength(Get(O, "length")).
4. ReturnIfAbrupt(len).
5. If IsCallable(callbackfn) is false, throw a TypeError exception.
6. If len is 0 and initialValue is not present, throw a TypeError exception.
7. Let k be 0.
8. If initialValue is present, then
  a. Set accumulator to initialValue.
9. Else initialValue is not present,
  a. Let kPresent be false.
  b. Repeat, while kPresent is false and k < len
    i. Let Pk be ToString(k).
    ii. Let kPresent be HasProperty(O, Pk).
    iii. ReturnIfAbrupt(kPresent).
    iv. If kPresent is true, then
      1. Let accumulator be Get(O, Pk).
      2. ReturnIfAbrupt(accumulator).
    v. Increase k by 1.
  c. If kPresent is false, throw a TypeError exception.
10. Repeat, while k < len
  a. Let Pk be ToString(k).
  b. Let kPresent be HasProperty(O, Pk).
  c. ReturnIfAbrupt(kPresent).
  d. If kPresent is true, then
    i. Let kValue be Get(O, Pk).
    ii. ReturnIfAbrupt(kValue).
    iii. Let accumulator be Call(callbackfn, undefined, «accumulator, kValue, k, O»).
    iv. ReturnIfAbrupt(accumulator).
  e. Increase k by 1.
11. Return accumulator.

The length property of the reduce method is 1.

```

Overall it's not too bad!  Let's write this out in pseudocode:

```
1. Keep track of input object with O
2. If there are any issues doing so, return
3. Keep track of the length of the input object with variable len
4. If there are any issues doing so, return
5. If we can't call callbackfn, eg it isn't a function, throw a TypeError exception (we need a function to call)
6. If we have an empty input but don't have an initial value, throw a TypeError exception (we need to have a value to start with)
7. Initialize a counter variable k to be 0
8. If we have an initial value,
  a. Initialize our accumulator variable to be that initial value
9. If we don't have an initial value,
  a. Initialize a present indicator variable kPresent to be false
  b. While we haven't found an item and our counter variable is less than the length of our input,
    i. Get the string version of our counter variable to use for indexing
    ii. Check whether or not our input object O has an element at the current index
    iii. If there's any problem indexing in to our input element, return
    iv. If our input object O has an element at the current index,
      1. Initialize our accumulator variable to be that element
      2. If there's any problem accessing that element, return
    v. Increase our counter variable to the next index
  c. If we've gone through all the indexes of the input object and didn't find a value, throw a TypeError exception (since we need a value to start with)
10. While our counter variable k is less than the length of our input object,
  a. Get the string version of our counter variable to use for indexing
  b. Check whether or not our input object O has an element at the current index
  c. If there's any problem checking, return
  d. If there is an element at the current index,
    i. Assign that element to a variable kValue
    ii. If there's a problem accessing or assigning, return
    iii. Call our callback function with the accumulator variable, the current element kValue, the current index k, and our input O, then assign that value to the accumulator variable
    iv. If there was any problem calling the callback, return
  e. Increase our counter variable by one
11. We're done! Return the accumulator variable
```

That ended up much longer than it needs to be, in part because the specification is very specific.  Let's put this in broad brush strokes:

```
1. Make sure we have an object with length, a callback function, and a value to start with
2. Loop through the rest of the values and update the accumulator variable with the result of our callback function called with the accumulator and the value
3. Return the accumulator variable
```

That doesn't look so bad!  If you're looking for an interesting exercise, try writing your own reduce function.  Here's one way to do it in JavaScript:

```
function reduce (input, callback, initialValue) {
  let O = input;
  const inputLength = O.length;


  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  if (!inputLength && !initialValue && initialValue !== 0) {
    throw new TypeError('We need an initial value');
  }

  let k = 0;

  let accumulator;
  let Pk;
  let kPresent;

  if (initialValue) {
    accumulator = initialValue;
  } else {
    kPresent = false;
    while (!kPresent && k < inputLength) {
      Pk = String(k);
      kPresent = O.hasOwnProperty(Pk);

      if (kPresent) {
        accumulator = O[Pk];
      }
      k++;
    }

    if (!kPresent) {
      throw new TypeError('If no initial value is given, the input must have a value to use as the initial value');
    }
  }

  while (k < inputLength) {
    Pk = String(k);
    kPresent = O.hasOwnProperty(Pk);

    if (kPresent) {
      let kValue = O[Pk];
      accumulator = callback(accumulator, kValue, k, O);
    }

    k++;
  }

  return accumulator;
}


console.log(reduce([1, 2, 3], (total, current) => total + current));
> 6

console.log(reduce([1, 2, 3], (total, current) => total + current, 10));
> 16
```

Success!

If you've written your own, I highly recommend comparing to both my version and the [MDN Polyfill version](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Polyfill).  What's different? What choices did you make that are different?
