---
title: "Funny artifacts in a 3D house scan"
date: 2022-07-30T13:16:31-04:00
draft: false
---

I like to window shop houses on Zillow. I really enjoy the recent trend of
3D interior scans, as they help give you a feeling for what the place is like,
and it allows for another way to explore the space without seeing it in person,
which is key for a good cross-country window shopping experience.

The other day, I was looking at a 4 story townhouse, and I noticed a few weird
things on its 3D model. These models are frequently weird to look at because of
the exterior wall artifacts, but this one was extra weird.

![A 3D scan of a house showing a bed floating outside the house](3d-house-scan.png)


Is that a bed floating in the void?

![A bed just floating outside the house in the void](floating-bed.png)

Why yes, I think it is! But the bed looks familiar: it's a weird copy of the
bed in the room next to it.

Is this the bed's shadow self? The Upside Down?

![The floating bed is very similar to the bed in the room](bed-duplicate.png)

I'll give you a moment to think about why this may be happening. When you're
ready, click the spoiler tag below.


{{< detail-tag "Spoiler: why there is a floating bed" >}}

<br>

{{< video webmSrc="floating-bed-screencast.webm" mp4Src="floating-bed-screencast.mp4" >}}

<br>

It looks like the 3D camera was bouncing its sensing waves off the mirror!
It saw a bed through the mirror, and it couldn't tell whether the thing it
saw was a real bed, maybe through a window, or a bed's reflection in the mirror.
Additionally, because the vantage point of the camera was a limited section of
the bed through the mirror, it thought it was a triangle shaped bed — the right
side of the ghost bed is truncated along the camera's line of sight at the edge
of the mirror.

Here's the position the camera was in when it was doing the 3D scan of this room:

![The camera's point of view, showing the bed in the mirror](mirror-view.png)

It's so cool that the camera can create a (mostly working) 3D model from just a
single vantage point, but you can see how important the additional scans are for
verifying and completing the models.

There are a few more in here, too, like these windows that are translated...
scarily.

{{< video webmSrc="scary-windows-screencast.webm" mp4Src="scary-windows-screencast.mp4" >}}



{{< /detail-tag >}}

[Here's a link if you want to play around with the 3D model yourself.](https://www.zillow.com/homedetails/397-Bunker-Hill-St-Charlestown-MA-02129/59212360_zpid/?mmlb=p,0) It's fun to think about how these things work!