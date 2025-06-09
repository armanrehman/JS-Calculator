function add(a,b){
    return a+b;
}

function  multiply(a,b){
    return a * b;
}

function divide(a,b){
    if (b==0)
    {
        return "Error: Division by zero is not allowed";
    }

    return a/b;
}

function subtract(a,b){
    return a-b;
}

let currentDisplay = '0';
let firstNumber = null;
let currentOperator = null
let waitingForSecondNumber = false;
let justCalculated = false;

function operate(operater , firstNum , secondNum){
    //arguements pass to math functions
    let num1 = parseFloat(firstNum);
    let num2 = parseFloat(secondNum);

    if (operater == "+"){
        return add(firstNum,secondNum);
    }

    else if (operater == "-"){
        return subtract(firstNum,secondNum);
    }

    else if (operater=='/'){
        return divide(firstNum,secondNum);
    }

    else if (operater=='*'){
        return multiply(firstNum,secondNum);
    }

    else if (operater=='%'){
        return num1 % num2;
    }

    else
    {
        return "Error: Unknown operator";
    }
}


//control updates for displauy
function updateDisplay(value){
    let displayElement = document.getElementById("display");

    if (typeof(value)=='number'){
        let formattedValue = formatNumber(value);
        displayElement.textContent = formattedValue;
        currentDisplay = formattedValue;
    }

    else{
        displayElement.textContent = value;
        currentDisplay = value;
    }
}


//current state of display of final answer
function getCurrentDisplay(){
    let displayText = currentDisplay;
    let numericValue = parseFloat(displayText);

    if (isNaN(numericValue)){
        return 0;
    }

    else return numericValue;
}

function formatNumber(num){
    if(num.toString().length > 10){
        return num.toFixed(10).replace(/\.?0+$/,""); //removes trailing zeros
    }

    else return num.toString();
}

//input handling
function handleNumberClick(clickedNumber){
    if (clickedNumber === 'clear'){
        handleClear();
        return;
    }

    //perventing multiple decimals
    if (clickedNumber === '.'){
        if(currentDisplay.toString().includes('.')){
            return;
        };
    }

    //starting fresh
    if (justCalculated == true){
        currentDisplay = clickedNumber;
        justCalculated = false;
        waitingForSecondNumber=false;
        firstNumber=null;
        currentOperator=null;
    }

    //starting second num after operator click
    else if (waitingForSecondNumber==true){
        currentDisplay = clickedNumber;
        waitingForSecondNumber=false;
    }

    //replacing 0
    else if (currentDisplay == '0' && clickedNumber != '.'){
        currentDisplay = clickedNumber;
    }

    //appending clicked number to appended display
    else{
        currentDisplay = currentDisplay.toString() + clickedNumber;
    }

    updateDisplay(currentDisplay);
}

function handleOperatorClick(clickedOperator){
    let currentNumber = getCurrentDisplay();

    if (firstNumber==null){
        firstNumber = currentNumber;
        currentOperator=clickedOperator;
        waitingForSecondNumber=true;
        justCalculated=false;
    }

     //operation carried out
    else if (waitingForSecondNumber == false){
        let result = operate(currentOperator,firstNumber,currentNumber);
        updateDisplay(result);

        //chained calculation
        if (typeof result === 'number'){
            firstNumber = result;
            justCalculated = false;
            waitingForSecondNumber = true;
            currentOperator = clickedOperator;
        }
    }

    //operator replaced
    else{
        currentOperator=clickedOperator;
    }
}

function handleEqualClick(){
    if(firstNumber==null || currentDisplay==null){
        return;
    }

    if (waitingForSecondNumber){
        return; //bug fix
    }

    let secondNumber = getCurrentDisplay()
    let result = operate(currentOperator,firstNumber,secondNumber)

    if (typeof result === 'string' && result.includes('Error')){
        updateDisplay(result);
        resetCalculator();
    }

    else{
        updateDisplay(result);
        justCalculated=true;
        waitingForSecondNumber=false;
        firstNumber=null;
        secondNumber=null;
    }
}

function handleClear(){
    currentDisplay = "0"
    firstNumber = null
    currentOperator = null
    waitingForSecondNumber = false
    justCalculated = false
    updateDisplay("0")
}

function resetCalculator(){
    currentDisplay = "0";
    firstNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
    justCalculated = false;
    updateDisplay("0");
}

function setupEventListener(){
    //num buttons setup
    let numberButtons =  document.querySelectorAll('[data-number]');
    numberButtons.forEach(button => {
        button.addEventListener('click' , () => {
            let clickedNumber = button.getAttribute('data-number');
            handleNumberClick(clickedNumber);
        });
    });

    //operator buttons setup
    let operatorButtons =  document.querySelectorAll('[data-operator]');
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            let clickedOperator = button.getAttribute('data-operator');
            handleOperatorClick(clickedOperator);
        });
    });

    //equals button setup
    let equalsButton = document.querySelector('[data-equals]');
    equalsButton.addEventListener('click', () => {
        handleEqualClick();
    });

    let backspaceButton = document.getElementById('backspace');
            backspaceButton.addEventListener('click', () => {
                handleBackspace();
    });
}

function handleBackspace(){
    if(justCalculated) return;

    if (typeof currentDisplay === 'string' && currentDisplay.includes('Error')){
        return;
    }

    let displayString = currentDisplay.toString();
    if(displayString.length <= 1 || displayString =='0'){
        currentDisplay = '0';
    }

    else currentDisplay = displayString.slice(0, -1); //removing last char

    updateDisplay(currentDisplay);
}

//function for keyboard support
function handleKeyPress(event){
    const key = event.key;
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace' || key.toLowerCase() === 'c') {
        event.preventDefault(); //preventing default action
    }

    if (key >= '0' && key<='9'){
        handleNumberClick(key);
        highlightButton(`btn-${key}`);
    }

    else if (key === '.') {
        handleNumberClick('.');
        highlightButton('btn-dot');
    }

    else if (key === '+') {
        handleOperatorClick('+');
        highlightButton('btn-plus');
    }
    else if (key === '-') {
        handleOperatorClick('-');
        highlightButton('btn-minus');
    }
    else if (key === '*') {
        handleOperatorClick('*');
        highlightButton('btn-multiply');
    }
    else if (key === '/') {
        handleOperatorClick('/');
        highlightButton('btn-divide');
    }

    else if (key === '%') {
        handleOperatorClick('%');
        highlightButton('btn-percent');
    }

    else if (key === '=' || key === 'Enter') {
        handleEqualClick();
        highlightButton('btn-equals');
    }

    else if (key.toLowerCase() === 'c' || key === 'Escape') {
        handleClear();
    }

    else if (key === 'Backspace') {
        handleBackspace();
        highlightButton('backspace');
    }
}

function highlightButton(buttonID)
{
    const button = document.getElementById(buttonID);
    if (button){
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }

}

function initialize()
{
    updateDisplay("0");
    setupEventListener();
}

document.addEventListener('DOMContentLoaded', initialize);
document.addEventListener('keydown' , handleKeyPress);












