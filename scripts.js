/* Next steps
- get number keys to work
- can't divide by 0
- deal with decimals - TOP has guidance on this
    - decimal button, also when the answer is a long decimal
- can't add more than one decimal
- get del key to work


- work on the design - there's gotta be something you can do
    - barebones calculator
- exponents?
*/



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

function divide (x,y) {
    return x/y
}

function operate(operator,x,y){
    operators = {
        '+': add(x,y),
        '-': subtract(x,y),
        '*': multiply(x,y),
        "/": divide(x,y),
    }
    return operators[operator]
}

//Saving what should be calculated + displayed
let displayVariable = [] //numbers and operators
let t = [''] //for multidigit numbers
let currentNumber = document.querySelector('.currentNumber')
let currentExpression = document.querySelector('.currentExpression')

//using C to clear the variables and display
let clear = document.querySelector('.clear')
clear.addEventListener('click',clearAll)
function clearAll(){
    t = ['']
    displayVariable =[]
    currentNumber.textContent =''
    currentExpression.textContent = ''

}

//Selecting the Numbers
let numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(number => number.addEventListener('click', numberSelector));
function numberSelector(){
    t += this.textContent
    currentNumber.textContent = t

}
//Using the Operator Buttons (+,-,etc...)
let operatorButtons = document.querySelectorAll('.basicOps');
operatorButtons.forEach(btn => btn.addEventListener('click',operationSelector));
function operationSelector(){
    displayVariable.push(t)
    currentNumber.textContent = t
    t =['']
    displayVariable.push(this.textContent)
    //the currentExpression array is displayed as a string
    currentExpression.textContent = displayVariable.join('')
}

//Calculating the value of the statement
let equals = document.querySelector('.equals')
equals.addEventListener('click', calculate)
function calculate(){
    displayVariable.push(t)
    currentExpression.textContent = displayVariable.join('')
    console.log(typeof(displayVariable),displayVariable);
    let PEMDAS = ['/','*','+','-']
    for (item in PEMDAS){
        let newArray = []
        for (let i=0; i<displayVariable.length;i++){
            if (displayVariable[i] === PEMDAS[item]) {
                 newArray[i-1] = operate(PEMDAS[item],+displayVariable[i-1],Number(displayVariable[i+1]))
            }
            else if (displayVariable[i-1] === PEMDAS[item]){
                continue
            }
            else newArray.push(displayVariable[i])
        }
        console.log('item: ',PEMDAS[item],'newArray: ',newArray)
        displayVariable = newArray
        }

    currentNumber.textContent = '';
    // console.log('1: ',currentNumber)
    currentNumber.textContent = displayVariable;
    console.log('2: ',currentNumber)
    console.log('3: ',displayVariable)

    console.log
    }