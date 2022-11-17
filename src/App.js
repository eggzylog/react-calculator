import React, { useReducer } from 'react';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate',
    NEGATE: 'negate',
    PERCENT: 'percent',
    RECIPROCAL: 'reciprocal',
    ROOT: 'root',
    SQUARED: 'squared'
}

//   14         +         25       = 39
// {first} {operation} {second} {evaluate}

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    second: payload.digit,
                    overwrite: false,
                }
            }

            if (payload.digit === '0' && state.second === '0') {
                return state;
            }

            if (state.second == null && payload.digit === '.') {
                return state;
            }

            if (payload.digit === '.' && state.second.includes('.')) {
                return state;
            }

            return {
                ...state,
                second: `${state.second || ""}${payload.digit}`
            }

        case ACTIONS.CLEAR:
            return {}

        case ACTIONS.CHOOSE_OPERATION:
            if (state.second == null && state.first == null) {
                return state
            }
            if (state.second == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }
            if (state.first == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    first: state.second,
                    second: null
                }
            }
            return {
                ...state,
                first: evaluate(state),
                operation: payload.operation,
                second: null,
            }

        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    second: null
                }
            }
            if (state.second == null) {
                return state;
            }
            if (state.second.length === 1) {
                return {
                    ...state,
                    second: null
                }
            }
            return {
                ...state,
                second: state.second.slice(0, -1)
            }

        case ACTIONS.EVALUATE:
            if (state.operation == null || state.second == null || state.first == null) {
                return state;
            }
            return {
                ...state,
                overwrite: true,
                first: null,
                operation: null,
                second: evaluate(state)
            }

        case ACTIONS.NEGATE:
            return {
                second: negate(state)
            }

        case ACTIONS.PERCENT:
            return {
                second: percent(state)
            }

        case ACTIONS.RECIPROCAL:
            return {
                second: reciprocal(state)
            }

        case ACTIONS.ROOT:
            return {
                second: root(state)
            }

        case ACTIONS.SQUARED:
            return {
                second: squared(state)
            }

        default:
            return state;
    }
}

function evaluate({ first, second, operation }) {
    const first_int = parseFloat(first);
    const second_int = parseFloat(second);
    if (isNaN(first_int) || isNaN(second_int)) {
        return "";
    }
    let computation = "";
    switch (operation) {
        case "+":
            computation = first_int + second_int;
            break;

        case "-":
            computation = first_int - second_int;
            break;

        case "X":
            computation = first_int * second_int;
            break;

        case "÷":
            computation = first_int / second_int;
            break;

        case "mod":
            computation = first_int % second_int;
            break;

        default:
            return;
    }
    return computation.toString();
}

function negate({ second }) {
    const second_int = parseFloat(second);
    if (isNaN(second_int)) {
        return "";
    }
    return (second_int * -1).toString();
}

function percent({ second }) {
    const second_int = parseFloat(second);
    if (isNaN(second_int)) {
        return "";
    }
    return (second_int / 100).toString();
}

function reciprocal({ second }) {
    const second_int = parseFloat(second);
    if (isNaN(second_int)) {
        return "";
    }
    return (1 / second_int).toString();
}

function root({ second }) {
    const second_int = parseFloat(second);
    if (isNaN(second_int)) {
        return "";
    }
    return (Math.sqrt(second_int)).toString();
}

function squared({ second }) {
    const second_int = parseFloat(second);
    if (isNaN(second_int)) {
        return "";
    }
    return (second_int * second_int).toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
    const [{ first, second, operation }, dispatch] = useReducer(reducer, {})

    return (
        <React.Fragment>
            <div className="calculator-grid">
                <div className="display-output">
                    <div className="user-input">{formatOperand(first)} {operation}</div>
                    <div className="display-result">{formatOperand(second)}</div>
                </div>

                <button title='All Clear Display' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
                <button title='percent' onClick={() => dispatch({ type: ACTIONS.PERCENT })}>%</button>
                <OperationButton operation='mod' dispatch={dispatch} />
                <button title='Delete' onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

                <button title='Inverse' onClick={() => dispatch({ type: ACTIONS.RECIPROCAL })}>1/x</button>
                <button onClick={() => dispatch({ type: ACTIONS.SQUARED })}>x^2</button>
                <button onClick={() => dispatch({ type: ACTIONS.ROOT })}>√</button>
                <OperationButton operation='÷' dispatch={dispatch} />

                <DigitButton digit='7' dispatch={dispatch} />
                <DigitButton digit='8' dispatch={dispatch} />
                <DigitButton digit='9' dispatch={dispatch} />
                <OperationButton operation='X' dispatch={dispatch} />

                <DigitButton digit='4' dispatch={dispatch} />
                <DigitButton digit='5' dispatch={dispatch} />
                <DigitButton digit='6' dispatch={dispatch} />
                <OperationButton operation='-' dispatch={dispatch} />

                <DigitButton digit='1' dispatch={dispatch} />
                <DigitButton digit='2' dispatch={dispatch} />
                <DigitButton digit='3' dispatch={dispatch} />
                <OperationButton operation='+' dispatch={dispatch} />

                <button onClick={() => dispatch({ type: ACTIONS.NEGATE })}>+/-</button>
                <DigitButton digit='0' dispatch={dispatch} />
                <DigitButton digit='.' dispatch={dispatch} />
                <button className='equal-sign' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

            </div>
        </React.Fragment>
    )
}

export default App;