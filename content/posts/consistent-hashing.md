---
title: "Visualizing Consistent Hashing"
subtitle: "White board drawings, interactive JavaScript, and tail-eating serpents"
date: 2019-12-08T18:25:50-05:00
draft: true
---


<img src="Serpiente_alquimica.jpg" alt="Snake eating its own tail" width="400"/>
<center>
*An [Ouroboros](https://en.wikipedia.org/wiki/Ouroboros): a serpent eating its own tail.*
</center>

In-this post I'll be explaining and drawing consistent hashing. [Feel free to skip to the bottom](#ok-alex-but-i-m-sick-of-whiteboard-pictures-and-i-learn-best-by-pressing-buttons) to try out the visualization at any point as well.

### Preface

Generalized writing about tech is tricky because it's so important to tie the explanation to the reader's background. To be safe, I'll assume a general familiarity with hashing and thinking like a computer. This lets the less advanced reader build context and note terms to review, while more advanced readers can skip the post entirely or [point out mistakes](https://en.wikipedia.org/wiki/Ward_Cunningham#Cunningham's_Law). Everyone wins!

As with code, one of the best ways to learn is to look at the source. I recommend taking a look at the [original  paper](https://www.akamai.com/us/en/multimedia/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf) that introduced consistent hashing.

### Background

Hashing is the classic game of finding an appropriate bucket for a certain value.

There are many ways to hash values. One of the easiest is with a simple [modulo](https://en.wikipedia.org/wiki/Modulo_operation) function:

x -> ax + b (mod p)

### The problem

We can take a look at the original problem presented in the paper:

> Consider a single server that has a large number of objects that other clients might want to access.  It is natural to introduce a layer of caches between the clients and the server in order to reduce the load on the server.  In such a scheme, the objects should be distributed across the caches, so that each is responsible for a roughly equal share.  In addition, clients need to know which cache to query for a specific object.  The obvious approach is hashing.  The server can use a hash function that evenly distributes the objects across the caches.  Clients can use the hash function to discover which cache stores an object.

We can also look at what that would look like visually.

TODO: insert picture 1

Note: maybe instead of X, Y, Z, we use actual values (ex. 27, 51) such that they're distributed to the different modulo buckets.

- Talk about hash function: when client wants X, it hashes X, gets 1. It knows to visit cache 1.
- When the server caches an object Z, it hashes Z, gets 3, and stores it in cache 3.

x -> ax + b (mod p)

What's the problem with the modulo function? Well, to distribute evenly to all of our caches, we would want to use a modulo that matched the number of caches. In the example above, we'd use 3, since that would clamp any integer to the range [0, 2]. This would ensure that all caches got values and that values wouldn't extend past the caches available.

The problem comes when we have add a new cache.

Let's say we add another cache to our group. In order to effectively distribute traffic to all nodes, we'd need to change our hash function to be modulo 4 instead.

The problem is that keys we may have stored initially using our mod 3 hash function would now be placed into a different bucket with our modulo 4 function. Let's look at those keys from before:

<Whiteboard picture of before/after hashing>

Every key that would now be hashed to a difference destination because of the new modulo needs to be moved to the new position. If this is a lot of keys, then we may have a lot of data to move around, all just because we added an additional cache.

### Consistent hashing

Consistent hashing is the idea that instead of having a direct mapping of hash output to bucket, we instead have both cache and key map to a continuous range. Once we know where all of our caches are on the range, when we hash a key, we can select the closest cache for that key.

Here's a basic way to do this: have everything map to the continuous range of real numbers [0, 1], then have every cache be responsible for the values since the previous node.

<Drawing of range [0,1] with buckets in different positions>

If Alice hashes to 0.3, Bob hashes to 0.8, and Carol hashes to 0.5, then we can assign responsibility for the ranges as follows:

<Drawing of range [0, 1] with buckets in different positions and responsibilities marked>


Now, if we were trying to find the cache responsible for a key that hashed to 0.4, we would cache the key to find its position in the range, then walk forward to find the next cache.

<Previous drawing with a key being hashed and walking to find the solution>

This works for most of the range, but what about the range from (0.8, 1]? One way to cover those values is to wrap the responsibility around the end of the range: make the next cache from 0 responsible for it.

<Drawing of range [0, 1] with buckets in different positions and responsibilities marked>

Since Alice is now covering that later bit, we can also visualize it as the responsibility "wrapping" around the end of the range.

<Drawing of range [0, 1] as circle with buckets in different positions and responsibilities marked>

This is pretty similar to visualizations of modulo arithmetic, where the values wrap around, but importantly this is a visualization of the areas of responsibility for each node. You can kind of think about it as the first node reaching back to the tail end to take over that range, much like the serpent above.

What's the difference from before? The main idea is that as we add a cache to our group of caches, we don't have to update most of the existing keys. Let's see what happens when we add David, a new node. Let's say David hashes to 0.6. We can add the node to the range to see what ranges would need to be updated.

<Drawing of range [0, 1] as circle with new node D and responsibilities marked>

The new range that David covers, 0.5-0.6 market in blue on the drawing, was previously covered by Bob. This means that all of the keys that used to be covered by Bob are now covered by David, so we do have to move all of those files over to Bob. Importantly though, it's only the keys that fall within this updated range that have to be updated. Alice's keys aren't touched, Carol's key's aren't touched, and even most of Bob's keys aren't touched.

This means that as we add or remove nodes from our system, especially when we have a ton of nodes, we probably won't have to do a big reshuffle affecting most of our keys. This really comes down to the decoupling of the connection between the key hash result and the cache hash result; instead of being a 1:1 mapping of key->bucket, we've instead added a middle layer of the range [0, 1] that we can map each to and use accordingly.

### OK Alex but I'm sick of whiteboard pictures and I learn best by pressing buttons

I've drawn the continuous range [0,1] wrapping around as a circle, and you can press the buttons to add/remove nodes. Nodes will cover the range of numbers to the node behind them. You can click on the nodes (on mobile, too) to visualize the range of values that each covers.

<div style="display:flex; justify-content:center; align-items:center;">
<svg id="container" height="600" width="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
</svg>
</div>
<div style="display:flex;">
<button id="add-node" style="flex:1 1 auto; height: 40px; font-size: 20px;">
  Add node
</button>
<button id="remove-node" style="flex:1 1 auto; height: 40px; font-size: 20px;">
  Remove node
</button>
</div>
<script src="script.js"></script>

You can see the code for this visualization [here](script.js).



While I've used some naive checks for range checking and generating the random position of the new node, it's possible to do both intelligently to speed things up, keep things as spread out as possible, and distribute the load across caches that have different powers. I'll be diving into these topics more in a future post about Dynamo, so look for that in a future post.



