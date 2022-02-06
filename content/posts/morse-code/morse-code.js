
const FREQUENCY = 440;

var DOT_TIME = 300;
var DASH_TIME = DOT_TIME * 3;
var SYMBOL_BREAK = DOT_TIME;
var LETTER_BREAK = DOT_TIME * 3;
var WORD_BREAK = DOT_TIME * 7;


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
var playCounter = 0;

async function playDash(currentPlayCounter) {
  if (currentPlayCounter != playCounter) { return; }
  startNotePlaying();
  await sleep(DASH_TIME);
  stopNotePlaying();
}

async function playDot(currentPlayCounter) {
  if (currentPlayCounter != playCounter) { return; }
  startNotePlaying();
  await sleep(DOT_TIME);
  stopNotePlaying();
}

/**
 * message is something like '---'
 */
async function playLetter(letter, currentPlayCounter) {
  // console.log('playSentence with', playCounter, currentPlayCounter);
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  // console.log('playing', letter);
  for (let i = 0; i < letter.length; i++) {
    if (currentPlayCounter != playCounter) { return; }
    if (letter[i] == '-') {
      await playDash(currentPlayCounter);
    } else if (letter[i] == '.') {
      await playDot(currentPlayCounter);
    }
    await sleep(SYMBOL_BREAK);
  }
}

// Word is an array of letters, like ['.', '.-', '-']
async function playWord(word, currentPlayCounter) {
  // console.log('playSentence with', playCounter, currentPlayCounter);
  for (let i = 0; i < word.length; i++) {
    if (currentPlayCounter != playCounter) { return; }
    await playLetter(word[i], currentPlayCounter);
    await sleep(LETTER_BREAK);
  }
}

// Sentence is an array of words.
// Ex. "dog is good" -> [['-..', '---', '--.'], ['..', '...'], ['--.', '---', '---', '-..']]
async function playSentence(sentence, currentPlayCounter) {
  // console.log('playSentence with', playCounter, currentPlayCounter);
  if (currentPlayCounter != playCounter) { return; }
  // Slight pause before it starts
  // console.log('playSentence with', playCounter, currentPlayCounter);
  await sleep(LETTER_BREAK);
  // console.log('playSentence with', playCounter, currentPlayCounter);
  for (let i = 0; i < sentence.length; i++) {
    if (currentPlayCounter != playCounter) { return; }
    await playWord(sentence[i], currentPlayCounter);
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

function getRandomEasyWords() {
  const totalLength = Math.floor(Math.random() * 3) + 2;
  let finalSentence = ''
  for (let i = 0; i < totalLength; i++) {
    finalSentence += EASY_WORDS[Math.floor(Math.random() * EASY_WORDS.length)];
    if (i < totalLength - 1) {
      finalSentence += ' ';
    }
  }
  return finalSentence;
}

function getRandomWords() {
  const totalLength = Math.floor(Math.random() * 4) + 2;
  let finalSentence = ''
  for (let i = 0; i < totalLength; i++) {
    finalSentence += ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
    if (i < totalLength - 1) {
      finalSentence += ' ';
    }
  }
  return finalSentence;
}

function updateSpeed() {
  const useFarnsworth = document.querySelector('input[name="farnsworth"]:checked').value == 'yes';
  // Get the difficulty and update the constants.
  const difficulty = document.querySelector('input[name="speed"]:checked').value
  if (useFarnsworth) {
    DOT_TIME = 60;
    DASH_TIME = DOT_TIME * 3;
    SYMBOL_BREAK = DOT_TIME;
    let letterBreakMultiplier;
    switch (difficulty) {
      case 'easy':
        letterBreakMultiplier = 24;
        break;
      case 'medium':
        letterBreakMultiplier = 12;
        break;
      case 'hard':
        letterBreakMultiplier = 6;
        break;
      default:
        letterBreakMultiplier = 3;
        break;
    }
    LETTER_BREAK = DOT_TIME * letterBreakMultiplier;
    WORD_BREAK = DOT_TIME * (letterBreakMultiplier * 2.5);
  } else {
    switch (difficulty) {
      case 'easy':
        DOT_TIME = 300;
        break;
      case 'medium':
        DOT_TIME = 200;
        break;
      case 'hard':
        DOT_TIME = 100;
        break;
      default:
        DOT_TIME = 60;
        break;
    }
    DASH_TIME = DOT_TIME * 3;
    SYMBOL_BREAK = DOT_TIME;
    LETTER_BREAK = DOT_TIME * 3;
    WORD_BREAK = DOT_TIME * 7;
  }
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
    case 'hard':
      target = getRandomEasyWords();
      break;
    default:
      target = getRandomWords();
      break;
  }
  return target;
}

var startButton = document.getElementById('playGame');

class ListeningGame {
  constructor(wordInput, statusElement, submitButton, resetButton) {
    this.stopped = false;
    this.messageFound = false;

    // DOM elements we'll interact with
    this.wordInput = wordInput;
    this.statusElement = statusElement;
    this.submitButton = submitButton;
    this.resetButton = resetButton;

    // Bind listeners to `this`.
    this.inputListener = this.inputListener.bind(this);
    this.submit = this.submit.bind(this);
    this.resetButtonListener = this.resetButtonListener.bind(this);

    // Initialize listeners
    this.wordInput.addEventListener('keyup', this.inputListener);
    this.submitButton.addEventListener('click', this.submit);
    this.resetButton.addEventListener('click', this.resetButtonListener);
    this.wordInput.removeAttribute('disabled');
    this.submitButton.removeAttribute('disabled');
    this.resetButton.removeAttribute('disabled');

    this.target = '';
  }

  startNewGame() {
    // Start listening
    if (!audioContextInitialized) {
      initializeAudioContext();
    }
    // Focus on the word input box.
    this.wordInput.focus();
    // Update speed based on difficulty.
    updateSpeed();
    // Get a new target
    this.target = getTarget();
    // console.log('target: ', this.target);
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
      // console.log('enteredWord: ', enteredWord, 'target: ', this.target);
      if (enteredWord.toLowerCase() == this.target) {
        // If they got the word, show message and switch event listener.
        this.statusElement.textContent = 'Correct! Press enter to play a new round.';
        this.messageFound = true;
        // Extra playCounter increase to stop any current playing.
        this.stopCurrentPlaying();
      } else {
        // If they didn't, clear the text box and let them try again.
        this.statusElement.textContent = 'Not quite! Try again.';
        this.replay();
      }
    }
  }

  stopCurrentPlaying() {
    // console.log('stopping current playing');
    // Also increase playCounter to stop any current playing. Wastes a count, but we have the bits to spare.
    playCounter += 1;
  }

  async replay() {
    if (this.messageFound) {
      this.startNewGame();
      return;
    }
    // Stop the current playing, and play the target again.
    this.stopCurrentPlaying();
    this.wordInput.focus();
    this.playTarget();
  }

  resetButtonListener(event) {
    event.preventDefault();
    this.replay();
  }

  inputListener(event) {
    if (this.messageFound) {
      this.startNewGame();
      return;
    }
    if (event.key == 'Control') {
      this.replay();
    } else if (event.key == 'Enter') {
      this.submit(event);
    }
  }

  playTarget() {
    playCounter += 1;
    // console.log('playing with counter', playCounter)
    playSentence(convertAsciiSentenceToMorse(this.target), playCounter);
  }

  stopGame() {
    this.stopCurrentPlaying();
    this.wordInput.value = '';
    this.statusElement.textContent = 'Press Start to begin.';
    this.wordInput.removeEventListener('keyup', this.inputListener);
    this.submitButton.removeEventListener('click', this.submit);
    this.resetButton.removeEventListener('click', this.resetButtonListener);
    this.wordInput.setAttribute('disabled', 'disabled');
    this.submitButton.setAttribute('disabled', 'disabled');
    this.resetButton.setAttribute('disabled', 'disabled');
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
  const resetButton = document.getElementById('resetButton');

  currentGame = new ListeningGame(wordInput, status, submitButton, resetButton);

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

class InputGame {
  constructor(signalButton, startOverButton, targetDisplay, inputDisplay, inputStatus) {
    this.signalButton = signalButton;
    this.startOverButton = startOverButton;
    this.targetDisplay = targetDisplay;
    this.inputDisplay = inputDisplay;
    this.inputStatus = inputStatus;

    this.target = '';

    // Stack for keeping track of dots and dashes that make up letter
    this.dotAndDashStack = [];
    // Stack for keeping track of letters that make up word
    this.letterStack = [];

    this.lastKeyDownTime = 0;
    this.lastKeyUpTime = 0;
    this.letterTimeout = null;
    this.spaceTimeout = null;

    this.matchFound = false;

    // Keep track of where the spacebar is to prevent duplicate keydowns when you hold it down.
    this.spacebarDown = false;
    // Keep track of if the tap key is down or not to prevent weird state issues when restarting game.
    // this.keyIsDown = false;

    this.documentKeydownListener = this.documentKeydownListener.bind(this);
    this.documentKeyupListener = this.documentKeyupListener.bind(this);
    this.buttonMousedownListener = this.buttonMousedownListener.bind(this);
    this.buttonMouseupListener = this.buttonMouseupListener.bind(this);
    this.startOver = this.startOver.bind(this);
    this.handleLetterTimeout = this.handleLetterTimeout.bind(this);
    this.handleSpaceTimeout = this.handleSpaceTimeout.bind(this);

    document.addEventListener('keydown', this.documentKeydownListener);
    document.addEventListener('keyup', this.documentKeyupListener);
    this.signalButton.addEventListener('mousedown', this.buttonMousedownListener);
    this.signalButton.addEventListener('mouseup', this.buttonMouseupListener);
    this.signalButton.addEventListener('touchstart', this.buttonMousedownListener);
    this.signalButton.addEventListener('touchend', this.buttonMouseupListener);
    this.startOverButton.addEventListener('click', this.startOver);
  }

  startNewGame()  {
    this.matchFound = false;
    this.startOver();
    // Update speed based on difficulty.
    updateSpeed();
    // Get target word
    this.target = getTarget();
    // console.log('target: ', this.target);
    // Update target display with the new target
    this.targetDisplay.textContent = 'Target: ' + this.target;
    this.inputDisplay.textContent = '';
    this.inputStatus.textContent = '';

    this.signalButton.removeAttribute('disabled');
    this.startOverButton.removeAttribute('disabled');
    // Focus on the tap button
    this.signalButton.focus();

    // Start listening
    if (!audioContextInitialized) {
      initializeAudioContext();
    }
  }

  keyDown() {
    if (this.matchFound) {
      // console.log('match found! doing nothing on keydown')
      return;
    }
    startNotePlaying();
    const currentTime = Date.now();
    // Update the marker for the last signal ending
    this.lastKeyDownTime = currentTime;
    // Get the total silence time since we last had a signal
    const silenceDelta = currentTime - this.lastKeyUpTime;
    this.handleSilence(silenceDelta);
    // We also want to clear any pending intervals so we don't duplicate them.
    clearTimeout(this.letterTimeout);
    clearTimeout(this.spaceTimeout);
  }

  keyUp() {
    if (this.matchFound) {
      this.startNewGame();
      return;
    }
    // console.log('keyup!');
    stopNotePlaying();
    const currentTime = Date.now();
    // Update the marker for the last silence ending
    this.lastKeyUpTime = currentTime;
    // Get the total signal time since we last had silence
    const signalDelta = currentTime - this.lastKeyDownTime;
    this.handleSignal(signalDelta);

    // TODO: start timer
    this.letterTimeout = setTimeout(this.handleLetterTimeout, LETTER_BREAK);
    this.spaceTimeout = setTimeout(this.handleSpaceTimeout, WORD_BREAK);
  }

  handleLetterTimeout() {
    this.handleSilence(LETTER_BREAK);
  }

  handleSpaceTimeout() {
    this.handleSilence(WORD_BREAK)
  }

  handleSignal(signalDelta) {
    // console.log('signalDelta: ', signalDelta)
    // See if it's a dot or a dash
    if (signalDelta < DASH_TIME)  {
      this.dotAndDashStack.push('.');
    } else {
      this.dotAndDashStack.push('-');
    }
  }

  handleSilence(silenceDelta) {
    // If there's no input yet, don't do anything
    if (this.dotAndDashStack.length == 0 && this.letterStack.length == 0) {
      return;
    }
    // console.log('silenceDelta: ', silenceDelta, 'LETTER_BREAK: ', LETTER_BREAK);
    // If we have at least a letter break, try to add a new character if we have any dots or dashes
    if (silenceDelta >= LETTER_BREAK && this.dotAndDashStack.length != 0) {
      // TODO: handle letter being done.
      const currentLetterCombo = this.dotAndDashStack.join('');
      if (currentLetterCombo in REVERSE_MORSE_MAP) {
        this.letterStack.push(REVERSE_MORSE_MAP[currentLetterCombo]);
      } else {
        // Push a question mark
        this.letterStack.push('?');
      }
      // Clear current stack.
      this.dotAndDashStack = [];
    }
    // If we have more than a word break, we may also want to add a space after doing the above.
    // We may want to do this without dots and dashes (e.g. the timeout), but only if the last char
    // isn't a space
    if (silenceDelta >= WORD_BREAK &&
        this.letterStack.length != 0 &&
        this.letterStack[this.letterStack.length - 1] != ' ') {
      this.letterStack.push(' ');
    }
    // Update the display.
    this.inputDisplay.textContent = this.letterStack.join('');
    this.checkForMatch();
  }

  documentKeydownListener(event) {
    event.preventDefault();
    // console.log('document keydown');
    if (event.key == ' ' && !this.spacebarDown) {
      // console.log('sending keydown');
      this.spacebarDown = true;
      this.keyDown();
    } else if (event.key == 'Control') {
      this.startOver();
    }
  }

  documentKeyupListener(event) {
    event.preventDefault();
    if (this.matchFound) {
      this.spacebarDown = false;
      this.startNewGame();
      return;
    }
    // console.log('document keyup');
    // console.log(this);
    if (event.key == ' ') {
      this.spacebarDown = false;
      this.keyUp();
    }
  }

  buttonMousedownListener(event) {
    event.preventDefault();
    // console.log('button mousedown');
    // console.log(this);
    this.keyDown();
  }

  buttonMouseupListener(event) {
    event.preventDefault();
    // console.log('button mouseup');
    // console.log(this);
    this.keyUp();
  }

  startOver(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.matchFound) {
      this.startNewGame();
      return;
    }
    this.inputDisplay.textContent = '';
    this.inputStatus.textContent = '';
    this.dotAndDashStack = [];
    this.letterStack = [];
    this.lastKeyDownTime = 0;
    this.lastKeyUpTime = 0;

    clearTimeout(this.letterTimeout);
    clearTimeout(this.spaceTimeout);
  }

  checkForMatch() {
    // console.log('checking for match');
    // console.log('target: \'' + this.target + '\'');
    // console.log('this.letterStack.join(\'\'): \'' + this.letterStack.join('') + '\'');
    // console.log(this.letterStack.join('') == this.target);
    if (this.letterStack.join('') == this.target) {
      // console.log('match!');
      // Clear intervals
      clearTimeout(this.letterTimeout);
      clearTimeout(this.spaceTimeout);

      // Show message
      this.inputStatus.textContent = 'You got it! Press any key or click either button to start a new round.';
      this.matchFound = true;
    }
  }

  stopGame() {
    this.startOver();
    this.targetDisplay.textContent = 'Press Start to begin.';
    this.inputStatus.textContent = '';
    document.removeEventListener('keydown', this.documentKeydownListener);
    document.removeEventListener('keyup', this.documentKeyupListener);
    this.signalButton.removeEventListener('mousedown', this.buttonMousedownListener);
    this.signalButton.removeEventListener('mouseup', this.buttonMouseupListener);
    this.signalButton.removeEventListener('touchstart', this.buttonMousedownListener);
    this.signalButton.removeEventListener('touchend', this.buttonMouseupListener);
    this.startOverButton.removeEventListener('click', this.startOver);
    this.signalButton.setAttribute('disabled', 'disabled');
    this.startOverButton.setAttribute('disabled', 'disabled');
  }
}

var playInputGameButton = document.getElementById("playInputGame");

async function playInputGame() {
  // TODO: check if there's a currentGame already. If there is, stop it!
  if (currentGame) {
    currentGame.stopGame();
  }

  const signalButton = document.getElementById('signalButton');
  const startOverButton = document.getElementById('startOverButton');
  const targetDisplay = document.getElementById('targetDisplay');
  const inputDisplay = document.getElementById('inputDisplay');
  const inputStatus = document.getElementById('inputStatus');

  currentGame = new InputGame(signalButton, startOverButton, targetDisplay, inputDisplay, inputStatus);

  currentGame.startNewGame();

  playInputGameButton.removeEventListener('click', playInputGame);
  playInputGameButton.addEventListener('click', stopInputGame);
  playInputGameButton.textContent = 'Stop';
}

async function stopInputGame() {
  if (currentGame) {
    // Stop current game
    currentGame.stopGame();
  }

  playInputGameButton.removeEventListener('click', stopInputGame);
  playInputGameButton.addEventListener('click', playInputGame);
  playInputGameButton.textContent = 'Start';
}

playInputGameButton.addEventListener('click', playInputGame);

// For iOS, you need a touch event before you can play audio!
var initializeAudioOnTouch = function() {
  if (!audioContextInitialized) {
    initializeAudioContext();
  }
  document.removeEventListener('touchend', initializeAudioOnTouch);
}
document.addEventListener('touchend', initializeAudioOnTouch);