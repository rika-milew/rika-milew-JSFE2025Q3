// start screen

let currentMode = '';
let lastMove = null;
let score = 0;
let gameContainer = null;
let revertButton = null;

let addNumbersUses = 0;
const addNumbersUsesLimit = 10;

let shuffleUses = 0;
const shuffleUsesLimit = 5;

let eraserUses = 0;
const eraserUsesLimit = 5;

let gameTimer = null;
let gameSeconds = 0;

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

const savedGame = localStorage.getItem('savedGame');
if (savedGame) {
  continueButton.disabled = false;
  continueButton.addEventListener('click', continueSavedGame);
} else {
  continueButton.disabled = true;
}
 
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
  currentMode = mode;
  addNumbersUses = 0;
  shuffleUses = 0;
  eraserUses = 0;

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

  
    
  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Settings';
  settingsButton.classList.add('settings-button');
  settingsButton.classList.add('button');
  infoContainer.appendChild(settingsButton);

  revertButton = assistButtons.querySelector('.revert-button');
  useRevertButton(revertButton);
  

  const addButton = assistButtons.querySelector('.add-numbers-button');


  if (addButton) {
    addButton.addEventListener('click', () => {
      if (addNumbersUses >= addNumbersUsesLimit) {
        showModal('You have already used Add Numbers 10 times.');
        addButton.disabled = true; 
        return;
      }

      addNumbersUses++;
      showModal(`Add Numbers (${addNumbersUsesLimit - addNumbersUses} left)`);
      addNumbers(mode);
      });
  }
  
  const hintsButton = assistButtons.querySelector('.hints-button');

  if (hintsButton) {
    hintsButton.addEventListener('click', () => {
      const availablePairs = showHints();
      playSound('hints');
      showModal('Available pairs: ' + (availablePairs.length > 5 ? '5+' : availablePairs.length));
    });
  }


  const shuffleButton = document.querySelector('.shuffle-button');
  useShuffleButton(shuffleButton, gameContainer);

  const eraserButton = assistButtons.querySelector('.eraser-button');
  useEraserButton(eraserButton, gameContainer);

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

  

  

  const gameControls = document.createElement('div');
  gameControls.classList.add('game-controls');
  controlsContainer.appendChild(gameControls);

  const backButton = document.createElement('button');
  backButton.textContent = '← Back';
  backButton.classList.add('button', 'back-button');
  backButton.onclick = () => {
    saveGame();
    stopTimer();
    createStartScreen();
  };
  gameControls.appendChild(backButton);

  ['Reset', 'Save Game', 'Continue Game'].forEach(button => {
    const controlButton = document.createElement('button');
    controlButton.textContent = button;
    controlButton.classList.add('control-button');
    controlButton.classList.add('button');
    gameControls.appendChild(controlButton);
  });
}



// gameplay 

let firstCell = null;
let secondCell = null;
let isEraserActive = false;


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
  const isValidPosition = checkPairSelection(firstCell, secondCell, Array.from(gameContainer.querySelectorAll('.game-cell')));

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
      checkLoseConditions();
      saveGame();
      gameContainer.classList.remove('locked');
    }, 400);

  } else if (digit1 === 6 && digit2 === 9) {
    bonusFeature(firstCell, secondCell);
    const firstWrongCell = firstCell;
    const secondWrongCell = secondCell;
    firstCell = null;
    secondCell = null;

    setTimeout(() => {
      firstWrongCell.classList.remove('selected-cell');
      secondWrongCell.classList.remove('selected-cell');
      gameContainer.classList.remove('locked');
    }, 700);
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

  console.log('The bonus feature is activated by selecting 6 and 9 pair in sequence.');
  updateScore();
  if (revertButton) revertButton.disabled = true;

  startTimer(true);
}


function checkPairSelection(firstCell, secondCell, cells, columns = 9) {
  const gameCells = Array.from(cells || document.querySelectorAll('.game-cell'));
  const cell1 = gameCells.indexOf(firstCell);
  const cell2 = gameCells.indexOf(secondCell);

  if (cell1 === -1 || cell2 === -1) return false;
  if (cell1 === cell2) return false;

  const [start, end] = [Math.min(cell1, cell2), Math.max(cell1, cell2)];

  const sameRow = Math.floor(cell1 / columns) === Math.floor(cell2 / columns);
  const sameColumn = cell1 % columns === cell2 % columns;

  const checkAdjacent =
    Math.abs(cell1 - cell2) === 1 && sameRow || Math.abs(cell1 - cell2) === columns;

  const checkSameRow = (() => {
    if (!sameRow) return false;
    const startIndex = Math.min(cell1, cell2) + 1;
    const endIndex = Math.max(cell1, cell2);
    for (let i = startIndex; i < endIndex; i++) {
      if (gameCells[i].textContent !== '') return false;
    }
    return true;
  })();

  const checkSameColumn = (() => {
    if (!sameColumn) return false;
    for (let i = start + columns; i < end; i += columns) {
      if (gameCells[i].textContent !== '') return false;
    }
    return true;
  })();

  const checkAcrossEmptyCells = (() => {
    for (let i = start + 1; i < end; i++) {
      if (gameCells[i].textContent !== '') return false;
    }
    return true;
  })();

  const checkStartandEndofRow =
    Math.floor(cell1 / columns) === Math.floor(cell2 / columns) &&
    Math.abs(cell1 - cell2) === columns - 1;

  if (checkStartandEndofRow) return false;



  return (
    checkAdjacent ||
    checkSameRow ||
    checkSameColumn ||
    checkAcrossEmptyCells
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
  const targetScore = 100;
  const scoreDisplay = document.querySelector('.current-score');
  scoreDisplay.textContent = `Score: ${score}`;
  
  if (score >= targetScore) {
    showModal('Congratulations! You win!', true);
    playSound('win');
    gameContainer.classList.add('locked');
    stopTimer();
    return;
  }
}

function checkLoseConditions() {
  const availablePairs = showHints();
  const assistToolsLocked = (
    addNumbersUses >= addNumbersUsesLimit &&
    shuffleUses >= shuffleUsesLimit &&
    eraserUses >= eraserUsesLimit
  );

  const allCells = Array.from(gameContainer.querySelectorAll('.game-cell'));
  const allEmpty = allCells.every(cell => cell.textContent.trim() === '');

  if (availablePairs.length === 0 && assistToolsLocked) {
    showModal('You lose! No valid moves remain and all assist tools have been used.', true);
    playSound('lose');
    gameContainer.classList.add('locked');
    stopTimer();
    return;
  }

  if (allEmpty && score < 100) {
    showModal('You lose! The grid is empty and you didn’t reach 100 points.', true);
    playSound('lose');
    gameContainer.classList.add('locked');
    stopTimer();
    return;
  }
}


// sound effects

const sounds = {
  error: 'assets/sounds/error.mp3',
  match: 'assets/sounds/match.mp3',
  bonus: 'assets/sounds/bonus.mp3',
  win: 'assets/sounds/win.mp3',
  lose: 'assets/sounds/lose.mp3',
  revert: 'assets/sounds/revert.mp3',
  add: 'assets/sounds/add.mp3',
  eraser: 'assets/sounds/eraser.mp3',
  hints: 'assets/sounds/hints.mp3',
  shuffle: 'assets/sounds/shuffle.mp3',
  button: 'assets/sounds/button.mp3',
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

function useRevertButton(revertButton) {
  if (!revertButton) return;

  revertButton.disabled = true;

  revertButton.addEventListener('click', () => {
    if (!lastMove) return;

    if (lastMove.type === 'erase') {
      const cell = gameContainer.querySelectorAll('.game-cell')[lastMove.cellIndex];
      cell.textContent = lastMove.value;
      cell.classList.remove('empty-cell');
    } else {
      lastMove.cells.forEach((cell, i) => {
        cell.textContent = lastMove.values[i];
        cell.classList.remove('empty-cell');
      });
      score -= lastMove.points;
      updateScore();
      saveGame();
    }
    playSound('revert');
    lastMove = null;
    revertButton.disabled = true;
  });
}


function addNumbers(mode) {
  gameContainer = document.querySelector('.game-container');
  firstCell = null;
  secondCell = null; 

  const maxCells = 9 * 50;
  const currentCells = gameContainer.querySelectorAll('.game-cell').length;

  if (currentCells >= maxCells) {
    showModal('You lose! 50-line grid limit has been reached.', true);
    playSound('lose');
    gameContainer.classList.add('locked');
    return;
  }

  const existingDigits = Array.from(gameContainer.querySelectorAll('.game-cell'))
    .filter(cell => cell.textContent !== '')
    .map(cell => parseInt(cell.textContent));

  let newDigits = [];
  playSound('add');

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
  
  revertButton.disabled = true;
  updateScore();
  saveGame();
}

function useShuffleButton(shuffleButton, gameContainer) {

  shuffleButton.addEventListener('click', () => {
    if (shuffleUses >= shuffleUsesLimit) {
      showModal('You have already used Shuffle 5 times.');
      shuffleButton.disabled = true;
      return;
    }

    playSound('shuffle');
    shuffleGameCells(gameContainer);
    shuffleUses++;
    lastMove = null;
    if (revertButton) revertButton.disabled = true;
    showModal(`The numbers are shuffled! (${shuffleUsesLimit - shuffleUses} uses left)`);
  });
}

function shuffleGameCells(gameContainer) {
  const cells = Array.from(gameContainer.querySelectorAll('.game-cell'));
  const digits = cells
    .filter(cell => cell.textContent !== '')
    .map(cell => parseInt(cell.textContent));

  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  let index = 0;
  cells.forEach(cell => {
    if (cell.textContent !== '') {
      cell.textContent = digits[index];
      index++;
    }
  });
  saveGame();
}

function useEraserButton(eraserButton, gameContainer) {

  if (!eraserButton) return;
  

  eraserButton.addEventListener('click', () => {
    if (eraserUses >= eraserUsesLimit) {
      showModal('You have already used Eraser 5 times.');
      eraserButton.disabled = true;

      return;
    }

    clearSelectedCells();

    showModal(`Eraser (${eraserUsesLimit - eraserUses} uses left). Click any number to remove it.`);

    gameContainer.classList.add('active-eraser');

    const activateEraser = (event) => {
      const cell = event.target.closest('.game-cell');
      if (!cell || !cell.textContent.trim()) return;

      lastMove = {
        type: 'erase',
        cellIndex: Array.from(gameContainer.querySelectorAll('.game-cell')).indexOf(cell),
        value: cell.textContent
      };

      playSound('eraser');

      cell.textContent = '';
      cell.classList.add('empty-cell');
      eraserUses++;

      clearSelectedCells();

      gameContainer.classList.remove('active-eraser');
      gameContainer.removeEventListener('click', activateEraser);
 
      showModal(`Number removed! (${eraserUsesLimit - eraserUses} uses left)`);
      revertButton.disabled = false; 

      saveGame();

    };

    gameContainer.addEventListener('click', activateEraser);
  });
}

function clearSelectedCells() {
  const selectedCells = document.querySelectorAll('.selected-cell');
  selectedCells.forEach(c => c.classList.remove('selected-cell'));
  firstCell = null;
  secondCell = null;
}


// modal 

function createModal() {
  let modalWrapper = document.querySelector('.modal-wrapper');
  if (modalWrapper) return modalWrapper;
  modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modal-wrapper');
  

  modalWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.body.appendChild(modalWrapper);


  const modal = document.createElement('div');
  modal.classList.add('modal');
  modalWrapper.appendChild(modal);

  const content = document.createElement('p');
  content.classList.add('modal-text');
  modal.appendChild(content);

  const closeButton = document.createElement('button');
  closeButton.textContent = 'OK';
  closeButton.classList.add('close-button');
  modal.appendChild(closeButton);

  return modalWrapper;
}

function showModal(content, isLose = false) {
  const modalWrapper = createModal();
  modalWrapper.querySelector('.modal-text').textContent = content;
  modalWrapper.style.display = 'flex';

  


  const closeButton = modalWrapper.querySelector('.close-button');
  if (isLose) {
    closeButton.textContent = 'Try again';
  }
  closeButton.onclick = () => {
    modalWrapper.style.display = 'none';
    if (isLose) {
      createStartScreen();
    }
  };
}



// timer 


function startTimer(reset = true) {
  const timer = document.querySelector('.timer');
  if (!timer) return;

  if (reset) gameSeconds = 0;
  updateTimer(timer);

  if (gameTimer) clearInterval(gameTimer);

  gameTimer = setInterval(() => {
    gameSeconds++;
    updateTimer(timer);
  }, 1000);
}

function updateTimer(timer) {
  const minutes = Math.floor(gameSeconds / 60);
  const seconds = gameSeconds % 60;
  timer.textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
  clearInterval(gameTimer);
  gameTimer = null;
}


// save game 

function saveGame(mode) {
  const cells = Array.from(document.querySelectorAll('.game-cell')).map(cell => cell.textContent);
  

  let savedLastMove = null;
  if (lastMove) {
    if (lastMove.type === 'erase') {
      savedLastMove = {
        type: 'erase',
        cellIndex: lastMove.cellIndex,
        value: lastMove.value
      };
    } else {
      savedLastMove = {
        type: lastMove.type,
        cellIndices: lastMove.cells.map(cell =>
          Array.from(document.querySelectorAll('.game-cell')).indexOf(cell)
        ),
        values: lastMove.values,
        points: lastMove.points
      };
    }
  }


  const lastGame = {
    mode: currentMode,   
    lastMove: savedLastMove,
    cells,
    score,
    gameSeconds,
    addNumbersUses,
    shuffleUses,
    eraserUses
  };
  localStorage.setItem('savedGame', JSON.stringify(lastGame));
}

function continueSavedGame() {
  const savedGame = JSON.parse(localStorage.getItem('savedGame'));
  if (!savedGame) return;

  createGameGrid(savedGame.mode);
  launchSavedGame(savedGame);
}

function launchSavedGame(savedGame) {
  if (!savedGame || !gameContainer) return;

  score = savedGame.score || 0;
  lastMove = savedGame.lastMove || null;
  gameSeconds = savedGame.gameSeconds || 0;
  addNumbersUses = savedGame.addNumbersUses || 0;
  shuffleUses = savedGame.shuffleUses || 0;
  eraserUses = savedGame.eraserUses || 0;
  currentMode = savedGame.mode || 'Classic';


  const addButton = document.querySelector('.add-numbers-button');
  const shuffleButton = document.querySelector('.shuffle-button');
  const eraserButton = document.querySelector('.eraser-button');

  if (addButton) addButton.disabled = addNumbersUses >= addNumbersUsesLimit;
  if (shuffleButton) shuffleButton.disabled = shuffleUses >= shuffleUsesLimit;
  if (eraserButton) eraserButton.disabled = eraserUses >= eraserUsesLimit;
  if (revertButton) revertButton.disabled = !lastMove;

  const cells = Array.from(gameContainer.querySelectorAll('.game-cell'));

  if (lastMove && lastMove.type !== 'erase' && lastMove.cellIndices) {
    lastMove.cells = lastMove.cellIndices.map(i => cells[i]);
  }

  if (savedGame.lastMove) {
    if (savedGame.lastMove.type === 'erase') {
      lastMove = {
        ...savedGame.lastMove
      };
    } else {
      lastMove = {
        type: savedGame.lastMove.type,
        cells: savedGame.lastMove.cellIndices.map(i => cells[i]),
        values: savedGame.lastMove.values,
        points: savedGame.lastMove.points
      };
    }
  } else {
    lastMove = null;
  }

  savedGame.cells.forEach((digit, index) => {
    if (cells[index]) {
      cells[index].textContent = digit;
      if (digit === '') cells[index].classList.add('empty-cell');
      else cells[index].classList.remove('empty-cell');
    }
  });

  const scoreDisplay = document.querySelector('.current-score');
  if (scoreDisplay) scoreDisplay.textContent = `Score: ${score}`;
  revertButton.disabled = false;

  updateScore();
  updateTimer(document.querySelector('.timer'));
  stopTimer();
  startTimer(false);
}



// bonus feature 


function bonusFeature(firstCell, secondCell) {
  if (!firstCell || !secondCell) return;

  [firstCell, secondCell].forEach(cell => {
    const digit = cell.textContent;
    cell.textContent = '';
    const span = document.createElement('span');
    span.textContent = digit;
    span.classList.add('bonus-animation');
    cell.appendChild(span);
  });

  const text = document.createElement('div');
  text.textContent = '✨ Magic Pair! ✨';
  text.classList.add('bonus-text');

  const rect = firstCell.getBoundingClientRect();
  text.style.left = rect.left + window.scrollX + 'px';
  text.style.top = rect.top + window.scrollY - 40 + 'px';

  document.body.appendChild(text);
  
  setTimeout(() => {
    [firstCell, secondCell].forEach(cell => {
      const span = cell.querySelector('span.bonus-animation');
      if (span) {
        cell.textContent = span.textContent;
      }
    });
    text.remove();
  }, 1500);
}