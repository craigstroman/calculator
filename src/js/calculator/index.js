// TODO: Remove lnv button, move both sin and ln buttons over 1 and add a log button since there is a math.log method
// TODO: Also work on Xy button next to 0
export default class Calculator {
  constructor(buttons, clearBtn, sumBtn, input, result) {
    this.buttons = buttons;
    this.clearBtn = clearBtn;
    this.sumBtn = sumBtn;
    this.input = input[0];
    this.result = result;
    this.inputText = '';
    this.btnClicked = '';
  }

  initCalculator() {
    const buttonLength = this.buttons.length;

    if (this.buttons && buttonLength >= 1) {
      for (let i = 0; i < buttonLength; i = i + 1) {
        this.buttons[i].addEventListener(
          'click',
          (e) => {
            this.handleKeyPress(e);
          },
          false,
        );
      }
    }

    this.sumBtn.addEventListener('click', (e) => this.sum(), false);

    this.clearBtn.addEventListener('click', (e) => this.clear(e));
  }

  handleKeyPress(e) {
    let btnClass = e.target.classList.length > 1 ? e.target.classList[2] : e.target.classList;
    let answer = this.input.getAttribute('data-answer');
    this.btnClicked = e.target.textContent;
    this.inputText = this.input.textContent ? this.input.textContent : this.input.innerText;

    if (answer === 'true' && this.btnClicked !== 'Ans') {
      this.input.innerHTML = '';
      this.input.setAttribute('data-answer', false);
      this.sumBtn.disabled = false;
    }

    switch (btnClass) {
      case 'btn-math-function':
        this.setMathFunction();
        break;
      case 'btn-number':
        this.setNumber();
        break;
      case 'btn-percent':
        this.setPercent();
        break;
      case 'btn-negative-number':
        this.setNegativeNumber();
        break;
      case 'btn-operator':
        this.setOperator();
        break;
      case 'btn-function':
        this.setFunction();
      case 'btn-parentheses':
        this.setParentheses();
        break;
      case 'btn-decimal':
        this.setDecimal();
      default:
        return 0;
    }
  }

  clear(e) {
    const result = document.getElementsByClassName('expression')[0];

    if (e.target.innerText === 'CE') {
      const htmlLength = this.input.innerHTML.length;
      const lastCharacter = this.input.innerHTML.substr(htmlLength - 1, 1);

      if (
        this.isNumber(parseFloat(lastCharacter)) ||
        lastCharacter === '%' ||
        lastCharacter === '.' ||
        lastCharacter === '-'
      ) {
        this.input.innerHTML = this.input.innerHTML.substr(0, htmlLength - 1);
      } else {
        this.input.lastChild.remove();
      }

      if (this.input.innerHTML.length === 0) {
        this.input.innerHTML = 0;
      }
    } else {
      if (this.sumBtn.disabled === true) {
        this.sumBtn.disabled = false;
      }

      result.innerHTML = '';
      this.input.innerHTML = '0';
      this.innerHTML = 'CE';
    }
  }

  setParentheses() {
    if (this.btnClicked === '(') {
      if (this.inputText === '0') {
        this.input.innerHTML = this.btnClicked;
      } else {
        this.input.innerHTML = this.input.innerHTML + this.btnClicked;
      }
    } else if (this.btnClicked === ')') {
      if (this.inputText === '0' || this.inputText === '(') {
        alert('Error.');
        console.log('Error');
      } else {
        this.input.innerHTML = this.input.innerHTML + this.btnClicked;
      }
    }
  }

  setDecimal() {
    const lastCharacter = this.inputText.substring(this.inputText.length - 1, 1);
    if (this.inputText === '0') {
      this.input.innerHTML = this.input.innerHTML + this.btnClicked;
    } else {
      if (
        (lastCharacter !== '.' && this.isOperator(lastCharacter)) ||
        (lastCharacter !== '.' && this.input.innerHTML === '')
      ) {
        this.input.innerHTML = this.input.innerHTML + '0' + this.btnClicked;
      } else {
        this.input.innerHTML =
          lastCharacter !== '.' ? this.input.innerHTML + this.btnClicked : this.input.innerHTML;
      }
    }
  }

  setFunction() {
    if (this.btnClicked === 'Ans') {
      if (this.input.getAttribute('data-answer') === 'true') {
        const sumBtn = document.getElementById('sum-function');

        this.input.setAttribute('data-answer', false);
        sumBtn.disabled = false;

        this.input.innerHTML = input.innerHTML;
      }
    }
  }

  setMathFunction() {
    let newMathFunction = '';
    const subText = document.createElement('sub');

    switch (this.btnClicked) {
      case 'log':
        this.btnClicked = 'log(';

        newMathFunction = this.btnClicked;
        break;
      case 'log10':
        subText.innerHTML = '10';
        this.btnClicked = `log${subText.outerHTML}(`;

        newMathFunction = this.btnClicked;
        break;
      case 'xY':
        if (this.inputHtml.innerText === '0') {
          console.log('Error.');
          alert('Error');
          return 0;
        } else {
          const hiddenText = document.createElement('span');
          hiddenText.className = 'hidden';
          hiddenText.innerHTML = '^';
          const supperText = document.createElement('sup');
          supperText.className = 'supper';

          newMathFunction = hiddenText.outerHTML + supperText.outerHTML;
        }
        break;
      case '2√x':
        this.btnClicked = '√';
        newMathFunction = document.createElement('span');
        newMathFunction.className = 'spacer';
        newMathFunction.innerHTML = this.btnClicked + '(';
        break;
      case 'EXP':
        this.btnClicked = 'exp';
        newMathFunction = document.createElement('span');
        newMathFunction.className = 'spacer';
        newMathFunction = this.btnClicked + '(';
        break;
      case 'x!':
        this.btnClicked = '!';
        newMathFunction = this.btnClicked;
        break;
      case 'π':
        const lastCharacter = this.input.innerHTML.substr(0, this.input.innerHTML.length);
        newMathFunction = lastCharacter !== '3.141592653589793' ? Math.PI : '';
        break;
      default:
        newMathFunction = this.btnClicked + '(';
    }

    if (this.inputText === '0') {
      this.input.innerHTML =
        typeof newMathFunction === 'object' ? newMathFunction.outerHTML : newMathFunction;
    } else {
      if (typeof newMathFunction === 'object') {
        this.input.appendChild(newMathFunction);
      } else {
        this.input.innerHTML = this.input.innerHTML + newMathFunction;
      }
    }

    return this.input.innerHTML;
  }

  setPercent() {
    const lastCharacterIndex = this.inputText.lastIndexOf('');
    const lastCharacter = this.inputText.substring(lastCharacterIndex - 1, 1);
    const power = document.getElementsByClassName('supper')[0];

    if (lastCharacter !== '%') {
      if (this.inputText === '0') {
        this.input.innerHTML = this.btnClicked;
      } else if (power !== undefined) {
        power.innerHTML = power.innerHTML + this.btnClicked;
      } else {
        this.input.innerHTML = this.input.innerHTML + this.btnClicked;
      }
    } else {
      this.input.innerHTML = this.input.innerHTML.substr(0, this.input.innerHTML.length - 1);
    }

    return this.input.innerHTML;
  }

  setNegativeNumber() {
    const numbers = this.inputText.split(/(-?[0-9]+\.[0-9]{1,}%?|-?[0-9]+%?)/g).filter(function (el) {
      return el.length != 0;
    });

    if (numbers.length === 1) {
      if (this.isNumber(numbers[0])) {
        if (this.isNegativeNumber(numbers[0])) {
          const numberLength = numbers[0].length;
          this.input.innerHTML = this.input.innerHTML.substr(1, numberLength);
        } else {
          this.input.innerHTML = numbers[0] > 0 ? '-' + this.input.innerHTML : this.input.innerHTML;
        }
      }
    } else {
      const htmlLength = this.input.innerHTML.length;
      let lastNumberLength = 0;
      const lastNumber = numbers.pop();
      lastNumberLength = lastNumber.length;
      if (this.isNumber(lastNumber)) {
        if (this.isNegativeNumber(lastNumber)) {
          const newLastNumber = lastNumber.substr(1, lastNumberLength);
          this.input.innerHTML =
            this.input.innerHTML.substr(0, htmlLength - lastNumberLength) + newLastNumber;
        } else {
          if (this.input.innerHTML.substr(htmlLength - lastNumberLength, lastNumberLength) > 0) {
            this.input.innerHTML =
              this.input.innerHTML.substr(0, htmlLength - lastNumberLength) +
              '-' +
              this.input.innerHTML.substr(htmlLength - lastNumberLength, lastNumberLength);
          }
        }
      }
    }

    return this.input.innerHTML;
  }

  isNegativeNumber(number) {
    number = parseFloat(number);
    if (this.isNumber(number)) {
      return number < 0 ? true : false;
    } else {
      return false;
    }
  }

  setOperator() {
    const lastCharacterIndex = this.inputText.trim().lastIndexOf('');
    const lastCharacter = this.inputText.substr(lastCharacterIndex - 1, 1);
    const newOperator = document.createElement('span');
    const power = document.getElementsByClassName('supper')[0];

    if (this.btnClicked !== '-') {
      newOperator.className = 'spacer';
    }

    this.btnClicked = this.btnClicked === '-' ? ' ' + this.btnClicked + ' ' : this.btnClicked;

    if (power !== undefined) {
      power.className = '';
    }

    if (lastCharacter !== '+' && lastCharacter !== '-' && lastCharacter !== 'x' && lastCharacter !== '÷') {
      newOperator.innerHTML = this.btnClicked;
      this.input.innerHTML += newOperator.outerHTML;
    } else if (
      lastCharacter === '+' ||
      lastCharacter === '-' ||
      lastCharacter === 'x' ||
      lastCharacter === '÷'
    ) {
      newOperator.innerHTML = btnClicked;
      this.input.lastChild.remove();
      this.input.innerHTML += newOperator.outerHTML;
    }

    return this.input.innerHTML;
  }

  setNumber() {
    const power = document.getElementsByClassName('supper')[0];
    if (this.inputText === '0') {
      this.input.innerHTML = this.btnClicked;
    } else if (power !== undefined) {
      power.innerHTML = power.innerHTML + this.btnClicked;
    } else {
      if (this.input.innerHTML === '0') {
        this.input.innerHTML = this.btnClicked;
      } else {
        this.input.innerHTML = this.input.innerHTML + this.btnClicked;
      }
    }

    return this.input.innerHTML;
  }

  sum() {
    const clearBtn = document.getElementById('clear-function');
    const input = document.getElementsByClassName('calculator-input')[0];
    const showExpression = document.getElementsByClassName('expression')[0];
    const inputHtml = input.innerHTML;

    let postFix = [];
    let result = null;
    let chars = '';

    chars = this.inputText
      .replace('exp(', 'EXP(')
      .replace(/\=/g, '')
      .replace(/x/g, '*')
      .replace(/÷/g, '/')
      .replace(/log10\(/g, 'logTen(')
      .replace(/ln/g, 'log')
      .replace(/√/g, 'sqrt')
      .trim();

    chars = chars.split(/(-?[0-9]+\.[0-9]{1,}%?|-?[0-9]+%?|\+|\-|\*|\/|\^|\(|\)|\!)/g).filter(function (el) {
      if (el !== ' ') {
        if (el.length >= 1) {
          return el;
        }
      }
    });

    postFix = this.infixPostFixExpression(chars);

    result = this.evaluateExpression(postFix);

    showExpression.innerHTML = inputHtml;
    this.input.innerHTML = result;

    clearBtn.innerHTML = 'AC';

    this.disabled = true;

    input.setAttribute('data-answer', true);
  }

  isNumber(number) {
    return !isNaN(number) ? true : false;
  }

  isPercent(string) {
    if (string && string.length >= 1) {
      return string.indexOf('%') >= 1 ? true : false;
    }
    return false;
  }

  isOperator(string) {
    const regularExpression = new RegExp(/[+|-|*|log|logTen|sqrt|sin|cos|tan|EXP|e|!]/gm);

    if (string.match(regularExpression)) {
      return true;
    } else {
      return false;
    }
  }

  infixPostFixExpression(characters) {
    let output = [];
    let operatorStack = [];

    while (characters.length !== 0) {
      const currentCharacter = characters.shift();
      if (this.isNumber(currentCharacter) || this.isPercent(currentCharacter)) {
        output.push(currentCharacter);
      } else if (this.isOperator(currentCharacter)) {
        while (
          (this.getAssociativity(currentCharacter) === 'left' &&
            this.getOperatorPriority(currentCharacter) <=
              this.getOperatorPriority(operatorStack[operatorStack.length - 1])) ||
          (this.getAssociativity(currentCharacter) === 'right' &&
            this.getOperatorPriority(currentCharacter) <
              this.getOperatorPriority(operatorStack[operatorStack.length - 1]))
        ) {
          output.push(operatorStack.pop());
        }
        operatorStack.push(currentCharacter);
      } else if (currentCharacter === '(') {
        operatorStack.push(currentCharacter);
      } else if (currentCharacter === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          if (operatorStack.length === 0) {
            console.log('Error, parenthesis not balanced.');
            alert('Error, parenthesis not balanced.');
            break;
          }
          output.push(operatorStack.pop());
        }
        operatorStack.pop();
      }
    }

    while (operatorStack.length !== 0) {
      if (!operatorStack.toString().match(/([@'(@',@')@'])/gm)) {
        output.push(operatorStack.pop());
      } else {
        console.log('Error, parenthesis not balanced.');
        alert('Error, parenthesis not balanced.');
        break;
      }
    }

    return output;
  }

  getAssociativity(character) {
    return character === '+' || character === '-' || character === '*' || character === '/'
      ? 'left'
      : 'right';
  }

  getFactorial(characters) {
    let result = 1;

    for (let i = 1; i <= characters.length; i = i + 1) {
      result = result * i;
    }

    return result;
  }

  getOperatorPriority(operator) {
    if (
      operator === 'log' ||
      operator === 'logTen' ||
      operator === 'sqrt' ||
      operator === 'sin' ||
      operator === 'cos' ||
      operator === 'tan' ||
      operator === 'EXP' ||
      operator === 'e' ||
      operator === '!'
    ) {
      return 9;
    } else if (operator === '*' || operator === '/' || operator === '%' || operator === '^') {
      return 8;
    } else if (operator === '+' || operator === '-') {
      return 6;
    } else {
      return -1;
    }
  }

  evaluateExpression(characters) {
    let evalStack = [];

    while (characters.length !== 0) {
      const currentCharacter = characters.shift();

      if (this.isNumber(currentCharacter) || this.isPercent(currentCharacter)) {
        evalStack.push(currentCharacter);
      } else if (this.isOperator(currentCharacter)) {
        let operand1 = 0;
        let operand2 = 0;

        operand2 = evalStack.pop();
        operand1 = evalStack.pop();

        const result = this.performOperation(operand1, operand2, currentCharacter);

        evalStack.push(result);
      }
    }

    return evalStack.pop();
  }

  performOperation(operand1, operand2, operator) {
    let result = 0;
    if (
      operator === 'log' ||
      operator === 'logTen' ||
      operator === 'sqrt' ||
      operator === 'sin' ||
      operator === 'cos' ||
      operator === 'tan' ||
      operator === 'EXP' ||
      operator === 'e' ||
      operator === '!'
    ) {
      operand2 = parseFloat(operand2);

      switch (operator) {
        case 'log':
          result = Math.log(operand2);
          break;
        case 'logTen':
          result = Math.log(operand2) / Math.LN10;
          break;
        case 'sqrt':
          result = Math.sqrt(operand2);
          break;
        case 'sin':
          result = Math.sin(operand2);
          break;
        case 'cos':
          result = Math.cos(operand2);
          break;
        case 'tan':
          result = Math.tan(operand2);
          break;
        case 'EXP':
          result = Math.exp(operand2);
          break;
        case 'e':
          result = operand2 * Math.E;
          break;
        case '!':
          result = this.getFactorial(operand2);
          break;
      }
    } else {
      if (this.isPercent(operand1) || this.isPercent(operand2)) {
        result = this.getPercent(operand1, operand2, operator);
      } else {
        operand1 = parseFloat(operand1);
        operand2 = parseFloat(operand2);
        switch (operator) {
          case '+':
            result = operand1 + operand2;
            break;
          case '-':
            result = operand1 - operand2;
            break;
          case '*':
            result = operand1 * operand2;
            break;
          case '/':
            result = operand1 / operand2;
            break;
          case '^':
            result = Math.pow(operand1, operand2);
            break;
        }
      }
    }

    return result;
  }
}
