
const FREQUENCY = 440;

const DOT_TIME = 300;
const DASH_TIME = DOT_TIME * 3;
const SYMBOL_BREAK = DOT_TIME;
const LETTER_BREAK = DOT_TIME * 3 * 1.5;
const WORD_BREAK = DOT_TIME * 7;


const MORSE_MAP = {
  'a': '.-',
  'b': '-...',
  'c': '-.-.',
  'd': '-..',
  'e': '.',
  'f': '..-.',
  'g': '--.',
  'h': '....',
  'i': '..',
  'j': '.---',
  'k': '-.-',
  'l': '.-..',
  'm': '--',
  'n': '-.',
  'o': '---',
  'p': '.--.',
  'q': '--.-',
  'r': '.-.',
  's': '...',
  't': '-',
  'u': '..-',
  'v': '...-',
  'w': '.--',
  'x': '-..-',
  'y': '-.--',
  'z': '--..',
  // '1': '.----',
  // '2': '..---',
  // '3': '...--',
  // '4': '....-',
  // '5': '.....',
  // '6': '-....',
  // '7': '--...',
  // '8': '---..',
  // '9': '----.',
  // '0': '-----'
};


const RANDOM_WORDS = [
  'the',
  'he',
  'train',
  'oh',
  'arrive',
  'nine',
  'PM',
  'AM',
  'code',
  'morse',
  'tomato',
  'key',
  'shipment',
  'tractor',
  'grain',
  'error',
  'send',
  'emergency'
];


let note_context;
let note_node;
let gain_node;

let audioContextInitialized = false;

function initializeAudioContext() {
  note_context = new AudioContext();
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

document.addEventListener('keydown', event => {
  if (event.repeat || event.keyCode != 32) {
    return;
  }

  if (event.keyCode == 32 /* space */) {
    if (!audioContextInitialized) {
      initializeAudioContext();
    }
    console.log('we got a space down');
    startNotePlaying();
  }
});

document.addEventListener('keyup', event => {
  if (event.keyCode == 32 /* space */) {
    console.log('we got a space up');
    console.log(note_context.currentTime);
    stopNotePlaying();
  }
});


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function playDash() {
  if (STOPPED) { return; }
  startNotePlaying();
  await sleep(DASH_TIME);
  stopNotePlaying();
}

async function playDot() {
  if (STOPPED) { return; }
  startNotePlaying();
  await sleep(DOT_TIME);
  stopNotePlaying();
}

/**
 * message is something like '---'
 */
async function playLetter(letter) {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  console.log('playing', letter);
  for (let i = 0; i < letter.length; i++) {
    if (STOPPED) { return; }
    if (letter[i] == '-') {
      await playDash();
    } else if (letter[i] == '.') {
      await playDot();
    }
    await sleep(SYMBOL_BREAK);
  }
}

// Word is an array of letters, like ['.', '.-', '-']
async function playWord(word) {
  for (let i = 0; i < word.length; i++) {
    if (STOPPED) { return; }
    await playLetter(word[i]);
    await sleep(LETTER_BREAK);
  }
}

var STOPPED = false;

// Sentence is an array of words.
// Ex. "dog is good" -> [['-..', '---', '--.'], ['..', '...'], ['--.', '---', '---', '-..']]
async function playSentence(sentence) {
  STOPPED = false;
  // Slight pause before it starts
  await sleep(DASH_TIME);
  for (let i = 0; i < sentence.length; i++) {
    await playWord(sentence[i]);
    await sleep(WORD_BREAK);
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

// asciiSentence is something like 'dog is good'
// Assumes words are separated by spaces.
function convertAsciiSentenceToMorse(asciiSentence) {
  let splitSentence = asciiSentence.toLowerCase().split(' ');
  return splitSentence.map(convertAsciiWordToMorse);
}

function getRandomLetter() {
  const randomIndex = Math.floor(Math.random() * 26);
  return Object.keys(MORSE_MAP)[randomIndex];
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * RANDOM_WORDS.length);
  return RANDOM_WORDS[randomIndex];
}

function getRandomSentence() {
  return "I have not done this yet."
}

function getTarget() {
  let target;
  // Get the difficulty and assign a random target.
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value
  switch (difficulty) {
    case 'easy':
      target = getRandomLetter();
      break;
    case 'medium':
      target = getRandomWord();
      break;
    default:
      target = getRandomSentence();
      break;
  }
  return target;
}

var startButton = document.getElementById('playGame');

// function stop() {
//   STOPPED = true;
//   document.getElementById('playGame').textContent = 'Start';
// }

class ListeningGame {
  constructor(wordInput, statusElement, submitButton) {
    this.stopped = false;
    this.messageFound = false;

    // DOM elements we'll interact with
    this.wordInput = wordInput;
    this.statusElement = statusElement;
    this.submitButton = submitButton;

    // Initialize listeners
    wordInput.addEventListener('keyup', (event) => this.inputListener(event));
    submitButton.addEventListener('click', (event) => this.submit(event));

    this.target = '';
  }

  startNewGame() {
    // Focus on the word input box.
    this.wordInput.focus();
    // Get a new target
    this.target = getTarget();
    // Reset
    this.messageFound = false;
    this.wordInput.value = '';
    this.statusElement.textContent = 'Waiting...';
    this.playTarget();
  }

  submit(event) {
    event.preventDefault();
    if (this.messageFound) {
      // If we found it already, get a new target and play it.
      this.startNewGame();
    } else {
      const enteredWord = wordInput.value;
      if (enteredWord.toLowerCase() == this.target) {
        // If they got the word, show message and switch event listener.
        this.statusElement.textContent = 'Correct! Press enter to play a new round.'
        this.messageFound = true;
      } else {
        // If they didn't, clear the text box and let them try again.
        this.statusElement.textContent = 'Not quite! Try again.'
        // Play message.
        this.wordInput.value = '';
        this.playTarget();
      }
    }
  }

  inputListener(event) {
    if (event.key == 'Control') {
      // Reset
      // this.startNewGame();
      wordInput.value = '';
      STOPPED = true;
      this.playTarget();
    } else if (event.key == 'Enter') {
      this.submit(event);
    }
  }

  playTarget() {
    playSentence(convertAsciiSentenceToMorse(this.target));
  }
}

var currentGame;

async function playListeningGame() {
  // TODO: check if there's a currentGame already. If there is, stop it!

  const wordInput = document.getElementById('wordInput');
  const status = document.getElementById('status');
  const submitButton = document.getElementById('submitButton');

  currentGame = new ListeningGame(wordInput, status, submitButton);

  currentGame.startNewGame();
}

document.getElementById("playGame").addEventListener('click', playListeningGame);
