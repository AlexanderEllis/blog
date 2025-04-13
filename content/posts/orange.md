---
title: "How much oranger do red orange bags make oranges look?"
date: 2025-04-13T00:39:45-04:00
draft: false
tags: [ 'Human-Citrus Interaction' ]
---

Look at this orange:

![Picture of an orange without the orange bag that they come in](orange-3-without.jpeg)

Now look at this orange:

![Picture of an orange with the orange bag that they come in](orange-3-with.jpeg)

It's the same orange.

But, look how much more orange it looks with the red mesh on top of it:

![gif going back and forth between the two](orange-3.gif)

If you buy bags of oranges (at least at many places in the US), they frequently come in this red mesh bag. This bag
makes the
oranges look more orange. Oranger.

Here's what that looks like at a local grocery store[^1]:

![Picture of Sumo oranges for sale at Trader Joe's, with one bin in bags and the other bin just individual oranges](oranges-at-trader-joes.jpg)

Ripe oranges are usually oranger, so this bag makes the oranges look better than they may actually be. Maybe the secret
is to never buy bagged fruit, since it's harder to evaluate the quality of each orange.[^2]


<style>
table td, table th {
  width: 150px;
  text-align: center;
}
</style>

This made me wonder — how does the bag change how we perceive the color?

I thought this difference would be visible if we did some quick and tricky digital math: what if we had a picture of the
orange with and without the bag under the same light and camera conditions, then checked the average pixel?

Here are the results from 11 different orange photos, with and without the mesh:

| Orange      | Without bag                                                                  | With bag                                                                  | Avg. color without                                                          | Avg. color with                                                             |
|-------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| <h2>1</h2>  | <img src="cropped/orange-1-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-1-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #D0530A;"></div> | <div style="width: 100px; height: 100px; background-color: #B9310A;"></div> |
| <h2>2</h2>  | <img src="cropped/orange-2-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-2-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #B23C07;"></div> | <div style="width: 100px; height: 100px; background-color: #C1370A;"></div> |
| <h2>3</h2>  | <img src="cropped/orange-3-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-3-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #D0570D;"></div> | <div style="width: 100px; height: 100px; background-color: #CB3E0D;"></div> |
| <h2>4</h2>  | <img src="cropped/orange-4-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-4-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #D0570D;"></div> | <div style="width: 100px; height: 100px; background-color: #CB3E0D;"></div> |
| <h2>5</h2>  | <img src="cropped/orange-5-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-5-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #982606;"></div> | <div style="width: 100px; height: 100px; background-color: #A82808;"></div> |
| <h2>6</h2>  | <img src="cropped/orange-6-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-6-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #9A2B05;"></div> | <div style="width: 100px; height: 100px; background-color: #A22406;"></div> |
| <h2>7</h2>  | <img src="cropped/orange-7-without-cropped.jpeg" width="100" height="100"/>  | <img src="cropped/orange-7-with-cropped.jpeg" width="100" height="100"/>  | <div style="width: 100px; height: 100px; background-color: #982207;"></div> | <div style="width: 100px; height: 100px; background-color: #A21E09;"></div> |
| <h2>8</h2>  | <img src="cropped/orange-10-without-cropped.jpeg" width="100" height="100"/> | <img src="cropped/orange-10-with-cropped.jpeg" width="100" height="100"/> | <div style="width: 100px; height: 100px; background-color: #D55B0B;"></div> | <div style="width: 100px; height: 100px; background-color: #D73A08;"></div> |
| <h2>9</h2>  | <img src="cropped/orange-11-without-cropped.jpeg" width="100" height="100"/> | <img src="cropped/orange-11-with-cropped.jpeg" width="100" height="100"/> | <div style="width: 100px; height: 100px; background-color: #E3550C;"></div> | <div style="width: 100px; height: 100px; background-color: #CE3507;"></div> |
| <h2>10</h2> | <img src="cropped/orange-12-without-cropped.jpeg" width="100" height="100"/> | <img src="cropped/orange-12-with-cropped.jpeg" width="100" height="100"/> | <div style="width: 100px; height: 100px; background-color: #C1500A;"></div> | <div style="width: 100px; height: 100px; background-color: #BD3C09;"></div> |
| <h2>11</h2> | <img src="cropped/orange-13-without-cropped.jpeg" width="100" height="100"/> | <img src="cropped/orange-13-with-cropped.jpeg" width="100" height="100"/> | <div style="width: 100px; height: 100px; background-color: #C7500B;"></div> | <div style="width: 100px; height: 100px; background-color: #B73E09;"></div> |

There are a few interesting things here. First, the average pixel is not what I would expect it to be at all, to be
honest. I even ran the average pixel calculation a second time with more advanced calculations, including some
orange-only-masking to avoid non-orange colors, but I got similar results. They're all much more brown than my eyes
would assume when I look at the images.

Weirdly, that kind of makes sense when you look at each image closely. Here's a **big trypophobia warning**, but you can
open the spoiler below.

<details>
  <summary>Click to see a close up photo of orange skin, which is kinda weird to be honest</summary>
  <img src="cropped/orange-1-without-cropped.jpeg"/>
  <p>Look how much brown there really is when you look closely! Also, kind of gross.</p>
</details>


<br>

Kinda weird, right? This kind of makes sense though — this whole thing was motivated by the feeling that our eyes are
tricked by colors, so it makes sense that our eyes are much less analytical than my computer averaging over all of the
pixels.

The other interesting thing is that the addition of the red mesh clearly adds a warmth to each of the average colors.
We can see a clear shift, even for those showing up as brown.

We see the RGB shift mostly in the green, interestingly enough. The average change to RGB values is around (-15, -20,
-4) with the bag, with some larger shifts in the green. That's a little hard to visualize, but that's the difference
between this first pale yellow and the second, more robust orange:

<div style="width: 100px; height: 100px; background-color: rgb(242, 197, 38);"></div>
<div style="width: 100px; height: 100px; background-color: rgb(222, 167, 32);"></div>

<br>

OK, maybe not exactly a robust orange, and not exactly more appetizing, but again, I think our mind is probably playing
more
tricks on us. There's also probably a better way to think about color shifts that I'm not familiar with, but even as a
basic
measure, we can see this clear shift with the average pixels side by side.

Of course, as expected,
eyes [are](https://photo.stackexchange.com/questions/10208/how-many-colors-and-shades-can-the-human-eye-distinguish-in-a-single-scene) [incredibly](https://labs.psych.unr.edu/websterlab/Research.html) [complex](https://www.aao.org/eye-health/tips-prevention/how-humans-see-in-color),
and the answer is much more nuanced than the average pixel value: our eyes adapt to the environment, remember the color
of things, and change dynamically.

Given that the trick is happening in our eyes, I think a better experiment would be a human-focused experiment for how
we perceive the average color. Maybe we could have two groups, with bag and without, and we show them the cropped photos
and have them pick the average (or most dominant?) color they perceive in the photo. We'd then be able to compare across
the groups to confirm that the with-bag photos skew redder.

Maybe another day. I think I've already been staring at pictures of oranges for too long.

## Anyways, here's how I set this up.

![My experimental setup for taking photos of oranges, with my dog looking on](experimental-setup.jpg)
*The experimental setup, with the author's attentive assistant*

I took 11 different photos of various oranges in the same position, with and without the red mesh, and cropped the same
section of each photo.

I found the pixel locations of the square I wanted, then I translated those coordinates into specific offsets for a
`sips` command (Scriptable Image Processing System), which I learned about today. It made this programmatic cropping
very easy. For example, cropping two photos of Orange 1 in the same position, with and without mesh, as two files,
`orange-1-with.jpeg` and `orange-1-without.jpeg`:

```
for f in orange-1*.jpeg; 
  do sips -c 788 740 --cropOffset 1519 1083 "$f"; 
done
```

This let me go from these two photos:

<img src="orange-1-with.jpeg" width="300"/>

<br>

<img src="orange-1-without.jpeg" width="300"/>

To these two photos

<img src="cropped/orange-1-with-cropped.jpeg" width="200"/>

<br>

<img src="cropped/orange-1-without-cropped.jpeg" width="200"/>

<br>

Assuming I put the mesh on without disturbing the orange, this meant that we would be doing an exact comparison between
the two.

After I did this for all of the photos, with and without mesh, I then used `magick` to calculate the average pixel
value:

```
$ for f in *-cropped.jpeg; 
>   do   echo -n "$f: ";   
>   magick "$f" -resize 1x1 txt:- | grep -o '#[A-Fa-f0-9]\{6\}'; 
> done
orange-1-with-cropped.jpeg: #B9310A
orange-1-without-cropped.jpeg: #D0530A
...
```

Pretty neat!

Once I found that everything was showing up a lot more brown, I also experimented with a basic Python script that
leveraged OpenCV. This script creates a mask for each image that excludes non-orange-ish pixels, defined by a range that
I define. It can then take the average over just the orange pixels that fall outside of the mask.

```python
for file in files:
    image = cv2.imread(file)

    # Convert to HSV color space (better for color detection)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Define the range for orange in HSV. This took some tinkering to get the right values.
    lower_orange = np.array([3, 150, 150])
    upper_orange = np.array([20, 255, 255])

    # Mask the image to get only the orange parts.
    mask = cv2.inRange(hsv, lower_orange, upper_orange)
    orange_pixels = cv2.bitwise_and(image, image, mask=mask)

    # For debugging, I saved the binary mask to visualize them.
    mask_filename = os.path.join(output_mask_dir, os.path.basename(file).replace(".jpeg", "_mask.png"))
    cv2.imwrite(mask_filename, mask)

    # I also saved just the orange parts to visualize it.
    orange_only_filename = os.path.join(output_orange_only_dir, os.path.basename(file).replace(".jpeg", "_orange.png"))
    cv2.imwrite(orange_only_filename, orange_pixels)

    # Now, take the mean of the orange pixels with the mask, which means we're (hopefully) ignoring all of the browner 
    # pixels when calculating the mean.
    bgr_avg = cv2.mean(orange_pixels, mask=mask)[:3]
    # Then, translate to RGB (and HSV for debugging).
    rgb_avg = tuple(reversed(bgr_avg))
    hsv_avg = cv2.cvtColor(np.uint8([[bgr_avg]]), cv2.COLOR_BGR2HSV)[0][0]

    print(file, "Average RGB orange color:", rgb_avg, "HSV:", hsv_avg)
```

This was pretty neat, because it meant that I could mask away any non-orange pixels (like very dark shadows). That ended
up looking something like this, with the original photo, the mask, and just the orange parts that would be used for the
average:

<img src="cropped/orange-5-with-cropped.jpeg" width="300"/>
<br>
<img src="masks/orange-5-with-cropped_mask.png" width="300"/>
<br>
<img src="orange_only/orange-5-with-cropped_orange.png" width="300"/>
<br>

I must confess, I was cheating and trying to get the CSS boxes in the table above to look more orange. This isn't how
our eyes work, and these ended up looking more muted anyways. Maybe because I messed something up in
the translation? The average pixel values ended up being very, very similar though, so I ended up just using the
`magick` ones in the table above. Fun to experiment with though![^3]

This was also a great example of how much easier this experimentation is with LLMs — being able to easily discover tools
for cropping or pixel evaluation meant that the time from idea to proof of concept was very, very short.

-----

Even with these lackluster brown average pixels, I'm convinced that the red mesh bags make the oranges look oranger.
It's not big enough to call the FTC for, but it is an effective little trick, a small ripeness deception that we all
have to live with.

[^1]: This post is not affiliated with [Sumo Citrus](https://sumocitrus.com/), though the author would be very
interested in a sponsorship deal.

[^2]: Stores also do this with green bags for avocados, and others. That'll be the follow up paper that cites this one.

[^3]: New addition to the resume: "proficient in computer vision"
