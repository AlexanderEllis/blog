---
title: "Morse Code Game"
date: 2022-01-31T21:50:54-05:00
draft: true
---

TODO:
- First version: hear the dits/dashes, enter the word!
- 3 game modes: easy, medium, hard
- Do it so you can play multiple rounds without taking your hands off the keyboard

- Second version: see the word, enter the dits/dashes
- 3 game modes: easy, medium, hard

<br>



<h4>
  Morse Code Game
</h4>

<span>
  Press space to play sound.
</span>

<span>
  Each dot or dash within a character is followed by period of signal absence, called a space, equal to the dot duration. The letters of a word are separated by a space of duration equal to three dots, and the words are separated by a space equal to seven dots.
</span>

<br>


<br>
<br>

<h3>Matching Game</h3>

<p>It will play a word, and you have to enter it right.</p>
<p>Press Enter to see if you got it.</p>
<p>Press Control to reset your answer and hear it again.</p>

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

<button id="playGame">Start</button>

<div id="matchingGame">
  <p id="status"></p>
  <input type="text" id="wordInput" placeholder="Enter message">
  <br>
  <button id="submitButton">Submit</buton>
</div>

<script src="morse-code.js"></script>