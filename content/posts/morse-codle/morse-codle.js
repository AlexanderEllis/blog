
const TILE_STATE_TBD = 'tbd';
const TILE_STATE_EMPTY = 'empty';
const TILE_STATE_ABSENT = 'absent';
const TILE_STATE_PRESENT = 'present';
const TILE_STATE_CORRECT = 'correct';

const TILE_ANIMATION_FLIP_IN = 'flip-in';
const TILE_ANIMATION_FLIP_OUT = 'flip-out';
const TILE_ANIMATION_POP = 'pop';
const TILE_ANIMATION_REVEAL = 'reveal';

// Help modal functions
const overlayModal = document.getElementById('overlay-modal');
function showHelpModal(event) {
  overlayModal.classList.remove('hidden');
  overlayModal.setAttribute('open', '');
}
function hideHelpModal(event) {
  overlayModal.classList.add('hidden');
  setTimeout(() => { overlayModal.removeAttribute('open'); }, 200);
}
document.getElementById('close-icon').addEventListener('click', hideHelpModal);
document.getElementById('help-icon').addEventListener('click', showHelpModal);

// Options modal functions
const optionsOverlayModal = document.getElementById('options-overlay-modal');
function showOptionsModal(event) {
  console.log('hey');
  optionsOverlayModal.classList.remove('hidden');
  optionsOverlayModal.setAttribute('open', '');
}
function hideOptionsModal(event) {
  optionsOverlayModal.classList.add('hidden');
  setTimeout(() => { optionsOverlayModal.removeAttribute('open'); }, 200);
}
document.getElementById('options-close-icon').addEventListener('click', hideOptionsModal);
document.getElementById('options-icon').addEventListener('click', showOptionsModal);


// Speed switch
const speedSwitch = document.getElementById('speed-switch');
function toggleSpeed (event) {
  console.log('hey');
  // Set active
  const checked = speedSwitch.hasAttribute('checked');
  console.log('checked', checked)

  if (checked) {
    // uncheck
    console.log('removing attribute');
    speedSwitch.removeAttribute('checked');
    document.getElementById('speed-knob').removeAttribute('checked');
    updateDifficulty('hard');
  } else {
    speedSwitch.setAttribute('checked', '');
    document.getElementById('speed-knob').setAttribute('checked', '');
    updateDifficulty('easy');
  }
}
document.getElementById('speed-switch').addEventListener('click', toggleSpeed);

// This is the meat of the actual game
/*
// Initialize game state


////// What's in a game?

// Game state
- Guesses: array of 4 words



//// What's in a history?
- Completed days and the number of guesses

//// What's in a user's state?
- Settings
  - Play speed
- game history
- game state for most recent day

// Other things we'll need
Translate from day to game number
translate from


////// Game flow

Press button to hear morse code

Type in letter, is entered as guess
Delete removes until all gone in current row
Enter submits when 5
  - Evaluate it and update the tiles
  - Flip the tiles to morse code
*/

function getDayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

function getYearOffset() {
  var now = new Date();
  var year = now.getFullYear();
  return year - 2022;
}

function getRandomWord() {
  const yearOffset = getYearOffset
  const wordIndex = (getDayOfYear() * yearOffset()) % ALL_WORDS.length;
  return ALL_WORDS[wordIndex];
}

// TODO: get this from localstorage
var playerHistory = {
  pastGames: [],
  settings: {
    playSpeedfast: false
  },
  currentGameGuesses: []
}

var settings = playerHistory.settings;

var currentGuesses = playerHistory.currentGameGuesses;

var gameState = {
  targetWord: getRandomWord(),
  currentGameGuesses: [],
  currentLetters: [],
  targetFound: false,
};

function updateDifficulty(difficulty) {
  DOT_TIME = 60;
  DASH_TIME = DOT_TIME * 3;
  SYMBOL_BREAK = DOT_TIME;
  let letterBreakMultiplier;
  if (difficulty == 'hard') {

    letterBreakMultiplier = 24;
  } else {
    letterBreakMultiplier = 3;
  }
  LETTER_BREAK = DOT_TIME * letterBreakMultiplier;
}

function playCurrentWord() {
  playWord(convertAsciiWordToMorse(gameState.targetWord));
}

document.getElementById('play-button').addEventListener('click', (event) => {
  playCurrentWord();
});


async function updateGameBoard() {
  console.log('updateGameBoard')
  // debugger;
  if (gameState.currentGameGuesses.length > 4) {
    // We don't want to update any more.
    return;
  }
  let currentRowIndex = gameState.currentGameGuesses.length;
  var rows = document.getElementsByClassName('game-row');

  // Make sure previous guesses are all set.
  for (let i = 0; i < currentRowIndex; i++) {
    let row = rows[i];
    if (row.dataset.checked) {
      continue;
    }
    var tiles = row.getElementsByClassName('game-tile');
    var previousGuess = gameState.currentGameGuesses[i];
    for (let letterIndex = 0; letterIndex < tiles.length; letterIndex++)  {
      const tile = tiles[letterIndex];
      const letter = previousGuess[letterIndex];
      tile.dataset.animation = TILE_ANIMATION_FLIP_IN;
      await sleep(240);
      tile.textContent = MORSE_MAP[letter];
      if (letter == gameState.targetWord[letterIndex]) {
        tile.dataset.state = TILE_STATE_CORRECT;
      } else if (gameState.targetWord.indexOf(letter) != -1) {
        // It's not the right spot but it's in there.
        // TODO: handle duplicates
        tile.dataset.state = TILE_STATE_PRESENT;
      } else {
        tile.dataset.state = TILE_STATE_ABSENT;
      }
      tile.dataset.animation = TILE_ANIMATION_FLIP_IN;
      await sleep(60);
    }
    row.dataset.checked = true;
  }

  if (gameState.currentGameGuesses.length >= 4) {
    // All done!
    return;
  }

  var currentRow = rows[currentRowIndex];
  let currentLetterIndex = gameState.currentLetters.length;
  var tiles = currentRow.getElementsByClassName('game-tile');
  for (let i = 0; i < tiles.length; i++)  {
    const tile = tiles[i];
    if (i >= currentLetterIndex) {
      tile.removeAttribute('letter');
      tile.textContent = '';
      tile.dataset.state = TILE_STATE_EMPTY;
      tile.dataset.animation = '';
      return;
    } else {
      const letter = gameState.currentLetters[i];
      if (tile.getAttribute('letter') != letter) {
        tile.setAttribute('letter', letter);
        tile.textContent = letter;
        tile.dataset.state = TILE_STATE_TBD;
        tile.dataset.animation = TILE_ANIMATION_POP;
      }
    }
  }
}

// When we get a letter,
function handleLetterGuess(letter) {
  if (gameState.currentLetters.length < 5) {
    gameState.currentLetters.push(letter);
    updateGameBoard();
  }
}

function handleDelete() {
  console.log('handle delete');
  if (gameState.currentLetters.length > 0) {
    gameState.currentLetters.pop();
    updateGameBoard();
  }
}

async function handleEnter() {
  if (gameState.currentGameGuesses == 4) {
    // Too late!
    return;
  }
  // Check if the word is a word
  const candidateWord = gameState.currentLetters.join('');
  if (!ALL_WORDS_SET.has(candidateWord)) {
    alert('I don\'t think that\'s a word');
    return;
  }

  // Check if it's a candidate word
  gameState.currentGameGuesses.push(candidateWord);
  gameState.currentLetters = [];
  console.log(Date.now())
  await updateGameBoard();
  // Give it a little bit for the last animation to finish.
  await sleep(200);
  console.log(Date.now())
  if (candidateWord == gameState.targetWord) {
    alert('you got it!');
    gameState.targetFound = true;
  } else {

  }
}

const ALPHABET = new Set('abcdefghijklmnopqrstuvwxyz');
const ENTER_KEY = '↵';
const DELETE_KEY = '←';

function handleKeyboardEntry(key) {
  // Delete key
  if (key == DELETE_KEY) {
    handleDelete();
  }
  // Enter key
  if (key == ENTER_KEY) {
    // handle enter
    handleEnter();
  }
  // Letter key
  if (ALPHABET.has(key)) {
    handleLetterGuess(key);
  }
}

document.addEventListener('keydown', event => {
  if (gameState.targetFound) {
    return;
  }
  event.preventDefault();
  // console.log('document keydown');
  if (event.key == 'Backspace') {
    handleKeyboardEntry(DELETE_KEY);
  } else if (event.key == 'Enter') {
    handleKeyboardEntry(ENTER_KEY);
  } else if (event.key == ' ') {
    sleep(50);
    playCurrentWord();
  } else {
    handleKeyboardEntry(event.key);
  }
});

Array.from(document.getElementsByClassName('key')).forEach((keyboardKey => {
  keyboardKey.addEventListener('click', (event) => {
    handleKeyboardEntry(event.target.dataset.key);
  });
}));