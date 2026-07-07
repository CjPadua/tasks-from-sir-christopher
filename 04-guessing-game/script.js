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

function getRandomColors(numberOfColors) {

   function getRandomColor(listOfColors) {
      const randomNumber = Math.random();
      const randomIndex = Math.floor(randomNumber * listOfColors.length);
   
      return listOfColors[randomIndex];
   }

   const randomColors = [];

   for (let counter = 0; counter < numberOfColors; counter++) {
      randomColors.push(getRandomColor(COLORS_LIST));
   }

   return randomColors;
}

function displayGuess(guesses, score) {

   function resetGuessColorBalls() {
      guessingColorBalls.forEach((guessColorBall) => {
         guessColorBall.style.backgroundColor = "gray";
         guessColorBall.attributes.color.value = "";
      })
   }

   const guessContainer = document.createElement("div");
   guessContainer.classList.add("guess");

   guesses.forEach((guess) => {
      const colorBall = document.createElement("div");
      colorBall.classList.add("color-ball");
      colorBall.style.backgroundColor = guess;

      guessContainer.appendChild(colorBall);
   })

   const scoreText = document.createElement("p");
   scoreText.textContent = score;

   guessContainer.appendChild(scoreText);

   if(guessesContainer.childElementCount < 1) {
      guessesContainer.appendChild(guessContainer);
   }
   else {
      guessesContainer.insertBefore(guessContainer, guessesContainer.firstElementChild);
   }

   resetGuessColorBalls();
}

function revealAnswers(answers) {
   answerColorBalls.forEach((answerColorBall, index) => {
      answerColorBall.style.backgroundColor = answers[index];
   })
}

function play() {

   function getScore(answers, guesses) {
      let score = 0;

      guesses.forEach((guess, index) => {
         if(guess === answers[index]) {
            score++;
         }
      })

      return score;
   }
   
   const answers = getRandomColors(COLORS_COUNT);
   console.log(answers)

   surrenderBtn.addEventListener("click", () => {
      revealAnswers(answers);
   })
   
   guessBtn.addEventListener("click", () => {
      const guesses = [];

      guessingColorBalls.forEach(
         (guessingColorBall) => {
            guesses.push(guessingColorBall.attributes.color.value);
         }
      )

      const score = getScore(answers, guesses);
      displayGuess(guesses, score);

      return score;
   })
}

startBtn.addEventListener("click", () => {
   guessingContainer.style.display = "flex"
   startBtn.style.display = "none";
   surrenderBtn.style.display = "block"
   titleText.textContent = "Guess the Colors";
   play();
})



guessingColorBalls.forEach((guessingColorBall) => {

   function getNextColor(currentColor) {
      const currentIndex = COLORS_LIST.findIndex((color) => color === currentColor);
   
      if(currentIndex < 3) {
         return COLORS_LIST[currentIndex + 1]
      }
      
      return "red";
   }

   guessingColorBall.addEventListener("click", () => {
      const nextColor = getNextColor(guessingColorBall.attributes.color.value)

      guessingColorBall.style.backgroundColor = nextColor;
      guessingColorBall.attributes.color.value = nextColor;
   })
})