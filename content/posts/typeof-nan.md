---
title: "typeof NaN: more unintuitive JavaScript behavior"
date: 2018-03-22T09:51:00-04:00
draft: true
---


In my last post, I talked about `typeof null` and why the early implementation led to an early bug being adopted as the required behavior.

In this post, I'd like to investigate `typeof NaN` and why it returns `'number'`.

-----

When you think of something that is not a number, what do you think it is?

JavaScript thinks it's a number.

Let's see why!

As in the last post, the ECMAScript spec only points us to this table:

| Type of val                                                  | Result                                                                                                   |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Undefined                                                    | "undefined"                                                                                              |
| Null                                                    | "object"                                                                                                   |
| Boolean                                                      | "boolean                                                                                                 |
| Number                                                       | "number"                                                                                                 |
| String                                                       | "string"                                                                                                 |
| Symbol                                                       | "symbol"                                                                                                 |
| Object (ordinary and does not implement [[Call]])            | "object"                                                                                                 |
| Object (standard exotic and does not implement [[Call]])     | "object"                                                                                                 |
| Object (implements [[Call]])                                 | "function                                                                                                |
| Object (non-standard exotic and does not implement [[Call]]) | Implementation-defined. Must not be "undefined", "boolean", "function", "number", "symbol", or "string". |

Once again, not very illuminating, but this tells us that NaN's type must be one of these on the left.  Let's take a deeper look!

Another search in the ECMAScript spec returns this [illuminating section](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-ecmascript-language-types-number-type) (emphasis added):

> 6.1.6 The Number Type
> The Number type has exactly 18437736874454810627 (that is, 2^64-2^53+3) values, representing the double-precision 64-bit format IEEE 754-2008 values as specified in the IEEE Standard for Binary Floating-Point Arithmetic, **except that the 9007199254740990 (that is, 2^53-2) distinct “Not-a-Number” values of the IEEE Standard are represented in ECMAScript as a single special NaN value. (Note that the NaN value is produced by the program expression NaN.)** In some implementations, external code might be able to detect a difference between various Not-a-Number values, but such behaviour is implementation-dependent; to ECMAScript code, all NaN values are indistinguishable from each other.

So in reality, it's a number!



// TODO: write blog post about this




