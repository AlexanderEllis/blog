const FREQUENCY = 440;

var DOT_TIME = 60;
var DASH_TIME = DOT_TIME * 3;
var SYMBOL_BREAK = DOT_TIME;
var letterBreakMultiplier = 24;
var LETTER_BREAK = DOT_TIME * letterBreakMultiplier;


let note_context;
let note_node;
let gain_node;

let audioContextInitialized = false;

async function initializeAudioContext() {
  note_context = new AudioContext();
  await note_context.resume();
  note_node = note_context.createOscillator();
  gain_node = note_context.createGain();
  note_node.frequency.value = FREQUENCY.toFixed(2);
  gain_node.gain.value = 0;
  note_node.connect(gain_node);
  gain_node.connect(note_context.destination);
  note_node.start();
  audioContextInitialized = true;
}

function startNotePlaying() {
  // Pass a start time of 0 so it starts ramping up immediately.
  gain_node.gain.setTargetAtTime(0.1, 0, 0.001)
}

function stopNotePlaying() {
  // Pass a start time of 0 so it starts ramping down immediately.
  gain_node.gain.setTargetAtTime(0, 0, 0.001)
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Global strictly increasing play counter to avoid multiple replays at the same time.
var playthroughCounter = 0;

async function playDash(currentPlayCounter) {
  console.log('playing dash');
  if (currentPlayCounter != playthroughCounter) { return; }
  startNotePlaying();
  await sleep(DASH_TIME);
  stopNotePlaying();
}

async function playDot(currentPlayCounter) {
  if (currentPlayCounter != playthroughCounter) { return; }
  startNotePlaying();
  await sleep(DOT_TIME);
  stopNotePlaying();
}

/**
 * message is something like '---'
 */
async function playLetter(letter, currentPlayCounter) {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  for (let i = 0; i < letter.length; i++) {
    if (currentPlayCounter != playthroughCounter) { return; }
    if (letter[i] == '-') {
      await playDash(currentPlayCounter);
    } else if (letter[i] == '.') {
      await playDot(currentPlayCounter);
    }
    await sleep(SYMBOL_BREAK);
  }
}

// Word is an array of letters, like ['.', '.-', '-']
async function playWord(word) {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  playthroughCounter += 1;
  var currentPlayCounter = playthroughCounter;
  await sleep(SYMBOL_BREAK * 2);
  console.log('playSentence with', playthroughCounter, currentPlayCounter);
  for (let i = 0; i < word.length; i++) {
    if (currentPlayCounter != playthroughCounter) { return; }
    await playLetter(word[i], currentPlayCounter);
    await sleep(LETTER_BREAK);
  }
}

// asciiChar is something like 'd'
// Assumes [a-z0-9]
function convertAsciiCharToMorse(asciiChar) {
  return MORSE_MAP[asciiChar];
}

// asciiWord is something like 'dog'
// Assumes [a-z0-9]
function convertAsciiWordToMorse(asciiWord) {
  return asciiWord.split('').map(convertAsciiCharToMorse);
}