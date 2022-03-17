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
  if (event) {
    event.preventDefault();
  }
  overlayModal.classList.remove('hidden');
  overlayModal.setAttribute('open', '');
}
function hideHelpModal(event) {
  event.preventDefault();
  overlayModal.classList.add('hidden');
  setTimeout(() => { overlayModal.removeAttribute('open'); }, 200);
}
document.getElementById('close-icon').addEventListener('click', hideHelpModal);
document.getElementById('help-icon').addEventListener('click', showHelpModal);
document.getElementById('close-icon').addEventListener('touchstart', hideHelpModal);
document.getElementById('help-icon').addEventListener('touchstart', showHelpModal);

// Options modal functions
const optionsOverlayModal = document.getElementById('options-overlay-modal');
function showOptionsModal(event) {
  event.preventDefault();
  optionsOverlayModal.classList.remove('hidden');
  optionsOverlayModal.setAttribute('open', '');
}
function hideOptionsModal(event) {
  event.preventDefault();
  optionsOverlayModal.classList.add('hidden');
  setTimeout(() => { optionsOverlayModal.removeAttribute('open'); }, 200);
}
document.getElementById('options-close-icon').addEventListener('click', hideOptionsModal);
document.getElementById('options-icon').addEventListener('click', showOptionsModal);
document.getElementById('options-close-icon').addEventListener('touchstart', hideOptionsModal);
document.getElementById('options-icon').addEventListener('touchstart', showOptionsModal);

// Done modal functions
const doneOverlayModal = document.getElementById('done-overlay-modal');
function showDoneModal(event) {
  var doneTitle;
  var doneSubtitle;
  if (gameState.targetFound) {
    doneTitle = 'Well done!';
  } else {
    doneTitle = 'Better luck next time!';
    doneSubtitle = `The word was '${gameState.targetWord}'`;
  }
  if (settings.randomWord) {
    document.getElementById('share-button').style.display = 'none';
    document.getElementById('done-text').textContent = 'Refresh the page for a new challenge!';
  } else {
    document.getElementById('share-button').style.display = 'block';
    document.getElementById('done-text').textContent = 'You can wait for tomorrow for a new game, or if you want a new challenge now, you can enable Random mode and refresh the page.';
  }
  document.getElementById('done-title').textContent = doneTitle;
  document.getElementById('done-subtitle').textContent = doneSubtitle;
  doneOverlayModal.classList.remove('hidden');
  doneOverlayModal.setAttribute('open', '');
}
function hideDoneModal(event) {
  event.preventDefault();
  doneOverlayModal.classList.add('hidden');
  setTimeout(() => { doneOverlayModal.removeAttribute('open'); }, 200);
}
document.getElementById('done-close-icon').addEventListener('click', hideDoneModal);
document.getElementById('done-close-icon').addEventListener('touchstart', hideDoneModal);

// Speed switch
const speedSwitch = document.getElementById('speed-switch');
function toggleSpeed (event) {
  event.preventDefault();
  // Set active
  const checked = speedSwitch.hasAttribute('checked');

  if (checked) {
    // uncheck
    speedSwitch.removeAttribute('checked');
    document.getElementById('speed-knob').removeAttribute('checked');
    updateSpeed(false);
  } else {
    speedSwitch.setAttribute('checked', '');
    document.getElementById('speed-knob').setAttribute('checked', '');
    updateSpeed(true);
  }
}
document.getElementById('speed-switch').addEventListener('click', toggleSpeed);
document.getElementById('speed-switch').addEventListener('touchstart', toggleSpeed);

const hardSwitch = document.getElementById('hard-switch');
function toggleHard (event) {
  event.preventDefault();
  // Set active
  const checked = hardSwitch.hasAttribute('checked');

  if (checked) {
    // uncheck
    hardSwitch.removeAttribute('checked');
    document.getElementById('hard-knob').removeAttribute('checked');
    updateDifficulty(false);
  } else {
    hardSwitch.setAttribute('checked', '');
    document.getElementById('hard-knob').setAttribute('checked', '');
    updateDifficulty(true);
  }
}
document.getElementById('hard-switch').addEventListener('click', toggleHard);
document.getElementById('hard-switch').addEventListener('touchstart', toggleHard);

const randomSwitch = document.getElementById('random-switch');
function togglerandom (event) {
  event.preventDefault();
  // Set active
  const checked = randomSwitch.hasAttribute('checked');
  if (checked) {
    // uncheck
    randomSwitch.removeAttribute('checked');
    document.getElementById('random-knob').removeAttribute('checked');
    updateRandom(false);
  } else {
    randomSwitch.setAttribute('checked', '');
    document.getElementById('random-knob').setAttribute('checked', '');
    updateRandom(true);
  }
}
document.getElementById('random-switch').addEventListener('click', togglerandom);
document.getElementById('random-switch').addEventListener('touchstart', togglerandom);



function getDayOffset() {
  var now = new Date();
  var start = new Date('02/17/2022');
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

const GAME_NUMBER = getDayOffset();
const STEP = 4;

function share(event) {
  event.preventDefault();
  // Build results array
  var result = '';
  for (let i = 0; i < gameState.currentGameGuesses.length; i++) {
    for (let j = 0; j < 5; j++) {
      let letterStatus = getLetterStatus(gameState.targetWord, gameState.currentGameGuesses[i], j);
      if (letterStatus == TILE_STATE_ABSENT) {
        result += '⬜';
      }
      if (letterStatus == TILE_STATE_PRESENT) {
        result += '🟨';
      }
      if (letterStatus == TILE_STATE_CORRECT) {
        result += '🟩';
      }
    }
    result += '\n';
  }
  // Copy results to clipboard
  const stringToCopy =
  `-- --- .-. ... .   -.-. --- -.. .-.. .
Game #${GAME_NUMBER}

${result}\nhttps://alexanderell.is/posts/morse-codle/`;

  clipboard.writeText(stringToCopy).then(function () {
    alert('Text copied successfully.');
  }, function (err) {
    alert('There was a problem copying your result.');
  });
}
// Share button
document.getElementById('share-button').addEventListener('click', share);


function getTargetWord() {
  const wordIndex = (GAME_NUMBER * STEP) % ALL_WORDS.length;
  return ALL_WORDS[wordIndex];
}

function getRandomWord() {
  const wordIndex = Math.floor(Math.random() *  ALL_WORDS.length);
  return ALL_WORDS[wordIndex];
}

var DEFAULT_HISTORY = {
  pastGames: [],
  settings: {
    playSpeedFast: false,
    hardMode: false,
    randomWord: false,
  },
  gameState: null
}

var playerHistory;
if (window.localStorage.getItem('morseCodleHistory')) {
  playerHistory = JSON.parse(window.localStorage.getItem('morseCodleHistory'));
} else {
  playerHistory = DEFAULT_HISTORY;
  showHelpModal();
}

var settings = playerHistory.settings;
updateSettingsFromHistory();

// Start with new gameState if they don't have today's or randomWord is on.
var gameState;
if (playerHistory && playerHistory.settings && playerHistory.settings.randomWord) {
  gameState = {
    targetWord: getRandomWord(),
    currentGameGuesses: [],
    currentLetters: [],
    lettersTried: {},
    targetFound: false,
    gameOver: false,
  };
} else if (playerHistory && playerHistory.gameState && playerHistory.gameState.targetWord == getTargetWord()) {
  gameState = playerHistory.gameState;
  if (gameState.gameOver) {
    showDoneModal();
  }
} else {
  gameState = {
    targetWord: getTargetWord(),
    currentGameGuesses: [],
    currentLetters: [],
    lettersTried: {},
    targetFound: false,
    gameOver: false,
  };
}

function updateSettingsFromHistory() {
  const speedSwitch = document.getElementById('speed-switch');
  const speedKnob = document.getElementById('speed-knob');
  if (settings.playSpeedFast) {
    speedSwitch.setAttribute('checked', '');
    speedKnob.setAttribute('checked', '');
    updateSpeed(true);
  }
  const hardSwitch = document.getElementById('hard-switch');
  const hardKnob = document.getElementById('hard-knob');
  if (settings.hardMode) {
    hardSwitch.setAttribute('checked', '');
    hardKnob.setAttribute('checked', '');
  }
  const randomSwitch = document.getElementById('random-switch');
  const randomKnob = document.getElementById('random-knob');
  if (settings.randomWord) {
    randomSwitch.setAttribute('checked', '');
    randomKnob.setAttribute('checked', '');
  }
}

function saveGameState() {
  // Only save game state if it's not random
  if (!settings.randomWord) {
    playerHistory.gameState = gameState;
    window.localStorage.setItem('morseCodleHistory', JSON.stringify(playerHistory))
  }
}

function saveSettings() {
  playerHistory.settings = settings;
  window.localStorage.setItem('morseCodleHistory', JSON.stringify(playerHistory))
}

function savePastGames() {
  window.localStorage.setItem('morseCodleHistory', JSON.stringify(playerHistory))
}

updateGameBoard();
updateLettersTried();

function updateSpeed(useFastMode) {
  DOT_TIME = 60;
  DASH_TIME = DOT_TIME * 3;
  SYMBOL_BREAK = DOT_TIME;
  let letterBreakMultiplier;
  if (useFastMode) {
    letterBreakMultiplier = 3;
  } else {
    letterBreakMultiplier = 24;
  }
  settings.playSpeedFast = useFastMode;
  LETTER_BREAK = DOT_TIME * letterBreakMultiplier;
  saveSettings();
}

function updateDifficulty(hardMode) {
  settings.hardMode = hardMode;
  saveSettings();
}

let alreadyPlayedThrough = false;

function updateRandom(useRandomWord) {
  settings.randomWord = useRandomWord;
  saveSettings();
}

function playCurrentWord(event) {
  if (event) {
    event.preventDefault();
  }
  if (settings.hardMode && alreadyPlayedThrough) {
    return;
  }
  playWord(convertAsciiWordToMorse(gameState.targetWord));
  alreadyPlayedThrough = true;
}

document.getElementById('play-button').addEventListener('click', playCurrentWord);

function isPresent(targetWord, guess, index) {
  // We only want the unmatched counts
  let unmatchedTargetWordLetterCounts = {};
  for (let i = 0; i < targetWord.length; i++) {
    const letter = targetWord[i];
    if (targetWord[i] == guess[i]) {
      continue;
    }
    if (unmatchedTargetWordLetterCounts[letter]) {
      unmatchedTargetWordLetterCounts[letter] += 1;
    } else {
      unmatchedTargetWordLetterCounts[letter] = 1;
    }
  }
  const letterInQuestion = guess[index];
  // How many unmatched letters are there left?
  for (let i = 0; i < index; i++) {
    // If there's an instance of the letter before this, decrement target count
    if (guess[i] == letterInQuestion && guess[i] != targetWord[i]) {
      unmatchedTargetWordLetterCounts[letterInQuestion] -= 1;
    }
  }
  if (unmatchedTargetWordLetterCounts[letterInQuestion] > 0) {
    return true;
  } else {
    return false;
  }
}

function getLetterStatus(targetWord, guess, index) {
  const letter = guess[index];
  if (targetWord[index] == letter) {
    return TILE_STATE_CORRECT;
  }
  if (targetWord.indexOf(letter) != -1) {
    // When is there a duplicate? When there's still a letter of this type to find.
    if (isPresent(targetWord, guess, index)) {
      return TILE_STATE_PRESENT;
    }
  }
  return TILE_STATE_ABSENT;
}

function updateLettersTried() {
  const keyboardKeys = document.getElementsByClassName('key');
  for (const letter in gameState.lettersTried) {
    for (const keyboardKey of keyboardKeys) {
      if (keyboardKey.dataset.key == letter) {
        const letterStatus = gameState.lettersTried[letter];
        if (letterStatus == TILE_STATE_ABSENT) {
          // No luck
          keyboardKey.dataset.state = TILE_STATE_ABSENT;
        } else if (letterStatus == TILE_STATE_CORRECT) {
          keyboardKey.dataset.state = TILE_STATE_CORRECT;
        } else if (letterStatus == TILE_STATE_PRESENT) {
          keyboardKey.dataset.state = TILE_STATE_PRESENT;
        }
      }
    }
  }
}

function updateLetter(letter, letterStatus) {
  const currentLetterStatus = gameState.lettersTried[letter];
  if (letterStatus == TILE_STATE_ABSENT && currentLetterStatus != TILE_STATE_CORRECT && currentLetterStatus != TILE_STATE_PRESENT) {
    gameState.lettersTried[letter] = TILE_STATE_ABSENT;
  } else if (letterStatus == TILE_STATE_CORRECT) {
    gameState.lettersTried[letter] = TILE_STATE_CORRECT;
  } else if (letterStatus == TILE_STATE_PRESENT && currentLetterStatus != TILE_STATE_CORRECT) {
    // We only want to mark something as present if we haven't already found it correctly.
    gameState.lettersTried[letter] = TILE_STATE_PRESENT;
  }
}

async function updateGameBoard() {
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
      tile.dataset.state = getLetterStatus(gameState.targetWord, previousGuess, letterIndex);
      updateLetter(letter, tile.dataset.state);
      tile.dataset.animation = TILE_ANIMATION_FLIP_IN;
      await sleep(60);
    }
    row.dataset.checked = true;
    updateLettersTried();
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
  if (gameState.currentLetters.length < 5 && gameState.currentGameGuesses.length < 4) {
    gameState.currentLetters.push(letter);
    updateGameBoard();
  }
}

function handleDelete() {
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
  await updateGameBoard();
  // Give it a little bit for the last animation to finish.
  await sleep(200);
  alreadyPlayedThrough = false;
  if (candidateWord == gameState.targetWord) {
    gameState.targetFound = true;
    gameState.gameOver = true;
  } else if (gameState.currentGameGuesses.length == 4) {
    gameState.gameOver = true;
  }
  saveGameState();
  if (gameState.gameOver) {
    showDoneModal();
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
    if (gameState.targetFound) {
      return;
    }
    event.preventDefault();
    handleKeyboardEntry(keyboardKey.dataset.key);
  });
  keyboardKey.addEventListener('touchstart', (event) => {
    if (gameState.targetFound) {
      return;
    }
    event.preventDefault();
    handleKeyboardEntry(keyboardKey.dataset.key);
  });
}));