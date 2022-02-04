
const FREQUENCY = 440;

const DOT_TIME = 300;
const DASH_TIME = DOT_TIME * 3;
const SYMBOL_BREAK = DOT_TIME;
const LETTER_BREAK = DOT_TIME * 3 * 1.5;
const WORD_BREAK = DOT_TIME * 7;


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



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Global variable to stop the playing. Not the most elegant, but whatever.
var STOPPED = false;

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

// Sentence is an array of words.
// Ex. "dog is good" -> [['-..', '---', '--.'], ['..', '...'], ['--.', '---', '---', '-..']]
async function playSentence(sentence) {
  STOPPED = false;
  // Slight pause before it starts
  await sleep(DASH_TIME);
  for (let i = 0; i < sentence.length; i++) {
    if (STOPPED) { return; }
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
  const randomIndex = Math.floor(Math.random() * EASY_WORDS.length);
  return EASY_WORDS[randomIndex];
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

    // Bind listeners to `this`.
    this.inputListener = this.inputListener.bind(this);
    this.submit = this.submit.bind(this);

    // Initialize listeners
    this.wordInput.addEventListener('keyup', this.inputListener);
    this.submitButton.addEventListener('click', this.submit);

    this.target = '';
  }

  startNewGame() {
    // Focus on the word input box.
    this.wordInput.focus();
    // Get a new target
    this.target = getTarget();
    console.log('target: ', this.target);
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
      const enteredWord = this.wordInput.value;
      console.log('enteredWord: ', enteredWord, 'target: ', this.target);
      if (enteredWord.toLowerCase() == this.target) {
        // If they got the word, show message and switch event listener.
        this.statusElement.textContent = 'Correct! Press enter to play a new round.';
        this.messageFound = true;
      } else {
        // If they didn't, clear the text box and let them try again.
        this.statusElement.textContent = 'Not quite! Try again.';
        // Play message.
        this.wordInput.value = '';
        this.playTarget();
      }
    }
  }

  inputListener(event) {
    if (event.key == 'Control') {
      if (this.messageFound) {
        return;
      }
      // Reset the input, stop the current playing, and play the target again.
      this.wordInput.value = '';
      STOPPED = true;
      this.playTarget();
    } else if (event.key == 'Enter') {
      this.submit(event);
    }
  }

  playTarget() {
    playSentence(convertAsciiSentenceToMorse(this.target));
  }

  stopGame() {
    console.log('stopping');
    // Reset
    STOPPED = true;
    this.wordInput.value = '';
    this.statusElement.textContent = '';
    this.wordInput.removeEventListener('keyup', this.inputListener);
    this.submitButton.removeEventListener('click', this.submit);
  }
}

var currentGame;

var playListeningGameButton = document.getElementById("playListeningGame");

async function playListeningGame() {
  // Check if there's a currentGame already. If there is, stop it!
  if (currentGame) {
    currentGame.stopGame();
  }

  const wordInput = document.getElementById('wordInput');
  const status = document.getElementById('status');
  const submitButton = document.getElementById('submitButton');

  currentGame = new ListeningGame(wordInput, status, submitButton);

  currentGame.startNewGame();

  playListeningGameButton.removeEventListener('click', playListeningGame);
  playListeningGameButton.addEventListener('click', stopListeningGame);
  playListeningGameButton.textContent = 'Stop';
}

async function stopListeningGame() {
  if (currentGame) {
    // Stop current game
    currentGame.stopGame();
  }

  playListeningGameButton.removeEventListener('click', stopListeningGame);
  playListeningGameButton.addEventListener('click', playListeningGame);
  playListeningGameButton.textContent = 'Start';
}

playListeningGameButton.addEventListener('click', playListeningGame);