import React, { useReducer, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Input.scss";

import { validate } from "../../util/validators";
const cx = classNames.bind(styles)
const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, { 
        value: props.value || '', 
        isTouched: false, 
        isValid: props.valid || false 
    });

    const [isInputTouched, setInputTouched] = useState(false);

    const { id, onInput } = props;
    const { value, isValid } = inputState;

    useEffect(() => {
        props.onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        const inputValue = event.target.value;
        dispatch({ type: 'CHANGE', val: inputValue, validators: props.validators });
        setInputTouched(inputValue.trim() !== '');
    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    const element = props.element === 'input' ?
        (<input id={props.id} type={props.type} className={props.className} placeholder={props.placeholder} aria-label={props.ariaLabel} aria-required={props.ariaRequired} autoCapitalize={props.autocapitalize} maxLength={props.maxlength} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />)
        : (<textarea id={props.id} rows={props.rows || 3} className={props.className} onChange={changeHandler} onBlur={touchHandler} value={inputState.value} />);

    const labelClassName = cx(props.labelClass, { "on-input": isInputTouched });    

    return <label className={labelClassName}>
            <span className={props.spanClass}>{props.ariaLabel}</span>
            {element}
        </label>

};

export default Input;