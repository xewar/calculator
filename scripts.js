//Saving what should be calculated + displayed
let displayVariable = [] //tracking all the numbers and operators as an array
let t = ''; //for multidigit numbers
let currentNumber = document.querySelector('.currentNumber') //the bottom line on the display
let currentExpression = document.querySelector('.currentExpression') //top line - expression that is displayed
let decimalCount = 0
let significantFigures = 16


//Selecting the Numbers
let calculationDone = 0 //stops the display from changing further until you press clear
let numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(number => number.addEventListener('click', numberSelector, animate));
numberButtons.forEach(number => number.addEventListener('click', animate));
numberButtons.forEach(number => number.addEventListener('transitionend', removeAnimation));

let decimal = document.querySelector('.decimal')
function numberSelector(){
    if (calculationDone === 1) {
        clearAll() //start afresh if you've already pressed enter
    }
    if (this.className.includes('decimal')) {
        decimalCount++
        if (decimalCount >= 2) {
            return //can only use the decimal button once per number
            }}
    t += this.textContent //string of current digits making up the number
    if (t.length >= significantFigures){
        return
    }
    console.log('here')
    currentNumber.textContent = t
    }


//Using the Operator Buttons (+,-,etc...)
let operatorButtons = document.querySelectorAll('.basicOps');
operatorButtons.forEach(btn => btn.addEventListener('click',operationSelector));
operatorButtons.forEach(btn => btn.addEventListener('click',animate));
operatorButtons.forEach(number => number.addEventListener('transitionend', removeAnimation));

function operationSelector(){
    if (calculationDone === 1) {
        clearAll() //start afresh if you've already pressed enter
    }
    if (t != '') { //don't add an empty string to the array to be calculated
        console.log('there')
        t = t.slice(0,significantFigures-1)
        displayVariable.push(t)
        currentNumber.textContent = this.textContent;
    }
    if (!t || t.length === 0){ //can start an expression with a minus but not any of the others
        if (this.textContent === '-') {
            t += this.textContent
            currentNumber.textContent += t
        }
        else return
    }
    displayVariable.push(this.textContent)
    t =['']
    currentExpression.textContent = displayVariable.join('') //the currentExpression array is displayed as a string
    decimalCount = 0
}


//Using your keyboard (in addition to the GUI) to select the numbers
document.addEventListener('keydown',isNumberOrDecimalKey);
function isNumberOrDecimalKey(e){
    let keyPressed =''
    let validCharacters = ['.','/','*','=','-','+','c','^','Backspace'];
    let validNumbers = [0,1,2,3,4,5,6,7,8,9]
    if (validCharacters.includes(e.key) ||e.key in validNumbers || e.key === 'Enter') {
        keyPressed = e.key
        if (keyPressed === 'Enter') {
            keyPressed = '='
        }
        else if (keyPressed === 'Backspace') {
            keyPressed = 'del'
        }
        for (const a of document.querySelectorAll("button")) { //from https://stackoverflow.com/questions/3813294/how-to-get-element-by-innertext
            if (a.textContent.includes(keyPressed)) {
                a.click()
            }
        }
    }}

//Rounding and floating point precision
function strip(number) { //Pedro Ladaria's solution, from https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript 
    return (parseFloat(number).toPrecision(12));
}

//using delete key
let del = document.querySelector('.delete');
del.addEventListener('click',deleteLastNumber);
function deleteLastNumber(){
    if (calculationDone === 1) { //delete doesn't work if you've already pressed '='
        return
    }
    t = t.slice(0,t.length-1); //delete key on the current number
    currentNumber.textContent = t;
    if (currentNumber.textContent ==='') { //or current expression
        if (displayVariable.length === 0){
            return
        } else {let lastElement = displayVariable.pop() // have taken off the last element
            if (lastElement.length != '1'){
                lastElement = lastElement.slice(0,-1)
                displayVariable.splice(displayVariable.length,0,lastElement) // add a shortened version back if necessary
            } currentExpression.textContent = displayVariable.join('');
        }
    }
}

//using c to clear the variables and display
let clear = document.querySelector('.clear')
clear.addEventListener('click',clearAll)
function clearAll(){
    t = '';
    displayVariable =[];
    currentNumber.textContent ='';
    currentExpression.textContent = '';
    calculationDone = 0;
}  


//button animations
function animate(){
    this.setAttribute('class','pressed')
}
function removeAnimation(){
    this.removeAttribute('class','pressed')
}

//Calculating the value of the statement
let equals = document.querySelector('.equals')
equals.addEventListener('click', calculate)
function calculate(){
    displayVariable.push(t);
    calculationDone = 1;
    currentExpression.textContent = displayVariable.join('');
    let PEMDAS = ['^','/','*','-','+'];

    //Store negative numbers with their signs
    //if expression starts with a minus sign, the first number is negative
    if (displayVariable[0] === '-') {
        displayVariable.shift();
        displayVariable[0] = -displayVariable[0];
    }
    //if there are two consecutive operators, store the second as part of the following number
    for (let i = 0; i < displayVariable.length; i++) {
        if (PEMDAS.includes(displayVariable[i]) && PEMDAS.includes(displayVariable[i -1])) {
            let combined = displayVariable.splice(i,2);
            displayVariable.splice(i,0,combined[0]+combined[1]);
        }
    }
    //Dividing by zero > undefined
    for (let i = 0; i < displayVariable.length; i++) {
        if (displayVariable[i] === '/' && displayVariable[i+1] === '0') {
        currentNumber.textContent = 'undefined'
        return }
    }

    //Main calculate function
    //iterates through PEMDAS, perform operations and reduces array
    let operatedVal = 0;
    let arrayCopy = displayVariable;
    for (let j = 0; j < PEMDAS.length; j++) {
        for (let i = 0; i<displayVariable.length; i++) {
            while (PEMDAS[j] === displayVariable[i]) {
                operatedVal = operate(displayVariable[i],Number(displayVariable[i-1]),Number(displayVariable[i+1]));
                arrayCopy.splice(i-1,3,operatedVal);
            }
        } 
    } displayVariable = arrayCopy;

    // correcting for floating point imprecision and then printing only significant figures 
    let stripped = strip(displayVariable); 
    while (stripped.slice(-1) === '0'){ //deleting zeroes at the end 
        stripped = stripped.slice(0,stripped.length-1);
    }
    if (stripped.slice(-1) === '.') {//and the decimal if zeroes to right
        stripped = stripped.slice(0,stripped.length-1);
    }

    //adding in commas left of decimal
    //take the length of a string to the left of decimal
    function addComma(){
        let int = stripped.search(/\./);
        if (int === -1) {
            int = stripped.length;
        }
        if (int >= 4) { //if there are four or more numbers to the left of the decimal
            for (let i = int-3; i > 0; (i-=3)) {
               stripped = stripped.slice(0,i) + ',' + stripped.slice(i);
           }
        }
        if (stripped.slice(0,2) === '-,'){ //correction for negative numbers
            stripped = '-' + stripped.slice(2);
        }
        }
    addComma(stripped);
    currentNumber.textContent = stripped;
    }

//Basic Functions
function add(x,y) {
    return x + y
}
function subtract(x,y) {
    return x-y
}
function multiply(x,y) {
    return x*y
}
function power (x,y) {
    return x**y
}
function divide (x,y) {
    return x/y
}

function operate(operator,x,y){
    operators = {
        '+': add(x,y),
        '-': subtract(x,y),
        '*': multiply(x,y),
        "/": divide(x,y),
        '^': power(x,y)
    }
    return operators[operator]
}


