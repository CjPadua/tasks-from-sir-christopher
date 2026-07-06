const COLORS_LIST = ["red", "green", "blue", "yellow"]

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