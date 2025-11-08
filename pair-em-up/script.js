// start screen

let currentMode = '';
let lastMove = null;
let score = 0;
let gameContainer = null;
let revertButton = null;

function createStartScreen() {
  const body = document.body;
  body.classList.add('body');

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  const container = document.createElement('div');
  container.classList.add('container');
  body.appendChild(container);

  const heading = document.createElement('h1');
  heading.textContent = "Pair 'em Up";
  heading.classList.add('heading');
  heading.id = 'heading';
  container.appendChild(heading);

  const authorContent = document.createElement('p');
  authorContent.classList.add('author-content');
  container.appendChild(authorContent);
  
  const authorText = document.createElement('span');
  authorText.textContent = 'Author: ';
  authorText.classList.add('author-text');
  authorContent.appendChild(authorText);

  const authorLink = document.createElement('a');
  authorLink.href = 'https://github.com/rika-milew';
  authorLink.textContent = 'rika-milew';
  authorLink.classList.add('author-link');
  authorLink.target = '_blank';
  authorContent.appendChild(authorLink);

  const selectMode = document.createElement('p');
  selectMode.textContent = 'Select Mode';
  selectMode.classList.add('select-mode');
  container.appendChild(selectMode);

  const modeContainer = document.createElement('div');
  modeContainer.classList.add('mode-container');
  container.appendChild(modeContainer);

  const modeButtons = ['Classic', 'Random', 'Chaotic'];
  for (let i = 0; i < modeButtons.length; i++) {
    const modeButton = document.createElement('button');
    modeButton.textContent = modeButtons[i];
    modeButton.classList.add('mode-button');
    modeButton.classList.add('button');
    modeButton.onclick = function() {
      console.log('Mode selected: ' + modeButtons[i]);
      createGameGrid(modeButtons[i]);
      setTimeout(() => startGame(modeButtons[i]), 0);
    };
    modeContainer.appendChild(modeButton);
  }

  const gameImage = document.createElement('div');
  gameImage.classList.add('game-image');
  container.appendChild(gameImage);

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');
  container.appendChild(buttonsContainer);

  const continueButton = document.createElement('button');
  continueButton.textContent = 'Continue';
  continueButton.classList.add('continue-button');
  continueButton.classList.add('button');
  continueButton.onclick = function() {
    console.log('Settings');
  };
  buttonsContainer.appendChild(continueButton);

  const resultsButton = document.createElement('button');
  resultsButton.textContent = 'Results';
  resultsButton.classList.add('results-button');
  resultsButton.classList.add('button');
  resultsButton.onclick = function() {
    console.log('Results');
  };
  buttonsContainer.appendChild(resultsButton);

  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.classList.add('settings-button');
  settingsButton.classList.add('button');
  settingsButton.onclick = function() {
    console.log('Settings');
  };
  buttonsContainer.appendChild(settingsButton);
}

createStartScreen();


// game grid

function createGameGrid(mode) {
  const body = document.body;

  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }

  const container = document.createElement('div');
  container.classList.add('container');
  body.appendChild(container);

  const modeHeading = document.createElement('h2');
  modeHeading.classList.add('mode-heading');
  modeHeading.textContent = mode + ' Mode';
  container.appendChild(modeHeading);

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-container');
  container.appendChild(infoContainer);

  gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  container.appendChild(gameContainer);

  const controlsContainer = document.createElement('div');
  controlsContainer.classList.add('controls-container');
  container.appendChild(controlsContainer);

  const scoreDisplay = document.createElement('div');
  scoreDisplay.classList.add('score-display');
  infoContainer.appendChild(scoreDisplay);

  const currentScore = document.createElement('div');
  currentScore.classList.add('current-score');
  currentScore.textContent = 'Score: 0';
  scoreDisplay.appendChild(currentScore);

  const targetScore = document.createElement('div');
  targetScore.classList.add('target-score');
  targetScore.textContent = 'Target: 100';
  scoreDisplay.appendChild(targetScore);

  const timer = document.createElement('div');
  timer.classList.add('timer');
  timer.textContent = '00:00';
  infoContainer.appendChild(timer);

  let digitsInCells = [];

  if (mode === 'Classic' || mode === 'Random') {
    for (let i = 1; i <= 19; i++) {
      if (i === 10) continue;
      const digits = i.toString().split('');
      digits.forEach(digit => digitsInCells.push(parseInt(digit)));
    }
    if (mode === 'Random') { 
      digitsInCells = shuffleDigits(digitsInCells);
    }
  } else if (mode === 'Chaotic') {
    for (let i = 0; i < 27; i++) {
      digitsInCells.push(Math.floor(Math.random() * 9) + 1);
    }
  }

  digitsInCells.forEach(digit => {
    const gameCell = document.createElement('div');
    gameCell.classList.add('game-cell');
    gameCell.textContent = digit;
    gameCell.addEventListener('click', clickOnCell);
    gameContainer.appendChild(gameCell);
  });
  
  const assistButtons = document.createElement('div');
  assistButtons.classList.add('assist-buttons');
  controlsContainer.appendChild(assistButtons);

  ['Hints', 'Revert', 'Add Numbers', 'Shuffle', 'Eraser'].forEach(button => {
    const assistButton = document.createElement('button');
    assistButton.textContent = button;
    assistButton.classList.add('assist-button');
    assistButton.classList.add('button');
    const className = button.toLowerCase().replace(/\s+/g, '-') + '-button';
    assistButton.classList.add(className);
    assistButtons.appendChild(assistButton);
  });

  const gameControls = document.createElement('div');
  gameControls.classList.add('game-controls');
  controlsContainer.appendChild(gameControls);

  const backButton = document.createElement('button');
  backButton.textContent = '← Back';
  backButton.classList.add('button', 'back-button');
  backButton.onclick = () => createStartScreen();
  gameControls.appendChild(backButton);

  ['Reset', 'Save Game', 'Continue Game'].forEach(button => {
    const controlButton = document.createElement('button');
    controlButton.textContent = button;
    controlButton.classList.add('control-button');
    controlButton.classList.add('button');
    gameControls.appendChild(controlButton);
  });
    
  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.classList.add('settings-button');
  settingsButton.classList.add('button');
  infoContainer.appendChild(settingsButton);

  revertButton = assistButtons.querySelector('.revert-button');
  const addButton = assistButtons.querySelector('.add-numbers-button');
  
  const hintsButton = assistButtons.querySelector('.hints-button');

  // if (revertButton) {
  //   const clone = revertButton.cloneNode(true);
  //   revertButton.parentNode.replaceChild(clone, revertButton);
  //   revertButton = clone;
  // }

  // if (addButton) {
  //   const clone = addButton.cloneNode(true);
  //   addButton.parentNode.replaceChild(clone, addButton);
  //   addButton = clone;
  // }

  // if (hintsButton) {
  //   const clone = hintsButton.cloneNode(true);
  //   hintsButton.parentNode.replaceChild(clone, hintsButton);
  //   hintsButton = clone;
  // }

  if (revertButton) {
    revertButton.disabled = true;
    revertButton.addEventListener('click', () => {
      if (!lastMove) return;
      lastMove.cells.forEach((cell, i) => {
        cell.textContent = lastMove.values[i];
        cell.classList.remove('empty-cell');
     });
      score -= lastMove.points;
      updateScore();
      lastMove = null;
      revertButton.disabled = true; 
    });
  }

  let addNumbersAttempts = 0;
  const addNumbersLimit = 10;

  if (addButton) {
    addButton.addEventListener('click', () => {
    if (addNumbersAttempts >= addNumbersLimit) {
      showModal('You have used Add Numbers 10 times already.');
      addButton.disabled = true; 
      return;
    }
  
    // if (addNumbersAttempts === addNumbersLimit - 1) {
    //   addButton.disabled = true; 
    // }

    addNumbersAttempts++;
    showModal(`Add Numbers (${addNumbersLimit - addNumbersAttempts} left)`);
    addNumbers(mode);
  });
}

  if (hintsButton) {
    hintsButton.addEventListener('click', () => {
      const availablePairs = showHints();
      showModal('Available pairs: ' + (availablePairs.length > 5 ? '5+' : availablePairs.length));
    });
  }
}



// gameplay 

let firstCell = null;
let secondCell = null;


function clickOnCell(event) {
  const cell = event.target.closest('.game-cell');
  if (!cell || !gameContainer.contains(cell)) return;
  if (!cell.textContent.trim()) return;
  if (gameContainer.classList.contains('locked')) return;

  if (!firstCell) {
    firstCell = cell;
    cell.classList.add('selected-cell');
    return;
  }

  if (cell === firstCell) {
    cell.classList.remove('selected-cell');
    firstCell = null;
    return;
  }
  
  secondCell = cell;
  cell.classList.add('selected-cell');

  const digit1 = parseInt(firstCell.textContent);
  const digit2 = parseInt(secondCell.textContent);

  const isValidNumbers = (digit1 === digit2 || digit1 + digit2 === 10);
  const isValidPosition = checkPairSelection(firstCell, secondCell, document.querySelectorAll('.game-cell'));

  gameContainer.classList.add('locked');
    
  if (isValidNumbers && isValidPosition) {
    let points = 0;
    if (digit1 === digit2) {
      points = (digit1 === 5) ? 3 : 1;
    } else if (digit1 + digit2 === 10) {
      points = 2;
    }

        
    playSound('match');
    score += points;

    lastMove = {
      cells: [firstCell, secondCell],
      values: [digit1, digit2],
      points: points
    };

    revertButton.disabled = false;

    firstCell.classList.add('right-pair');
    secondCell.classList.add('right-pair');

    const firstCorrectCell = firstCell;
    const secondCorrectCell = secondCell;

    firstCell = null;
    secondCell = null;
        
    setTimeout(() => {
      firstCorrectCell.textContent = '';
      secondCorrectCell.textContent = '';
      firstCorrectCell.classList.remove('selected-cell', 'right-pair');
      secondCorrectCell.classList.remove('selected-cell', 'right-pair');
      firstCorrectCell.classList.add('empty-cell');
      secondCorrectCell.classList.add('empty-cell');
      updateScore();
      gameContainer.classList.remove('locked');
    }, 400);

  } else {
    firstCell.classList.add('wrong-pair');
    secondCell.classList.add('wrong-pair');
    playSound('error');
    const firstWrongCell = firstCell;
    const secondWrongCell = secondCell;
    firstCell = null;
    secondCell = null;

    setTimeout(() => {
      firstWrongCell.classList.remove('selected-cell', 'wrong-pair');
      secondWrongCell.classList.remove('selected-cell', 'wrong-pair');
      gameContainer.classList.remove('locked');
    }, 700);
  }
}


function startGame(mode) {
  currentMode = mode;
  firstCell = null;
  secondCell = null;
  score = 0;
  lastMove = null;

  updateScore();
  if (revertButton) revertButton.disabled = true;
}


function checkPairSelection(firstCell, secondCell, cells, columns = 9) {
  const gameCells = Array.from(document.querySelectorAll('.game-cell'));
  const cell1 = Array.from(cells).indexOf(firstCell);
  const cell2 = Array.from(cells).indexOf(secondCell);

  if (cell1 === -1 || cell2 === -1) return false;

  const [start, end] = [Math.min(cell1, cell2), Math.max(cell1, cell2)];

  const digit1 = parseInt(firstCell.textContent);
  const digit2 = parseInt(secondCell.textContent);

  const checkAdjacent =
    Math.abs(cell1 - cell2) === 1 || Math.abs(cell1 - cell2) === columns;

  const checkSameRow = (cell1, cell2) => {
    const rowStart = Math.floor(cell1 / columns) * columns;
    const rowEnd = rowStart + columns - 1;
    const start = Math.min(cell1, cell2) + 1;
    const end = Math.max(cell1, cell2);
    if (cell1 >= rowStart && cell2 <= rowEnd) {
      for (let i = start; i < end; i++) {
        if (gameCells[i].textContent !== '') return false;
      }
      return true;
    }
    return false;
  };

  const checkSameColumn = (cell1, cell2) => {
    if (cell1 % columns !== cell2 % columns) return false;
    for (let i = cell1 + columns; i < cell2; i += columns) {
      if (gameCells[i].textContent !== '') return false;
    }
    return true;
  };

  const checkRowBoundaries = (cell1, cell2) => {
    const aboveCell = Math.min(cell1, cell2);
    const belowCell = Math.max(cell1, cell2);
    return (aboveCell % columns === columns - 1) && (belowCell % columns === 0) && (belowCell - aboveCell === 1);
  }


  const checkHorizontalAcrossRows = (cell1, cell2) => {
    for (let i = cell1 + 1; i < cell2; i++) {
      if (gameCells[i].textContent !== '') return false;
    }
    return true;
  };

  return (
    checkAdjacent ||
    checkSameRow(cell1, cell2) ||
    checkSameColumn(cell1, cell2) ||
    checkRowBoundaries(cell1, cell2) ||
    checkHorizontalAcrossRows(cell1, cell2)
  );
}


function shuffleDigits(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


function updateScore() {
  const scoreDisplay = document.querySelector('.current-score');
  scoreDisplay.textContent = `Score: ${score}`;
}



// sound effects

const sounds = {
  error: 'assets/sounds/error.mp3',
  match: 'assets/sounds/match.mp3',
  bonus: 'assets/sounds/bonus.mp3',
};

function playSound(type) {
  if (!sounds[type]) return;
  if (document.hidden) return;
  const audio = new Audio(sounds[type]);
  audio.volume = 0.5;
  audio.play().catch(err => {
    console.log('Sound playback error:', err);
  });
}


// Assist Tools


function showHints() {
  const cells = Array.from(document.querySelectorAll('.game-cell'));
  const availablePairs = [];

  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].textContent) continue;

    for (let j = i + 1; j < cells.length; j++) {
      if (!cells[j].textContent) continue;

      const digit1 = parseInt(cells[i].textContent);
      const digit2 = parseInt(cells[j].textContent);

      const isValidNumbers = (digit1 === digit2 || digit1 + digit2 === 10);
      const isValidPosition = checkPairSelection(cells[i], cells[j], cells);

      if (isValidNumbers && isValidPosition) {
        availablePairs.push([cells[i], cells[j]]);
      }
    }
  }
  return availablePairs;
}


function addNumbers(mode) {
  gameContainer = document.querySelector('.game-container');
  firstCell = null;
  secondCell = null; 

  const existingDigits = Array.from(gameContainer.querySelectorAll('.game-cell'))
    .filter(cell => cell.textContent !== '')
    .map(cell => parseInt(cell.textContent));

  let newDigits = [];

  if (mode === 'Classic') {
    newDigits = [...existingDigits];
  } else if (mode === 'Random') {
    newDigits = shuffleDigits([...existingDigits]);
  } else if (mode === 'Chaotic') {
    newDigits = existingDigits.map(() => Math.floor(Math.random() * 9) + 1);
  }

  newDigits.forEach(digit => {
    const newCell = document.createElement('div');
    newCell.classList.add('game-cell');
    newCell.textContent = digit;
    newCell.addEventListener('click', clickOnCell);
    gameContainer.appendChild(newCell);
  });
  updateScore();
}


// modal 

function createModal() {
  let modal = document.querySelector('.modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.classList.add('modal');

  const content = document.createElement('p');
  content.classList.add('modal-text');
  modal.appendChild(content);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'OK';
  closeButton.classList.add('close-button');
  closeButton.onclick = () => {
    modal.style.display = 'none';
  };
  modal.appendChild(closeButton);

  document.body.appendChild(modal);
  return modal;
}

function showModal(content) {
  const modal = createModal();
  modal.querySelector('.modal-text').textContent = content;
  modal.style.display = 'block';
}