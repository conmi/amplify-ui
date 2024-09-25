import * as React from 'react';
import { isFunction } from '@aws-amplify/ui';
import { ESCAPE_KEY, ENTER_KEY } from '../shared/constants.mjs';
import { useComposeRefsCallback } from '../../hooks/useComposeRefsCallback.mjs';

const DEFAULT_KEYS = new Set([ESCAPE_KEY, ENTER_KEY]);
const useSearchField = ({ defaultValue = '', value, onChange, onClear, onSubmit, externalRef, }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const composedValue = isControlled ? value : internalValue;
    const internalRef = React.useRef(null);
    const composedRefs = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    const onClearHandler = React.useCallback(() => {
        if (!isControlled) {
            setInternalValue('');
        }
        internalRef?.current?.focus();
        if (isFunction(onClear)) {
            onClear();
        }
    }, [isControlled, setInternalValue, onClear]);
    const onSubmitHandler = React.useCallback((value) => {
        if (isFunction(onSubmit)) {
            onSubmit(value);
        }
    }, [onSubmit]);
    const onKeyDown = React.useCallback((event) => {
        const { key } = event;
        if (!DEFAULT_KEYS.has(key)) {
            return;
        }
        event.preventDefault();
        if (key === ESCAPE_KEY) {
            onClearHandler();
        }
        else if (key === ENTER_KEY) {
            onSubmitHandler(composedValue);
        }
    }, [composedValue, onClearHandler, onSubmitHandler]);
    const handleOnChange = React.useCallback((event) => {
        if (!isControlled) {
            setInternalValue(event.target.value);
        }
        if (isFunction(onChange)) {
            onChange(event);
        }
    }, [isControlled, onChange, setInternalValue]);
    const onClick = React.useCallback(() => {
        onSubmitHandler(composedValue);
    }, [onSubmitHandler, composedValue]);
    return {
        composedValue,
        onClearHandler,
        onKeyDown,
        onClick,
        handleOnChange,
        composedRefs,
    };
};

export { useSearchField };