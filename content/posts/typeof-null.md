---
title: "typeof null: investigating a classic JavaScript bug"
date: 2018-03-19T08:40:17-04:00
tags: ['javascript']
draft: false
---

In my last post, I looked into some JavaScript casting and explored why `0 <= null` evaluates as true.

For this post, I'd like to investigate another unexpected behavior in JavaScript: why `typeof(null)` evaluates as `'object'`.

This is a [well-known bug](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof), and we'll investigate first in the ECMAScript specification followed by a deep dive into an early implementation of JavaScript to see the bug in its natural habitat.

The main idea is that the code assigned each item some bits for use as flags for different types, but _null_ was different.  Objects had a flag of `000`, so an object's last 3 bits were `000`.  _null_ was previously defined as 32 `0` bits: `00000000000000000000000000000000`.  When the code tried to check _null_'s flag, the last three bits of _null_ (`000`) matched the Object flag (`000`), so it was incorrectly determined to be an object.

Let's take a deeper look!

As before, for a proper background and preparation for this post, please watch (or rewatch!) [wat](https://www.destroyallsoftware.com/talks/wat).

--------

To start, let's take a look at the [ECMAScript spec for typeof](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-typeof-operator):

```
The typeof Operator

Runtime Semantics: Evaluation

UnaryExpression : typeof UnaryExpression

1. Let val be the result of evaluating UnaryExpression.
2. If Type(val) is Reference, then
  a. If IsUnresolvableReference(val) is true, return "undefined".
3. Set val to ? GetValue(val).
4. Return a String according to Table 35.
```

So when we call `typeof null`, _null_ is passed in as the UnaryExpression.  It is evaluated in step 1, and val gets its value, _null_.  Type(null) evaluates to the [Null type](https://www.ecma-international.org/ecma-262/8.0/index.html#sec-terms-and-definitions-null-type), so Type(val) is not Reference and step 2 is false.  Next, step 3 calls GetValue on _null_.  We saw get value before, but let's take another look to confirm nothing odd is going on:

```
GetValue ( V )

1. ReturnIfAbrupt(V).
2. If Type(V) is not Reference, return V.
3. Let base be GetBase(V).
4. If IsUnresolvableReference(V) is true, throw a ReferenceError exception.
5. If IsPropertyReference(V) is true, then
  a. If HasPrimitiveBase(V) is true, then
    i. Assert: In this case, base will never be undefined or null.
    ii. Set base to ! ToObject(base).
  b. Return ? base.[[Get]](GetReferencedName(V), GetThisValue(V)).
6. Else base must be an Environment Record,
  a. Return ? base.GetBindingValue(GetReferencedName(V), IsStrictReference(V)) (see 8.1.1).
```

Calling GetValue with _null_ will only reach the second step, as Type(null) is the Null type, and GetValue will return _null_.

Finally we reach step 4: "Return a String according to Table 35."  Here's Table 35:

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

Not very illuminating.  It says that `typeof null` should just return the string `'object'`.  But why?  Let's dive a little deeper.

I came across the [2ality post about the history of `typeof null`](http://2ality.com/2013/10/typeof-null.html), and it answers the question very well with reference to an early implementation.  As Brendan Eich wrote in the top comment, the code comes from the 1996 Spider Monkey implementation, not the very original 10-day Mocha, although the bug existed in the original as well.  Let's take a look!

Although the link from that post is deprecated, we can still see the classic version of the code on https://dxr.mozilla.org/classic/source/js/src/.

Two main C files will be of interest here at first: `classic/js/src/jsapi.h` and `classic/js/src/jsapi.c`.  Let's take a look at the relevant part of `jsapi.c` first:

```
JS_PUBLIC_API(JSType)
JS_TypeOfValue(JSContext *cx, jsval v)
{
    JSType type = JSTYPE_VOID;
    JSObject *obj;
    JSObjectOps *ops;
    JSClass *clasp;

    CHECK_REQUEST(cx);
    if (JSVAL_IS_VOID(v)) {
        type = JSTYPE_VOID;
    } else if (JSVAL_IS_OBJECT(v)) {
        obj = JSVAL_TO_OBJECT(v);
        if (obj &&
            (ops = obj->map->ops,
             ops == &js_ObjectOps
             ? (clasp = OBJ_GET_CLASS(cx, obj),
                clasp->call || clasp == &js_FunctionClass)
             : ops->call != 0)) {
            type = JSTYPE_FUNCTION;
        } else {
            type = JSTYPE_OBJECT;
        }
    } else if (JSVAL_IS_NUMBER(v)) {
        type = JSTYPE_NUMBER;
    } else if (JSVAL_IS_STRING(v)) {
        type = JSTYPE_STRING;
    } else if (JSVAL_IS_BOOLEAN(v)) {
        type = JSTYPE_BOOLEAN;
    }
    return type;
}
```

Let's walk through what this does.

First, it checks `JSVAL_IS_VOID(v)`.  That is defined in `jsapi.h` as follows:

```
#define JSVAL_IS_VOID(v)        ((v) == JSVAL_VOID)
```

And `JSVAL_VOID` is defined as:
```
#define JSVAL_VOID              INT_TO_JSVAL(0 - JSVAL_INT_POW2(30))
```

So the void value, what we know in JavaScript as `undefined`, is defined as `-(2^30)`, an integer outside of the integer range.  The `typeof` call first checks if that's what we're dealing with.  If so, the line `type = JSVAL_VOID` is called, and then that is returned.  Good so far!

If we aren't dealing with a void value, the code then evaluates `JSVAL_IS_OBJECT(v)`.  This is defined as follows in `jsapi.h`:

```
#define JSVAL_IS_OBJECT(v)      (JSVAL_TAG(v) == JSVAL_OBJECT)
```

So this checks a tag on the value and sees if it matches the object tag.  Here are the tag definitions from `jsapi.h`:

```
/*
 * Type tags stored in the low bits of a jsval.
 */
#define JSVAL_OBJECT            0x0     /* untagged reference to object */
#define JSVAL_INT               0x1     /* tagged 31-bit integer value */
#define JSVAL_DOUBLE            0x2     /* tagged reference to double */
#define JSVAL_STRING            0x4     /* tagged reference to string */
#define JSVAL_BOOLEAN           0x6     /* tagged boolean value */
```

This means that objects will have `000` as the bits for its tag, integers will have `001`, doubles will have `010`, strings will have `100`, and booleans will have `110`.

Here's `JSVAL_TAG` and its called `JSVAL_TAGMASK`:

```
#define JSVAL_TAGBITS           3
#define JSVAL_TAGMASK           JS_BITMASK(JSVAL_TAGBITS)
#define JSVAL_TAG(v)            ((v) & JSVAL_TAGMASK)
```


`JS_BITMASK` comes from a different file, [jstypes.h](https://dxr.mozilla.org/classic/source/js/src/jstypes.h), and it builds the correct value to bitmask against tag.  This means that it grabs the last 3 bits from the value, and those three bits correspond to the tag.

For instance, if we were working with a very simplified version with integers of 5 bit length and the last 3 bits were the tag, we may have a value like 00001001.  Here, the first 5 bits, **00001**, would correspond to the value, and the last 3 bits, **001**, wold be the tag (here, for an integer).  To get just the tag, we would do a bitwise AND comparison between our value `00001001` and a mask with 1s for the last three bits, `111`, to get just the tag, `001`.
```
Value:           00001001
Bitmask:         00000111
Value & bitmask: 00000001
```

So far so good!  Let's see what we can find about the _null_ value.  A quick search reveals the definition for _null_ from `jsapi.h`:

```
/*
 * Well-known JS values.  The extern'd variables are initialized when the
 * first JSContext is created by JS_NewContext (see below).
 */
#define JSVAL_VOID              INT_TO_JSVAL(0 - JSVAL_INT_POW2(30))
#define JSVAL_NULL              OBJECT_TO_JSVAL(0)
#define JSVAL_ZERO              INT_TO_JSVAL(0)
#define JSVAL_ONE               INT_TO_JSVAL(1)
#define JSVAL_FALSE             BOOLEAN_TO_JSVAL(JS_FALSE)
#define JSVAL_TRUE              BOOLEAN_TO_JSVAL(JS_TRUE)
```

Here, `JSVAL_NULL` is `OBJECT_TO_JSVAL(0)`.  Let's follow this down:

`jsapi.h`:
```
#define OBJECT_TO_JSVAL(obj)    ((jsval)(obj))
```

`jspubtd.h`:
```
typedef jsword    jsval;
```

`jscompat.h`:
```
typedef JSWord jsword;
```

`jstypes.h`:
```
/*
** A JSWord is an integer that is the same size as a void*
*/
typedef long JSWord;
typedef unsigned long JSUword;
```

This means that _null_, `OBJECT_TO_JSVAL(0)`, is actually just creating a `long` with just `0` as the value.  This is just `00000000000000000000000000000000` (32 bits, all 0).

Now, let's go back to our `JSVAL_IS_OBJECT` call
```
#define JSVAL_IS_OBJECT(v)      (JSVAL_TAG(v) == JSVAL_OBJECT)
```

Now, what happens if we call JS_TAG on our _null_ value?

```
Value:           00000000000000000000000000000000
Bitmask:         00000000000000000000000000000111
Value & bitmask: 00000000000000000000000000000000
```

No surprises there: this means that the resulting calculated tag is just `0x0`.

This is where we have the problem!  We then compare _null_'s calculated `0x0` tag with `JSVAL_OBJECT`, `0x0`.  They match!

This means our JS_TypeOfValue call then checks if its a function, and when it isn't, it assigns `type` to be `JSTYPE_OBJECT` and returns `type`.  `JSTYPE_OBJECT` is the string `'object'`, and we get `typeof null === 'object'`.

As mentioned in the 2ality blog, interestingly enough there _is_ a function (in this version of the code, at least) that checks for a _null_ value:

```
#define JSVAL_IS_NULL(v)        ((v) == JSVAL_NULL)
```

Maybe this was added in after the fact?  Maybe this was in there and overlooked?  Regardless, this bug was in the original, and it remains to this day.

>_"In general, typeof seems like a mess that will be hard to reform sensibly. "_
>
>— _Brendan Eich 2006/03/31 15:13_


---

Thanks to [Brendan Eich](https://brendaneich.com/) for writing JavaScript, Mozilla for hosting the classic code, and  [Dr. Axel Rauschmayer](http://2ality.com/p/about.html) for the very helpful blog post about this topic.









