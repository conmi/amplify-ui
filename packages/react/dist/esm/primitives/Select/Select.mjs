import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier, classNameModifierByFlag } from '@aws-amplify/ui';
import { Flex } from '../Flex/Flex.mjs';
import '../Icon/Icon.mjs';
import '../Icon/context/IconsContext.mjs';
import { useIcons } from '../Icon/context/useIcons.mjs';
import { View } from '../View/View.mjs';
import { IconExpandMore } from '../Icon/icons/IconExpandMore.mjs';
import { useFieldset } from '../Fieldset/useFieldset.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const SelectPrimitive = ({ autoComplete, className, size, variation, value, defaultValue, hasError, icon, iconColor, children, placeholder, isDisabled, isRequired, isMultiple = false, selectSize = 1, ...rest }, ref) => {
    const DEFAULT_PLACEHOLDER_VALUE = '';
    // value === undefined is to make sure that component is used in uncontrolled way so that setting defaultValue is valid
    const shouldSetDefaultPlaceholderValue = value === undefined && defaultValue === undefined && placeholder;
    const isExpanded = isMultiple || selectSize > 1;
    const componentClasses = classNames(ComponentClassName.Select, ComponentClassName.FieldGroupControl, classNameModifier(ComponentClassName.Select, size), classNameModifier(ComponentClassName.Select, variation), classNameModifierByFlag(ComponentClassName.Select, 'error', hasError), classNameModifierByFlag(ComponentClassName.Select, 'expanded', isExpanded), className);
    const icons = useIcons('select');
    const { isFieldsetDisabled } = useFieldset();
    return (React.createElement(View, { className: ComponentClassName.SelectWrapper },
        React.createElement(View, { "aria-invalid": hasError, as: "select", autoComplete: autoComplete, value: value, defaultValue: shouldSetDefaultPlaceholderValue
                ? DEFAULT_PLACEHOLDER_VALUE
                : defaultValue, isDisabled: isFieldsetDisabled ? isFieldsetDisabled : isDisabled, multiple: isMultiple, size: selectSize, required: isRequired, className: componentClasses, ref: ref, ...rest },
            placeholder && React.createElement("option", { value: "" }, placeholder),
            children),
        isExpanded ? null : (React.createElement(Flex, { className: classNames(ComponentClassName.SelectIcon, classNameModifier(ComponentClassName.SelectIcon, size)), color: iconColor, "aria-hidden": "true" }, icon ?? icons?.expand ?? React.createElement(IconExpandMore, null)))));
};
const Select = primitiveWithForwardRef(SelectPrimitive);
Select.displayName = 'Select';

export { Select };