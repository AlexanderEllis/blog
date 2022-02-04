---
title: "Morse Code Game"
date: 2022-01-31T21:50:54-05:00
draft: true
---


## Game options

If you're not


For doing letter->Morse lookups, I like an alphabetized chart like this:

For doing Morse->letter lookups, I find it helpful to look at a tree-shaped diagram, where you can follow from one node to the next based on whether it's a dit or a dah.
![hey](https://upload.wikimedia.org/wikipedia/commons/1/19/Morse-code-tree.svg)
[From here](https://commons.wikimedia.org/wiki/File:Morse-code-tree.svg)


### Speed


From Wikipedia:

*The duration of a dah is three times the duration of a dit. Each dit or dah within an encoded character is followed by a period of signal absence, called a space, equal to the dit duration. The letters of a word are separated by a space of duration equal to three dits, and words are separated by a space equal to seven dits.*

| Speed  | Dit time (ms) | Dash time (ms) | Letter gap (ms) | Word gap (ms) |
|--------|---------------|----------------|-----------------|---------------|
| Slow   |           300 |            900 |             900 |          2100 |
| Medium |           200 |            600 |             600 |          1400 |
| Fast   |           100 |            300 |             300 |           700 |

All times are in milliseconds. I recommend starting with slow and giving yourself plenty of time for the dahs, then increasing the speed as you go!

<legend>Please select your preferred speed:</legend>
<div>
  <input type="radio" id="speedEasy"
    name="speed" value="easy" checked>
  <label for="speedEasy">Slow</label>
  <input type="radio" id="speedMedium" name="speed" value="medium" >
  <label for="speedMedium">Medium</label>
  <input type="radio" id="speedHard" name="speed" value="hard">
  <label for="speedHard">Fast</label>
</div>

### Difficulty

<legend>Please select your preferred difficulty:</legend>
<div>
  <input type="radio" id="difficultyEasy"
    name="difficulty" value="easy" checked>
  <label for="difficultyEasy">Easy (letters)</label>
  <input type="radio" id="difficultyMedium" name="difficulty" value="medium" >
  <label for="difficultyMedium">Medium (words)</label>
  <input type="radio" id="difficultyHard" name="difficulty" value="hard">
  <label for="difficultyHard">Hard (sentences)</label>
</div>
<br>

# The Games

## Morse Code Listening Game

In this game, it will play a word in Morse Code and you have to enter it right.

Press Enter (or submit) to see if you got it, and press Control (or the reset button) to reset your answer and hear it again.


<button id="playListeningGame">Start</button>

<div id="matchingGame">
  <p id="status">Press Start to begin.</p>
  <input type="text" id="wordInput" placeholder="Enter message" autocomplete="off" disabled>
  <br>
  <button id="submitButton" disabled>Submit</buton>
  <br>
  <button id="resetButton" disabled>Reset</buton>
</div>
<br>

## Morse Code Input Game

For the input game, it will show a word, and you'll have to input it in Morse Code.

You can use your spacebar on desktop or the button on mobile. Press Control to clear your input and start over. It will automatically insert a space for you; be careful you don't take too long in between dits!

<button id="playInputGame">Start</button>

<div id="inputGame">
  <!-- 1.7em to match CSS -->
  <p id="targetDisplay" style="min-height: 1.7em">Press Start to begin.</p>
  <p id="inputDisplay" style="min-height: 1.7em"></p>
  <div>
  <button id="signalButton" disabled>Tap</buton>
  </div>
  <div>
  <button id="startOverButton" disabled>Start Over</buton>
  </div>
</div>

<script src="constants.js"></script>
<script src="morse-code.js"></script>
