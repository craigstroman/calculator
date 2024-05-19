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

    if (Array.isArray(this.buttons)) {
      for (let i = 0; i < buttonLength; i = i + 1) {
        this.buttons[i].addEventListener('click', (e) => this.handleKeyPress(e), false);
      }
    }

    this.sumBtn.addEventListener('click', (e) => this.sum(e), false);

    this.clearBtn.addEventListener('click', (e) => this.clear(e));
  }

  handleKeyPress(e) {
    let btnClassList = e.target.classList.length > 1 ? e.target.classList[2] : e.target.classList;
    let answer = this.input.getAttribute('data-answer');
    this.btnClicked = e.target.textContent;
    this.inputText = input.textContent ? input.textContent : input.innerText;

    if (answer === 'true' && btnClicked !== 'Ans') {
      input.innerHTML = '';
      input.setAttribute('data-answer', false);
      this.sumBtn.disabled = false;
    }

    switch (btnClass) {
      case 'btn-math-function':
        input.innerHTML = this.setMathFunction();
        break;
      case 'btn-number':
        this.input.innerHTML = this.setPercent();
        break;
      case 'btn-percent':
        this.input.innerHTML = this.setPercent();
        break;
      case 'btn-negative-number':
        this.input.innerHTML = this.setNegativeNumber();
        break;
      case 'btn-operator':
        this.input.innerHTML = this.setOperator();
        break;
      case 'btn-function':
        this.input.innerHTML = this.setFunction();
      case 'btn-parentheses':
        this.input.innerHTML = this.setParentheses();
        break;
      case 'btn-decimal':
        this.input.innerHTML = this.setDecimal();
      default:
        return 0;
    }
  }

  sum(e) {}

  clear(e) {}

  setMathFunction() {
    let newMathFunction = '';
    const subText = document.createElement('sub');

    switch (this.btnClicked) {
      case 'log10':
        subText.innerHTML = '10';
        this.btnClicked = `log${subText.outerHTML}(`;

        newMathFunction = this.btnClicked;
        break;
    }
  }

  setPercent() {}

  setNegativeNumber() {}

  setOperator() {}

  setFunction() {}

  setParentheses() {}

  setDecimal() {}
}
