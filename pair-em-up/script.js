// start screen

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
      setTimeout(startGame, 0);
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
  modeHeading.textContent = 'Classic Mode';
  container.appendChild(modeHeading);

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info-container');
  container.appendChild(infoContainer);

  const gameContainer = document.createElement('div');
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

  function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  if (mode === 'Classic' || mode === 'Random') {
    for (let i = 1; i <= 19; i++) {
      if (i === 10) continue;
      const digits = i.toString().split('');
      digits.forEach(digit => digitsInCells.push(parseInt(digit)));
    }
    if (mode === 'Random') { 
      digitsInCells = shuffleArray(digitsInCells);
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
}

// gameplay 

function startGame() {
  let firstCell = null;
  let secondCell = null;
  let score = 0;

  function updateScore() {
    const scoreDisplay = document.querySelector('.current-score');
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function clickOnCell(event) {
    const cell = event.target;
    if (!cell.textContent) return;

    if (!firstCell) {
      firstCell = cell;
      cell.classList.add('selected-cell');
      return;
    }

    if (cell === firstCell) return;
    secondCell = cell;
    cell.classList.add('selected-cell');

    const digit1 = parseInt(firstCell.textContent);
    const digit2 = parseInt(secondCell.textContent);


    if (checkPairSelection(firstCell, secondCell, document.querySelectorAll('.game-cell'))) {
      let points = 0;
      if (digit1 === digit2) {
        points = (digit1 === 5) ? 3 : 1;
      } else if (digit1 + digit2 === 10) {
        points = 2;
      }

      if (points > 0) {
        score += points;
        setTimeout(() => {
          firstCell.textContent = '';
          secondCell.textContent = '';
          firstCell.classList.remove('selected-cell');
          secondCell.classList.remove('selected-cell');
          firstCell.classList.add('empty-cell');
          secondCell.classList.add('empty-cell');
          firstCell = null;
          secondCell = null;
          updateScore();
        }, 200);
      } else {
        setTimeout(() => {
          firstCell.classList.remove('selected-cell');
          secondCell.classList.remove('selected-cell');
          firstCell = null;
          secondCell = null;
        }, 700);
      }
    }
  }
  document.querySelectorAll('.game-cell').forEach(cell => {
      cell.addEventListener('click', clickOnCell);
    });
}


function checkPairSelection(firstCell, secondCell, cells, columns = 9) {
  const cell1 = Array.from(cells).indexOf(firstCell);
  const cell2 = Array.from(cells).indexOf(secondCell);

  const checkAdjacent = Math.abs(cell1 - cell2) === 1 || Math.abs(cell1 - cell2) === columns;

  const checkSameRow = (cell1, cell2) => {
    const rowStart = Math.floor(cell1 / columns) * columns;
    const rowEnd = rowStart + columns - 1;
    const start = Math.min(cell1, cell2) + 1;
    const end = Math.max(cell1, cell2);
    if (cell1 >= rowStart && cell2 <= rowEnd) {
      for (let i = start; i < end; i++) {
        if (cells[i].textContent !== '') return false;
      }
      return true;
    }
    return false;
  }

  const checkSameColumn = (cell1, cell2) => {
    if (cell1 % columns !== cell2 % columns) return false;
    const start = Math.min(cell1, cell2) + columns;
    const end = Math.max(cell1, cell2);
    for (let i = start; i < end; i += columns) {
      if (cells[i].textContent !== '') return false;
    }
    return true;
  }

  const checkRowBoundaries = (cell1, cell2) => {
    return (cell1 % columns === columns - 1 && cell2 % columns === 0) ||
           (cell2 % columns === columns - 1 && cell1 % columns === 0);
  }

  const digit1 = parseInt(firstCell.textContent);
  const digit2 = parseInt(secondCell.textContent);

  return checkAdjacent || checkSameRow(cell1, cell2) || checkSameColumn(cell1, cell2) || checkRowBoundaries(cell1, cell2);
}