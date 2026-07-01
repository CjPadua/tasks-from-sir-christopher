const shrinkRectangle = document.getElementById('shrink-rectangle');
const expandRectangle = document.getElementById('expand-rectangle');
const redRectangle = document.getElementById('red-rectangle');
const blueRectangle = document.getElementById('blue-rectangle');
const greenRectangle = document.getElementById('green-rectangle');

const sizeModificationButtons = document.querySelectorAll('.size-modification-button')
const changeColorButtons = document.querySelectorAll('.color-button');

function changeRectangleSize(rectangle, amount) {
   let rectangleHeight = rectangle.getBoundingClientRect().height;
   let rectangleWidth = rectangle.getBoundingClientRect().width; 

   rectangle.style.height = `${rectangleHeight+=amount}px`;
   rectangle.style.width = `${rectangleWidth+=amount}px`;
}

sizeModificationButtons.forEach((button) => {
   button.addEventListener('click', () => {
      switch (button.value) {
         case 'shrink':
            changeRectangleSize(shrinkRectangle, -1);
            break;
         case 'expand':
            changeRectangleSize(expandRectangle, 1);
            break;
      }
   })
})

function changeRectangleColor(color) {
   switch (color) {
      case 'red-bg':
         redRectangle.classList.toggle(color);
         break;
      case 'blue-bg':
         blueRectangle.classList.toggle(color);
         break;
      case 'green-bg':
         greenRectangle.classList.toggle(color);
         break;
   }
}

changeColorButtons.forEach((button) => {
   button.addEventListener('click', () => {
      changeRectangleColor(button.value)
   })
})