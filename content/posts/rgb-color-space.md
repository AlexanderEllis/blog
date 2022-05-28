---
title: "Playing with a 3D representation of RGB color space"
date: 2022-05-28T12:29:44-04:00
draft: false
---


I'm working on a color picking/finding game, and part of it will be asking the
user to pick a color from a range of colors. This got me thinking: what are some
ways we can represent RGB color space?

## RGB

One way to think of colors, especially colors on computers, is as a combination
of three different primary colors: **R**ed, **G**reen, and **B**lue. If we say
how much of each color we want, we can build a color from the values. For
example, maybe we want all Red and no Green or Blue - we could represent this as
(100%, 0%, 0%), corresponding to (R, G, B). That would look like this:

<div style="height: 100px; width: 100px; background-color: #ff0000"></div>

<br>

That's an OK red, but it gets more interesting when we mix in some other colors.
For instance, here's 100% red, 33% green, and 33% blue:

<div style="height: 100px; width: 100px; background-color: #ff5656"></div>

<br>

Now we're talking!

### 2D, but with a spectrum

If you Google "color picker", you get a widget that provides you with
a spectrum of colors to pick from. I think these are pretty intuitive, since
you're able to see what colors are close and similar to your colors. That
being said, it's a little unintuitive how the actual values map to the layout
on the grid - try clicking and dragging left and right, and see what the RGB values do.

![Screenshot of Google's default color picker](google-picker.png)
Give it a shot [here](https://www.google.com/search?q=color+picker).

The y-axis looks like it's red, as going up and down on the far left and far
right only changes the red value. But, go to the middle and go up and down, and
all three values change. Put your picker in the middle, then change the spectrum
from red to blue - you can see there are discrete sections where only one value
or another is increasing. The display is intuitive, but the numbers aren't!

## 3D RGB color space

Because each color is composed of those three separate values, you could imagine
it as if it were a 3D chart, with one axis for red, one axis for green, and one
axis for blue. As you go up to 100% for each axis, the color changes
accordingly.

![Color cube, with each color on a different axis](https://upload.wikimedia.org/wikipedia/commons/8/83/RGB_Cube_Show_lowgamma_cutout_b.png)
SharkD, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons

You could, if you wanted to, actually *make* one of these cubes. That's what
[Tauba Auerbach did in the RGB ColorspaceAtlas](https://taubaauerbach.com/view.php?id=286&alt=2945), where the pages in a
book correspond to a slice of that cube, so that every color in the entire space
is printed. Pretty neat!

### How do we see this represented?

Oftentimes when working with computers and colors, you'll want to pick a color
from a selection of colors. An interesting question here is how the colors are
represented — on one unhelpful end, we could just type in the color codes and
see the color, while on the other end, we'd somehow fly through the 3D color
space to find the right one. An interesting consideration is how well the
representation lets you compare the color you've chosen with its colorful
neighbors. If you're just typing in an exact number, you won't have any context
of the colors around it. If you're selecting from a spectrum, you'd have much
more context, though this gets interesting when you think in 3D.

As a side note, we usually talk about each color ranging from 0 to 255, with
each color represented by 8 bits. I'll use percentages below, but keep that in
mind for the actual code and color pickers.

### Exploring in 3D

Let's start with what looks like a very color picker, where you can pick a value
for each color and see how it changes. As you go through, you can also visualize
in the 3D space below, where one axis is for red, one is for green, and one is
for blue. I'll let you figure out which is which! Feel free to change the sliders
and see how the color changes.

For an extra bonus, try enabling DVD screensaver mode below — you can still mess with the
sliders while it's running.

<div style="display: flex;">
  <div id="slider-select" style="height: 100px; width: 100px; background-color: #7F7F7F"></div>
  <div style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 20px;">
    <div>
      <input type="range" id="red" name="red"
            min="0" max="100">
      <label for="red">Red: <span id="red-label">50</span>%</label>
    </div>
    <div>
      <input type="range" id="green" name="green"
            min="0" max="100">
      <label for="green">Green: <span id="green-label">50</span>%</label>
    </div>
    <div>
      <input type="range" id="blue" name="blue"
            min="0" max="100">
      <label for="blue">Blue: <span id="blue-label">50</span>%</label>
    </div>
  </div>
</div>


<br>

<div id="x3d-container"></div>

<fieldset>
    <legend>DVD screensaver mode:</legend>
    <div>
      <input type="radio" id="dvd-off" name="drone" value="off" checked onclick="handleRadioChange(this)">
      <label for="dvd-off">Off</label>
      <input type="radio" id="dvd-on" name="drone" value="on"
             onclick="handleRadioChange(this)">
      <label for="dvd-on">On</label>
    </div>
</fieldset>



<script src="https://x3dom.org/download/1.7/x3dom.js"></script>
<script src="https://d3js.org/d3.v4.0.0-alpha.28.min.js"></script>
<script src="d3-x3dom-axis.min.js"></script>
<script src="color-space.js"></script>


<br>

Not bad! It's almost like an ant crawling through the inside of that cube above,
reporting back the color it finds at each position.

But I think there are some key drawbacks with this single-color visualization:

- It's hard to visualize what changing a value does to the color, and you can't
  see the neighbors before you select the color.
- You're only able to see the exact color at a time, so searching is more
  difficult.
- You have three axes to change, but you're only able to do one slider at a
  time.
- DVD mode repeats itself frequently

<br>

I wonder what this could look like if you had a plane of color across two of the
axes, then adjusted the third axis? It would kind of be like fluidly switching
between pages in the book above.

This is already rambling enough, so I'll have to explore that another time :)

-----

You can see the source code [here](color-space.js), though it's very rough
around the edges. It's built with D3 and X3DOM, though it was mostly scraped
together from examples.




