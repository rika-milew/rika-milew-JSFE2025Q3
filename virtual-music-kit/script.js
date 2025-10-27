// basic page elements 

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const heading = document.createElement('h1');
heading.classList.add('heading');
heading.textContent = 'Virtual Hang Drum';
container.appendChild(heading);




// basic hang elements

const hangContainer = document.createElement('div');
hangContainer.classList.add('hang-container');
container.appendChild(hangContainer);

const hang = document.createElement('div');
hang.classList.add('hang');
container.appendChild(hang);

const ding = document.createElement('div');
ding.classList.add('note', 'center-note');
ding.dataset.sound = 'note1';
hang.appendChild(ding);

const notes = 8;
for (let i = 2; i <= notes + 1; i++) {
  const note = document.createElement('div');
  note.classList.add('note', 'basic-note');
  note.dataset.sound = `note${i}`;
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

hang.querySelectorAll('.note').forEach(note => {
  note.addEventListener('click', () => {
    note.classList.add('played');
    setTimeout(() => note.classList.remove('played'), 200);
    console.log('Played:', note.dataset.sound); 
  });
});