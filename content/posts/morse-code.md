---
title: "Little games to learn Morse Code in your browser"
date: 2022-02-03T09:32:54-05:00
draft: false
---

This is a pair of games for playing with Morse Code. Before you begin, I'd recommend headphones and turning your volume down just in case.

Game options available at the bottom of the page.

<link rel="stylesheet" href="styles.css">
<noscript>
  Unfortunately, JavaScript is needed to run these games. The only JS running on my site is for the games (no tracking, etc) if you want to enable it. The good news is that if you're disabling JavaScript, you probably already know some Morse Code :)
</noscript>

# Morse Code Listening Game

In this game, it will play a word in Morse Code and you have to enter it right.

<br>
<div class="game-container">
  <button id="playListeningGame" class="start-button">Start</button>
  <br>
  <p id="status" class="display-message">Press Start to begin.</p>
  <input type="text" id="wordInput" class="input" placeholder="Enter message" autocomplete="off" disabled>
  <br>
  <div class="button-container">
    <button id="submitButton" class="interaction-button" disabled>Enter</buton>
    <button id="resetButton" class="interaction-button" disabled>Try again</buton>
  </div>
</div>

<br>
<br>

{{< detail-tag "How to play the listening game" >}}

<br>

As you hear the Morse Code, enter the letters (or words!) that you hear. Press Enter (either the button or on your keyboard) to see if you got it, and press Try Again (or Control on your keyboard) to reset your input and hear it again.

For doing Morse to letter lookups, I find it helpful to look at a tree-shaped diagram, where you can follow from one node to the next based on whether it's a dit or a dah.
<a href="https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg" target="blank_">
  ![Binary Tree-shaped diagram of letters and their corresponding Morse Code representation.](https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg)
</a>
[From here](https://commons.wikimedia.org/wiki/File:Morse-code-tree.svg)

{{< /detail-tag >}}

# Morse Code "Speaking" Game

For the speaking game, it will show a word, and you'll have to enter it in Morse Code.

<div class="game-container">
  <button id="playInputGame" class="start-button">Start</button>
  <p id="inputStatus" class="display-message"></p>
  <p id="targetDisplay" class="display-message">Press Start to begin.</p>
  <p id="inputDisplay" class="display-message morse-input"></p>
  <div class="button-container">
  <button id="signalButton" class="interaction-button" disabled>Tap</buton>
  <button id="startOverButton" class="interaction-button" disabled>Try Again</buton>
  </div>
</div>

<br>
<br>

{{< detail-tag "How to play the speaking game" >}}

Press start to reveal the target. Enter Morse Code with your spacebar or the Tap button. Press Control or the Try Again button to clear your input and start over.

The game will assume you're done with a letter after the letter gap interval (see options below), and it will automatically insert a space for you after the word interval; be careful you don't take too long in between dits!

For doing letter to Morse lookups, I find it helpful to look at an alphabetical list with the matching representation. This makes looking up a letter faster.
![Alphabetical list of letters and their corresponding Morse Code representation](https://upload.wikimedia.org/wikipedia/commons/b/b5/International_Morse_Code.svg)
[From here](https://en.wikipedia.org/wiki/File:International_Morse_Code.svg)

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
  <input type="radio" id="difficultyMedium" name="difficulty" value="medium" >
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

</div>

All times are in milliseconds. I recommend starting with slow and giving yourself plenty of time for the dahs, then increasing the speed as you go!

<br>

## Other details

#### *Something went wrong?*

You may need to refresh — it's a little rough around the edges.

#### *Why is it so quick with the spaces when listening?*

Sorry, it was easiest to be super strict about the timing when making it. Try slowing the speed down or practicing to go faster!

#### *How does it work?*

You can see the source code [here](morse-code.js) and [here](constants.js), though it's very unpolished. I'll follow this up with a blog post describing it as well.


Version: 1.0.2

<script src="constants.js"></script>
<script src="morse-code.js"></script>