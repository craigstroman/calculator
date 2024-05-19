import Calculator from './calculator/index';

const buttons = document.getElementsByClassName('btn');
const clearBtn = document.getElementById('clear-function');
const sumBtn = document.getElementById('sum-function');
const input = document.getElementsByClassName('calculator-input');
const result = document.getElementsByClassName('expression')[0];

const calculator = new Calculator(buttons, clearBtn, sumBtn, input, result);

calculator.initCalculator();
