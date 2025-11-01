// basic page elements 

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const heading = document.createElement('h1');
heading.classList.add('heading');
heading.textContent = 'Virtual Handpan';
container.appendChild(heading);

const hangContainer = document.createElement('div');
hangContainer.classList.add('hang-container');
container.appendChild(hangContainer);

const hang = document.createElement('div');
hang.classList.add('hang');
container.appendChild(hang);

const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');
container.appendChild(inputContainer);


// basic hang elements

const noteNames = ['D4', 'A4', 'G4', 'E4', 'C5', 'A3', 'Bb4', 'D5', 'F4'];

const ding = document.createElement('div');
ding.classList.add('note', 'center-note');
ding.dataset.sound = 'note1';
ding.textContent = noteNames[0];
hang.appendChild(ding);

const notes = 8;
for (let i = 2; i <= notes + 1; i++) {
  const note = document.createElement('div');
  note.classList.add('note', 'basic-note');
  note.dataset.sound = `note${i}`;
  note.textContent = noteNames[i - 1];
  hang.appendChild(note);
}

function positionNotes() {
  const basicNotes = hang.querySelectorAll('.basic-note');
  const hangSize = hang.getBoundingClientRect();
  const centerX = hangSize.width / 2;
  const centerY = hangSize.height / 2;
  const radius = hangSize.width / 2 * 0.7;

  basicNotes.forEach((note, i) => {
    const angle = (i / basicNotes.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - note.offsetWidth / 2;
    const y = centerY + radius * Math.sin(angle) - note.offsetHeight / 2;
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
  });
}

positionNotes();
window.addEventListener('resize', positionNotes);


// sounds 

const sounds = {
  note1: 'sounds/D4.wav',
  note2: 'sounds/A4.wav',
  note3: 'sounds/G4.wav',
  note4: 'sounds/E4.wav',
  note5: 'sounds/C5.wav',
  note6: 'sounds/A3.wav',
  note7: 'sounds/Bb4.wav',
  note8: 'sounds/D5.wav',
  note9: 'sounds/F4.wav'
};

let audioCtx = null; 
let audioBuffers = {};
let isAudioReady = false;

async function initAudioIfNeeded() {
  if (audioCtx) return;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextCtor();
  await loadAllBuffers();
  isAudioReady = true;
}

async function loadAllBuffers() {
  const entries = Object.entries(sounds);
  for (const [key, url] of entries) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Failed to fetch ${url}`);
      const arrayBuffer = await r.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      audioBuffers[key] = audioBuffer;
    } catch (err) {
      console.warn('Error loading sound', url, err);
    }
    await new Promise(r => setTimeout(r, 50));
  }
}

async function playBuffer(noteKey) {
  if (!audioCtx || !audioBuffers[noteKey]) return null;
  if (audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (e) {}
  }
  const src = audioCtx.createBufferSource();
  src.buffer = audioBuffers[noteKey];
  src.connect(audioCtx.destination);
  src.start(0);
  return src;
}

hang.querySelectorAll('.note').forEach(note => {
  note.addEventListener('mousedown', async (e) => {
    await initAudioIfNeeded().catch(() => {});
    if (isAudioReady) {
      const src = playBuffer(note.dataset.sound);
      note.classList.add('played');
      if (src) {
        src.onended = () => note.classList.remove('played');
      } else {
        setTimeout(() => note.classList.remove('played'), 400);
      }
    } else {
      note.classList.add('played');
      setTimeout(() => note.classList.remove('played'), 200);
    }
  });

  note.addEventListener('mouseup', () => {
    note.classList.remove('played');
  });

  note.addEventListener('mouseleave', () => {
    note.classList.remove('played');
  });

  note.addEventListener('touchstart', (event) => {
    event.preventDefault();
    playNotebyClick(note.dataset.sound);
    note.classList.add('played');
  }, { passive: false });

  note.addEventListener('touchend', (event) => {
    event.preventDefault();
    note.classList.remove('played');
  }, { passive: false });

  note.addEventListener('touchcancel', (event) => {
    event.preventDefault();
    note.classList.remove('played');
  }, { passive: false });
});


// sounds by click

let currentSound = null;

function playNotebyClick(soundKey) {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  } 
  const audio = audioSounds[soundKey].cloneNode();
  audio.volume = 1;
  audio.play().catch(() => {});
  currentSound = audio; 
}


// keys

const keyMap = {
  KeyS:  { sound: 'note1', name: 'D4' },
  KeyW:  { sound: 'note2', name: 'A4' },
  KeyE:  { sound: 'note3', name: 'G4' },
  KeyD:  { sound: 'note4', name: 'E4' },
  KeyC:  { sound: 'note5', name: 'C5' },
  KeyX:  { sound: 'note6', name: 'A3' },
  KeyZ:  { sound: 'note7', name: 'Bb4' },
  KeyA:  { sound: 'note8', name: 'D5' },
  KeyQ:  { sound: 'note9', name: 'F4' },
};

const pressedKeys = new Set();
let currentKey = null;

function playNoteKey(soundKey) {
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }
  const audio = audioSounds[soundKey].cloneNode();
  audio.volume = 1;
  audio.play().catch(() => {});
  currentSound = audio;
  const note = hang.querySelector(`[data-sound="${soundKey}"]`);
  if (note) note.classList.add('played');
}

window.addEventListener('keydown', (event) => {
  if (document.activeElement.tagName === 'INPUT') return;
  const key = event.code;
  if (!keyMap[key] || currentKey || pressedKeys.has(key)) return;
  currentKey = key;
  pressedKeys.add(key);
  const { sound, name } = keyMap[key];
  playNoteKey(sound);
});

window.addEventListener('keyup', (event) => {
  const key = event.code;
  if (key !== currentKey) return;
  if (!keyMap[key]) return;

  const { sound } = keyMap[key];
  const note = hang.querySelector(`[data-sound="${sound}"]`);
  if (note) note.classList.remove('played');
  if (pressedKeys.has(key)) pressedKeys.delete(key);
  currentKey = null;
});


// key table 

const tableContainer = document.createElement('div');
tableContainer.classList.add('keys-table');
container.appendChild(tableContainer);

const tableHeader = document.createElement('h2');
tableHeader.textContent = ' Notes → Keyboard';
tableContainer.appendChild(tableHeader);

const keyTable = document.createElement('table');
tableContainer.appendChild(keyTable);

const header = document.createElement('tr');
const headerNote = document.createElement('th');
headerNote.textContent = 'Note';

header.appendChild(headerNote);
const headerKey = document.createElement('th');
headerKey.textContent = 'Key';

header.appendChild(headerKey);
const headerEdit = document.createElement('th');
headerEdit.textContent = 'Edit';
header.appendChild(headerEdit);
keyTable.appendChild(header);

Object.entries(keyMap).forEach(([key, { name }]) => {
  const header = document.createElement('tr');
  const row = document.createElement('tr');

  const columnNote = document.createElement('td');
  columnNote.textContent = name;
  row.appendChild(columnNote);

  const columnKey = document.createElement('td');
  columnKey.classList.add('key-column');
  columnKey.textContent = key.replace('Key', '');
  row.appendChild(columnKey);

  const columnEdit = document.createElement('td');
  columnEdit.classList.add('edit-button');
  columnEdit.textContent = '✏️';
  row.appendChild(columnEdit);

  keyTable.appendChild(row);
});


// edit input

let editingKey = null; 

keyTable.addEventListener('click', (event) => {
  if (!event.target.classList.contains('edit-button')) return;

  const editButton = event.target;
  const row = event.target.closest('tr');
  const keyArea = row.querySelector('.key-column');
  const templateKey = keyArea.textContent;
  editButton.classList.add('active');

  const editField = document.createElement('input');
  editField.type = 'text';
  editField.value = templateKey;
  editField.classList.add('edit-field');
  editField.maxLength = 1;

  keyArea.textContent = '';
  keyArea.appendChild(editField);
  editField.focus();

  editingKey = keyArea;

  editField.addEventListener('input', () => {
    editField.value = editField.value.toUpperCase();
  });

  editField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newKey = editField.value.trim().toUpperCase();
      if (!/^[A-Z]$/.test(newKey)) {
        openModal('Please enter a single English letter (A-Z).');
        editButton.classList.remove('active');
        return;
      }

      if (keyMap[`Key${newKey}`]) {
       openModal(`Key "${newKey}" is already used!`);
       editButton.classList.remove('active');
       editButton.blur();
       return;
      }
  
      const oldKey = `Key${templateKey}`;
      const sound = keyMap[oldKey].sound;
      const name = keyMap[oldKey].name;
      keyMap[`Key${newKey}`] = { sound, name };
      delete keyMap[oldKey];

      if (musicInput.value.includes(templateKey)) {
        musicInput.value = '';
      }

      keyArea.textContent = newKey;
      editingKey = null;
      editButton.classList.remove('active');
      editButton.blur();
    }

    if (event.key === 'Escape') {
      keyArea.textContent = templateKey;
      editingKey = null;
      editButton.classList.remove('active');
      editButton.blur();
    }
  });

  editField.addEventListener('blur', () => {
    if (editingKey) keyArea.textContent = keyArea.querySelector('input') ? templateKey : keyArea.textContent;
    editingKey = null;
    editButton.classList.remove('active');
    editButton.blur();
  });
});


// music input field

const musicInput = document.createElement('input');
musicInput.classList.add('music-input');
musicInput.type = 'text';
musicInput.placeholder = 'Type your key sequence';
musicInput.maxLength = 18;
inputContainer.appendChild(musicInput);

const playButton = document.createElement('button');
playButton.classList.add('play-button');
playButton.textContent = 'Play';
inputContainer.appendChild(playButton);

musicInput.addEventListener('input', () => {
  const validKeys = Object.keys(keyMap).map(k => k.replace('Key','').toUpperCase());
  musicInput.value = musicInput.value.toUpperCase().split('').filter(ch => validKeys.includes(ch)).join('');
});

let melodyAudio = null;

async function playMelody(sequence) {
  if (!sequence) return;
  await initAudioIfNeeded().catch(() => {});
  if (!isAudioReady) return;

  musicInput.disabled = true;
  playButton.disabled = true;
  musicInput.style.opacity = '0.5';
  playButton.style.opacity = '0.5';

  const editButtons = keyTable.querySelectorAll('.edit-button');
  editButtons.forEach(b => { b.classList.add('disabled'); b.style.pointerEvents = 'none'; b.style.opacity = '0.4'; });

  hang.style.pointerEvents = 'none';
  let isKeysLocked = true;

  function lockKeyboard(event) {
    if (isKeysLocked) event.stopImmediatePropagation();
  }

  window.addEventListener('keydown', lockKeyboard, true);
  window.addEventListener('keyup', lockKeyboard, true);

  if (melodyAudio) {
    melodyAudio.pause();
    melodyAudio.currentTime = 0;
  }

  for (const ch of sequence.split('')) {
    const code = `Key${ch}`;
    if (!keyMap[code]) continue;
    const soundKey = keyMap[code].sound;
    const note = hang.querySelector(`[data-sound="${soundKey}"]`);
    if (note) note.classList.add('played');

    const src = audioCtx.createBufferSource();
    src.buffer = audioBuffers[soundKey];
    src.connect(audioCtx.destination);
    src.start(0);

    await new Promise(resolve => {
      let done = false;
      src.onended = () => { if (!done) { done = true; resolve(); } };
      setTimeout(() => { if (!done) { done = true; resolve(); } }, 500);
    });

    if (note) note.classList.remove('played');
  }

  keyboardLocked = false;
  window.removeEventListener('keydown', keyBlocker, true);
  window.removeEventListener('keyup', keyBlocker, true);
  for (let sound of melody) {
    const key = `Key${sound.toUpperCase()}`;
    if (keyMap[key]) {
      const soundKey = keyMap[key].sound;
      const note = hang.querySelector(`[data-sound="${soundKey}"]`);

      if (melodyAudio) {
      melodyAudio.pause();
      melodyAudio.currentTime = 0;
    }

    const audio = audioSounds[soundKey].cloneNode();
    audio.volume = 1;
    audio.play().catch(() => {});
    melodyAudio = audio;

    hang.querySelectorAll('.note').forEach(n => n.classList.remove('played'));
    if (note) note.classList.add('played');


    await new Promise(resolve => setTimeout(resolve, 1500));

    audio.pause();
    audio.currentTime = 0;
    if (note) note.classList.remove('played');
    melodyAudio = null;

    await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  musicInput.disabled = false;
  playButton.disabled = false;
  musicInput.style.opacity = '1';
  playButton.style.opacity = '1';
  hang.style.pointerEvents = 'auto';
  isKeysLocked = false;

  window.removeEventListener('keydown', lockKeyboard, true);
  window.removeEventListener('keyup', lockKeyboard, true);

  editButtons.forEach(b => { b.classList.remove('disabled'); b.style.pointerEvents = 'auto'; b.style.opacity = '1'; });
}

playButton.addEventListener('click', () => {
  const melody = musicInput.value.trim();
  if (!melody) return;
  playMelody(melody);
});


// modal 

const modalOverlay = document.createElement('div');
modalOverlay.id = 'modalOverlay';
modalOverlay.classList.add('modal-overlay');

const modalWindow = document.createElement('div');
modalWindow.id = 'modal';
modalWindow.classList.add('modal');
modalOverlay.appendChild(modalWindow);

const modalContent = document.createElement('p');
modalContent.id = 'modalContent';
modalContent.classList.add('modal-content');
modalWindow.appendChild(modalContent);

const modalButton = document.createElement('button');
modalButton.id = 'modalButton';
modalButton.classList.add('modal-button');
modalButton.textContent = 'OK';
modalWindow.appendChild(modalButton);

document.body.appendChild(modalOverlay);

modalButton.addEventListener('click', () => {
  modalWindow.style.transform = 'scale(0.8)';
  modalWindow.style.opacity = '0';
  setTimeout(() => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 200); 
});

function openModal(content, btnText = 'OK') {
  modalContent.textContent = content;
  modalButton.textContent = btnText;
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    modalWindow.style.transform = 'scale(1)';
    modalWindow.style.opacity = '1';
  });
}


// start modal 

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  openModal('Tap "Start" to enable sound', 'Start');
modalButton.addEventListener('click', async function startHandler() {
  if (!audioCtx) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextCtor();
  }

  if (audioCtx.state === 'suspended') {
    try { await audioCtx.resume(); } catch (e) {}
  }

  const buffer = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);

  await loadAllBuffers();
  isAudioReady = true;
   modalWindow.style.transform = 'scale(0.8)';
  modalWindow.style.opacity = '0';
  setTimeout(() => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 200);
}, { once: true });

} else {
  const firstGesture = async () => {
    await initAudioIfNeeded().catch(() => {});
    if (audioCtx && audioCtx.state === 'suspended') {
      try { await audioCtx.resume(); } catch (e) {}
    }
    window.removeEventListener('touchstart', firstGesture);
    window.removeEventListener('click', firstGesture);
  };
  window.addEventListener('touchstart', firstGesture, { once: true, passive: true });
  window.addEventListener('click', firstGesture, { once: true });
}