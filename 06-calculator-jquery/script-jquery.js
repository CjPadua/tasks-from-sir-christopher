const expressionText = $("#expression-text");
const resultText = $("#result-text");

let expression = '';
let result = 0;

let equalButtonToggled = false;

function updateExpressionText() {
   expressionText.val(expression);
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
   expressionText.toggleClass("enlarge-text");
   expressionText.toggleClass("color-light-gray");
   resultText.toggleClass("enlarge-text");
   resultText.toggleClass("color-light-gray");
}

function setEqualButtonToggledFalse() {
   equalButtonToggled = false;
}

function clearExpressionAndResult() {
   expression = '';
   result = '';
   updateExpressionText();
   resultText.val(result);
}

function identifyOperation(expression) {
   const operator = expression.match(/[+\-\*\/]/)[0];
   return operator;
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

function evaluateExpressionV2(expression) {
   const operatorsRegex = /[+\-\*\/]/g;
   const numbers = expression.split(operatorsRegex);
   const operators = expression.match(operatorsRegex);

   let term1, term2, operation, result;

   while(operators.length > 0) {
      
      const mdOperatorIndex = operators.findIndex((operator) => ["*", "/"].includes(operator));

      if(mdOperatorIndex >= 0) {
         operation = operators[mdOperatorIndex];
         term1 = Number(numbers[mdOperatorIndex]);
         term2 = Number(numbers[mdOperatorIndex + 1]);
      }
      else {
         operation = operators[0];
         term1 = Number(numbers[0]);
         term2 = Number(numbers[1]);
      }

      switch (operation) {
         case "+":
            result = addTwoNumbers(term1, term2);
            break;
         case "-":
            result = subtractTwoNumbers(term1, term2);
            break;
         case "*":
            result = multiplyTwoNumbers(term1, term2);
            break;
         case "/":
            result = divideTwoNumbers(term1, term2);
            break;
      }

      if(mdOperatorIndex >= 0) {
         numbers.splice(mdOperatorIndex, 2, result);
         operators.splice(mdOperatorIndex, 1);
      }
      else {
         numbers.shift();
         operators.shift();

         numbers[0] = result;
      }

   }

   return result;
}

function evaluateExpression(expression) {
   let result;
   const operation = identifyOperation(expression);
   const separatedExpression = expression.split(/[+\-\*\/]/);
   const term1 = Number(separatedExpression[0]);
   const term2 = Number(separatedExpression[1]);

   switch (operation) {
      case "+":
         result = addTwoNumbers(term1, term2);
         break;
      case "-":
         result = subtractTwoNumbers(term1, term2);
         break;
      case "*":
         result = multiplyTwoNumbers(term1, term2);
         break;
      case "/":
         result = divideTwoNumbers(term1, term2);
         break;
   }

   return result;
}

function processButtonPress(buttonType, buttonValue) {
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

         if(parseInt(lastItemInExpression) || lastItemInExpression === '0') {
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
                  result = evaluateExpressionV2(expression);
               } catch (error) {
                  result = "Error"
               }

               // expression = result.toLocaleString();
               resultText.val(result);

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

$("button").click(function (){
   processButtonPress($(this).attr("button_type"), $(this).val());
});