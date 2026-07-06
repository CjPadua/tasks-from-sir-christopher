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

let equalButtonToggled = false;

function updateExpressionText() {
   expressionText.value = expression;
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

function switchHighlightBetweenExpressionAndResult() {
   expressionText.classList.toggle("enlarge-text");
   expressionText.classList.toggle("color-light-gray");
   resultText.classList.toggle("enlarge-text");
   resultText.classList.toggle("color-light-gray");
}

function setEqualButtonToggledFalse() {
   equalButtonToggled = false;
}

function clearExpressionAndResult() {
   expression = '';
   result = '';
   updateExpressionText();
   resultText.value = result;
}

function identifyOperation(expression) {
   const operator = expression.match(/[+\-\*\/]/)[0];
   
   let operation;

   switch (operator) {
      case "+":
         operation = "addition";
         break;
      case "-":
         operation = "subtraction";
         break;
      case "*":
         operation = "multiplication";
         break;
      case "/":
         operation = "division";
         break;
   }

   return operation;
}

function addTwoNumbers(addend1, addend2) {
   const sum = addend1 + addend2
   return sum;
}

function subtractTwoNumbers(minuend, subtrahend) {
   const difference = minuend - subtrahend;
   return difference;
}

function multiplyTwoNumbers(factor1, factor2) {
   const product = factor1 * factor2;
   return product;
}

function divideTwoNumbers(dividend, divisor) {
   const quotient = dividend/divisor;
   return quotient;
}

/**
 * 
 */

function evaluateExpression(expression) {
   let result;
   const operation = identifyOperation(expression);
   const separatedExpression = expression.split(/[+\-\*\/]/);
   const term1 = Number(separatedExpression[0]);
   const term2 = Number(separatedExpression[1]);

   switch (operation) {
      case "addition":
         result = addTwoNumbers(term1, term2);
         break;
      case "subtraction":
         result = subtractTwoNumbers(term1, term2);
         break;
      case "multiplication":
         result = multiplyTwoNumbers(term1, term2);
         break;
      case "division":
         result = divideTwoNumbers(term1, term2);
         break;
   }

   return result;
}

function processButtonPress(buttonType, buttonValue) {
   console.log(buttonType, buttonValue)

   if(equalButtonToggled) {
      switchHighlightBetweenExpressionAndResult();
   }

   switch (buttonType) {
      case 'number':
         if(equalButtonToggled) {
            clearExpressionAndResult();
         }

         appendToTheExpression(buttonValue);
         setEqualButtonToggledFalse();
         break;

      case 'decimal-point':

         if(expression.includes('.')) {
            break;
         }
         appendToTheExpression(buttonValue);
         setEqualButtonToggledFalse();
         break;

      case 'operator':

         if(equalButtonToggled) {
            expression = result.toLocaleString();
         }

         const lastItemInExpression = expression.at(-1);

         if(parseInt(lastItemInExpression)) {
            appendToTheExpression(buttonValue);
            setEqualButtonToggledFalse();
            break;
         }

         if(
            checkIfItemIsOperator(lastItemInExpression) &&
            lastItemInExpression !== buttonValue
         ) {
            removeLastItemInTheExpression()
            appendToTheExpression(buttonValue);
         }
         
         setEqualButtonToggledFalse();
         break;

      case 'command':
         
         switch (buttonValue) {
            case 'equal':

               equalButtonToggled = true;
               
               try {
                  result = eval(expression);
               } catch (error) {
                  result = "Error"
               }

               // expression = result.toLocaleString();
               resultText.value = result;

               switchHighlightBetweenExpressionAndResult();
               break;

            case 'backspace':
               removeLastItemInTheExpression();
               updateExpressionText();
               setEqualButtonToggledFalse();

               break;

            case 'clear':
               clearExpressionAndResult();
               setEqualButtonToggledFalse();
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