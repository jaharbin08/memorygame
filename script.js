const gameContainer = document.getElementById('game');
const bestScore = document.getElementById('scoreBest');
const currentScore = document.getElementById('scoreCurrent');
const value = document.querySelector('#value');
const input = document.querySelector('#numberCards');
let savedScore = JSON.parse(localStorage.getItem('score')) || '';
let shuffledColors = [];
let COLORS = [];
let firstCard = null;
let secondCard = null;
let flippedCards = 0;
let pause = false;
let guess = 0;

//Input Event Listener: Shows number of cards chosen
value.textContent = input.value;
input.addEventListener('input', (event) => {
  value.textContent = event.target.value;
});

//Best Score Display
bestScore.innerText = `Best Score: ${savedScore}`;

//Generate Colors Function
function generateColors() {
  for (let i = 0; i < input.value / 2; i++) {
    COLORS.push(Math.floor(Math.random() * 16777215).toString(16));
  }
  return COLORS.concat(COLORS);
  console.log(COLORS);
  console.log(COLORS.concat(COLORS));
}

//Suffle function
function shuffle(array) {
  let shuffleCounter = array.length;

  // While there are elements in the array
  while (shuffleCounter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * shuffleCounter);
    // Decrease counter by 1
    shuffleCounter--;
    // And swap the last element with it
    let temp = array[shuffleCounter];
    array[shuffleCounter] = array[index];
    array[index] = temp;
  }

  return array;
}

//Card Creation Function
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement('div');
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener('click', handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

//Card Click Function
function handleCardClick(event) {
  if (pause) return;
  if (event.target.classList.contains('flipped')) return;

  let currentCard = event.target;
  currentCard.style.backgroundColor = `#${currentCard.classList[0]}`;

  if (firstCard === null) {
    firstCard = currentCard;
    firstCard.classList.add('flipped');
  } else {
    secondCard = currentCard;
    secondCard.classList.add('flipped');
    pause = true;
    setTimeout(checkForMatch, 1000);
  }
}

//Check for Match Function
function checkForMatch() {
  guess++;
  currentScore.innerText = `Score: ${guess}`;
  if (firstCard.className === secondCard.className) {
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);
    flippedCards += 2;
    firstCard = null;
    secondCard = null;
    pause = false;
  } else {
    firstCard.style.backgroundColor = '';
    secondCard.style.backgroundColor = '';
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard = null;
    secondCard = null;
    pause = false;
  }
  if (flippedCards === COLORS.length) {
    saveScore();
  }
}

//Save Best Score Function
function saveScore() {
  if (savedScore === '' || guess < savedScore) {
    savedScore = guess;
    localStorage.setItem('score', JSON.stringify(guess));
  }
  bestScore.innerText = `Best Score: ${savedScore}`;
}

//Start Game Function and Reset Game Function
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('startGame').addEventListener('click', function () {
    if (gameContainer.innerHTML === '') {
      shuffledColors = shuffle(generateColors());
      createDivsForColors(shuffledColors);
    }
  });
  document.getElementById('resetGame').addEventListener('click', function () {
    if (gameContainer.innerHTML === '') return;
    gameContainer.innerHTML = '';
    COLORS = [];
    shuffledColors = shuffle(generateColors());
    createDivsForColors(shuffledColors);
    document.getElementById('scoreCurrent').innerText = 'Current Score: 0';
    guess = 0;
  });
});
