//MATH FUNCTIONS
function add(a,b)
{
    return a+b;
}

function  multiply(a,b)
{
    return a * b;
}

function divide(a,b)
{
    if (b==0)
    {
        return "Error: Division by zero is not allowed";
    }

    return a/b;
}

function subtract(a,b)
{
    return a-b;
}

let currentDisplay = '0';
let firstNumber = null;
let currentOperator = null
let waitingForSecondNumber = false;
let justCalculated = false;

function operate(operater , firstNum , secondNum)
{
    //arguements pass to math functions
    let num1 = parseFloat(firstNum);
    let num2 = parseFloat(secondNum);

    if (operater == "+")
    {
        return add(firstNum,secondNum);
    }

    else if (operater == "-")
    {
        return subtract(firstNum,secondNum);
    }

    else if (operater=='/')
    {
        return divide(firstNum,secondNum);
    }

    else if (operater=='*')
    {
        return multiply(firstNum,secondNum);
    }

    else
    {
        return "Error: Unknown operator";
    }
}


//control updates for displauy
function updateDisplay(value)
{
    let displayElement = document.getElementById("display");

    if (typeof(value)=='number')
    {
        let formattedValue = formatNumber(value);
        displayElement.textContent = formattedValue;
        currentDisplay = formattedValue;
    }

    else
    {
        displayElement.textContent = value;
        currentDisplay = value;
    }
}


//current state of display of final answer
function getCurrentDisplay()
{
    let displayText = currentDisplay;
    let numericValue = parseFloat(displayText);

    if (numericValue == isNaN(numericValue))
    {
        return 0;
    }

    else return numericValue;
}

function formatNumber(num)
{
    if(num.toString().length > 10)
    {
        return num.toFixed(10).replace(/\.?0+$/,""); //removes trailing zeros
    }

    else return num.toString();
}

//input handling
function handleNumberClick(clickedNumber)
{
    if (clickedNumber === 'clear')
    {
        handleClear();
        return;
    }

    //starting fresh
    if (justCalculated == true)
    {
        currentDisplay = clickedNumber;
        justCalculated = false;
        waitingForSecondNumber=false;
        firstNumber=null;
        currentOperator=null;
    }

    //starting second num after operator click
    else if (waitingForSecondNumber==true)
    {
        currentDisplay = clickedNumber;
        waitingForSecondNumber=false;
    }

    //replacing 0
    else if (currentDisplay == '0')
    {
        currentDisplay = clickedNumber;
    }

    else
    //appending clicked number to appended display
    {
        currentDisplay = currentDisplay.toString() + clickedNumber;
    }

    updateDisplay(currentDisplay);
}

function handleOperatorClick(clickedOperator)
{
    let currentNumber = getCurrentDisplay();

    if (firstNumber==null){
        firstNumber = currentNumber;
        currentOperator=clickedOperator;
        waitingForSecondNumber=true;
        justCalculated=false;
    }

    else if (waitingForSecondNumber == false) //operation carried out
    {
        let result = operate(currentOperator,firstNumber,currentNumber);
        updateDisplay(result);

        //continued calculation
        if (typeof result === 'number') {
            firstNumber = result;
            justCalculated = false;
            waitingForSecondNumber = true;
            currentOperator = clickedOperator;
        }
    }

    else
    {
        currentOperator=clickedOperator;
    }
}

function handleEqualClick()
{
    if(firstNumber==null || currentDisplay==null)
    {
        return;
    }

    let secondNumber = getCurrentDisplay()
    let result = operate(currentOperator,firstNumber,secondNumber)

    if (typeof result === 'string' && result.includes('Error'))
    {
        updateDisplay(result);
        resetCalculator();
    }

    else
    {
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

function resetCalculator() {
    currentDisplay = "0";
    firstNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
    justCalculated = false;
    updateDisplay("0");
}

function setupEventListener()
{
    //num buttons setup
    let numberButtons =  document.querySelectorAll('[data-number]');
    numberButtons.forEach(button => {
        button.addEventListener('click' , () =>
        {
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
    equalsButton.addEventListener('click', () =>{
        handleEqualClick();
    });
}

function initialize()
{
    updateDisplay("0");
    setupEventListener();
}

document.addEventListener('DOMContentLoaded', initialize);












