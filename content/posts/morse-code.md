---
title: "Little games to play with Morse Code in your browser"
date: 2022-02-04T22:32:54-05:00
draft: false
---

*Be sure to also check out my other Morse code game, [Morse Codle](/posts/morse-codle), a daily Morse code Wordle puzzle.*

This is a pair of games for playing with Morse Code. Since the games play the signals as sound, I recommend headphones (wired if possible for the latency) and a low volume. Game options are available towards the bottom.

<link rel="stylesheet" href="styles.css">
<noscript>
  Unfortunately, JavaScript is needed to run these games. The only JS running on my site is for the games (no tracking, etc) if you want to enable it. The good news is that if you're disabling JavaScript, you probably already know some Morse Code :)
</noscript>

# Morse Code Listening Game

In this game, it will play a word in Morse Code, and you have to type in the word.

<br>
<div class="game-container">
  <button id="playListeningGame" class="start-button">Start</button>
  <br>
  <p id="status" class="display-message">Press Start to begin.</p>
  <input type="text" id="wordInput" class="input" placeholder="Enter message" autocomplete="off" disabled>
  <br>
  <div class="button-container">
    <button id="submitButton" class="interaction-button" disabled>Enter</button>
    <button id="resetButton" class="interaction-button" disabled>Replay</button>
  </div>
</div>

<br>
<br>

{{< detail-tag "How to play the listening game" >}}

<br>

As you hear the Morse Code, enter the letters (or words!) that you hear. Press Enter (either the button or on your keyboard) to see if you got it, and press Replay (or Control on your keyboard) to hear it again.

For doing Morse to letter lookups, I find it helpful to look at a tree-shaped diagram, where you can follow from one node to the next based on whether it's a dit or a dah.
<a href="https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg" target="blank_">
  ![Binary Tree-shaped diagram of letters and their corresponding Morse Code representation.](https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg)
</a>
[Source](https://commons.wikimedia.org/wiki/File:Morse-code-tree.svg)

{{< /detail-tag >}}

# Morse Code "Speaking" Game

For the speaking game, it will show a word, and you'll have to enter it in Morse Code.

<div class="game-container">
  <button id="playInputGame" class="start-button">Start</button>
  <p id="inputStatus" class="display-message"></p>
  <p id="targetDisplay" class="display-message">Press Start to begin.</p>
  <p id="inputDisplay" class="display-message morse-input"></p>
  <div class="button-container">
  <button id="signalButton" class="interaction-button" disabled>Tap</button>
  <button id="startOverButton" class="interaction-button" disabled>Try Again</button>
  </div>
</div>

<br>
<br>

{{< detail-tag "How to play the speaking game" >}}

Press start to reveal the target. Enter Morse Code with your spacebar or the Tap button. Press Control or the Try Again button to clear your input and start over.

The game will assume you're done with a letter after the letter gap interval (see options below), and it will automatically insert a space for you after the word interval; be careful you don't take too long in between dits!

For doing letter to Morse lookups, I find it helpful to look at an alphabetical list with the matching representation. This makes looking up a letter faster.
<a href="https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg" target="blank_">
  ![Alphabetical list of letters and their corresponding Morse Code representation](https://upload.wikimedia.org/wikipedia/commons/b/b5/International_Morse_Code.svg)
</a>
[Source](https://en.wikipedia.org/wiki/File:International_Morse_Code.svg)


{{< /detail-tag >}}


## Game options

After changing settings, you have to stop and restart the above games.

### Difficulty

<legend>Please select your preferred difficulty:</legend>
<div>
  <input type="radio" id="difficultyEasy"
    name="difficulty" value="easy" checked>
  <label for="difficultyEasy">Easy (letters)</label>
  <br>
  <input type="radio" id="difficultyMedium" name="difficulty" value="medium">
  <label for="difficultyMedium">Medium (short words)</label>
  <br>
  <input type="radio" id="difficultyHard" name="difficulty" value="hard">
  <label for="difficultyHard">Hard (multiple short words)</label>
  <br>
  <input type="radio" id="difficultyVeryHard" name="difficulty" value="really-hard">
  <label for="difficultyVeryHard">Very Hard (multiple words)</label>
</div>

<br>
<br>

### Speed

<legend>Please select your preferred speed:</legend>
<div>
  <input type="radio" id="speedEasy"
    name="speed" value="easy" checked>
  <label for="speedEasy">Slow</label>
  <br>
  <input type="radio" id="speedMedium" name="speed" value="medium" >
  <label for="speedMedium">Medium</label>
  <br>
  <input type="radio" id="speedHard" name="speed" value="hard">
  <label for="speedHard">Fast</label>
  <br>
  <input type="radio" id="speedHarder" name="speed" value="harder">
  <label for="speedHarder">Faster</label>
</div>

<br>


<legend>Use the Farnsworth method?</legend>
<div>
  <input type="radio" id="yesFarnsworth" name="farnsworth" value="yes" checked>
  <label for="yesFarnsworth">Yes</label>
  <br>
  <input type="radio" id="noFarnsworth"
    name="farnsworth" value="no">
  <label for="noFarnsworth">No</label>
</div>

<br>

The speeds match the following from Wikipedia:

*The duration of a dah is three times the duration of a dit. Each dit or dah within an encoded character is followed by a period of signal absence, called a space, equal to the dit duration. The letters of a word are separated by a space of duration equal to three dits, and words are separated by a space equal to seven dits.*

<div id="speed-table">

| Speed  | Dit (ms) | Dash (ms) | Letter gap (ms) | Word gap (ms) |
|--------|---------------|----------------|-----------------|---------------|
| Slow   |           300 |            900 |             900 |          2100 |
| Medium |           200 |            600 |             600 |          1400 |
| Fast   |           100 |            300 |             300 |           700 |
| Very Fast   |            60 |            180 |             180 |           420 |

</div>


But, that being said, the [Farnsworth method](https://www.google.com/search?q=Farnsworth+method) varies the intervals between the letters and the word gap instead of varying the length of the dits, dashes, or character gaps. It is more helpful for learning the sounds of each letter at a real speed you would hear it.

All times are in milliseconds. I recommend starting with slow and giving yourself plenty of time for the dahs, then increasing the speed as you go!

<br>

## Issues/questions

#### *Something went wrong?*

You may need to refresh — it's a little rough around the edges.

#### *Something went wrong on iOS?*

First, make sure your phone is unsilenced (turns out a silenced phone blocks the web audio APIs). You also may need to tap Start and Stop a few times, refresh, or start with the "speaking" game. I ran into an issue with initializing the AudioContext, and although I think I got it right, I'm sorry if it's giving you trouble.

#### *Why is it so quick with the spaces when listening?*

Sorry, it was easiest to be super strict about the timing when making it. Try slowing the speed down or practicing to go faster!

#### *How does it work?*

You can read about it [here](/posts/writing-morse-code-games), and you can see the source code [here](morse-code.js) and [here](constants.js), though it's very unpolished.

#### *Any recommendations for learning Morse Code for real?*

I'm far from an expert, but so far I've seen a few recommendations (thanks to curiousfab and SaberTail on HN):

- https://morsecode.world/international/trainer/trainer.html
- https://lcwo.net/
- http://www.elkins.org/


<script src="constants.js"></script>
<script src="morse-code.js"></script>
