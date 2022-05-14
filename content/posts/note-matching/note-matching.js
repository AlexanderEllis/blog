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

// C2 is 36
var FULL_RANGE = [
  "c2", "c-2", "d2", "d-2", "e2", "f2", "f-2", "g2", "g-2", "a2", "a-2", "b2",  // 2
  "c3", "c-3", "d3", "d-3", "e3", "f3", "f-3", "g3", "g-3", "a3", "a-3", "b3",  // 3
  "c4", "c-4", "d4", "d-4", "e4", "f4", "f-4", "g4", "g-4", "a4", "a-4", "b4",  // 4
  "c5", "c-5", "d5", "d-5", "e5", "f5", "f-5", "g5", "g-5", "a5", "a-5", "b5",  // 5
  "c6", "c-6", "d6", "d-6", "e6", "f6", "f-6", "g6", "g-6", "a6", "a-6", "b6",  // 6
];

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

function getRandomNotes(n) {
  // Maybe we should pick a first random one, then one within 12?

  // Get n random notes.
  let notesToPlay = [];
  const firstNoteIndex = Math.floor(Math.random() * ALL_NOTES.length);
  notesToPlay.push(ALL_NOTES[firstNoteIndex]);
  for (let i = 1; i < n; i++) {
    const offset = Math.floor(Math.random() * 12) - 6;
    // console.log(offset);
    if (firstNoteIndex + offset < 0) {
      notesToPlay.push(ALL_NOTES[0]);
    } else if (firstNoteIndex + offset >= ALL_NOTES.length) {
      notesToPlay.push(ALL_NOTES[ALL_NOTES.length - 1]);
    } else {
      notesToPlay.push(ALL_NOTES[firstNoteIndex + offset]);
    }
  }
  return notesToPlay;
}

// Statuses for the game
const INIT = 0;
const PLAYING = 1;
const LISTENING = 2;
const IN_BETWEEN = 3;


const NUM_NOTES = 1;
const NUM_REPEATS = 0;

class NoteMatchingGame {
  constructor() {
    this.status = INIT;
    this.notes = [];
    this.numRepeats = NUM_REPEATS
    this.numberOfNotes = NUM_NOTES;
    // The pending notes we've heard so far while listening.
    this.notesSoFar = [];

    // Streaks for fun
    this.totalCorrect = 0;
    this.perfectStreak = 0;
    this.bestPerfectStreak = 0;

    this.handleNote = this.handleNote.bind(this);
    this.replayNotes = this.replayNotes.bind(this);
    document.getElementById('replayButton').addEventListener('click', this.replayNotes);
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
  }

  async startNewGame() {
    this.getDefaults();
    // Clear out status, results, etc
    this.updateStatus('');
    this.resetAllAttempts();
    this.startNewAttempt();
    this.numAlreadyCorrect = 0;

    // Pick some notes
    this.notes = getRandomNotes(this.numberOfNotes);
    // console.log(this.notes);

    await this.playNotes();
  }

  updateStatus(status) {
    document.getElementById('status').innerText = status;;
  }

  async playNotes() {
    // console.log(this.notes);
    this.noteListener.stopListening();
    this.status = PLAYING;
    this.updateStatus('Playing notes...');
    await sleep(100);
    await playNotes(this.notes);
    await sleep(200);

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

  startNewAttempt() {
    this.notesSoFar = [];
    this.currentResults = document.createElement('div');
    document.getElementById('results').appendChild(this.currentResults);
  }

  formatNote(note) {
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
    newSpan.innerText = this.formatNote(note);
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
      await sleep(3000);
      // Start over.
      this.startNewGame();
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
      await sleep(2000);
      this.startNewAttempt();
      this.replayNotes();
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
});
