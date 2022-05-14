---
title: "A basic ear training note matching game"
date: 2022-05-14T01:03:02-05:00
---

<noscript>
  This is a game for matching musical notes.

  JavaScript is needed to run this game. If you don't have it enabled, I totally get it — I <a
    href="/posts/taking-over-my-clipboard/" target="blank_">often</a> <a href="/posts/attention-javascript"
    target="blank_">don't like</a> it either.
</noscript>

This is a simple ear-training game for matching notes. Play along with your favorite instrument!

You can also try singing/whistling, but note that *the pitch detection is [hand rolled and rough around the edges](/posts/tuner/) — apologies if it makes any mistakes, especially for lower notes.*

Here's how to play:
- Press the start button to begin
- Listen to the notes, then play them yourself
- (Optional): Hit Replay to listen to the notes again
- Play around with the options and continue as long as you want :)

<br>

<b>Options (they'll apply to the next round):</b>
<br>
<label for="numNotes">Number of notes:</label>
<select name="numNotes" id="numNotes">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
</select>
<br>
<label for="numRepeats">Number of repeated success required:</label>
<select name="numRepeats" id="numRepeats">
  <option value="0">0</option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>
<br>
<label for="minDuration">Min note duration (the one you play):</label>
<select name="minDuration" id="minDuration">
  <option value="100">100ms</option>
  <option value="200">200ms</option>
  <option value="300" selected>300ms</option>
  <option value="500">500ms</option>
</select>

<br>

<div id="game">
  <div>Total correct: <span id="totalCorrect">0</span></div>
  <div>Perfect streak: <span id="perfectStreak">0</span></div>
  <div>Best perfect streak: <span id="bestPerfectStreak">0</span></div>
  <button id="startButton">Start</button>
  <br>
  <button id="replayButton" disabled>Replay</button>

  <br>
  <div id="status"></div>
  <div id="results">
  </div>
</div>

<script src="autocorrelate.js"></script>
<script src="note-matching.js"></script>

<style>
  .note {
    margin: 0 5px;
    min-width: 45px;
    display: inline-block;
    font-size: 26px;
  }
</style>