// basic hang elements

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

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
  const x = 200;
  const y = 200;
  const radius = 140;

hang.querySelectorAll('.note').forEach(note => {
  note.addEventListener('click', () => {
    note.classList.add('played');
    setTimeout(() => note.classList.remove('played'), 200);
    console.log('Played:', note.dataset.sound); 
  });
});