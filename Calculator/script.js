// PARAMS
const historyDisp = document.querySelector('.history');
const mainDisp = document.querySelector('.main input');
const btns = [...document.querySelectorAll('button')];

let expression = [];
let strExpr = '';
let checker = [];
const decimalRegEx = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
let btnSpans = [];
let errorCheck = false;

btns.forEach((btn, bInd) => {
    btn.onclick = (e) => {
        try {
            // if statement to separate '=' and 'del/clr'
            if (!(btn.classList.contains('del-clr') || btn.classList.contains('equals'))) {
                errorCheck = false;
                // clear display once any number btn is pressed after displaying result
                btns.forEach(btn => {
                    if (btn.classList.contains('del-clr')) {
                        const spans = [...btn.children];
                        btnSpans = spans;
                        spans.forEach(span => {
                            if (span.textContent === 'CLR' && !span.classList.contains('hide')) {
                                if (!btns[bInd].classList.contains('special')) {
                                    expression = [];
                                    checker = [];
                                }
                            }
                        })
                    }
                })

                btnSpans.forEach(span => {
                    if (span.textContent === 'CLR') {
                        span.classList.add('hide');
                    } else {
                        span.classList.remove('hide');
                    }
                })

                expression.push(btn.textContent);
                checker.push(btn.textContent);

                mainFunct();
            } else if (btn.textContent === '=') {
                if (errorCheck) {
                    historyDisp.innerHTML = '';
                    mainDisp.value = 'Bad expression';
                    mainDisp.style.color = 'rgb(218, 81, 81)';
                    expression = [];
                    checker = [];
                    expression.push(strExpr);
                    checker.push(strExpr);
                } else {
                    historyDisp.innerHTML = '';
                    mainDisp.value = strExpr;
                    mainDisp.style.color = 'white';
                    expression = [];
                    checker = [];
                    expression.push(strExpr);
                    checker.push(strExpr);
                }

                btns.forEach(btn => {
                    if (btn.classList.contains('del-clr')) {
                        const spans = [...btn.children];
                        spans.forEach(span => {
                            if (span.textContent === 'CLR') {
                                span.classList.remove('hide');
                            } else {
                                span.classList.add('hide');
                            }
                        })
                    }
                })
            } else {
                const tBtn = e.target;
                if (tBtn.textContent === 'DEL') {

                    expression.pop();
                    checker.pop();

                    mainFunct();
                } else {
                    expression = [];
                    checker = [];
                    mainDisp.style.color = 'white';

                    mainFunct();

                    btnSpans.forEach(span => {
                        if (span.textContent === 'CLR') {
                            span.classList.add('hide');
                        } else {
                            span.classList.remove('hide');
                        }
                    })
                }
            }
        } catch (err) {
            if (err) {
                errorCheck = true;
            } else {
                errorCheck = false;
            }
        }
    }
})

// MAIN FUNCTIONS
// Main
function mainFunct() {
    // statement to check input
    if (expression.length > 38) {
        expression.shift();
        checker.shift();
    }

    // change '*' and '/' back to 'x' and '/'
    expression.forEach((sym, i) => {
        if (sym === '*') {
            expression[i] = 'x';
        } else if (sym === '/') {
            expression[i] = '\xf7';
        }
    })

    // reset expression[] to eliminate dissimilarities with checker[]
    if (!(expression.length === checker.length)) {
        expression = [];
        checker.forEach(item => {
            expression.push(item);
        })
    } else {
        for (i = 0; i < checker.length; i++) {
            if (expression[i] !== checker[i]) {
                expression[i] = checker[i];
            }
        }
    }

    strExpr = expression.join('');
    // Display clicked btn
    mainDisp.value = strExpr;

    // evaluate expression and display in history
    expression.forEach((sym, i) => {
        if (sym === 'x') {
            expression[i] = '*';
        } else if (sym === '\xf7') {
            expression[i] = '/';
        }
        // fix bracket and sqrt operation i.e 2(3) 2 sqrt6
        if (sym === '(' || sym === '\u221A') {
            if (i !== 0 && !(expression[i - 1] === '(' || expression[i - 1] === '\xf7')) {
                if (/^[0-9]*$/.test(expression[i - 1])) {
                    expression.splice(i, 0, '*');
                }
            }
        }
    })

    // for sqrt operations
    sqrt();

    // for exponential operations
    exponential();

    // for percentage operations
    percentage();

    strExpr = expression.join('');

    strExpr = eval(strExpr);

    historyDisp.textContent = strExpr;
}
// Sqrt
function sqrt() {
    let sqrtArr = [];
    let result;

    expression.forEach((item, index) => {
        if (item === '\u221A' && item !== expression[expression.length - 1]) {
            let i = index + 1;

            const startIndex = i;
            // this handles sqrt ops not containing brackets
            if (expression[index + 1] !== '(') {
                while (true) {
                    if (i === expression.length || expression[i] === '*' || expression[i] === '/' || expression[i] === '-' || expression[i] === '+' || expression[i] === '\x5e' || expression[i] === '%' || expression[i] === ')') {
                        let count = i - startIndex;

                        expression.splice(startIndex, count);
                        break;
                    } else {
                        // INSERT CONDITION FOR SQRT CONTAINING ^
                        sqrtArr.push(expression[i]);
                        result = Math.sqrt(eval(sqrtArr.join('')));
                    }
                    i++;
                }
            }

            // this handles sqrt op containing brackets
            else if (expression[index + 1] === '(') {
                let openBraces = [];
                let closeBraces = [];

                // Resolve all ^ so as to eliminate error should any ^ be contained in a sqrt
                exponential();

                // Resolve all %
                percentage();

                while (true) {
                    if (i === expression.length) {
                        break;
                    } else {
                        if (!sqrtArr.length) {
                            sqrtArr.push(expression[i]);
                        } else {
                            let lCBI = 0; //lastCloseBraceIndex
                            sqrtArr.push(expression[i]);
                            openBraces = sqrtArr.filter(item => item === '(');
                            closeBraces = sqrtArr.filter(item => item === ')');

                            if (openBraces.length === closeBraces.length) {
                                sqrtArr.forEach((item, inx) => {
                                    if (item === ')') {
                                        lCBI = inx;
                                    }
                                })
                                for (inx = lCBI; inx < sqrtArr.length; inx++) {
                                    sqrtArr.splice(inx + 1, (sqrtArr.length - (inx + 1)));
                                }
                                result = Math.sqrt(eval(sqrtArr.join('')));

                                // replace items in sqrt with 'j'
                                let openBracesCount = openBraces.length;
                                let closeBracesCount = closeBraces.length;
                                for (index = startIndex; index <= i; index++) {
                                    if (expression[index] === '(') {
                                        openBracesCount--;
                                    } else if (expression[index] === ')') {
                                        closeBracesCount--;
                                    }
                                    expression.splice(index, 1, 'j');
                                    if (openBracesCount === closeBracesCount) {
                                        break;
                                    }
                                }

                                // end loop once close brace is followed by any operand
                                if (expression[i] === 'x' || expression[i] === '\xf7' || expression[i] === '-' || expression[i] === '+' || expression[i] === '\x5e' || expression[i] === '%') {
                                    let count = i - startIndex;
                                    expression.splice(startIndex, count);
                                    break;
                                }
                                break;
                            }
                        }
                    }
                    i++;
                }
            }
            sqrtArr = [];
            if (!(result === undefined)) {
                for (ind = 0; ind < expression.length; ind++) {
                    if (expression[ind] === '\u221A') {
                        expression.splice(ind, 0, result);
                        expression.splice(ind + 1, 1);
                        break;
                    }
                }

                expression = expression.filter(item => {
                    if (item !== 'j') {
                        return item;
                    }
                })
            }
        }
    })
}

// Exponential
exponential = () => {
    expression.forEach((item, index) => {
        let firstNumInd = 0;
        let lastNumInd = 0;
        let result;
        let newExp = [];
        let openBraces = 0;
        let closeBraces = 0;
        if (item === '^' && item !== expression[expression.length - 1]) {
            // resolve all percentages
            percentage();

            let i = index + 1;

            // for exponents without braces
            if (expression[i] !== '(') {
                // get the index of the first number of the base value
                for (ind = index - 1; ind >= 0; ind--) {
                    if (!decimalRegEx.test(expression[ind]) && expression[ind] !== '.') {
                        break;
                    } else {
                        firstNumInd = ind;
                    }
                }

                // get the index of the last number of the exponential value
                for (ind = i; ind < expression.length; ind++) {
                    if (!decimalRegEx.test(expression[ind]) && expression[ind] !== '.') {
                        break;
                    } else {
                        lastNumInd = ind;
                    }
                }

                // push exponential expression into newExp[]
                for (ind = firstNumInd; ind <= lastNumInd; ind++) {
                    newExp.push(expression[ind]);
                }
                result = evalExpo(newExp);
            }
            // if exponential value is contained in braces
            else if (expression[i] === '(' && expression[index - 1] !== ')') {
                openBraces = 0;
                closeBraces = 0;
                // get the index of the first number of the base value
                for (ind = index - 1; ind >= 0; ind--) {
                    if (!decimalRegEx.test(expression[ind]) && expression[ind] !== '.') {
                        break;
                    } else {
                        firstNumInd = ind;
                    }
                }

                // get the index of the last number of the exponential value
                for (ind = i; ind < expression.length; ind++) {
                    if (expression[ind] === '(') {
                        openBraces++
                    } else if (expression[ind] === ')') {
                        closeBraces++
                    }
                    if (openBraces === closeBraces) {
                        lastNumInd = ind;
                        break;
                    } else {
                        lastNumInd = ind;
                    }
                }

                if (openBraces === closeBraces) {
                    // push exponential expression into newExp[]
                    for (ind = firstNumInd; ind <= lastNumInd; ind++) {
                        newExp.push(expression[ind]);
                    }
                    result = evalExpo(newExp);
                }
            }
            // if both base and exponential values are wrapped in braces
            else if (expression[index - 1] === ')' && expression[i] === '(') {
                openBraces = 0;
                closeBraces = 0;
                // get the index of the first number of the base value
                for (ind = index - 1; ind >= 0; ind--) {
                    if (expression[ind] === '(') {
                        openBraces++
                    } else if (expression[ind] === ')') {
                        closeBraces++
                    }
                    if (openBraces === closeBraces) {
                        firstNumInd = ind;
                        openBraces = 0;
                        closeBraces = 0;
                        break;
                    } else {
                        firstNumInd = ind;
                    }
                }

                // get the index of the last number of the exponential value
                for (ind = i; ind < expression.length; ind++) {
                    if (expression[ind] === '(') {
                        openBraces++
                    } else if (expression[ind] === ')') {
                        closeBraces++
                    }
                    if (openBraces === closeBraces) {
                        lastNumInd = ind;
                        break;
                    } else {
                        lastNumInd = ind;
                    }
                }

                if (openBraces === closeBraces) {
                    // push exponential expression into newExp[]
                    for (ind = firstNumInd; ind <= lastNumInd; ind++) {
                        newExp.push(expression[ind]);
                    }
                    result = evalExpo(newExp);
                }

            }
            // send result to expression[]
            if (result) {
                const count = lastNumInd - firstNumInd + 1;
                expression.splice(firstNumInd, count, result);
            }

            // check for other unresolved exponents
            if (openBraces === 0 && closeBraces === 0 && result) {
                expression.forEach(item => {
                    if (item === '^') {
                        exponential();
                    }
                })
            } else if ((openBraces || closeBraces) && result) {
                if (openBraces === closeBraces) {
                    expression.forEach(item => {
                        if (item === '^') {
                            exponential();
                        }
                    })
                }
            }
        }
    })
}

// Percentage
function percentage() {
    expression.forEach((item, index) => {
        if (item === '%' && !decimalRegEx.test(expression[index + 1])) {
            let number = [];
            let startIndex = 0;
            let result = 0;
            for (i = index - 1; i >= 0; i--) {
                if (decimalRegEx.test(expression[i])) {
                    number.push(expression[i]);
                } else {
                    break;
                }
                startIndex = i;
            }
            number = number.reverse().join('');

            result = number / 100;

            // input result in expression
            const count = index - startIndex + 1;
            expression.splice(startIndex, count, result);
        }
    })
}

// SUB FUNCTIONS
function evalExpo(arr) {
    let expSignIndex = 0; //exponential sign index
    arr.forEach((item, i) => {
        if (item === '^') {
            expSignIndex = i;
        }
    })

    let beforeExp = [] //contains values before exponential sign
    let afterExp = [] // contains values after exponential sign

    for (i = 0; i < expSignIndex; i++) {
        beforeExp.push(arr[i]);
    }

    for (i = expSignIndex + 1; i < arr.length; i++) {
        afterExp.push(arr[i]);
    }

    beforeExp = eval(beforeExp.join(''));
    afterExp = eval(afterExp.join(''));

    let result = Math.pow(beforeExp, afterExp);
    if (isNaN(result)) {} else {
        return result;
    }
}