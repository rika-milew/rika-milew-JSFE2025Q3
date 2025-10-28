// basic page elements 

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const heading = document.createElement('h1');
heading.classList.add('heading');
heading.textContent = 'Virtual Handpan';
container.appendChild(heading);


// basic hang elements

const hangContainer = document.createElement('div');
hangContainer.classList.add('hang-container');
container.appendChild(hangContainer);

const hang = document.createElement('div');
hang.classList.add('hang');
container.appendChild(hang);

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

// hang.querySelectorAll('.note').forEach(note => {
//   note.addEventListener('click', () => {
//     playNotebyClick(note.dataset.sound);
//   });
// });


hang.querySelectorAll('.note').forEach(note => {
  note.addEventListener('mousedown', () => {
    playNotebyClick(note.dataset.sound);   
    note.classList.add('played');          
  });


  note.addEventListener('mouseup', () => {
    note.classList.remove('played');       
  });

  
  note.addEventListener('mouseleave', () => {
    note.classList.remove('played');       
  });
});


// sounds by click

function playNotebyClick(soundKey) {
  const audio = new Audio(sounds[soundKey]);
  audio.volume = 1;
  audio.play();
  // const note = hang.querySelector(`[data-sound="${soundKey}"]`);
  // if (note) {
  //   note.classList.remove('played');
  //   void note.offsetWidth; 
  //   note.classList.add('played');
  //   clearTimeout(note.timeout);
  //   note.timeout = setTimeout(() => note.classList.remove('played'), 300);
  // }
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
  KeyQ:  { sound: 'note9', name: 'F4' }
};

const pressedKeys = new Set();
let currentKey = null;

function playNoteKey(soundKey) {
  const audio = new Audio(sounds[soundKey]);
  audio.volume = 1;
  audio.play();
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
tableHeader.textContent = 'Keyboard → Notes';
tableContainer.appendChild(tableHeader);

const keyTable = document.createElement('table');
tableContainer.appendChild(keyTable);

const header = document.createElement('tr');
header.innerHTML = '<th>Note</th><th>Key</th><th>Edit</th>';
keyTable.appendChild(header);

Object.entries(keyMap).forEach(([key, { name }]) => {
  const row = document.createElement('tr');
  row.innerHTML = `<td>${name}</td><td class="key-column">${key.replace('Key','')}</td><td class="edit-button">✏️</td>`;
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
  editField.style.width = '40px';
  editField.style.textAlign = 'center';
  editField.style.textTransform = 'uppercase';

  keyArea.textContent = '';
  keyArea.appendChild(editField);
  editField.focus();

  editingKey = keyArea;

  editField.addEventListener('input', () => {
    editField.value = editField.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
  });

  editField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newKey = editField.value.toUpperCase();
      if (!newKey.match(/^[A-Z]$/)) {
        alert('Please enter a single English letter (A–Z).');
        editButton.classList.remove('active');
        return;
      }

      if (keyMap[`Key${newKey}`]) {
       alert(`Key "${newKey}" is already used!`);
       editButton.classList.remove('active');
       editButton.blur();
       return;
      }
  
      const oldKey = `Key${templateKey}`;
      const sound = keyMap[oldKey].sound;
      const name = keyMap[oldKey].name;
      keyMap[`Key${newKey}`] = { sound, name };
      delete keyMap[oldKey];

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

const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');
container.appendChild(inputContainer);

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


