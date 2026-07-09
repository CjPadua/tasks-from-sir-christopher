/**
 * OVERVIEW ---
 * 
 * Generate colors to be guessed.
 * 
 * If a guess color ball is clicked, change its color and value.
 * 
 * If guess button is clicked, add a set of colored balls below
 * the guess color ball and indicate how many of the 
 * guesses are right. Then, reset the guess color balls.
 * 
 * If all of the guesses are right, reveal the answer balls and
 * show a play again button.
 * 
 * If surrender button is clicked, reveal the answer balls and
 * show a play again button.
 * 
 * COLOR CHANGING LOGIC ---
 * 
 */

const COLORS_LIST = ["red", "green", "blue", "yellow"];
const COLORS_COUNT = 4;

const guessingContainer = document.getElementById("guessing-container");
const guessingColorBalls = document.querySelectorAll("div.guessing-container > div");
const answerColorBalls = document.querySelectorAll("div.answer-container > div");
const guessesContainer = document.getElementById("guesses-container");
const guessBtn = document.getElementById("guess-btn");

const startBtn = document.getElementById("start-btn");
const titleText = document.getElementById("title-text");

const surrenderBtn = document.getElementById("surrender-btn");

let handleUserSurrender, handleGuessBtnClick;

function getNextColor(currentColor) {
   const currentIndex = COLORS_LIST.findIndex((color) => color === currentColor);

   if(currentIndex < 3) {
      return COLORS_LIST[currentIndex + 1]
   }
   
   return "red";
}

guessingColorBalls.forEach((guessingColorBall) => {
   guessingColorBall.addEventListener("click", () => {
      const nextColor = getNextColor(guessingColorBall.attributes.color.value)

      guessingColorBall.style.backgroundColor = nextColor;
      guessingColorBall.attributes.color.value = nextColor;
   })
})

function getRandomColor(listOfColors) {
   const randomNumber = Math.random();
   const randomIndex = Math.floor(randomNumber * listOfColors.length);

   return listOfColors[randomIndex];
}

function getRandomColors(numberOfColors) {
   const randomColors = [];

   for (let counter = 0; counter < numberOfColors; counter++) {
      randomColors.push(getRandomColor(COLORS_LIST));
   }

   return randomColors;
}

function displayGuess(guesses, score) {

   const guessContainer = document.createElement("div");
   guessContainer.classList.add("guess");

   guesses.forEach((guess) => {
      const colorBall = document.createElement("div");
      colorBall.classList.add("color-ball");
      colorBall.style.backgroundColor = guess;

      guessContainer.appendChild(colorBall);
   })

   const scoreText = document.createElement("p");
   scoreText.classList.add("score-text")
   scoreText.textContent = score;

   guessContainer.appendChild(scoreText);

   if(guessesContainer.childElementCount < 1) {
      guessesContainer.appendChild(guessContainer);
   }
   else {
      guessesContainer.insertBefore(guessContainer, guessesContainer.firstElementChild);
   }
}

function revealAnswers(answers) {
   answerColorBalls.forEach((answerColorBall, index) => {
      answerColorBall.style.backgroundColor = answers[index];
   })
}

function resetTheGame() {
   guessesContainer.replaceChildren();

   surrenderBtn.style.display  = "none";
   guessingContainer.style.display = "none";
   guessesContainer.style.display = "none";

   document.querySelectorAll("div[class*='color-ball']").forEach((colorBall) => {
      colorBall.style.backgroundColor = "gray";
   })

   guessingColorBalls.forEach((guessingColorBall) => {
      guessingColorBall.attributes.color.value = "gray";
   })

   titleText.textContent = "Guess the Colors";
   startBtn.style.display = "block";

   surrenderBtn.disabled = false;
   guessBtn.disabled = false;

   surrenderBtn.removeEventListener("click", handleUserSurrender);
   guessBtn.removeEventListener("click", handleGuessBtnClick);
}

function getScore(answers, guesses) {
   let score = 0;

   guesses.forEach((guess, index) => {
      if(guess === answers[index]) {
         score++;
      }
   })

   return score;
}

function endGame(answers, userWin) {
   surrenderBtn.disabled = "true";
   guessBtn.disabled = true;

   titleText.textContent = userWin ? "You Win." : "You Lose.";

   revealAnswers(answers);
   setTimeout(resetTheGame, 3000);
}

function play() {
   
   const answers = getRandomColors(COLORS_COUNT);
   console.log(answers)

   handleUserSurrender = () => {
      endGame(answers, false);
   }

   handleGuessBtnClick = () => {
      const guesses = [];

      guessingColorBalls.forEach(
         (guessingColorBall) => {
            guesses.push(guessingColorBall.attributes.color.value);
         }
      )

      const score = getScore(answers, guesses);

      if(score === 4) {
         endGame(answers, true);
         return;
      }

      displayGuess(guesses, score);

      return score;
   }
   
   surrenderBtn.addEventListener("click", handleUserSurrender);
   guessBtn.addEventListener("click", handleGuessBtnClick);
}

startBtn.addEventListener("click", () => {
   guessingContainer.style.display = "flex"
   guessesContainer.style.display = "flex";
   startBtn.style.display = "none";
   surrenderBtn.style.display = "block"
   titleText.textContent = "Guess the Colors";
   play();
})