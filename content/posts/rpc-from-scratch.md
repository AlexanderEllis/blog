---
title: "Writing an RPC From Scratch"
subtitle: "...so you can appreciate the libraries that do it for you"
date: 2021-04-18T13:15:13-04:00
draft: false
---


There are many ways for computers to talk to other computers. A commonly used approach is a Remote Procedure Call, or an RPC. An RPC allows for the abstraction of calling another computer's procedure as if it were a local one with all of the transmission and communication taken care of.

Let's say we're writing some math program on a single computer and we have some procedure or function that handles checking if a number is prime. We can use this function as we'd like, passing it numbers and getting an answer, and it can live in our computer.

![The is_prime function as a library](is-prime-as-library.png)

This is fine, and for doing many things, it's very helpful to keep things nearby. It's easy to call, and since it's right alongside the rest of our code, there's nearly no delay when we have to send it numbers.

But, there are cases when it isn't as helpful to keep it local. Maybe we want to have it run on a really powerful computer with many cores and lots of memory so it can check really, really big numbers. Well, that's not so bad. We can run our main program on this big computer as well, so even though the rest of the program might not need it, the prime finder can use as much of the computer as it can.  What if we want to let other programs reuse the prime finder? We could make it a library that we can share between programs, but we might need a lot of memory resources for every computer that runs the prime finding library.

What if we just ran the prime function on a separate computer, then talked to that computer when we needed to check a number? That way, we can beef up this prime finder computer, and we can share it with other programs running on other computers.

![The is_prime function living on a powerful computer as part of a distributed network ](is-prime-on-big-computer.png)

The downside here is more complexity. Computers fail, networks are unreliable, and we have to worry about sending the answer back and forth. If you're just writing a math program, you may not want to worry about network details, resending lost packets, or even how to find the computer that's running the prime finder. If your job is writing the best prime-finding program, you may not want to worry about how to listen for requests or check for closed sockets.

This is where remote procedure calls come into play. We can wrap the complexity of inter-computer communication in the center, and we can surface a simple interface, called a *stub*, to either side of the conversation. To the math-program writer, we can make it look like you're just calling the function that lives on the other computer. To the prime-finding program writer, we can just make it look like your function is being called. If we abstract away the middle, each side can focus on their respective details while still being able to enjoy the benefit of splitting this computation across multiple computers.

![The is_prime function living on a powerful computer as part of a distributed network ](is-prime-distributed-with-stubs.png)

The main job of an RPC call is to handle this middle section. Part of it has to live on the math program computer, where it has to take the arguments, package them, and send them to the other computer. When it gets a response, it has to unpackage it and pass it back. The part that lives on the prime finder computer has to wait for requests, unpackage the arguments, pass them to the function, get the result, package it, and send it back to whoever asked for it. Importantly, both the math program and the prime finder program have a clean interface between them and their respective stubs that allows for this abstraction.

![RPC components.](RPC-diagram.png)
<center>
<em>Diagram from Implementing Remote Procedure Calls, Birrell & Nelson, 1981</em>
</center>
<br>

For more details, I'd highly recommend the 1981 paper *Implementing Remote Procedure Calls* by Andrew D. Birrell and Bruce Jay Nelson[^2], where they walk through the use of RPCs at Xerox PARC.

<br>

### Writing an RPC from scratch...

What would this look like if we tried to write it?

(With a big old caveat that I'm far from an expert in C, but I can scratch enough down with a toy problem to (hopefully) get a concept across. Imagine a big asterisk after nearly every line that says "would be different for production code". These examples are very much inspired by Beej's Guide to Network Programming[^1].)

We can start with our basic math program. Maybe for the sake of simplicity, it's a command line tool that takes some input and checks whether or not it's prime. It has a separate method, `is_prime`, for the actual checking.

{{< snippet "content/posts/rpc-from-scratch/basic-math-program/basic_math_program.c" >}}

OK, some potential issues there, and the author clearly didn't handle all edge cases, but maybe they had some pressing deadlines. Either way, it's using this function, and it looks like it's working pretty well:

![Running basic_math_program.c; says 31 is prime](basic-math-program.png)

So far so good. Maybe we want to split this up into different files, so `is_prime` would be reusable between programs on the same computer. That's easy enough. Let's start by making a separate library for `is_prime`:


{{< snippet "content/posts/rpc-from-scratch/basic-math-refactored/is_prime.h" >}}
{{< snippet "content/posts/rpc-from-scratch/basic-math-refactored/is_prime.c" >}}

We can now include it and call it from our main program:

{{< snippet "content/posts/rpc-from-scratch/basic-math-refactored/basic_math_program_refactored.c" >}}

Trying it again, it looks like it still works! Though it would have been nice if the original author had written some tests...

![Running basic_math_program_refactored.c; still says 31 is prime](basic-math-program-refactored.png)

This is OK so far, but now we've come to that junction we mentioned earlier, where we want to distribute this across computers. We need to write the following:

- Caller stub, which has to...
  - Pack the argument
  - Transmit argument
  - Receive the result
  - Unpack the result
- Callee stub, which has to...
  - Receive the argument
  - Unpack argument
  - Call the function
  - Pack the result
  - Transmit the result

<br>

Our example is a pretty simple one, since we're just packing and sending a single `int` as the argument and receiving a single byte as a result. For the caller library, we can pack the data, create a socket, connect to a host (let's assume localhost for now), send the data, wait to receive, unpack, and then return. Here's what the header file looks like for the caller library:

{{< snippet "content/posts/rpc-from-scratch/is-prime-rpc/client/is_prime_rpc_client.h" >}}

The astute (or just conscious) reader will notice that the interface is actually the exact same as when it was just the library, and this is the point! The caller doesn't have to worry about anything other than the business logic it's trying to send (but see caveats below). The implementation, on the other hand, is a little more complex:

{{< snippet "content/posts/rpc-from-scratch/is-prime-rpc/client/is_prime_rpc_client.c" >}}

As mentioned earlier, this client code needs to pack the argument, connect to the server, send the data, receive the data, unpack it, and return it. This is relatively simple for our example, since we just need to ensure the byte order of the number is in the network order.

Next, we need to run the callee library on the server. It will call the `is_prime` library we wrote earlier, which now lives entirely on the server.

{{< snippet "content/posts/rpc-from-scratch/is-prime-rpc/server/is_prime_rpc_server.c" >}}

Finally, we can update our main function that runs on the client to use the new RPC library call:

{{< snippet "content/posts/rpc-from-scratch/is-prime-rpc/client/basic_math_program_distributed.c" >}}


The RPC in action:

{{< video webmSrc="basic-math-distributed-animated.webm" mp4Src="basic-math-distributed-animated.mp4" >}}

<br>

If we run the server, we can run the client to distribute our prime check! Now, when the program is calling `is_prime_rpc`, all network business happens in the background. We've successfully distributed the computation, and the client really is calling a remote procedure.


<br>



### ...so you can appreciate the libraries


This is a toy example, and although it shows some of the ideas, it's really only a toy. Real frameworks (such as gRPC[^3]) are understandably much more complex. Our implementation could use (at least) the following improvements:

- **Discoverability**: in the toy example above, we assumed the server was running on `localhost`. How would the RPC library know where to send the RPC? We would need some way to discover where the servers that can handle this RPC call live.
- **RPC type**: we're dealing with a very simple server for a single RPC call. What if we wanted our server to serve two different RPCs, e.g. `is_prime` and `get_factors`? We would need a way to differentiate between the two in the requests that we're sending to the server.
- **Packing**: Packing an integer is easy, and packing a single byte is even easier. What if we had a complicated data structure we wanted to send across the wire? What if we wanted to compress the data to save some bandwidth?
- **Generating code automatically**: we don't want to hand write all of the packing and networking code every time we write a new RPC. It would be great if we could just define our interface once and let the computer do the work for us, giving us just the stub to work with. This is where something like protocol buffers[^4] come into play.
- **Multiple languages**: along the previous lines, if we're automatically generating the stubs, we might as well let it generate it in multiple languages, so cross-service and cross-language communication is still as easy as calling a function.
- **Error & timeout handling**: what happens if the RPC fails? What if the network goes down, the server stops, the wifi drops... What if we want to have a timeout to ensure we're not waiting all day?
- **Versioning**: let's say you have all of the above, but you want to make a change to an RPC call that already has code generated and is running on multiple computers. How do you do it safely?
- **All of the other caveats that go along with running servers**: threading, blocking, multiplexing, security, encryption, authorization...

<br>

Computer science is the business of standing on the shoulders of those that have come before us. It's things like this that make you appreciate the libraries that do a lot of work for us already.



[^1]: [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/)
[^2]: [*Implementing Remote Procedure Calls*, Andrew D. Birrell and Bruce Jay Nelson](http://web.eecs.umich.edu/~mosharaf/Readings/RPC.pdf)
[^3]: [gRPC: "a modern open source high performance Remote Procedure Call (RPC) framework"](https://grpc.io/)
[^4]: [Protocol Buffers](https://developers.google.com/protocol-buffers)