// Rectangles for demonstration
const rectangleToShrink = document.getElementById('shrink-rectangle');
const rectangleToExpand = document.getElementById('expand-rectangle');
const rectangleToRed = document.getElementById('red-rectangle');
const rectangleToBlue = document.getElementById('blue-rectangle');
const rectangleToGreen = document.getElementById('green-rectangle');

/**
 * Group buttons with similar functionality instead of selecting each 
 * individually to avoid repetition.
 */
const sizeModificationButtons = document.querySelectorAll('.size-modification-button')
const changeColorButtons = document.querySelectorAll('.color-button');

function changeRectangleSize(rectangle, amount) {
   // Get the initial height and width of the rectangle to be modified
   let rectangleHeight = rectangle.getBoundingClientRect().height;
   let rectangleWidth = rectangle.getBoundingClientRect().width; 

   // Modify the height and width of the rectangle
   rectangle.style.height = `${rectangleHeight+=amount}px`;
   rectangle.style.width = `${rectangleWidth+=amount}px`;
}

sizeModificationButtons.forEach((button) => {
   button.addEventListener('click', () => {
      /**
       * Rely on the value attribute of the button to determine:
       * 1. The type of modification to be executed
       * 2. The rectangle to be modified
       */
      switch (button.value) {
         case 'shrink':
            changeRectangleSize(rectangleToShrink, -1);
            break;
         case 'expand':
            changeRectangleSize(rectangleToExpand, 1);
            break;
      }
   })
})

/**
 * Rely on the argument for background color to
 * determine what rectangle to be modified.
 * 
 * Use toggle method to efficiently add and remove
 * the class that colors the rectangle.
 */
function changeRectangleColor(bgColor) {
   switch (bgColor) {
      case 'red-bg':
         rectangleToRed.classList.toggle(bgColor);
         break;
      case 'blue-bg':
         rectangleToBlue.classList.toggle(bgColor);
         break;
      case 'green-bg':
         rectangleToGreen.classList.toggle(bgColor);
         break;
   }
}

changeColorButtons.forEach((button) => {
   button.addEventListener('click', () => {
      /**
       * Rely on the value attribute of the button to
       * determine what rectangle to be modified.
       */
      changeRectangleColor(button.value)
   })
})