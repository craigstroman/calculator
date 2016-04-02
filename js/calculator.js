var Calculator = function () {

    var inputItem = function () {
        var btns = document.getElementsByClassName( "btn" );

        for ( var i = 0; i < btns.length; i++ ) {
            btns[ i ].addEventListener( "click", function ( e ) {
                _handelKeyPres( e );
            }, false );
        }
    };

    var clearCalculator = function () {
        var clearBtn = document.getElementById( 'clear-function' );

        clearBtn.addEventListener( "click", function ( e ) {
            var input = document.getElementsByClassName( "calculator-input" )[ 0 ];
            var inputText = ( input.textContent ) ? input.textContent : input.innerText;
            var result = document.getElementsByClassName( "expression" )[ 0 ];
            var sumBtn = document.getElementById( "sum-function" );

            if ( e.target.innerText === "CE" ) {
                var htmlLength = input.innerHTML.length;
                var lastCharacter = input.innerHTML.substr( htmlLength - 1, 1 );

                if ( _isNumber( parseFloat( lastCharacter ) ) || lastCharacter === "%" || lastCharacter === "." || lastCharacter === "-" ) {
                    input.innerHTML = input.innerHTML.substr( 0, htmlLength - 1 );
                } else {
                    input.lastChild.remove();
                }

                if ( input.innerHTML.length === 0 ) {
                    input.innerHTML = 0;
                }
            } else {
                if ( sumBtn.disabled === true ) {
                    sumBtn.disabled = false;
                }

                result.innerHTML = "";
                input.innerHTML = "0";
                this.innerHTML = "CE";
            }
        }, false );
    };

    //Evaluate using the shunting-yard-algorithm
    var _evaluateExpression = function ( tokens ) {
        var evalStack = [];

        while ( tokens.length !== 0 ) {
            var currentToken = tokens.shift();

            if ( _isNumber( currentToken ) || _isPercent( currentToken ) ) {
                evalStack.push( currentToken );
            } else if ( _isOperator( currentToken ) ) {
                var operand1 = 0;
                var operand2 = 0;

                operand2 = evalStack.pop();
                operand1 = evalStack.pop();

                var result = _performOperation( operand1, operand2, currentToken );

                evalStack.push( result );
            }
        }

        return evalStack.pop();
    };

    var _getAssociativity = function ( token ) {
        return ( token === "+" || token === "-" || token === "*" || token === "/" ) ? "left" : "right";
    };

    var getExpression = function () {

        var sumBtn = document.getElementById( "sum-function" );

        sumBtn.addEventListener( "click", function ( e ) {

            var chars = "";
            var clearBtn = document.getElementById( "clear-function" );
            var input = document.getElementsByClassName( "calculator-input" )[ 0 ];
            var inputText = ( input.textContent ) ? input.textContent : input.innerText;
            var inputHtml = input.innerHTML;
            var postFix = [];
            var result = null;
            var showExpression = document.getElementsByClassName( "expression" )[ 0 ];

            //console.log("inputText: " + inputText);
            //console.log("_isExpression: " + _isExpression(inputText));

            chars = inputText.replace( "exp(", "EXP(" ).replace( /\=/g, "" ).replace( /x/g, "*" ).replace( /÷/g, "/" ).replace( /log10\(/g, "logTen(" ).replace( /ln/g, "log" ).replace( /√/g, "sqrt" ).trim();

            chars = chars.split( /(-?[0-9]+\.[0-9]{1,}%?|-?[0-9]+%?|\+|\-|\*|\/|\^|\(|\)|\!)/g ).filter( function ( el ) {
                if ( el !== " " ) {
                    if ( el.length >= 1 ) {
                        return el;
                    }
                }
            } );

            // console.log("chars: ");
            // console.log(chars);

            postFix = _infixPostFixExpression( chars );

            // console.log("postFix: ");
            // console.log(postFix);

            result = _evaluateExpression( postFix );

            showExpression.innerHTML = inputHtml;
            input.innerHTML = result;

            clearBtn.innerHTML = "AC";

            this.disabled = true;

            input.setAttribute( "data-answer", true );

        }, false );
    };

    var _getFactorial = function ( token ) {
        var result = 1;

        for ( var i = 1; i <= token; i++ ) {
            result = result * i;
        }

        return result;
    };

    var _getOperatorPriority = function ( operator ) {
        if ( operator === "log" || operator === "logTen" || operator === "sqrt" || operator === "sin" || operator === "cos" || operator === "tan" || operator === "EXP" || operator === "e" || operator === "!" ) {
            return 9;
        } else if ( operator === "*" || operator === "/" || operator === "%" || operator === "^" ) {
            return 8;
        } else if ( operator === "+" || operator === "-" ) {
            return 6;
        } else {
            return -1;
        }
    };

    var _getPercent = function ( operand1, operand2, operator ) {
        var num1 = 0;
        var num2 = 0;

        if ( _isPercent( operand1 ) ) {
            num1 = operand1;
            num1 = num1.replace( "%", "" );
            num1 = parseFloat( operand1 );
        } else {
            num1 = parseFloat( operand1 );
        }

        if ( _isPercent( operand2 ) ) {
            num2 = operand2;
            num2 = num2.replace( "%", "" );
            num2 = parseFloat( operand2 );
        } else {
            num2 = parseFloat( operand2 );
        }

        switch ( operator ) {
        case "+":
            if ( _isPercent( operand1 ) && _isPercent( operand2 ) ) {
                return ( ( ( 100 + num2 ) / 100 ) * ( num1 / 100 ) ).toFixed( 4 );
            } else {
                return ( ( _isPercent( operand1 ) ) ? ( num1 / 100 ) + num2 : num1 + ( num2 / 100 ) ).toFixed( 4 );
            }
            break;
        case "-":
            if ( _isPercent( operand1 ) && _isPercent( operand2 ) ) {
                return ( ( 100 - num2 ) / 100 ) * ( num1 / 100 );
            } else {
                return ( _isPercent( operand1 ) ) ? ( num1 / 100 ) - num2 : num1 - ( num2 / 100 );
            }
            break;
        case "*":
            if ( _isPercent( operand1 ) && _isPercent( operand2 ) ) {
                return ( num1 / 100 ) * ( num2 / 100 );
            } else {
                return ( _isPercent( operand1 ) ) ? ( num1 / 100 ) * num2 : num1 * ( num2 / 100 );
            }
            break;
        case "/":
            return num1 / num2;
            break;
        }
    };

    var _handelKeyPres = function ( e ) {
        var answer = false;
        var btnClass = ( e.target.classList.length > 1 ) ? e.target.classList[ 2 ] : e.target.classList;
        var btnClicked = e.target.textContent;
        var input = document.getElementsByClassName( "calculator-input" )[ 0 ];
        var inputText = ( input.textContent ) ? input.textContent : input.innerText;
        var inputTextLength = inputText.length;
        var sumBtn = document.getElementById( "sum-function" );

        answer = input.getAttribute( "data-answer" );

        if ( answer === "true" && btnClicked !== "Ans" ) {
            input.innerHTML = "";
            input.setAttribute( "data-answer", false );
            sumBtn.disabled = false;
        }

        if ( btnClass === "btn-math-function" ) {
            input.innerHTML = _setMathFunction( inputText, input, btnClicked );
        } else if ( btnClass === "btn-number" || btnClass === "btn-percent" ) {
            input.innerHTML = _setPercent( inputText, input, btnClicked );
        } else if ( btnClass === "btn-negative-number" ) {
            input.innerHTML = _setNegativeNumber( inputText, input, e );
        } else if ( btnClass === "btn-operator" ) {
            input.innerHTML = _setOperator( inputText, input, btnClicked );
        } else if ( btnClass === "btn-parentheses" ) {
            if ( btnClicked === "(" ) {
                if ( inputText === "0" ) {
                    input.innerHTML = btnClicked;
                } else {
                    input.innerHTML = input.innerHTML + btnClicked;
                }
            } else if ( btnClicked === ")" ) {
                if ( inputText === "0" || inputText === "(" ) {
                    alert( "Error." );
                    console.log( "Error" );
                } else {
                    input.innerHTML = input.innerHTML + btnClicked;
                }
            }
        } else if ( btnClass === "btn-decimal" ) {
            var lastCharacter = inputText.substr( inputText.length - 1, 1 );
            if ( inputText === "0" ) {
                input.innerHTML = input.innerHTML + btnClicked;
            } else {
                if ( ( lastCharacter !== "." && _isOperator( lastCharacter ) ) || ( lastCharacter !== "." && input.innerHTML === "" ) ) {
                    input.innerHTML = input.innerHTML + "0" + btnClicked;
                } else {
                    input.innerHTML = ( lastCharacter !== "." ) ? input.innerHTML + btnClicked : input.innerHTML;
                }
            }
        } else if ( btnClass === "btn-function" ) {
            if ( btnClicked === "Ans" ) {
                if ( input.getAttribute( "data-answer" ) === "true" ) {
                    var result = document.getElementsByClassName( "expression" )[ 0 ];
                    var sumBtn = document.getElementById( "sum-function" );

                    input.setAttribute( "data-answer", false );
                    sumBtn.disabled = false;

                    input.innerHTML = input.innerHTML;
                }
            } else if ( btnClicked === "lnv" ) {
                console.log( "Coming soon." );
                alert( "Coming soon." );
            }
        }
    };

    var _isExpression = function ( string ) {
        string = string.replace( /\=/g, "" ).replace( /x/g, "*" ).replace( /÷/g, "/" );
        var expr = string.match( /(\+|\-|\*|\\|\%|\(|\|))/g );

        if ( expr !== null ) {
            return ( expr.length >= 1 ) ? true : false;
        } else {
            return false;
        }
    };

    var _isNegativeNumber = function ( token ) {
        token = parseFloat( token );
        if ( _isNumber( token ) ) {
            return ( token < 0 ) ? true : false;
        } else {
            return false;
        }
    };

    var _isNumber = function ( token ) {
        return ( !isNaN( token ) ) ? true : false;
    };

    var _isOperator = function ( token ) {
        switch ( token ) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "log":
        case "logTen":
        case "sqrt":
        case "sin":
        case "cos":
        case "tan":
        case "EXP":
        case "e":
        case "!":
            return true;
            break;
        default:
            return false;
            break;
        }
    };

    var _isPercent = function ( token ) {
        return ( token.toString().indexOf( "%" ) >= 1 ) ? true : false;
    };

    var _infixPostFixExpression = function ( tokens ) {
        var output = [];
        var operatorStack = [];

        while ( tokens.length !== 0 ) {
            var currentToken = tokens.shift();

            if ( _isNumber( currentToken ) || _isPercent( currentToken ) ) {
                output.push( currentToken );
            } else if ( _isOperator( currentToken ) ) {
                while ( ( _getAssociativity( currentToken ) === "left" && _getOperatorPriority( currentToken ) <= _getOperatorPriority( operatorStack[ operatorStack.length - 1 ] ) ) || ( _getAssociativity( currentToken ) === "right" && _getOperatorPriority( currentToken ) < _getOperatorPriority( operatorStack[ operatorStack.length - 1 ] ) ) ) {
                    output.push( operatorStack.pop() );
                }
                operatorStack.push( currentToken );
            } else if ( currentToken === "(" ) {
                operatorStack.push( currentToken );
            } else if ( currentToken === ")" ) {
                while ( operatorStack[ operatorStack.length - 1 ] !== "(" ) {
                    if ( operatorStack.length === 0 ) {
                        console.log( "Error, parenthesis not balanced." );
                        alert( "Error, parenthesis not balanced." );
                        break;
                    }
                    output.push( operatorStack.pop() );
                }
                operatorStack.pop();
            }
        }

        while ( operatorStack.length !== 0 ) {
            if ( !operatorStack[ operatorStack.length - 1 ].match( /([()])/ ) ) {
                output.push( operatorStack.pop() );
            } else {
                console.log( "Error, parenthesis not balanced." );
                alert( "Error, parenthesis not balanced." );
                break;
            }
        }

        return output;
    };

    var _performOperation = function ( operand1, operand2, operator ) {
        if ( operator === "log" || operator === "logTen" || operator === "sqrt" || operator === "sin" || operator === "cos" || operator === "tan" || operator === "EXP" || operator === "e" || operator === "!" ) {
            operand2 = parseFloat( operand2 );
            switch ( operator ) {
            case "log":
                return Math.log( operand2 );
                break;
            case "logTen":
                return Math.log( operand2 ) / Math.LN10;
                break;
            case "sqrt":
                return Math.sqrt( operand2 );
                break;
            case "sin":
                return Math.sin( operand2 );
                break;
            case "cos":
                return Math.cos( operand2 );
                break;
            case "tan":
                return Math.tan( operand2 );
                break;
            case "EXP":
                return Math.exp( operand2 );
                break;
            case "e":
                return operand2 * Math.E;
                break;
            case "!":
                return _getFactorial( operand2 );
                break;
            }
        } else {
            if ( ( _isPercent( operand1 ) || _isPercent( operand2 ) ) ) {
                return _getPercent( operand1, operand2, operator );
            } else {
                operand1 = parseFloat( operand1 );
                operand2 = parseFloat( operand2 );
                switch ( operator ) {
                case "+":
                    return operand1 + operand2;
                    break;
                case "-":
                    return operand1 - operand2;
                    break;
                case "*":
                    return operand1 * operand2;
                    break;
                case "/":
                    return operand1 / operand2;
                    break;
                case "^":
                    return Math.pow( operand1, operand2 );
                    break;
                }
            }

        }
    };

    var _setMathFunction = function ( inputText, inputHtml, btnClicked ) {
        var newMathFunction = "";

        if ( btnClicked === "log10" ) {
            var subText = document.createElement( "sub" );
            subText.innerHTML = "10";
            btnClicked = "log" + subText.outerHTML + "(";

            newMathFunction = btnClicked;
        } else if ( btnClicked === "xY" ) {
            if ( inputHtml.innerText === "0" ) {
                console.log( "Error." );
                alert( "Error" );
                return 0;
            } else {
                var hiddenText = document.createElement( "span" );
                hiddenText.className = "hidden";
                hiddenText.innerHTML = "^";
                var supperText = document.createElement( "sup" );
                supperText.className = "supper";

                newMathFunction = hiddenText.outerHTML + supperText.outerHTML;
            }
        } else if ( btnClicked === "2√x" ) {
            btnClicked = "√";
            newMathFunction = document.createElement( "span" );
            newMathFunction.className = "spacer";
            newMathFunction.innerHTML = btnClicked + "(";
        } else if ( btnClicked === "EXP" ) {
            btnClicked = "exp";
            newMathFunction = document.createElement( "span" );
            newMathFunction.className = "spacer";
            newMathFunction = btnClicked + "(";
        } else if ( btnClicked === "x!" ) {
            btnClicked = "!";
            newMathFunction = btnClicked;
        } else if ( btnClicked === "π" ) {
            var lastCharacter = inputHtml.innerHTML.substr( 0, inputHtml.innerHTML.length );
            newMathFunction = ( lastCharacter !== "3.141592653589793" ) ? Math.PI : "";
        } else {
            newMathFunction = btnClicked + "(";
        }

        if ( inputText === "0" ) {
            inputHtml.innerHTML = ( typeof newMathFunction === "object" ) ? newMathFunction.outerHTML : newMathFunction;
        } else {
            if ( typeof newMathFunction === "object" ) {
                inputHtml.appendChild( newMathFunction );
            } else {
                inputHtml.innerHTML = inputHtml.innerHTML + newMathFunction;
            }
        }

        return inputHtml.innerHTML;
    };

    var _setNegativeNumber = function ( inputText, inputHtml, e ) {

        var numbers = inputText.split( /(-?[0-9]+\.[0-9]{1,}%?|-?[0-9]+%?)/g ).filter( function ( el ) {
            return el.length != 0
        } );

        if ( numbers.length === 1 ) {
            if ( _isNumber( numbers[ 0 ] ) ) {
                if ( _isNegativeNumber( numbers[ 0 ] ) ) {
                    var numberLength = ( numbers[ 0 ] ).length;
                    inputHtml.innerHTML = inputHtml.innerHTML.substr( 1, numberLength );
                } else {
                    inputHtml.innerHTML = ( numbers[ 0 ] > 0 ) ? "-" + inputHtml.innerHTML : inputHtml.innerHTML;
                }
            }
        } else {
            var htmlLength = inputHtml.innerHTML.length;
            var lastNumberLength = 0;
            var lastNumber = numbers.pop();
            lastNumberLength = lastNumber.length;
            if ( _isNumber( lastNumber ) ) {
                if ( _isNegativeNumber( lastNumber ) ) {
                    var newLastNumber = lastNumber.substr( 1, lastNumberLength );
                    inputHtml.innerHTML = inputHtml.innerHTML.substr( 0, ( htmlLength - lastNumberLength ) ) + newLastNumber;
                } else {
                    if ( inputHtml.innerHTML.substr( ( htmlLength - lastNumberLength ), lastNumberLength ) > 0 ) {
                        inputHtml.innerHTML = inputHtml.innerHTML.substr( 0, ( htmlLength - lastNumberLength ) ) + "-" + inputHtml.innerHTML.substr( ( htmlLength - lastNumberLength ), lastNumberLength );
                    }
                }
            }
        }

        return inputHtml.innerHTML;
    };

    var _setOperator = function ( inputText, inputHtml, btnClicked ) {
        var lastCharacterIndex = inputText.trim().lastIndexOf( "" );
        var lastCharacter = inputText.substr( lastCharacterIndex - 1, 1 );
        var newOperator = document.createElement( "span" );
        var power = document.getElementsByClassName( "supper" )[ 0 ];

        if ( btnClicked !== "-" ) {
            newOperator.className = "spacer";
        }

        btnClicked = ( btnClicked === "-" ) ? " " + btnClicked + " " : btnClicked;

        if ( power !== undefined ) {
            power.className = "";
        }

        if ( lastCharacter !== "+" && lastCharacter !== "-" && lastCharacter !== "x" && lastCharacter !== "÷" ) {
            newOperator.innerHTML = btnClicked;
            inputHtml.innerHTML += newOperator.outerHTML;
        } else if ( lastCharacter === "+" || lastCharacter === "-" || lastCharacter === "x" || lastCharacter === "÷" ) {
            newOperator.innerHTML = btnClicked;
            inputHtml.lastChild.remove();
            inputHtml.innerHTML += newOperator.outerHTML;
        }

        return inputHtml.innerHTML;
    };

    var _setPercent = function ( inputText, inputHtml, btnClicked ) {
        var lastCharacterIndex = inputText.lastIndexOf( "" );
        var lastCharacter = inputText.substr( lastCharacterIndex - 1, 1 );
        var power = document.getElementsByClassName( "supper" )[ 0 ];

        if ( lastCharacter !== "%" ) {
            if ( inputText === "0" ) {
                inputHtml.innerHTML = btnClicked;
            } else if ( power !== undefined ) {
                power.innerHTML = power.innerHTML + btnClicked;
            } else {
                inputHtml.innerHTML = inputHtml.innerHTML + btnClicked;
            }
        } else {
            inputHtml.innerHTML = inputHtml.innerHTML.substr( 0, inputHtml.innerHTML.length - 1 );
        }

        return inputHtml.innerHTML;
    };

    return {
        inputItem: inputItem(),
        getExpression: getExpression(),
        clearCalculator: clearCalculator()
    };
};

( function () {
    var invokeCalculator = Calculator();
} )();
