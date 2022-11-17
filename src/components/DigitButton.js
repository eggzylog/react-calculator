import { ACTIONS } from "../App";

export default function DigitButton(props) {
    const { digit, dispatch } = props
    return (
        <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>{digit}</button>
    )
}