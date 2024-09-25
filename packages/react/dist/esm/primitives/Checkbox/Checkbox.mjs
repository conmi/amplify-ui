import * as React from 'react';
import { ComponentClassName, classNames, classNameModifierByFlag, isFunction } from '@aws-amplify/ui';
import { Flex } from '../Flex/Flex.mjs';
import '../Icon/Icon.mjs';
import '../Icon/context/IconsContext.mjs';
import { useIcons } from '../Icon/context/useIcons.mjs';
import { View } from '../View/View.mjs';
import { IconCheck } from '../Icon/icons/IconCheck.mjs';
import { IconIndeterminate } from '../Icon/icons/IconIndeterminate.mjs';
import { Input } from '../Input/Input.mjs';
import { Text } from '../Text/Text.mjs';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { useFieldset } from '../Fieldset/useFieldset.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const CheckboxPrimitive = ({ checked: controlledChecked, className, defaultChecked, hasError, isDisabled, isIndeterminate, label, labelHidden, labelPosition, onBlur: _onBlur, onFocus: _onFocus, onChange: _onChange, testId, inputStyles, ..._rest }, ref) => {
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    const [focused, setFocused] = React.useState(false);
    const icons = useIcons('checkbox');
    const { isFieldsetDisabled } = useFieldset();
    const shouldBeDisabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const isControlled = controlledChecked !== undefined;
    const [localChecked, setLocalChecked] = React.useState(() => 
    // if controlled, initialize to `controlledChecked` else `defaultChecked`
    isControlled ? controlledChecked : defaultChecked);
    const checked = isControlled ? controlledChecked : localChecked;
    const onChange = (e) => {
        if (isFunction(_onChange)) {
            _onChange(e);
        }
        // in controlled mode, `controlledChecked` determines checked state
        if (!isControlled) {
            setLocalChecked(e.target.checked);
        }
    };
    const onFocus = (e) => {
        if (isFunction(_onFocus)) {
            _onFocus(e);
        }
        setFocused(true);
    };
    const onBlur = (e) => {
        if (isFunction(_onBlur)) {
            _onBlur(e);
        }
        setFocused(false);
    };
    const dataId = useStableId();
    React.useEffect(() => {
        const input = document.querySelector(`[data-id="${dataId}"]`);
        if (input && typeof isIndeterminate === 'boolean') {
            // HTMLInputElement does not have an `indeterminate` attribute
            input.indeterminate =
                isIndeterminate;
        }
    }, [dataId, isIndeterminate]);
    const buttonTestId = getUniqueComponentId(testId, ComponentClassName.CheckboxButton);
    const iconTestId = getUniqueComponentId(testId, ComponentClassName.CheckboxIcon);
    const labelTestId = getUniqueComponentId(testId, ComponentClassName.CheckboxLabel);
    const flexClasses = classNames(ComponentClassName.CheckboxButton, classNameModifierByFlag(ComponentClassName.CheckboxButton, 'disabled', shouldBeDisabled), classNameModifierByFlag(ComponentClassName.CheckboxButton, 'error', hasError), classNameModifierByFlag(ComponentClassName.CheckboxButton, 'focused', focused));
    const iconClasses = classNames(ComponentClassName.CheckboxIcon, classNameModifierByFlag(ComponentClassName.CheckboxIcon, 'checked', checked), classNameModifierByFlag(ComponentClassName.CheckboxIcon, 'disabled', shouldBeDisabled), classNameModifierByFlag(ComponentClassName.CheckboxIcon, 'indeterminate', isIndeterminate));
    const iconProps = {
        className: classNames(iconClasses),
        'data-checked': localChecked,
        'data-disabled': shouldBeDisabled,
        'data-testid': iconTestId,
    };
    const checkedIcon = icons?.checked ? (React.createElement(View, { as: "span", className: classNames(iconClasses) }, icons.checked)) : (React.createElement(IconCheck, { ...iconProps }));
    const indeterminateIcon = icons?.indeterminate ? (React.createElement(View, { as: "span", className: classNames(iconClasses) }, icons.indeterminate)) : (React.createElement(IconIndeterminate, { ...iconProps }));
    return (React.createElement(Flex, { as: "label", className: classNames(ComponentClassName.Checkbox, classNameModifierByFlag(ComponentClassName.Checkbox, 'disabled', shouldBeDisabled), labelPosition ? `amplify-label-${labelPosition}` : null, className), testId: testId, ...styleProps },
        React.createElement(VisuallyHidden, null,
            React.createElement(Input, { checked: controlledChecked, className: ComponentClassName.CheckboxInput, "data-id": dataId, defaultChecked: defaultChecked, isDisabled: shouldBeDisabled, onBlur: onBlur, onChange: onChange, onFocus: onFocus, ref: ref, type: "checkbox", ...rest })),
        label && (React.createElement(Text, { as: "span", className: classNames(ComponentClassName.CheckboxLabel, classNameModifierByFlag(ComponentClassName.CheckboxLabel, `disabled`, shouldBeDisabled), {
                [ComponentClassName.VisuallyHidden]: labelHidden,
            }), "data-disabled": shouldBeDisabled, testId: labelTestId }, label)),
        React.createElement(Flex, { "aria-hidden": "true", as: "span", className: flexClasses, "data-checked": checked, "data-disabled": shouldBeDisabled, "data-focus": focused, "data-error": hasError, testId: buttonTestId, ...inputStyles }, isIndeterminate ? indeterminateIcon : checkedIcon)));
};
const Checkbox = primitiveWithForwardRef(CheckboxPrimitive);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
