// Shout out to SingleInfinity for these files.
// https://webcache.googleusercontent.com/search?q=cache%3AEvxrnji0pxcJ%3Ahttps%3A%2F%2Fwww.reddit.com%2Fr%2Fpiano%2Fcomments%2F3u6ke7%2Fheres_some_midi_and_mp3_files_for_individual%2F+&cd=1&hl=en&ct=clnk&gl=us
// Note that b4 is actually b3 repeated!
// C3 is 48
// Also some notes are incorrect unfortunately, notably the As
var ALL_NOTES = [
  "a2", "a-2",                                                                      // 2
  "c3", "c-3", "d3", "d-3", "e3", "f3", "f-3", "g3", "g-3", "a3", "a-3", "b3",      // 3
  "c4", "c-4", "d4", "d-4", "e4", "f4", "f-4", "g4", "g-4", "a4", "a-4", "b4",      // 4
  "c5", "c-5", "d5", "d-5", "e5", "f5", "f-5", "g5", "g-5", /*"a5", "a-5", "b5",*/  // 5
  "c6",                                                                             // 6
];

var BASE_CLEF_NOTES = [
  "a2", "a-2",                                                                      // 2
  "c3", "c-3", "d3", "d-3", "e3", "f3", "f-3", "g3", "g-3", "a3", "a-3", "b3",      // 3
  // "c4", "c-4", "d4", "d-4", "e4", "f4", "f-4", "g4", "g-4", "a4", "a-4", "b4",      // 4
  // "c5", "c-5", "d5", "d-5", "e5", "f5", "f-5", "g5", "g-5", /*"a5", "a-5", "b5",*/  // 5
  // "c6",                                                                             // 6
];

var TREBLE_CLEF_NOTES = [
  // "a2", "a-2",                                                                      // 2
  // "c3", "c-3", "d3", "d-3", "e3", "f3", "f-3", "g3", "g-3", "a3", "a-3", "b3",      // 3
  "c4", "c-4", "d4", "d-4", "e4", "f4", "f-4", "g4", "g-4", "a4", "a-4", "b4",      // 4
  "c5", "c-5", "d5", "d-5", "e5", "f5", "f-5", "g5", "g-5", /*"a5", "a-5", "b5",*/  // 5
  "c6",                                                                             // 6
];

// C2 is 36
var FULL_RANGE = [
  "c2", "c-2", "d2", "d-2", "e2", "f2", "f-2", "g2", "g-2", "a2", "a-2", "b2",  // 2
  "c3", "c-3", "d3", "d-3", "e3", "f3", "f-3", "g3", "g-3", "a3", "a-3", "b3",  // 3
  "c4", "c-4", "d4", "d-4", "e4", "f4", "f-4", "g4", "g-4", "a4", "a-4", "b4",  // 4
  "c5", "c-5", "d5", "d-5", "e5", "f5", "f-5", "g5", "g-5", "a5", "a-5", "b5",  // 5
  "c6", "c-6", "d6", "d-6", "e6", "f6", "f-6", "g6", "g-6", "a6", "a-6", "b6",  // 6
];

// The flat spelling of each sharp, e.g. C# is Db.
const FLAT_NAMES = {c: 'D', d: 'E', f: 'G', g: 'A', a: 'B'};

// Supported keys. `signature` maps each letter in the key signature to its accidental, and
// `flats` says whether black keys are spelled as flats (Bb) rather than sharps (A#).
const KEYS = {
  'C':  {signature: {},               flats: false},
  'G':  {signature: {F: '#'},         flats: false},
  'D':  {signature: {F: '#', C: '#'}, flats: false},
  'Bb': {signature: {B: 'b', E: 'b'}, flats: true},
};

// Splits a formatted note like "Bb4" into its letter, accidental and octave.
function parseNote(formattedNote) {
  let [, letter, accidental, octave] = formattedNote.match(/^([A-G])([#b]?)(\d)$/);
  return {letter, accidental, octave};
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// This is wild if this works. Keep a map of the audios around and instantiate them on
// user action for mobile safari.
var audioMap = {};

async function playNote(source) {
  // console.log(source);
  // It sounds like we may need an explicit user action every time we create a new audio?
  await new Promise((resolve) => {
    var audio = audioMap[source];
    audio.onended = resolve;
    audio.play()
      .catch(eror => {
        // Probably iOS permissions and couldn't autoplay.
        // console.log(error);
        resolve();
      });
  });
}

async function playNotes(notes) {
  // console.log(ALL_NOTES);
  for (let note of notes) {
    await playNote('notes/' + note + '.mp3');
  }
}

async function playRandomNotes(n) {
  playNotes(getRandomNotes(n));
}

// Picks n random notes from pool, all within maxOffset steps of the first one.
function getRandomNotes(n, pool = ALL_NOTES, maxOffset = 6) {
  // Get n random notes.
  let notesToPlay = [];
  const firstNoteIndex = Math.floor(Math.random() * pool.length);
  notesToPlay.push(pool[firstNoteIndex]);
  for (let i = 1; i < n; i++) {
    const offset = Math.floor(Math.random() * 2 * maxOffset) - maxOffset;
    // console.log(offset);
    if (firstNoteIndex + offset < 0) {
      notesToPlay.push(pool[0]);
    } else if (firstNoteIndex + offset >= pool.length) {
      notesToPlay.push(pool[pool.length - 1]);
    } else {
      notesToPlay.push(pool[firstNoteIndex + offset]);
    }
  }
  return notesToPlay;
}

// Statuses for the game
const INIT = 0;
const PLAYING = 1;
const LISTENING = 2;
const IN_BETWEEN = 3;

// Timing constants
const WAIT_BETWEEN = 2000;


const NUM_NOTES = 8;
const NUM_REPEATS = 0;

// Staff layout: quarter notes in 4/4, so 4 per bar.
const NOTES_PER_BAR = 4;
const FIRST_BAR_WIDTH = 350;
const BAR_WIDTH = 270;
// Extra room in the first bar for each sharp or flat in the key signature.
const KEY_ACCIDENTAL_WIDTH = 12;

class NoteMatchingGame {
  constructor() {
    this.status = INIT;
    this.notes = [];
    this.numRepeats = NUM_REPEATS
    this.numberOfNotes = NUM_NOTES;
    this.showStaff = true;
    this.shouldPlayNotes = false;
    this.key = 'C';
    this.notesOutsideKey = false;
    this.round = 0;
    // The pending notes we've heard so far while listening.
    this.notesSoFar = [];

    // Streaks for fun
    this.totalCorrect = 0;
    this.perfectStreak = 0;
    this.bestPerfectStreak = 0;

    this.handleNote = this.handleNote.bind(this);
    this.replayNotes = this.replayNotes.bind(this);
    this.resetAttempt = this.resetAttempt.bind(this);
    this.nextRound = this.nextRound.bind(this);
    document.getElementById('nextRoundButton').addEventListener('click', this.nextRound);
    document.getElementById('replayButton').addEventListener('click', this.replayNotes);
    document.getElementById('resetButton').addEventListener('click', this.resetAttempt);
  }

  initializeListener() {
    this.noteListener = new NoteListener(this.handleNote);
    // Also initialize all Audio elements in audioMap...
    for (const note of ALL_NOTES) {
      var source = 'notes/' + note + '.mp3';
      audioMap[source] = new Audio(source);
    }
  }

  getDefaults() {
    this.numberOfNotes = parseInt(document.getElementById('numNotes').value)
    this.numRepeats = parseInt(document.getElementById('numRepeats').value)
    this.showStaff =
        document.getElementById("show-staff").checked;
    this.shouldPlayNotes = document.getElementById("play-notes").checked;
    this.key = document.getElementById('key').value;
    this.notesOutsideKey = document.getElementById('outside-key').checked;
  }

  // Whether a note belongs to the current key, i.e. its accidental matches the key signature.
  isInKey(note) {
    let {letter, accidental} = parseNote(this.formatNote(note));
    return accidental == (KEYS[this.key].signature[letter] || '');
  }

  async startNewGame() {
    // Bumped every round so delayed steps from an earlier round know to stop.
    this.round += 1;
    this.getDefaults();
    // Clear out status, results, etc
    this.updateStatus('');
    this.resetAllAttempts();
    this.startNewAttempt();
    this.numAlreadyCorrect = 0;

    // Pick some notes
    if (this.notesOutsideKey) {
      this.notes = getRandomNotes(this.numberOfNotes);
    } else {
      // A scale has 7 of the 12 notes, so jump fewer steps to keep a similar range.
      this.notes = getRandomNotes(this.numberOfNotes, ALL_NOTES.filter(note => this.isInKey(note)), 4);
    }
    // Randomly spell each note outside the key as a sharp or a flat (C# vs Db).
    this.useFlats = this.notes.map(() => Math.random() < 0.5);

    if (this.showStaff) {
      this.drawNotes();
    }

    await this.playNotes();
  }

  drawNotes() {

    // Clear it out first
    document.getElementById("staff").innerHTML = "";

    // Create an SVG renderer and attach it to the DIV element named "staff".
    var vf = new Vex.Flow.Factory({renderer: {elementId: 'staff', width: 800, height: 240}});
    var score = vf.EasyScore();

    // Let's use the first one to figure out where we draw it.
    let firstNote = this.notes[0];
    let isTreble = false;
    if (TREBLE_CLEF_NOTES.includes(firstNote)) {
      isTreble = true;
    }

    // Each bar gets its own system, laid out left to right. Only the first has the clefs
    // and time signature, so it needs to be wider.
    let x = 0;
    for (let barStart = 0; barStart < this.notes.length; barStart += NOTES_PER_BAR) {
      let isFirstBar = barStart == 0;
      let numKeyAccidentals = Object.keys(KEYS[this.key].signature).length;
      let width = isFirstBar ? FIRST_BAR_WIDTH + KEY_ACCIDENTAL_WIDTH * numKeyAccidentals : BAR_WIDTH;
      var system = vf.System({ x: x, y: 0, width: width});
      x += width;

      let joinedNotes = this.formatBar(barStart, isTreble);
      let trebleNotes = isTreble ? joinedNotes : "C5/1/r"
      let bassNotes = isTreble ? "D3/1/r" : joinedNotes;

      console.log("trebleNotes", trebleNotes);
      console.log("bassNotes", bassNotes);

      // Always add a bass and a treble
      let trebleStave = system.addStave({
        voices: [
          score.voice(score.notes(trebleNotes, {stem: 'up'})),
        ]
      });

      let bassStave = system.addStave({
        voices: [
          score.voice(score.notes(bassNotes, {clef: 'bass', stem: 'up'})),
        ]
      });

      if (isFirstBar) {
        trebleStave.addClef('treble').addKeySignature(this.key).addTimeSignature('4/4');
        bassStave.addClef('bass').addKeySignature(this.key).addTimeSignature('4/4');
      }
    }

    vf.draw();
  }

  // Formats the notes of the bar starting at barStart into an EasyScore string, padded with rests.
  formatBar(barStart, isTreble) {
    let barNotes = this.notes.slice(barStart, barStart + NOTES_PER_BAR);

    // A sign is only drawn when a note differs from the accidental already in effect. The key
    // signature applies to every octave, while a sign in the bar carries through the rest of the
    // bar for that staff position only (e.g. C#4 then C4 needs a natural; in Bb, B4 needs one too).
    // Maps staff position (e.g. "C4") to the accidental drawn earlier in this bar.
    let signature = KEYS[this.key].signature;
    let accidentals = {};
    let formattedNotes = barNotes.map((note, index) => {
      let {letter, accidental, octave} = parseNote(this.spellNote(barStart + index));
      let position = letter + octave;
      let inEffect = position in accidentals ? accidentals[position] : (signature[letter] || '');
      // EasyScore uses 'n' for a natural, e.g. "Cn4". VexFlow places notes by staff position,
      // so a plain "B4" is drawn on the B line and the key signature makes it a Bb.
      let formattedNote = letter + (accidental == inEffect ? '' : (accidental || 'n')) + octave;
      accidentals[position] = accidental;
      if (index == 0) {
        formattedNote += "/q";
      }
      return formattedNote;
    });

    while (formattedNotes.length < NOTES_PER_BAR) {
      formattedNotes.push(isTreble ? "C5/r" : "D3/r");
    }

    return formattedNotes.join(", ");
  }

  updateStatus(status) {
    document.getElementById('status').innerText = status;;
  }

  async playNotes() {
    // console.log(this.notes);
    this.noteListener.stopListening();
    if (this.shouldPlayNotes) {
      this.status = PLAYING;
      this.updateStatus('Playing notes...');
      await sleep(100);
      await playNotes(this.notes);
      await sleep(200);
    }

    // Transition to listening
    this.listenForNotes();
  }

  async replayNotes() {
    if (this.status == PLAYING) {
      return;
    }
    this.playNotes();
  }

  notesMatch() {
    return this.notes.length == this.notesSoFar.length &&
      this.notes.every((note, index) => {
        return note == this.notesSoFar[index];
      });
  }

  resetAllAttempts() {
    while (document.getElementById('results').firstChild) {
      document.getElementById('results').removeChild(
        document.getElementById('results').firstChild);
    }
    this.notesSoFar = [];
    this.currentResults = null;
  }

  // Skips to a fresh round with the current options, without touching the streaks.
  nextRound() {
    // Don't overlap the notes that are playing, same as replay.
    if (this.status == PLAYING) {
      return;
    }
    this.startNewGame();
  }

  // Throws away the notes heard so far in this attempt so you can start it over.
  resetAttempt() {
    if (this.status != LISTENING) {
      return;
    }
    this.notesSoFar = [];
    this.currentResults.innerHTML = '';
  }

  startNewAttempt() {
    this.notesSoFar = [];
    this.currentResults = document.createElement('div');
    document.getElementById('results').appendChild(this.currentResults);
  }

  // Spells the note at index in this.notes as it's shown on the staff. Notes in the key use the
  // key's spelling, and notes outside it are randomly a sharp or a flat.
  spellNote(index) {
    let note = this.notes[index];
    let useFlat = this.isInKey(note) ? KEYS[this.key].flats : this.useFlats[index];
    return this.formatNote(note, useFlat);
  }

  // Spells a note, by default for the current key, e.g. "a-4" is "Bb4" in Bb but "A#4" in D.
  formatNote(note, useFlat = KEYS[this.key].flats) {
    if (useFlat && note.includes('-')) {
      // Spell the sharp as the flat of the next letter up, e.g. "c-4" -> "Db4".
      return FLAT_NAMES[note[0]] + 'b' + note.slice(2);
    }
    // Uppercase and replace '-' with '#'
    return note.replace('-', '#').toUpperCase();
  }

  updateStreaks(isPerfect) {
    this.totalCorrect += 1;
    if (isPerfect) {
      this.perfectStreak += 1;
      if (this.perfectStreak > this.bestPerfectStreak) {
        this.bestPerfectStreak = this.perfectStreak;
      }
    } else {
      this.perfectStreak = 0;
    }

    document.getElementById('totalCorrect').innerText = this.totalCorrect;
    document.getElementById('perfectStreak').innerText = this.perfectStreak;
    document.getElementById('bestPerfectStreak').innerText = this.bestPerfectStreak;
  }

  async handleNote(note) {
    // console.log(note);
    const currentIndex = this.notesSoFar.length;
    if (this.status == PLAYING || currentIndex >= this.notes.length) {
      return;
    }

    // Add it to the results so far.
    this.notesSoFar.push(note);
    let noteMatches = this.notes[currentIndex] == note;

    let newSpan = document.createElement('span');
    newSpan.classList.add('note');
    // Show a correct note with the same spelling as the staff.
    newSpan.innerText = noteMatches ? this.spellNote(currentIndex) : this.formatNote(note);
    newSpan.style.color = noteMatches ? 'green' : 'black';
    this.currentResults.appendChild(newSpan);


    // Check if they all match, if they do, we can restart!
    if (this.notesMatch() && this.numAlreadyCorrect == this.numRepeats) {
      this.noteListener.stopListening();
      this.updateStatus('You got it!');

      // It'll be perfect if the number of attempts is equal to the number of repeats.
      const isPerfect = document.getElementById('results').childElementCount == this.numRepeats + 1;
      this.updateStreaks(isPerfect);
      this.status = IN_BETWEEN;
      const round = this.round;
      await sleep(WAIT_BETWEEN);
      // Start over, unless "Next round" already did.
      if (round == this.round) {
        this.startNewGame();
      }
    } else if (currentIndex == this.notes.length - 1) {
      this.noteListener.stopListening();
      // We're past what we should be listening for. Replay and restart.
      if (this.notesMatch()) {
        this.numAlreadyCorrect += 1;
        this.updateStatus('Nice! Again?');
      } else {
        this.updateStatus('Not quite!');
        this.numAlreadyCorrect = 0;
      }
      this.status = IN_BETWEEN;
      const round = this.round;
      await sleep(2000);
      if (round == this.round) {
        this.startNewAttempt();
        this.replayNotes();
      }
    }
  }

  listenForNotes() {
    this.status = LISTENING;
    this.updateStatus('Listening...');
    this.noteListener.startListening();
  }
}

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
// Note that c3 is midi note 48 and c6 is midi note 84.
function midiNoteFromPitch(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}


const MIN_NOTE_DURATION_MS = 400;

// Basic class for a listener.
class NoteListener {
  constructor(onNoteFunction) {
    this.onNote = onNoteFunction;
    this.listening = false;

    // Keeping track of the current note that we want to report
    this.currentNote = null;
    this.currentNoteStart = null;
    // Only report the same note once.
    this.sentNote = false;

    this.listen = this.listen.bind(this);
    this.initialize();
  }

  startListening() {
    this.listening = true;
  }

  stopListening() {
    this.listening = true;
  }

  initialize() {
    this.source;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.minDecibels = -100;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      // No audio allowed
      alert('Sorry, getUserMedia is required for the app.')
      return;
    } else {
      var constraints = { audio: true };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(
          (stream) => {
            // Initialize the SourceNode
            this.source = this.audioContext.createMediaStreamSource(stream);
            // Connect the source node to the analyzer
            this.source.connect(this.analyser);
            this.listen();
          }
        )
        .catch(function (err) {
          // console.log(err);
          alert('Sorry, microphone permissions are required for the app. Feel free to read on without playing :)')
        });
    }
  }

  listen() {
    this.listenNote = requestAnimationFrame(this.listen);
    if (!this.listening) {
      return;
    }
    var bufferLength = this.analyser.fftSize;
    var buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);
    var autoCorrelateValue = autoCorrelate(buffer, this.audioContext.sampleRate)

    if (autoCorrelateValue === -1) {
      // No value found, reset.
      this.currentNote = null;
      this.currentNoteStart = null;
      return;
    }

    const midiNoteValue = midiNoteFromPitch(autoCorrelateValue);
    // Our "full range" starts at 36 and ends at
    const noteIndex = midiNoteValue - 36;
    if (noteIndex < 0 || noteIndex >= FULL_RANGE.length) {
      // Outside of our range, so reset.
      this.currentNote = null;
      this.currentNoteStart = null;
      return;
    }
    const note = FULL_RANGE[noteIndex];

    // We have a note!
    // Check if it's the same as the current note - we want to hear a note for at least 1 second.
    if (note == this.currentNote) {
      // If we're past the threshold, report it once.
      const min_duration = document.getElementById('minDuration').value;
      if (Date.now() - this.currentNoteStart > min_duration && !this.sentNote) {
        this.onNote(note);
        this.sentNote = true;
      }
    } else {
      this.currentNote = note;
      this.currentNoteStart = Date.now();
      this.sentNote = false;
    }
  }
}

const game = new NoteMatchingGame();

document.getElementById('startButton').addEventListener('click', () => {
  game.initializeListener()
  game.startNewGame();
  document.getElementById('startButton').disabled = true;
  document.getElementById('replayButton').disabled = false;
  document.getElementById('resetButton').disabled = false;
  document.getElementById('nextRoundButton').disabled = false;
});
