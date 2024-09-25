import * as React from 'react';
import { classNames, ComponentClassName } from '@aws-amplify/ui';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';
import { Flex } from '../Flex/Flex.mjs';

const ButtonGroupPrimitive = ({ className, children, isDisabled: _isDisabled = false, role = 'group', size: _size, variation: _variation, ...rest }, ref) => (React.createElement(Flex, { className: classNames(ComponentClassName.ButtonGroup, className), role: role, ref: ref, ...rest }, React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
        const { size = _size, variation = _variation, isDisabled = _isDisabled, } = child.props;
        return React.cloneElement(child, { isDisabled, size, variation });
    }
    return child;
})));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/button#buttongroup)
 */
const ButtonGroup = primitiveWithForwardRef(ButtonGroupPrimitive);
ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };