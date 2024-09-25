import * as React from 'react';
import { classNames, ComponentClassName, classNameModifier } from '@aws-amplify/ui';
import { Button } from '../Button/Button.mjs';
import { useStyles } from '../shared/styleUtils.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const MenuButtonPrimitive = ({ ariaLabel, className, children, isDisabled = false, isLoading, size, style, type = 'button', variation, testId, ...rest }, ref) => {
    const { propStyles, nonStyleProps } = useStyles(rest, style);
    const componentClasses = classNames(ComponentClassName.Button, classNameModifier(ComponentClassName.Button, size), classNameModifier(ComponentClassName.Button, variation), className);
    return (React.createElement(Button, { ref: ref, className: componentClasses, disabled: isDisabled || isLoading, isDisabled: isDisabled || isLoading, type: type, testId: testId, "aria-label": ariaLabel, style: propStyles, ...nonStyleProps }, children));
};
const MenuButton = primitiveWithForwardRef(MenuButtonPrimitive);
MenuButton.displayName = 'MenuButton';

export { MenuButton };