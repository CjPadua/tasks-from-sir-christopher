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

const expressionText = document.getElementById("expression-text");
const resultText = document.getElementById("result-text");

let expression = '';
let result = 0;

function updateExpressionText() {
   expressionText.textContent = expression;
}

function appendToTheExpression(value) {
   expression += value;
   updateExpressionText();
}

function removeLastItemInTheExpression() {
   const expressionArray = expression.split('');
   expressionArray.pop();
   expression = expressionArray.join('');
}

function checkIfItemIsOperator(item) {
   const isItemInOperatorsArray = ['+', '-', '*', '/'].find((operator) => {
      return operator === item
   })

   return isItemInOperatorsArray;
}

function processButtonPress(buttonType, buttonValue) {
   console.log(buttonType, buttonValue)
   switch (buttonType) {
      case 'number':
         appendToTheExpression(buttonValue);
         break;

      case 'decimal-point':

         if(expression.includes('.')) {
            break;
         }
         appendToTheExpression(buttonValue);
         break;

      case 'operator':
         const lastItemInExpression = expression.at(-1);

         if(parseInt(lastItemInExpression)) {
            appendToTheExpression(buttonValue);
            break;
         }

         if(
            checkIfItemIsOperator(lastItemInExpression) &&
            lastItemInExpression !== buttonValue
         ) {
            removeLastItemInTheExpression()
            appendToTheExpression(buttonValue);
         }

         break;

      case 'command':
         
         switch (buttonValue) {
            case 'equal':
               
               try {
                  result = eval(expression);
               } catch (error) {
                  result = "Error"
               }

               resultText.textContent = result;
               break;

            case 'backspace':
               removeLastItemInTheExpression();
               updateExpressionText();
               break;

            case 'clear':
               expression = '';
               updateExpressionText();
               break;
         }
         
         break;
   }
}

document.querySelectorAll('button').forEach((button) => {
   button.addEventListener('click', () => {
      processButtonPress(button.attributes.button_type.value, button.value)
   })
})