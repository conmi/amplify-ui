import * as React from 'react';
import { ComponentClassName, classNames, classNameModifier } from '@aws-amplify/ui';
import { Checkbox } from '../Checkbox/Checkbox.mjs';
import '../Field/FieldClearButton.mjs';
import '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { Flex } from '../Flex/Flex.mjs';

const CheckboxFieldPrimitive = ({ className, errorMessage, hasError = false, labelHidden = false, labelPosition, testId, size, ...rest }, ref) => {
    const checkboxTestId = getUniqueComponentId(testId, ComponentClassName.Checkbox);
    return (React.createElement(Flex, { className: classNames(ComponentClassName.Field, ComponentClassName.CheckboxField, classNameModifier(ComponentClassName.Field, size), className), testId: testId },
        React.createElement(Checkbox, { hasError: hasError, labelHidden: labelHidden, testId: checkboxTestId, labelPosition: labelPosition, ref: ref, ...rest }),
        React.createElement(FieldErrorMessage, { hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/checkboxfield)
 */
const CheckboxField = primitiveWithForwardRef(CheckboxFieldPrimitive);
CheckboxField.displayName = 'CheckboxField';

export { CheckboxField };