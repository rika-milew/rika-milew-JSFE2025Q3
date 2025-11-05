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
      if (modeButtons[i] === 'Classic') {
      createGameGrid(mode = 'Classic');
      }
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

function createGameGrid(mode = 'Classic') {
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
  gameContainer.classList.add('controls-container');
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

  for (let i = 1; i <= 19; i++) {
    if (i === 10) continue;
    const digits = i.toString().split(''); 
    digits.forEach(digit => {
      if (digit !== '0') {
        const gameCell = document.createElement('div');
        gameCell.classList.add('game-cell');
        gameCell.textContent = digit;
        gameContainer.appendChild(gameCell);
      }
    });
  }
  
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