/**
 * User clicks a button
 * 
 * Get button type
 * 
 * if button type is number
 *    get button value
 *    append it to the expression
 * 
 * if button type is decimal point
 *    check if no decimal point exists yet
 *       if true
 *          append it to the expression
 *       else
 *          reject input
 * 
 * if button type is command
 *    get button value
 *       if value is backspace
 *          remove the last item in the expression
 *       if value is clear
 *          set the expression to empty
 *       if value is equal
 *          evaluate the expression
 * 
 * if button type is operator
 *    get button value
 *    check if the last item in the expression is a number
 *       if true
 *          append it to the expression
 *       else
 *          check if last item in the expression is an operator
 *             if true
 *                check if value is equal to the last item in the expression
 *                if true
 *                   reject the input
 *                else
 *                   replace the operator with this operator
 *             else
 *                reject the input
 */

const expressionText = document.getElementById("expression-text")
let expression = '';
let result = 0;

function updateExpressionText() {
   expressionText.textContent = expression
}

function processButtonPress(buttonType, buttonValue) {
   console.log(buttonType, buttonValue)
   switch (buttonType) {
      case 'number':
         expression += buttonValue
         updateExpressionText()
         break;
      case 'decimal-point':
         
         break;
      case 'operator':
         
         break;
      case 'command':
         
         break;
   }
}

document.querySelectorAll('button').forEach((button) => {
   button.addEventListener('click', () => {
      processButtonPress(button.attributes.button_type.value, button.value)
   })
})