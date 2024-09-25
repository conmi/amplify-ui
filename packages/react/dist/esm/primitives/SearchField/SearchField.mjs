import { classNames, ComponentClassName } from '@aws-amplify/ui';
import * as React from 'react';
import { FieldClearButton } from '../Field/FieldClearButton.mjs';
import '../Field/FieldDescription.mjs';
import '../Field/FieldErrorMessage.mjs';
import '../Field/Field.mjs';
import { FieldGroupIcon } from '../FieldGroupIcon/FieldGroupIcon.mjs';
import '../FieldGroupIcon/FieldGroupIconButton.mjs';
import '../View/View.mjs';
import { IconSearch } from '../Icon/icons/IconSearch.mjs';
import '../Icon/context/IconsContext.mjs';
import { SearchFieldButton } from './SearchFieldButton.mjs';
import { TextField } from '../TextField/TextField.mjs';
import { useSearchField } from './useSearchField.mjs';
import { strHasLength } from '../shared/utils.mjs';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef.mjs';

const SearchFieldPrimitive = ({ autoComplete = 'off', className, isDisabled, clearButtonLabel, labelHidden = true, name = 'q', hasSearchButton = true, hasSearchIcon = false, onChange, onClear, onSubmit, searchButtonRef, size, defaultValue, value, ...rest }, ref) => {
    const { composedValue, onClearHandler, onKeyDown, onClick, handleOnChange, composedRefs, } = useSearchField({
        defaultValue,
        value,
        onChange,
        onClear,
        onSubmit,
        externalRef: ref,
    });
    const SearchButton = hasSearchButton ? (React.createElement(SearchFieldButton, { isDisabled: isDisabled, onClick: onClick, ref: searchButtonRef, size: size })) : undefined;
    const SearchIcon = hasSearchIcon ? (React.createElement(FieldGroupIcon, null,
        React.createElement(IconSearch, null))) : undefined;
    return (React.createElement(TextField, { autoComplete: autoComplete, className: classNames(ComponentClassName.SearchField, className), labelHidden: labelHidden, innerStartComponent: SearchIcon, innerEndComponent: React.createElement(FieldClearButton, { ariaLabel: clearButtonLabel, isVisible: !isDisabled && strHasLength(composedValue), onClick: onClearHandler, size: size, variation: "link" }), isDisabled: isDisabled, name: name, onChange: handleOnChange, onKeyDown: onKeyDown, outerEndComponent: SearchButton, ref: composedRefs, size: size, value: composedValue, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/searchfield)
 */
const SearchField = primitiveWithForwardRef(SearchFieldPrimitive);
SearchField.displayName = 'SearchField';

export { SearchField };