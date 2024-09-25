import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import '../Field/FieldClearButton.mjs';
import { FieldDescription } from '../Field/FieldDescription.mjs';
import { FieldErrorMessage } from '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { Flex } from '../Flex/Flex.mjs';
import { Label } from '../Label/Label.mjs';
import { Select } from '../Select/Select.mjs';
import { splitPrimitiveProps } from '../utils/splitPrimitiveProps.mjs';
import { useStableId } from '../utils/useStableId.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { createSpaceSeparatedIds } from '../utils/createSpaceSeparatedIds.mjs';
import { DESCRIPTION_SUFFIX, ERROR_SUFFIX } from '../../helpers/constants.mjs';
import { getUniqueComponentId } from '../utils/getUniqueComponentId.mjs';

const selectFieldChildren = ({ children, options, }) => {
    if (children) {
        if (options?.length) {
            // eslint-disable-next-line no-console
            console.warn('Amplify UI: <SelectField> component  defaults to rendering children over `options`. When using the `options` prop, omit children.');
        }
        return children;
    }
    return options?.map((option, index) => (React.createElement("option", { label: option, value: option, key: `${option}-${index}` }, option)));
};
const SelectFieldPrimitive = (props, ref) => {
    const { children, className, descriptiveText, errorMessage, hasError = false, id, label, labelHidden = false, options, size, testId, inputStyles, ..._rest } = props;
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
    return (React.createElement(Flex, { className: classNames(ComponentClassName.Field, classNameModifier(ComponentClassName.Field, size), ComponentClassName.SelectField, className), testId: testId, ...styleProps },
        React.createElement(Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React.createElement(FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React.createElement(Select, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, size: size, ...rest, ...inputStyles }, selectFieldChildren({ children, options })),
        React.createElement(FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/selectfield)
 */
const SelectField = primitiveWithForwardRef(SelectFieldPrimitive);
SelectField.displayName = 'SelectField';

export { SelectField };