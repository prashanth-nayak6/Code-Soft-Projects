const buttonLayout = [
  ["AC", "DEL", "%", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="]
];

const pad = document.getElementById("pad");
const historyText = document.getElementById("history");
const currentText = document.getElementById("current");

let firstNumber = "";
let secondNumber = "";
let currentOperator = "";
let shouldResetScreen = false;

function buildButtons() {
  for (let row = 0; row < buttonLayout.length; row++) {
    const currentRow = buttonLayout[row];
    for (let col = 0; col < currentRow.length; col++) {
      const symbol = currentRow[col];
      const button = document.createElement("button");
      button.textContent = symbol;
      button.dataset.value = symbol;

      if ("+-*/%".includes(symbol)) button.classList.add("op");
      if (symbol === "AC" || symbol === "DEL") button.classList.add("danger");
      if (symbol === ".") button.classList.add("util");
      if (symbol === "=") button.classList.add("equals");
      if (symbol === "0") button.classList.add("zero");

      button.addEventListener("click", () => processInput(symbol));
      pad.appendChild(button);
    }
  }
}

function processInput(value) {
  if (value >= "0" && value <= "9") {
    appendNumber(value);
  } else if (value === ".") {
    appendDecimal();
  } else if (value === "AC") {
    resetCalculator();
  } else if (value === "DEL") {
    deleteOneChar();
  } else if (value === "=") {
    calculateResult();
  } else {
    setOperator(value);
  }

  updateDisplay();
}

function appendNumber(digit) {
  if (shouldResetScreen) {
    secondNumber = "";
    shouldResetScreen = false;
  }

  if (currentOperator === "") {
    firstNumber += digit;
  } else {
    secondNumber += digit;
  }
}

function appendDecimal() {
  if (currentOperator === "") {
    if (firstNumber.includes(".")) return;
    if (firstNumber === "") firstNumber = "0";
    firstNumber += ".";
  } else {
    if (secondNumber.includes(".")) return;
    if (secondNumber === "") secondNumber = "0";
    secondNumber += ".";
  }
}

function setOperator(operatorSymbol) {
  if (firstNumber === "") return;

  if (secondNumber !== "") {
    calculateResult();
  }

  currentOperator = operatorSymbol;
  shouldResetScreen = false;
}

function calculateResult() {
  if (firstNumber === "" || secondNumber === "" || currentOperator === "") return;

  const a = Number(firstNumber);
  const b = Number(secondNumber);
  let result;

  if (currentOperator === "+") {
    result = a + b;
  } else if (currentOperator === "-") {
    result = a - b;
  } else if (currentOperator === "*") {
    result = a * b;
  } else if (currentOperator === "/") {
    if (b === 0) {
      currentText.textContent = "Error";
      historyText.textContent = "";
      secondNumber = "";
      currentOperator = "";
      shouldResetScreen = true;
      return;
    }
    result = a / b;
  } else if (currentOperator === "%") {
    result = a % b;
  } else {
    return;
  }

  historyText.textContent = `${firstNumber} ${currentOperator} ${secondNumber} =`;
  firstNumber = String(parseFloat(result.toFixed(10)));
  secondNumber = "";
  currentOperator = "";
  shouldResetScreen = true;
}

function deleteOneChar() {
  if (shouldResetScreen) return;

  if (secondNumber !== "") {
    secondNumber = secondNumber.slice(0, -1);
  } else if (currentOperator !== "") {
    currentOperator = "";
  } else {
    firstNumber = firstNumber.slice(0, -1);
  }
}

function resetCalculator() {
  firstNumber = "";
  secondNumber = "";
  currentOperator = "";
  shouldResetScreen = false;
  historyText.textContent = "";
}

function updateDisplay() {
  const currentValue = secondNumber || firstNumber || "0";
  currentText.textContent = currentValue;

  if (currentOperator !== "") {
    historyText.textContent = `${firstNumber} ${currentOperator}`;
  }
}

buildButtons();
updateDisplay();
