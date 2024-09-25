import * as React from 'react';
import { sanitizeNamespaceImport, classNames, ComponentClassName } from '@aws-amplify/ui';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup.mjs';
import '../Icon/Icon.mjs';
import '../Icon/context/IconsContext.mjs';
import { useIcons } from '../Icon/context/useIcons.mjs';
import '../View/View.mjs';
import { IconMenu } from '../Icon/icons/IconMenu.mjs';
import { MenuButton } from './MenuButton.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } = sanitizeNamespaceImport(Dropdown);
const MENU_TRIGGER_TEST_ID = 'amplify-menu-trigger-test-id';
const MENU_ITEMS_GROUP_TEST_ID = 'amplify-menu-items-group-test-id';
const MenuPrimitive = ({ menuAlign = 'start', children, className, isOpen, size, trigger, triggerClassName, ariaLabel, onOpenChange, isDisabled, ...rest }, ref) => {
    const icons = useIcons('menu');
    return (React.createElement(DropdownMenu, { onOpenChange: onOpenChange, open: isOpen },
        React.createElement(DropdownMenuTrigger, { disabled: isDisabled, asChild: true }, trigger ?? (React.createElement(MenuButton, { ariaLabel: ariaLabel, size: size, testId: MENU_TRIGGER_TEST_ID, className: classNames(ComponentClassName.MenuTrigger, triggerClassName) }, icons?.menu ?? React.createElement(IconMenu, null)))),
        React.createElement(DropdownMenuContent, { align: menuAlign, className: ComponentClassName.MenuWrapper },
            React.createElement(ButtonGroup, { className: classNames(ComponentClassName.MenuContent, className), ref: ref, isDisabled: isDisabled, size: size, testId: MENU_ITEMS_GROUP_TEST_ID, ...rest }, children))));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const Menu = primitiveWithForwardRef(MenuPrimitive);
Menu.displayName = 'Menu';

export { MENU_ITEMS_GROUP_TEST_ID, MENU_TRIGGER_TEST_ID, Menu };