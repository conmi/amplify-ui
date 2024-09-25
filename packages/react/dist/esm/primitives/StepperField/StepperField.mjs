import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier, classNameModifierByFlag } from '@aws-amplify/ui';
import { useStepper } from './useStepper.mjs';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { FieldGroup } from '../FieldGroup/FieldGroup.mjs';
import '../FieldGroupIcon/FieldGroupIcon.mjs';
import { FieldGroupIconButton } from '../FieldGroupIcon/FieldGroupIconButton.mjs';
import { Flex } from '../Flex/Flex.mjs';
import '../Icon/Icon.mjs';
import '../Icon/context/IconsContext.mjs';
import { useIcons } from '../Icon/context/useIcons.mjs';
import { IconAdd } from '../Icon/icons/IconAdd.mjs';
import '../View/View.mjs';
import { IconRemove } from '../Icon/icons/IconRemove.mjs';
import { Input } from '../Input/Input.mjs';
import { Label } from '../Label/Label.mjs';
import { ComponentText } from '../shared/constants.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { DESCRIPTION_SUFFIX, ERROR_SUFFIX } from '../../helpers/constants.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';

const DECREASE_ICON = 'decrease-icon';
const INCREASE_ICON = 'increase-icon';
const StepperFieldPrimitive = (props, ref) => {
    const { className, 
    // destructure to prevent `defaultValue` from being passed to underlying `Input` via `_rest`
    defaultValue, descriptiveText, errorMessage, hasError = false, id, inputStyles, isDisabled, isReadOnly, isRequired, increaseButtonLabel = ComponentText.StepperField.increaseButtonLabel, decreaseButtonLabel = ComponentText.StepperField.decreaseButtonLabel, label, labelHidden = false, 
    // destructure to prevent `onStepChange` from being passed to underlying `Input` via `_rest`
    onStepChange, size, testId, 
    // this is only required in useStepper hook but deconstruct here to remove its existence in rest
    value: controlledValue, variation, ..._rest } = props;
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    const icons = useIcons('stepperField');
    const { step, value, inputValue, handleDecrease, handleIncrease, handleOnBlur, handleOnChange, handleOnWheel, setInputValue, shouldDisableDecreaseButton, shouldDisableIncreaseButton, } = useStepper({ ...props, defaultValue, onStepChange });
    React.useEffect(() => {
        const isControlled = controlledValue !== undefined;
        if (isControlled) {
            setInputValue(controlledValue);
        }
    }, [controlledValue, setInputValue]);
    return (React.createElement(Flex, { className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.StepperField, className), testId: testId, ...styleProps },
        React.createElement(Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React.createElement(FieldGroup, { outerStartComponent: React.createElement(FieldGroupIconButton, { "aria-controls": fieldId, ariaLabel: `${decreaseButtonLabel} ${value - step}`, className: classNames(ComponentClassName.StepperFieldButtonDecrease, classNameModifier(ComponentClassName.StepperFieldButtonDecrease, variation), classNameModifierByFlag(ComponentClassName.StepperFieldButtonDecrease, 'disabled', shouldDisableDecreaseButton)), "data-invalid": hasError, isDisabled: shouldDisableDecreaseButton, onClick: handleDecrease, size: size }, icons?.remove ?? React.createElement(IconRemove, { "data-testid": DECREASE_ICON })), outerEndComponent: React.createElement(FieldGroupIconButton, { "aria-controls": fieldId, ariaLabel: `${increaseButtonLabel} ${value + step}`, className: classNames(ComponentClassName.StepperFieldButtonIncrease, classNameModifier(ComponentClassName.StepperFieldButtonIncrease, variation), classNameModifierByFlag(ComponentClassName.StepperFieldButtonIncrease, 'disabled', shouldDisableIncreaseButton)), "data-invalid": hasError, isDisabled: shouldDisableIncreaseButton, onClick: handleIncrease, size: size }, icons?.add ?? React.createElement(IconAdd, { "data-testid": INCREASE_ICON })) },
            React.createElement(Input, { "aria-describedby": ariaDescribedBy, className: ComponentClassName.StepperFieldInput, hasError: hasError, id: fieldId, isDisabled: isDisabled, isReadOnly: isReadOnly, isRequired: isRequired, onBlur: handleOnBlur, onChange: handleOnChange, onWheel: handleOnWheel, ref: ref, size: size, variation: variation, type: "number", value: inputValue, ...inputStyles, ...rest })),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/stepperfield)
 */
const StepperField = primitiveWithForwardRef(StepperFieldPrimitive);
StepperField.displayName = 'StepperField';

export { DECREASE_ICON, INCREASE_ICON, StepperField };
