'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var isEqual = require('lodash/isEqual.js');
var uiReactCore = require('@aws-amplify/ui-react-core');
var ui = require('@aws-amplify/ui');
var Field = require('./Field-3db91851.js');
require('aws-amplify/storage');
var debounce = require('lodash/debounce.js');
var Dropdown = require('@radix-ui/react-dropdown-menu');
var RadixSlider = require('@radix-ui/react-slider');
var QRCode = require('qrcode');
var utils = require('aws-amplify/utils');
var RadixDirection = require('@radix-ui/react-direction');
var ThemeStyle = require('./ThemeStyle-7d5abbc4.js');
require('@aws-amplify/core');
require('aws-amplify/auth');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var isEqual__default = /*#__PURE__*/_interopDefaultLegacy(isEqual);
var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
var Dropdown__namespace = /*#__PURE__*/_interopNamespace(Dropdown);
var RadixSlider__namespace = /*#__PURE__*/_interopNamespace(RadixSlider);
var QRCode__default = /*#__PURE__*/_interopDefaultLegacy(QRCode);
var RadixDirection__namespace = /*#__PURE__*/_interopNamespace(RadixDirection);

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/theming/responsive#usebreakpointvalue)
 */
const useBreakpointValue = (values, defaultBreakpoint = 'base', propKey) => {
    const { breakpoints: { values: breakpoints }, tokens, } = Field.useTheme();
    const breakpoint = Field.useBreakpoint({
        breakpoints,
        defaultBreakpoint,
    });
    const value = Field.getValueAtCurrentBreakpoint({
        breakpoint,
        breakpoints,
        values,
    });
    if (ui.isDesignToken(value) || ui.isString(value)) {
        return Field.getStyleValue({ value, propKey, tokens });
    }
    else {
        return value;
    }
};

function IconsProvider({ children, icons, }) {
    return (React__namespace.createElement(Field.IconsContext.Provider, { value: icons }, children));
}

const AlertPrimitive = ({ buttonRef, children, className, dismissButtonLabel = Field.ComponentText.Alert.dismissButtonLabel, hasIcon = true, heading, isDismissible = false, onDismiss, variation, ...rest }, ref) => {
    const [dismissed, setDismissed] = React__namespace.useState(false);
    const icons = Field.useIcons('alert');
    const dismissAlert = React__namespace.useCallback(() => {
        setDismissed(!dismissed);
        if (ui.isFunction(onDismiss)) {
            onDismiss();
        }
    }, [setDismissed, onDismiss, dismissed]);
    return !dismissed ? (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Alert, className, ui.classNameModifier(ui.ComponentClassName.Alert, variation)), ref: ref, role: "alert", ...rest },
        hasIcon && React__namespace.createElement(Field.AlertIcon, { variation: variation, ariaHidden: true }),
        React__namespace.createElement(Field.View, { flex: "1" },
            heading && (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AlertHeading }, heading)),
            React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AlertBody }, children)),
        isDismissible && (React__namespace.createElement(Field.Button, { ariaLabel: dismissButtonLabel, variation: "link", className: ui.ComponentClassName.AlertDismiss, onClick: dismissAlert, ref: buttonRef }, icons?.close ?? React__namespace.createElement(Field.IconClose, { "aria-hidden": "true" }))))) : null;
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/alert)
 */
const Alert = Field.primitiveWithForwardRef(AlertPrimitive);
Alert.displayName = 'Alert';

const AutocompleteOptionPrimitive = ({ children, className, isActive, ...rest }, ref) => {
    return (React__namespace.createElement(Field.View, { "aria-selected": isActive, as: "li", role: "option", className: ui.classNames(ui.ComponentClassName.AutocompleteMenuOption, ui.classNameModifierByFlag(ui.ComponentClassName.AutocompleteMenuOption, 'active', isActive), className), ref: ref, ...rest }, children));
};
const AutocompleteOption = Field.primitiveWithForwardRef(AutocompleteOptionPrimitive);
AutocompleteOption.displayName = 'AutocompleteOption';

/**
 *  Creates ref callback to compose together external and internal refs
 */
function useComposeRefsCallback({ externalRef, internalRef, }) {
    return React__namespace.useCallback((node) => {
        // Handle callback ref
        if (ui.isFunction(externalRef)) {
            externalRef(node);
        }
        else if (externalRef) {
            externalRef.current = node;
        }
        internalRef.current = node;
    }, [externalRef, internalRef]);
}

const ScrollViewPrimitive = ({ children, className, orientation, autoScroll, ...rest }, externalRef) => {
    const internalRef = React__namespace.useRef(null);
    const composedRefs = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    React__namespace.useEffect(() => {
        if (autoScroll) {
            internalRef.current?.scrollTo({
                top: internalRef.current?.scrollHeight,
                left: internalRef.current?.scrollWidth,
                behavior: autoScroll,
            });
        }
    }, [
        children,
        autoScroll,
    ]);
    return (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.ScrollView, ui.classNameModifier(ui.ComponentClassName.ScrollView, orientation), className), ref: composedRefs, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/scrollview)
 */
const ScrollView = Field.primitiveWithForwardRef(ScrollViewPrimitive);
ScrollView.displayName = 'ScrollView';

const MenuHeader = ({ children }) => {
    if (!children) {
        return null;
    }
    return (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AutocompleteMenuHeader }, children));
};
const MenuFooter = ({ children }) => {
    if (!children) {
        return null;
    }
    return (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AutocompleteMenuFooter }, children));
};
const MenuLoading = ({ children }) => {
    return (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AutocompleteMenuLoading }, children ?? (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement(Field.Loader, null),
        Field.ComponentText.Autocomplete.loadingText))));
};
const MenuEmpty = ({ children }) => (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.AutocompleteMenuEmpty }, children ?? Field.ComponentText.Autocomplete.emptyText));
const AutocompleteMenuPrimitive = ({ ariaLabel, children, Header = null, Footer = null, LoadingIndicator = null, Empty = null, isLoading, listboxId, ...rest }, ref) => {
    return (React__namespace.createElement(ScrollView, { className: ui.ComponentClassName.AutocompleteMenu, ref: ref, ...rest }, isLoading ? (React__namespace.createElement(MenuLoading, null, LoadingIndicator)) : (React__namespace.createElement(React__namespace.Fragment, null,
        React__namespace.createElement(MenuHeader, null, Header),
        children.length > 0 ? (React__namespace.createElement(ScrollView, { as: "ul", ariaLabel: ariaLabel, className: ui.ComponentClassName.AutocompleteMenuOptions, id: listboxId, role: "listbox" }, children)) : (React__namespace.createElement(MenuEmpty, null, Empty)),
        React__namespace.createElement(MenuFooter, null, Footer)))));
};
const AutocompleteMenu = Field.primitiveWithForwardRef(AutocompleteMenuPrimitive);
AutocompleteMenu.displayName = 'AutocompleteMenu';

// Source: https://github.com/radix-ui/primitives/blob/7ae63b6cce6ea53ea5d65b6d411894c004b38f47/packages/react/use-layout-effect/src/useLayoutEffect.tsx
/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
const useLayoutEffect = globalThis?.document ? React__namespace.useLayoutEffect : () => { };

// Adapted from https://github.com/radix-ui/primitives/blob/main/packages/react/id/src/id.tsx#L8
// Prefixed autogenerated id created by useStableId
const AUTO_GENERATED_ID_PREFIX = 'amplify-id';
// Create a local version of React.useId which will reference React.useId for React 18
// and fallback to noop for React 17 and below
// Note: We use `toString()` to prevent bundlers from trying to `import { useId } from 'react';`
// since it doesn't exist in React 17 and below (prevents https://github.com/aws-amplify/amplify-ui/issues/1154)
const useReactId = 
// disable eslint below to allow usage of casting React to `any`, which ensures that TS
// does not get confused about the existence of `useId` in React 17 and below
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
React__namespace['useId'.toString()] || (() => undefined);
let count = 0;
/**
 * Create a uuid to use with amplify fields unless
 * an id is provided
 * @param id user specified id
 * @returns string
 */
const useStableId = (id) => {
    const [stableId, setStableId] = React__namespace.useState(useReactId());
    // React versions older than 18 will have client-side ids only
    useLayoutEffect(() => {
        if (!id) {
            setStableId((reactId) => reactId ?? String(count++));
        }
    }, [id]);
    return id ?? (stableId ? `${AUTO_GENERATED_ID_PREFIX}-${stableId}` : '');
};

const DEFAULT_KEYS$1 = new Set([Field.ARROW_DOWN, Field.ARROW_UP, Field.ENTER_KEY, Field.ESCAPE_KEY]);
const useAutocomplete = ({ defaultValue = '', value, options, optionFilter, onBlur, onChange, onClear, onClick, onSelect, onSubmit, }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React__namespace.useState(defaultValue);
    const composedValue = isControlled ? value : internalValue;
    const [isMenuOpen, setIsMenuOpen] = React__namespace.useState(false);
    const [activeOption, setActiveOption] = React__namespace.useState(null);
    const isCustomFiltering = ui.isFunction(optionFilter);
    const filteredOptions = React__namespace.useMemo(() => {
        const defaultFilter = (option) => {
            const { label } = option;
            return label
                ?.toLocaleLowerCase()
                .includes(composedValue?.toLocaleLowerCase());
        };
        const filter = isCustomFiltering
            ? (option) => optionFilter(option, composedValue)
            : defaultFilter;
        return options?.filter(filter) ?? [];
    }, [composedValue, optionFilter, isCustomFiltering, options]);
    const autocompleteId = useStableId();
    const listboxId = useStableId();
    const menuId = useStableId();
    const optionBaseId = useStableId();
    const activeIndex = filteredOptions.findIndex((option) => option === activeOption);
    const activeOptionId = activeOption?.id ??
        (activeIndex !== -1 ? `${optionBaseId}-option-${activeIndex}` : undefined);
    const handleOnBlur = React__namespace.useCallback((event) => {
        setIsMenuOpen(false);
        setActiveOption(null);
        if (ui.isFunction(onBlur)) {
            onBlur(event);
        }
    }, [onBlur]);
    const handleOnChange = React__namespace.useCallback((event) => {
        setActiveOption(null);
        setIsMenuOpen(true);
        if (!isControlled) {
            setInternalValue(event.target.value);
        }
        if (ui.isFunction(onChange)) {
            onChange(event);
        }
    }, [isControlled, onChange]);
    const handleOnClear = React__namespace.useCallback(() => {
        if (!isControlled) {
            setInternalValue('');
        }
        if (ui.isFunction(onClear)) {
            onClear();
        }
    }, [isControlled, onClear]);
    const handleOnClick = React__namespace.useCallback((event) => {
        setIsMenuOpen(true);
        if (ui.isFunction(onClick)) {
            onClick(event);
        }
    }, [onClick]);
    const handleOnKeyDown = (event) => {
        const { key } = event;
        if (!DEFAULT_KEYS$1.has(key)) {
            return;
        }
        event.preventDefault();
        switch (key) {
            case Field.ESCAPE_KEY: {
                if (isMenuOpen) {
                    setIsMenuOpen(false);
                    setActiveOption(null);
                }
                else {
                    handleOnClear();
                }
                break;
            }
            case Field.ENTER_KEY: {
                if (!activeOption) {
                    if (ui.isFunction(onSubmit)) {
                        onSubmit(composedValue);
                    }
                }
                else {
                    const { label } = activeOption;
                    if (!isControlled) {
                        setInternalValue(label);
                    }
                    if (ui.isFunction(onSelect)) {
                        onSelect(activeOption);
                    }
                }
                setIsMenuOpen(false);
                setActiveOption(null);
                break;
            }
            case Field.ARROW_DOWN: {
                if (filteredOptions.length <= 0) {
                    return;
                }
                setIsMenuOpen(true);
                const newActiveIndex = activeIndex >= filteredOptions.length - 1 ? 0 : activeIndex + 1;
                setActiveOption(filteredOptions[newActiveIndex]);
                break;
            }
            case Field.ARROW_UP: {
                if (filteredOptions.length <= 0) {
                    return;
                }
                setIsMenuOpen(true);
                const newActiveIndex = activeIndex <= 0 ? filteredOptions.length - 1 : activeIndex - 1;
                setActiveOption(filteredOptions[newActiveIndex]);
            }
        }
    };
    // The window will scroll down to the right place to show the whole menu
    // if space is not enough in current viewport
    React__namespace.useEffect(() => {
        const autocompleteElement = document.getElementById(autocompleteId);
        const menuElement = document.getElementById(menuId);
        if (menuElement && isMenuOpen && autocompleteElement) {
            const { bottom } = menuElement.getBoundingClientRect();
            const { offsetParent, offsetTop } = autocompleteElement;
            if (offsetParent === document.body &&
                bottom > document.documentElement.clientHeight) {
                window.scrollTo({
                    top: Math.min(bottom -
                        document.documentElement.clientHeight +
                        window.scrollY +
                        20, // Add 20 gap between menu bottom and window viewport bottom
                    offsetTop),
                    behavior: 'smooth',
                });
            }
        }
    }, [autocompleteId, isMenuOpen, menuId]);
    // This will make the menu able to scroll with keyboard,
    // and scroll each option into window viewport if necessary
    React__namespace.useEffect(() => {
        const listboxElement = document.getElementById(listboxId);
        const activeOptionElement = Field.strHasLength(activeOptionId)
            ? document.getElementById(activeOptionId)
            : null;
        if (activeOptionElement && listboxElement) {
            const { scrollTop, clientHeight } = listboxElement;
            const { offsetHeight, offsetTop } = activeOptionElement;
            const { top, bottom } = activeOptionElement.getBoundingClientRect();
            if (scrollTop > offsetTop) {
                listboxElement.scrollTop = offsetTop;
            }
            if (scrollTop + clientHeight < offsetTop + offsetHeight) {
                listboxElement.scrollTop = offsetTop + offsetHeight - clientHeight;
            }
            if (top < 0 || bottom > document.documentElement.clientHeight) {
                activeOptionElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [activeOptionId, listboxId]);
    return {
        activeOptionId,
        autocompleteId,
        composedValue,
        filteredOptions,
        handleOnBlur,
        handleOnClear,
        handleOnClick,
        handleOnChange,
        handleOnKeyDown,
        isControlled,
        isCustomFiltering,
        isMenuOpen,
        listboxId,
        menuId,
        optionBaseId,
        setActiveOption,
        setIsMenuOpen,
        setInternalValue,
    };
};

const getUniqueComponentId = (id, suffix) => (id && suffix ? `${id}-${suffix}` : undefined);

const HighlightMatchPrimitive = ({ children, className, query, testId, ...rest }, ref) => {
    const matchTestId = getUniqueComponentId(testId, 'match');
    const startIndex = children
        ?.toLocaleLowerCase()
        .indexOf(query?.toLocaleLowerCase());
    if (Field.strHasLength(query) && startIndex !== -1) {
        const match = children.substring(startIndex, startIndex + query.length);
        return (React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(className, ui.ComponentClassName.HighlightMatch), testId: testId, ref: ref, ...rest },
            children.substring(0, startIndex),
            React__namespace.createElement(Field.View, { as: "strong", className: ui.ComponentClassName.HighlightMatchHighlighted, testId: matchTestId }, match),
            children.substring(startIndex + query.length)));
    }
    return (React__namespace.createElement(Field.View, { as: "span", testId: testId }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/highlightmatch)
 */
const HighlightMatch = Field.primitiveWithForwardRef(HighlightMatchPrimitive);
HighlightMatch.displayName = 'HighlightMatch';

const ariaLabelText = Field.ComponentText.SearchField.searchButtonLabel;
const SearchFieldButtonPrimitive = ({ size, ...props }, ref) => {
    const icons = Field.useIcons('searchField');
    return (React__namespace.createElement(Field.FieldGroupIconButton, { ariaLabel: ariaLabelText, className: ui.ComponentClassName.SearchFieldSearch, size: size, ref: ref, type: "submit", ...props }, icons?.search ?? React__namespace.createElement(Field.IconSearch, null)));
};
const SearchFieldButton = Field.primitiveWithForwardRef(SearchFieldButtonPrimitive);
SearchFieldButton.displayName = 'SearchFieldButton';

const FieldGroupPrimitive = ({ children, className, innerEndComponent, innerStartComponent, orientation = 'horizontal', outerEndComponent, outerStartComponent, variation, ...rest }, ref) => {
    // Don't apply hasInner classnames unless a component was provided
    const hasInnerStartComponent = innerStartComponent != null;
    const hasInnerEndComponent = innerEndComponent != null;
    const fieldGroupHasInnerStartClassName = hasInnerStartComponent
        ? ui.ComponentClassName.FieldGroupHasInnerStart
        : null;
    const fieldGroupHasInnerEndClassName = hasInnerEndComponent
        ? ui.ComponentClassName.FieldGroupHasInnerEnd
        : null;
    const componentClasses = ui.classNames(ui.ComponentClassName.FieldGroup, fieldGroupHasInnerStartClassName, fieldGroupHasInnerEndClassName, ui.classNameModifier(ui.ComponentClassName.FieldGroup, orientation), className);
    return (React__namespace.createElement(Field.Flex, { className: componentClasses, ref: ref, ...rest },
        outerStartComponent && (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.FieldGroupOuterStart, ui.classNameModifier(ui.ComponentClassName.FieldGroupOuterStart, variation)) }, outerStartComponent)),
        React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.FieldGroupFieldWrapper, ui.classNameModifier(ui.ComponentClassName.FieldGroupFieldWrapper, orientation)) },
            innerStartComponent && (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.FieldGroupInnerStart }, innerStartComponent)),
            children,
            innerEndComponent && (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.FieldGroupInnerEnd }, innerEndComponent))),
        outerEndComponent && (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.FieldGroupOuterEnd, ui.classNameModifier(ui.ComponentClassName.FieldGroupOuterEnd, variation)) }, outerEndComponent))));
};
const FieldGroup = Field.primitiveWithForwardRef(FieldGroupPrimitive);
FieldGroup.displayName = 'FieldGroup';

const InputPrimitive = ({ autoComplete, checked, className, defaultChecked, defaultValue, id, isDisabled, isReadOnly, isRequired, size, type = 'text', hasError = false, value, variation, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Input, ui.ComponentClassName.FieldGroupControl, ui.classNameModifier(ui.ComponentClassName.Input, variation), ui.classNameModifierByFlag(ui.ComponentClassName.Input, 'error', hasError), ui.classNameModifier(ui.ComponentClassName.Input, size), className);
    const { isFieldsetDisabled } = Field.useFieldset();
    return (React__namespace.createElement(Field.View, { "aria-invalid": hasError, as: "input", autoComplete: autoComplete, checked: checked, className: componentClasses, defaultChecked: defaultChecked, defaultValue: defaultValue, isDisabled: isFieldsetDisabled ? isFieldsetDisabled : isDisabled, id: id, readOnly: isReadOnly, ref: ref, required: isRequired, type: type, value: value, ...rest }));
};
const Input = Field.primitiveWithForwardRef(InputPrimitive);
Input.displayName = 'Input';

const isStyleKey = (prop) => {
    return prop in Field.ComponentPropsToStylePropsMap;
};
/**
 * This function splits props into style props and non-style props. This is used
 * on Field primitives so we can apply style props on the wrapper element and
 * the rest on the input.
 * @param props this should be a destructured `rest` from the component's props
 */
const splitPrimitiveProps = (props) => {
    const splitProps = {
        styleProps: {},
        rest: {},
    };
    Object.keys(props).forEach((prop) => {
        if (isStyleKey(prop)) {
            // we know it is a style key
            // so we know we can assign the key in styleProps
            splitProps.styleProps = {
                ...splitProps.styleProps,
                [prop]: props[prop],
            };
        }
        else {
            splitProps.rest = {
                ...splitProps.rest,
                [prop]: props[prop],
            };
        }
    });
    return splitProps;
};

/**
 * Joins an array of strings and undefined values into a single string with spaces as separators.
 * If all elements are undefined, returns undefined.
 *
 * @param {(string | undefined)[]} ids - An array of strings or undefined values.
 * @returns {string | undefined} A single string with space-separated IDs, or undefined if all elements are undefined.
 */
const createSpaceSeparatedIds = (ids) => {
    const joinedIds = ids.filter((id) => id !== undefined).join(' ');
    return joinedIds.length > 0 ? joinedIds : undefined;
};

(typeof Symbol !== 'undefined' && ui.isFunction(Symbol.for)
    ? Symbol.for('amplify_default')
    : '@@amplify_default');
const ERROR_SUFFIX = 'error';
const DESCRIPTION_SUFFIX = 'description';

const TextFieldPrimitive = (props, ref) => {
    const { className, descriptiveText, errorMessage, hasError = false, id, innerEndComponent, innerStartComponent, label, labelHidden = false, outerEndComponent, outerStartComponent, size, testId, variation, inputStyles, ..._rest } = props;
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
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.TextField, className), testId: testId, ...styleProps },
        React__namespace.createElement(Field.Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React__namespace.createElement(FieldGroup, { outerStartComponent: outerStartComponent, outerEndComponent: outerEndComponent, innerStartComponent: innerStartComponent, innerEndComponent: innerEndComponent, variation: variation },
            React__namespace.createElement(Input, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, size: size, variation: variation, ...inputStyles, ...rest })),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/textfield)
 */
const TextField = Field.primitiveWithForwardRef(TextFieldPrimitive);
TextField.displayName = 'TextField';

const DEFAULT_KEYS = new Set([Field.ESCAPE_KEY, Field.ENTER_KEY]);
const useSearchField = ({ defaultValue = '', value, onChange, onClear, onSubmit, externalRef, }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React__namespace.useState(defaultValue);
    const composedValue = isControlled ? value : internalValue;
    const internalRef = React__namespace.useRef(null);
    const composedRefs = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    const onClearHandler = React__namespace.useCallback(() => {
        if (!isControlled) {
            setInternalValue('');
        }
        internalRef?.current?.focus();
        if (ui.isFunction(onClear)) {
            onClear();
        }
    }, [isControlled, setInternalValue, onClear]);
    const onSubmitHandler = React__namespace.useCallback((value) => {
        if (ui.isFunction(onSubmit)) {
            onSubmit(value);
        }
    }, [onSubmit]);
    const onKeyDown = React__namespace.useCallback((event) => {
        const { key } = event;
        if (!DEFAULT_KEYS.has(key)) {
            return;
        }
        event.preventDefault();
        if (key === Field.ESCAPE_KEY) {
            onClearHandler();
        }
        else if (key === Field.ENTER_KEY) {
            onSubmitHandler(composedValue);
        }
    }, [composedValue, onClearHandler, onSubmitHandler]);
    const handleOnChange = React__namespace.useCallback((event) => {
        if (!isControlled) {
            setInternalValue(event.target.value);
        }
        if (ui.isFunction(onChange)) {
            onChange(event);
        }
    }, [isControlled, onChange, setInternalValue]);
    const onClick = React__namespace.useCallback(() => {
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

const SearchFieldPrimitive = ({ autoComplete = 'off', className, isDisabled, clearButtonLabel, labelHidden = true, name = 'q', hasSearchButton = true, hasSearchIcon = false, onChange, onClear, onSubmit, searchButtonRef, size, defaultValue, value, ...rest }, ref) => {
    const { composedValue, onClearHandler, onKeyDown, onClick, handleOnChange, composedRefs, } = useSearchField({
        defaultValue,
        value,
        onChange,
        onClear,
        onSubmit,
        externalRef: ref,
    });
    const SearchButton = hasSearchButton ? (React__namespace.createElement(SearchFieldButton, { isDisabled: isDisabled, onClick: onClick, ref: searchButtonRef, size: size })) : undefined;
    const SearchIcon = hasSearchIcon ? (React__namespace.createElement(Field.FieldGroupIcon, null,
        React__namespace.createElement(Field.IconSearch, null))) : undefined;
    return (React__namespace.createElement(TextField, { autoComplete: autoComplete, className: ui.classNames(ui.ComponentClassName.SearchField, className), labelHidden: labelHidden, innerStartComponent: SearchIcon, innerEndComponent: React__namespace.createElement(Field.FieldClearButton, { ariaLabel: clearButtonLabel, isVisible: !isDisabled && Field.strHasLength(composedValue), onClick: onClearHandler, size: size, variation: "link" }), isDisabled: isDisabled, name: name, onChange: handleOnChange, onKeyDown: onKeyDown, outerEndComponent: SearchButton, ref: composedRefs, size: size, value: composedValue, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/searchfield)
 */
const SearchField = Field.primitiveWithForwardRef(SearchFieldPrimitive);
SearchField.displayName = 'SearchField';

const AutocompletePrimitive = ({ className, defaultValue, value, isLoading = false, menuSlots = {}, options, optionFilter, onBlur, onChange, onClear, onClick, onSelect, onSubmit, renderOption, testId, ...rest }, ref) => {
    const { activeOptionId, autocompleteId, composedValue, filteredOptions, handleOnBlur, handleOnClear, handleOnClick, handleOnChange, handleOnKeyDown, isControlled, isCustomFiltering, isMenuOpen, listboxId, menuId, optionBaseId, setActiveOption, setIsMenuOpen, setInternalValue, } = useAutocomplete({
        defaultValue,
        value,
        options,
        optionFilter,
        onBlur,
        onChange,
        onClear,
        onClick,
        onSelect,
        onSubmit,
    });
    const comboboxProps = {
        role: 'combobox',
        'aria-activedescendant': activeOptionId,
        'aria-autocomplete': 'list',
        'aria-controls': isMenuOpen ? menuId : undefined,
        'aria-expanded': isMenuOpen,
        'aria-haspopup': 'listbox',
        'aria-owns': isMenuOpen ? menuId : undefined,
    };
    const Options = filteredOptions.map((option, idx) => {
        const { id, label, ...rest } = option;
        const handleOnClick = () => {
            setIsMenuOpen(false);
            setActiveOption(null);
            if (!isControlled) {
                setInternalValue(label);
            }
            if (ui.isFunction(onSelect)) {
                onSelect(option);
            }
        };
        // This is required. Mousedown event will fire a blur event by default
        // and so the menu will close before the click event on an option gets a chance to fire
        const handleOnMouseDown = (event) => {
            event.preventDefault();
        };
        const handleOnMouseMove = () => {
            setActiveOption(option);
        };
        const optionId = id ?? `${optionBaseId}-option-${idx}`;
        const isActive = optionId === activeOptionId;
        return (React__namespace.createElement(AutocompleteOption, { isActive: isActive, id: optionId, key: optionId, onClick: handleOnClick, onMouseDown: handleOnMouseDown, onMouseMove: handleOnMouseMove, ...rest }, ui.isFunction(renderOption) ? (renderOption(option, composedValue)) : isCustomFiltering ? (label) : (React__namespace.createElement(HighlightMatch, { query: composedValue }, label))));
    });
    return (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.Autocomplete, className), id: autocompleteId, testId: testId },
        React__namespace.createElement(SearchField, { hasSearchButton: false, hasSearchIcon: true, onBlur: handleOnBlur, onChange: handleOnChange, onClear: handleOnClear, onClick: handleOnClick, onKeyDown: handleOnKeyDown, ref: ref, value: composedValue, ...comboboxProps, ...rest }),
        isMenuOpen ? (React__namespace.createElement(AutocompleteMenu, { id: menuId, isLoading: isLoading, listboxId: listboxId, ...menuSlots }, Options)) : null));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/autocomplete)
 */
const Autocomplete = Field.primitiveWithForwardRef(AutocompletePrimitive);
Autocomplete.displayName = 'Autocomplete';

const ImagePrimitive = ({ className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: "img", ref: ref, className: ui.classNames(ui.ComponentClassName.Image, className), ...rest }));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/image)
 */
const Image = Field.primitiveWithForwardRef(ImagePrimitive);
Image.displayName = 'Image';

const AvatarPrimitive = ({ className, children, variation, colorTheme, size, src, alt, isLoading, ...rest }, ref) => {
    const icons = Field.useIcons('avatar');
    const icon = icons?.user ?? React__namespace.createElement(Field.IconUser, null);
    const componentClasses = ui.classNames(ui.ComponentClassName.Avatar, className, ui.classNameModifier(ui.ComponentClassName.Avatar, variation), ui.classNameModifier(ui.ComponentClassName.Avatar, size), ui.classNameModifier(ui.ComponentClassName.Avatar, colorTheme));
    return (React__namespace.createElement(Field.View, { as: "span", className: componentClasses, ref: ref, ...rest },
        src ? (React__namespace.createElement(Image, { className: ui.ComponentClassName.AvatarImage, src: src, alt: alt })) : (children ?? (React__namespace.createElement(Field.View, { as: "span", className: ui.ComponentClassName.AvatarIcon, "aria-hidden": "true" }, icon))),
        isLoading ? (React__namespace.createElement(Field.Loader, { className: ui.ComponentClassName.AvatarLoader })) : null));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/avatar)
 */
const Avatar = Field.primitiveWithForwardRef(AvatarPrimitive);
Avatar.displayName = 'Avatar';

const BadgePrimitive = ({ className, children, variation, size, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Badge, className, ui.classNameModifier(ui.ComponentClassName.Badge, variation), ui.classNameModifier(ui.ComponentClassName.Badge, size));
    return (React__namespace.createElement(Field.View, { as: "span", className: componentClasses, ref: ref, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/badge)
 */
const Badge = Field.primitiveWithForwardRef(BadgePrimitive);
Badge.displayName = 'Badge';

const BreadcrumbItemPrimitive = ({ className, children, as = 'li', ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.BreadcrumbsItem, className);
    return (React__namespace.createElement(Field.View, { ...rest, as: as, className: componentClasses, ref: ref }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
const BreadcrumbItem = Field.primitiveWithForwardRef(BreadcrumbItemPrimitive);
BreadcrumbItem.displayName = 'Breadcrumbs.Item';

const LinkPrimitive = ({ as = 'a', children, className, isExternal, ...rest }, ref) => {
    return (React__namespace.createElement(Field.View, { as: as, className: ui.classNames(ui.ComponentClassName.Link, className), ref: ref, rel: isExternal ? 'noopener noreferrer' : undefined, target: isExternal ? '_blank' : undefined, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/link)
 */
const Link = Field.primitiveWithForwardRef(LinkPrimitive);
Link.displayName = 'Link';

const BreadcrumbLinkPrimitive = ({ className, children, href, isCurrent, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.BreadcrumbsLink, ui.classNameModifierByFlag(ui.ComponentClassName.BreadcrumbsLink, 'current', isCurrent), className);
    if (isCurrent) {
        const ariaCurrent = rest['aria-current'] ?? 'page';
        const as = rest.as ?? 'span';
        return (React__namespace.createElement(Field.Text, { ...rest, as: as, "aria-current": ariaCurrent, className: componentClasses, ref: ref }, children));
    }
    else {
        return (React__namespace.createElement(Link, { ...rest, className: componentClasses, ref: ref, href: href }, children));
    }
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
const BreadcrumbLink = Field.primitiveWithForwardRef(BreadcrumbLinkPrimitive);
BreadcrumbLink.displayName = 'Breadcrumbs.Link';

const BreadcrumbSeparatorPrimitive = ({ className, children = '/', as = 'span', ...rest }, ref) => {
    const ariaHidden = rest['aria-hidden'] ?? 'true';
    return (React__namespace.createElement(Field.View, { ...rest, as: as, ref: ref, "aria-hidden": ariaHidden, className: ui.classNames(ui.ComponentClassName.BreadcrumbsSeparator, className) }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
const BreadcrumbSeparator = Field.primitiveWithForwardRef(BreadcrumbSeparatorPrimitive);
BreadcrumbSeparator.displayName = 'Breadcrumbs.Separator';

const BreadcrumbContainerPrimitive = ({ className, children, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Breadcrumbs, className);
    const ariaLabel = rest['aria-label'] ?? 'Breadcrumb';
    return (React__namespace.createElement(Field.View, { ...rest, as: "nav", "aria-label": ariaLabel, className: componentClasses, ref: ref },
        React__namespace.createElement(Field.View, { as: "ol", className: ui.ComponentClassName.BreadcrumbsList }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
const BreadcrumbContainer = Field.primitiveWithForwardRef(BreadcrumbContainerPrimitive);
BreadcrumbContainer.displayName = 'Breadcrumbs.Container';

const BreadcrumbsPrimitive = ({ className, items, separator = React__namespace.createElement(BreadcrumbSeparator, null), ...rest }, ref) => {
    const ariaLabel = rest['aria-label'] ?? 'Breadcrumb';
    return (React__namespace.createElement(BreadcrumbContainer, { ...rest, "aria-label": ariaLabel, className: className, ref: ref }, items?.map(({ href, label }, idx) => {
        const isCurrent = items.length - 1 === idx;
        return (React__namespace.createElement(BreadcrumbItem, { key: `${href}${idx}` },
            React__namespace.createElement(BreadcrumbLink, { href: href, isCurrent: isCurrent }, label),
            isCurrent ? null : separator));
    })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/breadcrumbs)
 */
const Breadcrumbs = Object.assign(Field.primitiveWithForwardRef(BreadcrumbsPrimitive), {
    Item: BreadcrumbItem,
    Link: BreadcrumbLink,
    Separator: BreadcrumbSeparator,
    Container: BreadcrumbContainer,
});
Breadcrumbs.displayName = 'Breadcrumbs';

const ButtonGroupPrimitive = ({ className, children, isDisabled: _isDisabled = false, role = 'group', size: _size, variation: _variation, ...rest }, ref) => (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.ButtonGroup, className), role: role, ref: ref, ...rest }, React__namespace.Children.map(children, (child) => {
    if (React__namespace.isValidElement(child)) {
        const { size = _size, variation = _variation, isDisabled = _isDisabled, } = child.props;
        return React__namespace.cloneElement(child, { isDisabled, size, variation });
    }
    return child;
})));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/button#buttongroup)
 */
const ButtonGroup = Field.primitiveWithForwardRef(ButtonGroupPrimitive);
ButtonGroup.displayName = 'ButtonGroup';

const CardPrimitive = ({ className, children, variation, ...rest }, ref) => {
    return (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.Card, ui.classNameModifier(ui.ComponentClassName.Card, variation), className), ref: ref, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/card)
 */
const Card = Field.primitiveWithForwardRef(CardPrimitive);
Card.displayName = 'Card';

const VisuallyHiddenPrimitive = ({ as = 'span', children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: as, className: ui.classNames(ui.ComponentClassName.VisuallyHidden, className), ref: ref, ...rest }, children));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/visuallyhidden)
 */
const VisuallyHidden = Field.primitiveWithForwardRef(VisuallyHiddenPrimitive);
VisuallyHidden.displayName = 'VisuallyHidden';

const CheckboxPrimitive = ({ checked: controlledChecked, className, defaultChecked, hasError, isDisabled, isIndeterminate, label, labelHidden, labelPosition, onBlur: _onBlur, onFocus: _onFocus, onChange: _onChange, testId, inputStyles, ..._rest }, ref) => {
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    const [focused, setFocused] = React__namespace.useState(false);
    const icons = Field.useIcons('checkbox');
    const { isFieldsetDisabled } = Field.useFieldset();
    const shouldBeDisabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const isControlled = controlledChecked !== undefined;
    const [localChecked, setLocalChecked] = React__namespace.useState(() => 
    // if controlled, initialize to `controlledChecked` else `defaultChecked`
    isControlled ? controlledChecked : defaultChecked);
    const checked = isControlled ? controlledChecked : localChecked;
    const onChange = (e) => {
        if (ui.isFunction(_onChange)) {
            _onChange(e);
        }
        // in controlled mode, `controlledChecked` determines checked state
        if (!isControlled) {
            setLocalChecked(e.target.checked);
        }
    };
    const onFocus = (e) => {
        if (ui.isFunction(_onFocus)) {
            _onFocus(e);
        }
        setFocused(true);
    };
    const onBlur = (e) => {
        if (ui.isFunction(_onBlur)) {
            _onBlur(e);
        }
        setFocused(false);
    };
    const dataId = useStableId();
    React__namespace.useEffect(() => {
        const input = document.querySelector(`[data-id="${dataId}"]`);
        if (input && typeof isIndeterminate === 'boolean') {
            // HTMLInputElement does not have an `indeterminate` attribute
            input.indeterminate =
                isIndeterminate;
        }
    }, [dataId, isIndeterminate]);
    const buttonTestId = getUniqueComponentId(testId, ui.ComponentClassName.CheckboxButton);
    const iconTestId = getUniqueComponentId(testId, ui.ComponentClassName.CheckboxIcon);
    const labelTestId = getUniqueComponentId(testId, ui.ComponentClassName.CheckboxLabel);
    const flexClasses = ui.classNames(ui.ComponentClassName.CheckboxButton, ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxButton, 'disabled', shouldBeDisabled), ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxButton, 'error', hasError), ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxButton, 'focused', focused));
    const iconClasses = ui.classNames(ui.ComponentClassName.CheckboxIcon, ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxIcon, 'checked', checked), ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxIcon, 'disabled', shouldBeDisabled), ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxIcon, 'indeterminate', isIndeterminate));
    const iconProps = {
        className: ui.classNames(iconClasses),
        'data-checked': localChecked,
        'data-disabled': shouldBeDisabled,
        'data-testid': iconTestId,
    };
    const checkedIcon = icons?.checked ? (React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(iconClasses) }, icons.checked)) : (React__namespace.createElement(Field.IconCheck, { ...iconProps }));
    const indeterminateIcon = icons?.indeterminate ? (React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(iconClasses) }, icons.indeterminate)) : (React__namespace.createElement(Field.IconIndeterminate, { ...iconProps }));
    return (React__namespace.createElement(Field.Flex, { as: "label", className: ui.classNames(ui.ComponentClassName.Checkbox, ui.classNameModifierByFlag(ui.ComponentClassName.Checkbox, 'disabled', shouldBeDisabled), labelPosition ? `amplify-label-${labelPosition}` : null, className), testId: testId, ...styleProps },
        React__namespace.createElement(VisuallyHidden, null,
            React__namespace.createElement(Input, { checked: controlledChecked, className: ui.ComponentClassName.CheckboxInput, "data-id": dataId, defaultChecked: defaultChecked, isDisabled: shouldBeDisabled, onBlur: onBlur, onChange: onChange, onFocus: onFocus, ref: ref, type: "checkbox", ...rest })),
        label && (React__namespace.createElement(Field.Text, { as: "span", className: ui.classNames(ui.ComponentClassName.CheckboxLabel, ui.classNameModifierByFlag(ui.ComponentClassName.CheckboxLabel, `disabled`, shouldBeDisabled), {
                [ui.ComponentClassName.VisuallyHidden]: labelHidden,
            }), "data-disabled": shouldBeDisabled, testId: labelTestId }, label)),
        React__namespace.createElement(Field.Flex, { "aria-hidden": "true", as: "span", className: flexClasses, "data-checked": checked, "data-disabled": shouldBeDisabled, "data-focus": focused, "data-error": hasError, testId: buttonTestId, ...inputStyles }, isIndeterminate ? indeterminateIcon : checkedIcon)));
};
const Checkbox = Field.primitiveWithForwardRef(CheckboxPrimitive);
Checkbox.displayName = 'Checkbox';

const CheckboxFieldPrimitive = ({ className, errorMessage, hasError = false, labelHidden = false, labelPosition, testId, size, ...rest }, ref) => {
    const checkboxTestId = getUniqueComponentId(testId, ui.ComponentClassName.Checkbox);
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.ComponentClassName.CheckboxField, ui.classNameModifier(ui.ComponentClassName.Field, size), className), testId: testId },
        React__namespace.createElement(Checkbox, { hasError: hasError, labelHidden: labelHidden, testId: checkboxTestId, labelPosition: labelPosition, ref: ref, ...rest }),
        React__namespace.createElement(Field.FieldErrorMessage, { hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/checkboxfield)
 */
const CheckboxField = Field.primitiveWithForwardRef(CheckboxFieldPrimitive);
CheckboxField.displayName = 'CheckboxField';

const GridPrimitive = ({ className, children, ...rest }, ref) => (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.Grid, className), ref: ref, ...rest }, children));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/grid)
 */
const Grid = Field.primitiveWithForwardRef(GridPrimitive);
Grid.displayName = 'Grid';

const ELLIPSIS = '...';
/**
 * This hook will be used to determine the range of page numbers to be rendered,
 * including ellipsis dots(e.g., an array like [1, '...', 4, 5, 6, '...', 10]).
 * @param currentPage current page number
 * @param totalPages total number of pages
 * @param siblingCount the number of siblings on each side of
 * @returns an array that contains the range of numbers to be rendered
 */
const useRange = (currentPageParam, totalPagesParam, siblingCountParam = 1) => {
    const range = React__namespace.useMemo(() => {
        // The current page should not be less than 1
        const currentPage = Math.max(currentPageParam, 1);
        // The sibling count should not be less than 1
        const siblingCount = Math.max(siblingCountParam, 1);
        // The total pages should be always greater than current page
        const totalPages = Math.max(currentPage, totalPagesParam);
        // Note: 1-based index will be used for page value.
        const firstPage = 1;
        const lastPage = totalPages;
        /**
         * To avoid resizing our pagination component while a user is interacting with the component,
         * the total number of items returned by the hook should remain constant.
         * The consant is supposed to be the max number of items that would returned by the hook in all cases,
         * so it should be calculated by 1(first page) + 1(last page) + 1(current page) + 2 * siblingCount + 2(ellipses)
         */
        const maxNumOfItems = 5 + 2 * siblingCount;
        /**
         * Case 1: If the total number of pages is not greater than the max number of items that would potentially be returned,
         * then no need to run through the ellipsis cases, just simply return the range from 1 to totalPages (e.g. [1, 2, 3, 4]).
         */
        if (totalPages < maxNumOfItems) {
            return Field.getConsecutiveIntArray(1, totalPages);
        }
        /**
         * Determine if ellipsis dots should be rendered on either left or right side, or both
         */
        const leftSiblingPage = Math.max(currentPage - siblingCount, firstPage);
        const rightSiblingPage = Math.min(currentPage + siblingCount, lastPage);
        const shouldRenderStartEllipsis = leftSiblingPage > 2;
        const shouldRenderEndEllipsis = rightSiblingPage < lastPage - 1;
        /**
         * Case 2: Only render ellipsis dots on the left side (e.g. [1, '...', 6, 7, 8, 9, 10]).
         */
        if (shouldRenderStartEllipsis && !shouldRenderEndEllipsis) {
            // 1(current page) + 1(last page) + 1(fill up a page for the position of end ellipsis) + 2 * siblingCount
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Field.getConsecutiveIntArray(lastPage - rightItemCount + 1, lastPage);
            return [firstPage, ELLIPSIS, ...rightRange];
        }
        /**
         * Case 3: Only render ellipsis dots on the right side (e.g. [1, 2, 3, 4, 5, '...', 10]).
         */
        if (!shouldRenderStartEllipsis && shouldRenderEndEllipsis) {
            // 1(current page) + 1(last page) + 1(fill up a page for the position of start ellipsis) + 2 * siblingCount
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Field.getConsecutiveIntArray(firstPage, leftItemCount);
            return [...leftRange, ELLIPSIS, lastPage];
        }
        /**
         * Case 4: Render ellipsis on both side (e.g. [1, '...', 4, 5, 6, '...', 10]).
         */
        const middleRange = Field.getConsecutiveIntArray(leftSiblingPage, rightSiblingPage);
        return [firstPage, ELLIPSIS, ...middleRange, ELLIPSIS, lastPage];
    }, [currentPageParam, totalPagesParam, siblingCountParam]);
    return range;
};

const PAGINATION_CURRENT_TEST_ID = 'current';
const PAGINATION_ELLIPSIS_TEST_ID = 'ellipsis';
const PaginationItem = ({ type, page, currentPage, currentPageLabel = Field.ComponentText.PaginationItem.currentPageLabel, isDisabled, onClick, ariaLabel, ...rest }) => {
    const icons = Field.useIcons('pagination');
    const nextClasses = ui.classNames(ui.ComponentClassName.PaginationItem, ui.classNameModifier(ui.ComponentClassName.PaginationItem, 'link'), ui.classNameModifierByFlag(ui.ComponentClassName.PaginationItem, 'disabled', isDisabled));
    const previousClasses = ui.classNames(ui.ComponentClassName.PaginationItem, ui.classNameModifier(ui.ComponentClassName.PaginationItem, 'link'), ui.classNameModifierByFlag(ui.ComponentClassName.PaginationItem, 'disabled', isDisabled));
    switch (type) {
        case 'page':
            return (React__namespace.createElement(Field.View, { as: "li" }, page === currentPage ? (React__namespace.createElement(Field.Button, { "aria-current": "page", size: "small", variation: "link", className: ui.classNames(ui.ComponentClassName.PaginationItem, ui.classNameModifier(ui.ComponentClassName.PaginationItem, 'current')), testId: PAGINATION_CURRENT_TEST_ID, ...rest },
                React__namespace.createElement(VisuallyHidden, null,
                    currentPageLabel,
                    ":"),
                page)) : (React__namespace.createElement(Field.Button, { className: ui.ComponentClassName.PaginationItem, size: "small", variation: "link", onClick: () => {
                    onClick?.();
                }, ariaLabel: ariaLabel, ...rest }, page))));
        case 'next':
            return (React__namespace.createElement(Field.View, { as: "li" },
                React__namespace.createElement(Field.Button, { className: nextClasses, size: "small", variation: "link", isDisabled: isDisabled, onClick: () => {
                        onClick?.();
                    }, ariaLabel: ariaLabel, ...rest }, icons?.next ?? React__namespace.createElement(Field.IconChevronRight, null))));
        case 'previous':
            return (React__namespace.createElement(Field.View, { as: "li" },
                React__namespace.createElement(Field.Button, { className: previousClasses, size: "small", variation: "link", isDisabled: isDisabled, onClick: () => {
                        onClick?.();
                    }, ariaLabel: ariaLabel, ...rest }, icons?.previous ?? React__namespace.createElement(Field.IconChevronLeft, null))));
        case 'ellipsis':
            return (React__namespace.createElement(Field.View, { as: "li" },
                React__namespace.createElement(Field.Flex, { as: "span", className: ui.classNameModifier(ui.ComponentClassName.PaginationItem, 'ellipsis'), testId: PAGINATION_ELLIPSIS_TEST_ID, ...rest }, "\u2026")));
        // No match type found
    }
    return React__namespace.createElement(Field.View, { as: "li" });
};
PaginationItem.displayName = 'PaginationItem';

/**
 * This hook will be used to get the pagination items to be rendered in the pagination primitive
 * @param currentPage current page number
 * @param totalPages total number of pages
 * @param siblingCount the number of siblings on each side of
 * @param onNext callback function triggered when the next-page button is pressed
 * @param onPrevious callback function triggered when the prev-page button is pressed
 * @param onChange callback function triggered every time the page changes
 * @returns an array of pagination items
 */
const usePaginationItems = ({ currentPage, totalPages, hasMorePages, siblingCount, currentPageLabel = Field.ComponentText.PaginationItem.currentPageLabel, pageLabel = Field.ComponentText.PaginationItem.pageLabel, previousLabel = Field.ComponentText.PaginationItem.previousLabel, nextLabel = Field.ComponentText.PaginationItem.nextLabel, onNext, onPrevious, onChange, }) => {
    const previousItem = (React__namespace.createElement(PaginationItem, { type: "previous", key: "previous", currentPage: currentPage, onClick: onPrevious, isDisabled: currentPage <= 1, ariaLabel: previousLabel }));
    const nextItem = (React__namespace.createElement(PaginationItem, { type: "next", key: "next", currentPage: currentPage, onClick: onNext, isDisabled: currentPage >= totalPages && !hasMorePages, ariaLabel: nextLabel }));
    // To get the range of page numbers to be rendered in the pagination primitive
    const range = useRange(currentPage, totalPages, siblingCount);
    const pageItems = React__namespace.useMemo(() => range.map((item, idx) => {
        if (item === ELLIPSIS) {
            return (React__namespace.createElement(PaginationItem, { type: "ellipsis", key: idx === 1 ? 'start-ellipsis' : 'end-ellipsis' }));
        }
        return (
        // Note: Do NOT use index for `key` and instead use page number
        // otherwise, react cannot update the component correctly with its diff mechanism
        React__namespace.createElement(PaginationItem, { key: item, type: "page", page: item, currentPage: currentPage, currentPageLabel: currentPageLabel, onClick: () => onChange?.(item, currentPage), 
            /**
             * @todo We should consider how we would support interpolation in our string translations.
             * This works for "Go to page 31" or "translatedText {s}" as the supplied string
             * But for Arabic or Japanese or some other languages the supplied string might look like: "{s} translatedText".
             */
            ariaLabel: `${pageLabel} ${item}` }));
    }), [range, currentPage, currentPageLabel, pageLabel, onChange]);
    return [previousItem, ...pageItems, nextItem];
};

const PaginationPrimitive = ({ className, currentPage = 1, totalPages, hasMorePages = false, siblingCount, currentPageLabel, pageLabel, previousLabel, nextLabel, onNext, onPrevious, onChange, ...rest }, ref) => {
    const paginationItems = usePaginationItems({
        currentPage,
        totalPages,
        hasMorePages,
        siblingCount,
        currentPageLabel,
        pageLabel,
        previousLabel,
        nextLabel,
        onNext,
        onPrevious,
        onChange,
    });
    return (React__namespace.createElement(Field.View, { as: "nav", className: ui.classNames(ui.ComponentClassName.Pagination, className), ref: ref, ...rest },
        React__namespace.createElement(Field.Flex, { as: "ol", justifyContent: "center", alignItems: "center", gap: "inherit" }, paginationItems)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/pagination)
 */
const Pagination = Field.primitiveWithForwardRef(PaginationPrimitive);
Pagination.displayName = 'Pagination';

const usePagination = (props) => {
    const { currentPage: initialPage = 1, totalPages, hasMorePages = false, siblingCount = 1, } = props;
    // The current page should not be less than 1
    const sanitizedInitialPage = Math.max(initialPage, 1);
    // The total pages should be always greater than current page
    const sanitizedTotalPages = Math.max(sanitizedInitialPage, totalPages);
    const [currentPage, setCurrentPage] = React__namespace.useState(sanitizedInitialPage);
    // Reset current page if initialPage or totalPages changes
    React__namespace.useEffect(() => {
        setCurrentPage(sanitizedInitialPage);
    }, [sanitizedInitialPage, sanitizedTotalPages]);
    const onNext = React__namespace.useCallback(() => {
        if (currentPage < sanitizedTotalPages) {
            setCurrentPage(currentPage + 1);
        }
    }, [currentPage, sanitizedTotalPages]);
    const onPrevious = React__namespace.useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);
    const onChange = React__namespace.useCallback((newPageIndex) => {
        if (typeof newPageIndex === 'number') {
            setCurrentPage(newPageIndex);
        }
    }, []);
    return {
        currentPage,
        hasMorePages,
        onChange,
        onNext,
        onPrevious,
        // The sibling count should not be less than 1
        siblingCount: Math.max(siblingCount, 1),
        totalPages: sanitizedTotalPages,
    };
};

/**
 * Slice a collection based on page index (starting at 1)
 */
const getItemsAtPage = (items, page, itemsPerPage) => {
    if (page < 1 || itemsPerPage < 1) {
        return [];
    }
    const startIndex = (page - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
};
/**
 * Recursively find a keyword within an object (case insensitive)
 */
const itemHasText = (item, text) => {
    if (Field.strHasLength(item)) {
        return item.toLowerCase().includes(text.toLowerCase());
    }
    if (typeof item === 'object' && item !== null) {
        return Object.values(item).some((subItem) => itemHasText(subItem, text));
    }
    return false;
};
/**
 * Computes the amount of available pages
 */
const getPageCount = (totalItems, itemsPerPage) => Math.ceil(totalItems / itemsPerPage);

const DEFAULT_PAGE_SIZE = 10;
const TYPEAHEAD_DELAY_MS = 300;
const ListCollection = ({ children, direction = 'column', items, ...rest }) => (React__namespace.createElement(Field.Flex, { direction: direction, ...rest }, Array.isArray(items) ? items.map(children) : null));
const GridCollection = ({ children, items, ...rest }) => (React__namespace.createElement(Grid, { ...rest }, Array.isArray(items) ? items.map(children) : null));
const renderCollectionOrNoResultsFound = (collection, items, searchNoResultsFound) => {
    if (items.length) {
        return collection;
    }
    if (searchNoResultsFound) {
        return searchNoResultsFound;
    }
    return (React__namespace.createElement(Field.Flex, { justifyContent: "center" },
        React__namespace.createElement(Field.Text, null, Field.ComponentText.Collection.searchNoResultsFound)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/collection)
 */
const Collection = ({ className, isSearchable, isPaginated, items, itemsPerPage = DEFAULT_PAGE_SIZE, searchFilter = itemHasText, searchLabel = Field.ComponentText.Collection.searchButtonLabel, searchNoResultsFound, searchPlaceholder, type = 'list', testId, ...rest }) => {
    const [searchText, setSearchText] = React__namespace.useState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSearch = React__namespace.useCallback(debounce__default["default"](setSearchText, TYPEAHEAD_DELAY_MS), [setSearchText]);
    // Make sure that items are iterable
    items = Array.isArray(items) ? items : [];
    // Filter items by text
    if (isSearchable && Field.strHasLength(searchText)) {
        items = items.filter((item) => searchFilter(item, searchText));
    }
    // Pagination
    const pagination = usePagination({
        totalPages: getPageCount(items.length, itemsPerPage),
    });
    if (isPaginated) {
        items = getItemsAtPage(items, pagination.currentPage, itemsPerPage);
    }
    const collection = type === 'list' ? (React__namespace.createElement(ListCollection, { className: ui.ComponentClassName.CollectionItems, items: items, ...rest })) : type === 'grid' ? (React__namespace.createElement(GridCollection, { className: ui.ComponentClassName.CollectionItems, items: items, ...rest })) : null;
    return (React__namespace.createElement(Field.Flex, { testId: testId, className: ui.classNames(ui.ComponentClassName.Collection, className) },
        isSearchable ? (React__namespace.createElement(Field.Flex, { className: ui.ComponentClassName.CollectionSearch },
            React__namespace.createElement(SearchField, { label: searchLabel, placeholder: searchPlaceholder, onChange: (e) => onSearch(e.target.value), onClear: () => setSearchText('') }))) : null,
        renderCollectionOrNoResultsFound(collection, items, searchNoResultsFound),
        isPaginated ? (React__namespace.createElement(Field.Flex, { className: ui.ComponentClassName.CollectionPagination },
            React__namespace.createElement(Pagination, { ...pagination }))) : null));
};
Collection.displayName = 'Collection';

const DividerPrimitive = ({ className, orientation = 'horizontal', size, label, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Divider, ui.classNameModifier(ui.ComponentClassName.Divider, orientation), ui.classNameModifier(ui.ComponentClassName.Divider, size), className);
    return (React__namespace.createElement(Field.View, { "aria-orientation": orientation, as: "hr", className: componentClasses, "data-label": label, ref: ref, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/divider)
 */
const Divider = Field.primitiveWithForwardRef(DividerPrimitive);
Divider.displayName = 'Divider';

const DropZoneContext = React__namespace.createContext('inactive');
const DropZoneProvider = ({ value, children, }) => {
    return (React__namespace.createElement(DropZoneContext.Provider, { value: value }, children));
};

const Container = ({ className, children, testId, isDisabled, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, ...rest }, ref) => {
    const dragState = React__default["default"].useContext(DropZoneContext);
    // Don't add drag event handlers if it is disabled.
    const dragProps = isDisabled
        ? {}
        : { onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop };
    return (React__default["default"].createElement(Field.View, { ...rest, ...dragProps, isDisabled: isDisabled, className: ui.classNames(className, ui.classNameModifierByFlag(ui.ComponentClassName.DropZone, 'rejected', dragState === 'reject'), ui.classNameModifierByFlag(ui.ComponentClassName.DropZone, 'accepted', dragState === 'accept'), ui.classNameModifierByFlag(ui.ComponentClassName.DropZone, 'disabled', isDisabled), ui.ComponentClassName.DropZone), "data-testid": testId, ref: ref }, children));
};
const DropZoneContainer = Field.primitiveWithForwardRef(Container);
DropZoneContainer.displayName = 'DropZoneContainer';

/**
 * These are syntactic sugar components that make it easy to compose children
 * in DropZone without having to expose the DropZoneContext.
 */
/**
 * This component renders when the user is dragging ONLY accepted files on the DropZone.
 */
const Accepted = ({ children, }) => {
    const dragState = React__namespace.useContext(DropZoneContext);
    if (!dragState) {
        throw new Error('`DropZone.Accept` must be used inside a DropZone');
    }
    return dragState === 'accept' ? React__namespace.createElement(React__namespace.Fragment, null, children) : null;
};
/**
 * This component renders when the user is dragging ANY rejected files on the DropZone.
 */
const Rejected = ({ children, }) => {
    const dragState = React__namespace.useContext(DropZoneContext);
    if (!dragState) {
        throw new Error('`DropZone.Rejected` must be used inside a DropZone');
    }
    return dragState === 'reject' ? React__namespace.createElement(React__namespace.Fragment, null, children) : null;
};
/**
 * This component renders by default when the user is not dragging.
 */
const Default = ({ children, }) => {
    const dragState = React__namespace.useContext(DropZoneContext);
    if (!dragState) {
        throw new Error('`DropZone.Default` must be used inside a DropZone');
    }
    return dragState === 'inactive' ? React__namespace.createElement(React__namespace.Fragment, null, children) : null;
};

const DropZonePrimitive = ({ children, testId, isDisabled, acceptedFileTypes, onDropComplete, ...rest }, ref) => {
    const { dragState, onDragEnter, onDragLeave, onDragOver, onDragStart, onDrop, } = Field.useDropZone({
        acceptedFileTypes,
        onDropComplete,
        ...rest,
    });
    return (React__namespace.createElement(DropZoneProvider, { value: dragState },
        React__namespace.createElement(DropZoneContainer, { ...rest, testId: testId, isDisabled: isDisabled, onDragStart: onDragStart, onDragEnter: onDragEnter, onDragLeave: onDragLeave, onDrop: onDrop, onDragOver: onDragOver, ref: ref }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/dropzone)
 */
const DropZone = Object.assign(Field.primitiveWithForwardRef(DropZonePrimitive), {
    Accepted,
    Rejected,
    Default,
});
DropZone.displayName = 'DropZone';

const AccordionContext = React__namespace.createContext(undefined);
const AccordionItemContext = React__namespace.createContext(undefined);

const AccordionItemPrimitive = ({ children, className, value, as = 'details', ...rest }, ref) => {
    const context = React__namespace.useContext(AccordionContext);
    const open = value ? context?.value?.includes(value) : undefined;
    return (React__namespace.createElement(AccordionItemContext.Provider, { value: value },
        React__namespace.createElement(Field.View, { ...rest, open: open, ref: ref, as: as, className: ui.classNames(ui.ComponentClassName.AccordionItem, className) }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const AccordionItem = Field.primitiveWithForwardRef(AccordionItemPrimitive);
AccordionItem.displayName = 'AccordionItem';

const AccordionContentPrimitive = ({ className, children, ...rest }, ref) => {
    return (React__namespace.createElement(Field.View, { ...rest, className: ui.classNames(ui.ComponentClassName.AccordionItemContent, className), ref: ref }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const AccordionContent = Field.primitiveWithForwardRef(AccordionContentPrimitive);
AccordionContent.displayName = 'Accordion.Content';

const AccordionTriggerPrimitive = ({ children, className, ...rest }, ref) => {
    const context = React__namespace.useContext(AccordionContext);
    const value = React__namespace.useContext(AccordionItemContext);
    const handleOnClick = (e) => {
        if (ui.isTypedFunction(rest.onClick)) {
            rest.onClick(e);
        }
        if (context?.setValue && value) {
            e.preventDefault();
            context.setValue(value);
        }
    };
    return (React__namespace.createElement(Field.View, { ...rest, ref: ref, as: "summary", className: ui.classNames(ui.ComponentClassName.AccordionItemTrigger, className), onClick: handleOnClick }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const AccordionTrigger = Field.primitiveWithForwardRef(AccordionTriggerPrimitive);
AccordionTrigger.displayName = 'Accordion.Trigger';

const AccordionIconPrimitive = ({ className, as = 'span', ...rest }, ref) => {
    const icons = Field.useIcons('accordion');
    return (React__namespace.createElement(Field.View, { ...rest, ref: ref, as: as, className: ui.classNames(ui.ComponentClassName.AccordionItemIcon, className), "aria-hidden": "true" }, icons?.more ?? React__namespace.createElement(Field.IconExpandMore, null)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const AccordionIcon = Field.primitiveWithForwardRef(AccordionIconPrimitive);
AccordionIcon.displayName = 'Accordion.Icon';

const AccordionContainerPrimitive = ({ children, className, defaultValue, allowMultiple, preventCollapse, onValueChange, testId, value: controlledValue, ...rest }, ref) => {
    const isControlled = controlledValue !== undefined;
    const [localValue, setLocalValue] = React__namespace.useState(() => isControlled ? controlledValue : defaultValue ?? []);
    const value = isControlled ? controlledValue : localValue;
    const setValue = React__namespace.useCallback((_value) => {
        let newValue;
        // if the value has the incoming value we try to close it by removing it from the array
        if (value.includes(_value)) {
            // only remove it from the array if preventCollapse is false/undefined OR
            // the number of open accordions is more than 1 (so it won't fully collapse anyways)
            newValue =
                !preventCollapse || value.length > 1
                    ? value.filter((v) => v !== _value)
                    : value;
        }
        else {
            // open the item by adding it to the array if allowMultiple is true
            // or make it the whole array
            newValue = allowMultiple ? [...value, _value] : [_value];
        }
        if (ui.isFunction(onValueChange)) {
            onValueChange(newValue);
        }
        if (!isControlled) {
            setLocalValue(newValue);
        }
    }, [onValueChange, value, isControlled, allowMultiple, preventCollapse]);
    const contextValue = React__namespace.useMemo(() => {
        return {
            value,
            setValue,
        };
    }, [value, setValue]);
    return (React__namespace.createElement(AccordionContext.Provider, { value: contextValue },
        React__namespace.createElement(Field.View, { ...rest, className: ui.classNames(ui.ComponentClassName.Accordion, className), "data-testid": testId, ref: ref }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const AccordionContainer = Field.primitiveWithForwardRef(AccordionContainerPrimitive);
AccordionContainer.displayName = 'Accordion.Container';

const AccordionPrimitive = ({ items, ...rest }, ref) => {
    return (React__namespace.createElement(AccordionContainer, { ref: ref, ...rest }, items?.map(({ content, trigger, value }) => (React__namespace.createElement(AccordionItem, { key: value, value: value },
        React__namespace.createElement(AccordionTrigger, null,
            trigger,
            React__namespace.createElement(AccordionIcon, null)),
        React__namespace.createElement(AccordionContent, null, content))))));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
const Accordion = Object.assign(Field.primitiveWithForwardRef(AccordionPrimitive), {
    Container: AccordionContainer,
    Content: AccordionContent,
    Icon: AccordionIcon,
    Item: AccordionItem,
    Trigger: AccordionTrigger,
});
Accordion.displayName = 'Accordion';

const FieldsetPrimitive = ({ children, className, isDisabled, legend, legendHidden, size, testId, variation = 'plain', ...rest }, ref) => {
    const { isFieldsetDisabled } = Field.useFieldset();
    // Fieldsets that are nested within a disabled Fieldset should
    // also be disabled.
    const shouldBeDisabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const value = React__namespace.useMemo(() => ({
        isFieldsetDisabled: shouldBeDisabled,
    }), [shouldBeDisabled]);
    const fieldsetClasses = ui.classNames(ui.ComponentClassName.Fieldset, ui.classNameModifier(ui.ComponentClassName.Fieldset, variation), ui.classNameModifier(ui.ComponentClassName.Fieldset, size), className);
    const legendClasses = ui.classNames(ui.ComponentClassName.FieldsetLegend, ui.classNameModifier(ui.ComponentClassName.FieldsetLegend, size), {
        [ui.ComponentClassName.VisuallyHidden]: legendHidden,
    });
    return (React__namespace.createElement(Field.FieldsetContext.Provider, { value: value },
        React__namespace.createElement(Field.Flex, { as: "fieldset", className: fieldsetClasses, ref: ref, disabled: shouldBeDisabled, testId: testId, ...rest },
            React__namespace.createElement(VisuallyHidden, { as: "legend" }, legend),
            React__namespace.createElement(Field.View, { as: "div", "aria-hidden": "true", className: legendClasses }, legend),
            children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/fieldset)
 */
const Fieldset = Field.primitiveWithForwardRef(FieldsetPrimitive);
Fieldset.displayName = 'Fieldset';

const headingLevels = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
};
const HeadingPrimitive = ({ className, children, isTruncated, level = 6, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: headingLevels[level], className: ui.classNames(ui.ComponentClassName.Heading, ui.classNameModifier(ui.ComponentClassName.Heading, level), ui.classNameModifierByFlag(ui.ComponentClassName.Heading, 'truncated', isTruncated), className), ref: ref, ...rest }, children));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/heading)
 */
const Heading = Field.primitiveWithForwardRef(HeadingPrimitive);
Heading.displayName = 'Heading';

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const MenuButtonPrimitive = ({ ariaLabel, className, children, isDisabled = false, isLoading, size, style, type = 'button', variation, testId, ...rest }, ref) => {
    const { propStyles, nonStyleProps } = Field.useStyles(rest, style);
    const componentClasses = ui.classNames(ui.ComponentClassName.Button, ui.classNameModifier(ui.ComponentClassName.Button, size), ui.classNameModifier(ui.ComponentClassName.Button, variation), className);
    return (React__namespace.createElement(Field.Button, { ref: ref, className: componentClasses, disabled: isDisabled || isLoading, isDisabled: isDisabled || isLoading, type: type, testId: testId, "aria-label": ariaLabel, style: propStyles, ...nonStyleProps }, children));
};
const MenuButton = Field.primitiveWithForwardRef(MenuButtonPrimitive);
MenuButton.displayName = 'MenuButton';

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } = ui.sanitizeNamespaceImport(Dropdown__namespace);
const MENU_TRIGGER_TEST_ID = 'amplify-menu-trigger-test-id';
const MENU_ITEMS_GROUP_TEST_ID = 'amplify-menu-items-group-test-id';
const MenuPrimitive = ({ menuAlign = 'start', children, className, isOpen, size, trigger, triggerClassName, ariaLabel, onOpenChange, isDisabled, ...rest }, ref) => {
    const icons = Field.useIcons('menu');
    return (React__namespace.createElement(DropdownMenu, { onOpenChange: onOpenChange, open: isOpen },
        React__namespace.createElement(DropdownMenuTrigger, { disabled: isDisabled, asChild: true }, trigger ?? (React__namespace.createElement(MenuButton, { ariaLabel: ariaLabel, size: size, testId: MENU_TRIGGER_TEST_ID, className: ui.classNames(ui.ComponentClassName.MenuTrigger, triggerClassName) }, icons?.menu ?? React__namespace.createElement(Field.IconMenu, null)))),
        React__namespace.createElement(DropdownMenuContent, { align: menuAlign, className: ui.ComponentClassName.MenuWrapper },
            React__namespace.createElement(ButtonGroup, { className: ui.classNames(ui.ComponentClassName.MenuContent, className), ref: ref, isDisabled: isDisabled, size: size, testId: MENU_ITEMS_GROUP_TEST_ID, ...rest }, children))));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const Menu = Field.primitiveWithForwardRef(MenuPrimitive);
Menu.displayName = 'Menu';

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { DropdownMenuItem } = ui.sanitizeNamespaceImport(Dropdown__namespace);
const MENU_ITEM_TEST_ID = 'amplify-menu-item-test-id';
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/menu)
 */
const MenuItemPrimitive = ({ children, className, ...rest }, ref) => {
    return (React__namespace.createElement(DropdownMenuItem, { asChild: true, ref: ref },
        React__namespace.createElement(MenuButton, { className: ui.classNames(ui.ComponentClassName.MenuItem, className), testId: MENU_ITEM_TEST_ID, ...rest, variation: "menu" // ensures `menu` variation is not overwritten
         }, children)));
};
const MenuItem = Field.primitiveWithForwardRef(MenuItemPrimitive);
MenuItem.displayName = 'MenuItem';

const MessageHeadingPrimitive = ({ children, className, ...rest }, ref) => {
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.MessageHeading, className), ref: ref, ...rest }, children));
};
const MessageHeading = Field.primitiveWithForwardRef(MessageHeadingPrimitive);
MessageHeading.displayName = 'MessageHeading';

const MessageContext = React__namespace.createContext({
    dismissed: false,
    setDismissed: () => { },
});
const useMessage = () => React__namespace.useContext(MessageContext);

const MessageIconPrimitive = ({ className, ...rest }, ref) => {
    const icons = Field.useIcons('message');
    const { colorTheme } = useMessage();
    let icon;
    switch (colorTheme) {
        case 'info':
            icon = icons?.info ?? React__namespace.createElement(Field.IconInfo, null);
            break;
        case 'error':
            icon = icons?.error ?? React__namespace.createElement(Field.IconError, null);
            break;
        case 'warning':
            icon = icons?.warning ?? React__namespace.createElement(Field.IconWarning, null);
            break;
        case 'success':
            icon = icons?.success ?? React__namespace.createElement(Field.IconCheckCircle, null);
            break;
    }
    return icon ? (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.MessageIcon, className), "aria-hidden": "true", ref: ref, ...rest }, icon)) : null;
};
const MessageIcon = Field.primitiveWithForwardRef(MessageIconPrimitive);
MessageIcon.displayName = 'MessageIcon';

const MessageDismissPrimitive = ({ onDismiss, dismissLabel, hasIcon = true, children, className, ...rest }, ref) => {
    const { setDismissed } = useMessage();
    const icons = Field.useIcons('message');
    const dismissMessage = React__namespace.useCallback(() => {
        setDismissed(true);
        if (ui.isFunction(onDismiss)) {
            onDismiss();
        }
    }, [setDismissed, onDismiss]);
    return (React__namespace.createElement(Field.Button, { variation: "link", colorTheme: "overlay", className: ui.classNames(ui.ComponentClassName.MessageDismiss, className), ref: ref, onClick: dismissMessage, ...rest },
        hasIcon ? icons?.close ?? React__namespace.createElement(Field.IconClose, { "aria-hidden": "true" }) : null,
        children ? (children) : (React__namespace.createElement(VisuallyHidden, null, dismissLabel ? dismissLabel : Field.ComponentText.Message.dismissLabel))));
};
const MessageDismiss = Field.primitiveWithForwardRef(MessageDismissPrimitive);
MessageDismiss.displayName = 'MessageContent';

const MessageContentPrimitive = ({ children, className, ...rest }, ref) => {
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.MessageContent, className), ref: ref, ...rest }, children));
};
const MessageContent = Field.primitiveWithForwardRef(MessageContentPrimitive);
MessageContent.displayName = 'MessageContent';

const MessageContainerPrimitive = ({ children, className, colorTheme = 'neutral', variation = 'filled', ...rest }, ref) => {
    const [dismissed, setDismissed] = React__namespace.useState(false);
    const value = React__namespace.useMemo(() => ({
        colorTheme,
        dismissed,
        setDismissed,
    }), [colorTheme, dismissed]);
    return (React__namespace.createElement(MessageContext.Provider, { value: value }, !dismissed ? (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Message, ui.classNameModifier(ui.ComponentClassName.Message, variation), ui.classNameModifier(ui.ComponentClassName.Message, colorTheme), className), ref: ref, ...rest }, children)) : null));
};
const MessageContainer = Field.primitiveWithForwardRef(MessageContainerPrimitive);
MessageContainer.displayName = 'MessageContainer';

const MessagePrimitive = ({ children, heading, dismissLabel, isDismissible, onDismiss, hasIcon = true, colorTheme = 'neutral', variation = 'filled', ...rest }, ref) => {
    return (React__namespace.createElement(MessageContainer, { colorTheme: colorTheme, variation: variation, ref: ref, ...rest },
        hasIcon ? React__namespace.createElement(MessageIcon, null) : null,
        React__namespace.createElement(MessageContent, null,
            heading ? React__namespace.createElement(MessageHeading, null, heading) : null,
            children),
        isDismissible ? (React__namespace.createElement(MessageDismiss, { onDismiss: onDismiss, dismissLabel: dismissLabel })) : null));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/message)
 */
const Message = Field.primitiveWithForwardRef(MessagePrimitive);
Message.displayName = 'Message';

const { passwordIsHidden, passwordIsShown, showPassword } = Field.ComponentText.PasswordField;
const ShowPasswordButtonPrimitive = ({ fieldType, passwordIsHiddenLabel = passwordIsHidden, passwordIsShownLabel = passwordIsShown, showPasswordButtonLabel = showPassword, size, hasError, ...rest }, ref) => {
    const icons = Field.useIcons('passwordField');
    const showPasswordButtonClass = ui.classNames(ui.ComponentClassName.FieldShowPassword, ui.classNameModifierByFlag(ui.ComponentClassName.FieldShowPassword, 'error', hasError));
    const icon = fieldType === 'password'
        ? icons?.visibility ?? React__namespace.createElement(Field.IconVisibility, { "aria-hidden": "true" })
        : icons?.visibilityOff ?? React__namespace.createElement(Field.IconVisibilityOff, { "aria-hidden": "true" });
    return (React__namespace.createElement(Field.Button, { "aria-checked": fieldType !== 'password', ariaLabel: showPasswordButtonLabel, className: showPasswordButtonClass, colorTheme: hasError ? 'error' : undefined, ref: ref, role: "switch", size: size, ...rest },
        React__namespace.createElement(VisuallyHidden, { "aria-live": "polite" }, fieldType === 'password'
            ? passwordIsHiddenLabel
            : passwordIsShownLabel),
        icon));
};
const ShowPasswordButton = Field.primitiveWithForwardRef(ShowPasswordButtonPrimitive);
ShowPasswordButton.displayName = 'ShowPasswordButton';

const PasswordFieldPrimitive = ({ autoComplete = 'current-password', label, className, hideShowPassword = false, passwordIsHiddenLabel, passwordIsShownLabel, showPasswordButtonLabel, showPasswordButtonRef, size, hasError, ...rest }, ref) => {
    const [type, setType] = React__namespace.useState('password');
    const showPasswordOnClick = React__namespace.useCallback(() => {
        if (type === 'password') {
            setType('text');
        }
        else {
            setType('password');
        }
    }, [setType, type]);
    return (React__namespace.createElement(TextField, { autoComplete: autoComplete, outerEndComponent: hideShowPassword ? null : (React__namespace.createElement(ShowPasswordButton, { fieldType: type, onClick: showPasswordOnClick, passwordIsHiddenLabel: passwordIsHiddenLabel, passwordIsShownLabel: passwordIsShownLabel, ref: showPasswordButtonRef, size: size, showPasswordButtonLabel: showPasswordButtonLabel, hasError: hasError })), size: size, type: type, label: label, className: ui.classNames(ui.ComponentClassName.PasswordField, className), ref: ref, hasError: hasError, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/passwordfield)
 */
const PasswordField = Field.primitiveWithForwardRef(PasswordFieldPrimitive);
PasswordField.displayName = 'PasswordField';

const SelectPrimitive = ({ autoComplete, className, size, variation, value, defaultValue, hasError, icon, iconColor, children, placeholder, isDisabled, isRequired, isMultiple = false, selectSize = 1, ...rest }, ref) => {
    const DEFAULT_PLACEHOLDER_VALUE = '';
    // value === undefined is to make sure that component is used in uncontrolled way so that setting defaultValue is valid
    const shouldSetDefaultPlaceholderValue = value === undefined && defaultValue === undefined && placeholder;
    const isExpanded = isMultiple || selectSize > 1;
    const componentClasses = ui.classNames(ui.ComponentClassName.Select, ui.ComponentClassName.FieldGroupControl, ui.classNameModifier(ui.ComponentClassName.Select, size), ui.classNameModifier(ui.ComponentClassName.Select, variation), ui.classNameModifierByFlag(ui.ComponentClassName.Select, 'error', hasError), ui.classNameModifierByFlag(ui.ComponentClassName.Select, 'expanded', isExpanded), className);
    const icons = Field.useIcons('select');
    const { isFieldsetDisabled } = Field.useFieldset();
    return (React__namespace.createElement(Field.View, { className: ui.ComponentClassName.SelectWrapper },
        React__namespace.createElement(Field.View, { "aria-invalid": hasError, as: "select", autoComplete: autoComplete, value: value, defaultValue: shouldSetDefaultPlaceholderValue
                ? DEFAULT_PLACEHOLDER_VALUE
                : defaultValue, isDisabled: isFieldsetDisabled ? isFieldsetDisabled : isDisabled, multiple: isMultiple, size: selectSize, required: isRequired, className: componentClasses, ref: ref, ...rest },
            placeholder && React__namespace.createElement("option", { value: "" }, placeholder),
            children),
        isExpanded ? null : (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.SelectIcon, ui.classNameModifier(ui.ComponentClassName.SelectIcon, size)), color: iconColor, "aria-hidden": "true" }, icon ?? icons?.expand ?? React__namespace.createElement(Field.IconExpandMore, null)))));
};
const Select = Field.primitiveWithForwardRef(SelectPrimitive);
Select.displayName = 'Select';

const selectFieldChildren = ({ children, options, }) => {
    if (children) {
        if (options?.length) {
            // eslint-disable-next-line no-console
            console.warn('Amplify UI: <SelectField> component  defaults to rendering children over `options`. When using the `options` prop, omit children.');
        }
        return children;
    }
    return options?.map((option, index) => (React__namespace.createElement("option", { label: option, value: option, key: `${option}-${index}` }, option)));
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
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.SelectField, className), testId: testId, ...styleProps },
        React__namespace.createElement(Field.Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React__namespace.createElement(Select, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, size: size, ...rest, ...inputStyles }, selectFieldChildren({ children, options })),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/selectfield)
 */
const SelectField = Field.primitiveWithForwardRef(SelectFieldPrimitive);
SelectField.displayName = 'SelectField';

const DialCodeSelectPrimitive = ({ className, dialCodeList, isReadOnly, ...props }, ref) => {
    const dialList = dialCodeList ?? ui.countryDialCodes;
    const dialCodeOptions = React__namespace.useMemo(() => dialList.map((dialCode) => (
    // Regarding the `disabled` attribute, see comment in SelectField below
    React__namespace.createElement("option", { key: dialCode, value: dialCode, disabled: isReadOnly }, dialCode))), [dialList, isReadOnly]);
    return (React__namespace.createElement(SelectField
    /*
        Since <select> elements do not support the `readonly` html attribute, it is suggested to use the `disabled` html attribute
        so that a screen reader will announce something to the user about the interactivity of the options list ( https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/readonly)
      */
    , { "aria-disabled": isReadOnly, autoComplete: "tel-country-code", className: ui.classNames(ui.ComponentClassName.CountryCodeSelect, ui.ComponentClassName.DialCodeSelect, className), labelHidden: true, ref: ref, ...props }, dialCodeOptions));
};
const DialCodeSelect = Field.primitiveWithForwardRef(DialCodeSelectPrimitive);
DialCodeSelect.displayName = 'DialCodeSelect';

const PhoneNumberFieldPrimitive = ({ autoComplete = 'tel-national', className, defaultDialCode, dialCodeLabel = Field.ComponentText.PhoneNumberField.countryCodeLabel, dialCodeList, dialCodeName, dialCodeRef, hasError, isDisabled, isReadOnly, onDialCodeChange, onInput, size, variation, ...rest }, ref) => {
    return (React__namespace.createElement(TextField, { outerStartComponent: React__namespace.createElement(DialCodeSelect, { defaultValue: defaultDialCode, dialCodeList: dialCodeList, className: className, hasError: hasError, isDisabled: isDisabled, isReadOnly: isReadOnly, label: dialCodeLabel, name: dialCodeName, onChange: onDialCodeChange, ref: dialCodeRef, size: size, variation: variation }), autoComplete: autoComplete, className: ui.classNames(ui.ComponentClassName.PhoneNumberField, className), hasError: hasError, isDisabled: isDisabled, isReadOnly: isReadOnly, onInput: onInput, ref: ref, size: size, type: "tel", variation: variation, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/phonenumberfield)
 */
const PhoneNumberField = Field.primitiveWithForwardRef(PhoneNumberFieldPrimitive);
PhoneNumberField.displayName = 'PhoneNumberField';

const PlaceholderPrimitive = ({ className, children, isLoaded, size, ...rest }, ref) => {
    if (isLoaded) {
        return React__namespace.createElement(React__namespace.Fragment, null, children);
    }
    return (React__namespace.createElement(Field.View, { className: ui.classNames(ui.ComponentClassName.Placeholder, ui.classNameModifier(ui.ComponentClassName.Placeholder, size), className), ref: ref, ...rest }));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/placeholder)
 */
const Placeholder = Field.primitiveWithForwardRef(PlaceholderPrimitive);
Placeholder.displayName = 'Placeholder';

const defaultValue = { name: 'default' };
const RadioGroupContext = React__default["default"].createContext(defaultValue);
const useRadioGroupContext = () => {
    return React.useContext(RadioGroupContext);
};

const RadioPrimitive = ({ children, className, id, isDisabled = false, testId, value, labelPosition: radioLabelPosition, ...rest }, ref) => {
    const { currentValue, defaultValue, name, hasError, isGroupDisabled = false, isRequired, isReadOnly, onChange, size, labelPosition: groupLabelPosition, } = useRadioGroupContext();
    const { isFieldsetDisabled } = Field.useFieldset();
    const shouldBeDisabled = isFieldsetDisabled
        ? isFieldsetDisabled
        : isGroupDisabled || isDisabled || (isReadOnly && defaultValue !== value);
    // for controlled component
    const checked = currentValue !== undefined ? value === currentValue : undefined;
    // for uncontrolled component
    const defaultChecked = defaultValue !== undefined ? value === defaultValue : undefined;
    const labelPosition = radioLabelPosition
        ? radioLabelPosition
        : groupLabelPosition;
    return (React__namespace.createElement(Field.Flex, { as: "label", className: ui.classNames(ui.ComponentClassName.Radio, ui.classNameModifierByFlag(ui.ComponentClassName.Radio, `disabled`, shouldBeDisabled), labelPosition ? `amplify-label-${labelPosition}` : null, className) },
        children && (React__namespace.createElement(Field.Text, { as: "span", className: ui.classNames(ui.ComponentClassName.RadioLabel, ui.classNameModifierByFlag(ui.ComponentClassName.RadioLabel, `disabled`, shouldBeDisabled)) }, children)),
        React__namespace.createElement(Input, { checked: checked, className: ui.classNames(ui.ComponentClassName.VisuallyHidden, ui.ComponentClassName.RadioInput), defaultChecked: defaultChecked, hasError: hasError, id: id, isDisabled: shouldBeDisabled, isReadOnly: isReadOnly, isRequired: isRequired, onChange: onChange, ref: ref, type: "radio", name: name, value: value, ...rest }),
        React__namespace.createElement(Field.Flex, { "aria-hidden": "true", as: "span", className: ui.classNames(ui.ComponentClassName.RadioButton, ui.classNameModifier(ui.ComponentClassName.RadioButton, size)), testId: testId })));
};
const Radio = Field.primitiveWithForwardRef(RadioPrimitive);
Radio.displayName = 'Radio';

const RadioGroupFieldPrimitive = ({ children, className, defaultValue, descriptiveText, errorMessage, hasError = false, id, isDisabled, isRequired, isReadOnly, legend, legendHidden = false, labelPosition, onChange, name, size, testId, value, variation, ...rest }, ref) => {
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const radioGroupTestId = getUniqueComponentId(testId, ui.ComponentClassName.RadioGroup);
    const radioGroupContextValue = React__namespace.useMemo(() => ({
        currentValue: value,
        defaultValue,
        hasError,
        isRequired,
        isReadOnly,
        isGroupDisabled: isDisabled,
        onChange,
        size,
        name,
        labelPosition,
    }), [
        defaultValue,
        hasError,
        isDisabled,
        isRequired,
        isReadOnly,
        onChange,
        size,
        name,
        value,
        labelPosition,
    ]);
    return (React__namespace.createElement(Fieldset, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.RadioGroupField, className), isDisabled: isDisabled, legend: legend, legendHidden: legendHidden, ref: ref, role: "radiogroup", size: size, testId: testId, variation: variation, ...rest },
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: legendHidden, descriptiveText: descriptiveText }),
        React__namespace.createElement(Field.Flex, { "aria-describedby": ariaDescribedBy, className: ui.ComponentClassName.RadioGroup, id: fieldId, testId: radioGroupTestId },
            React__namespace.createElement(RadioGroupContext.Provider, { value: radioGroupContextValue }, children)),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/radiogroupfield)
 */
const RadioGroupField = Field.primitiveWithForwardRef(RadioGroupFieldPrimitive);
RadioGroupField.displayName = 'RadioGroupField';

const isIconFilled = (currentIconIndex, ratingValue) => {
    if (currentIconIndex <= ratingValue)
        return true;
    return false;
};
const isIconEmpty = (currentIconIndex, ratingValue) => {
    if (currentIconIndex - 1 >= ratingValue)
        return true;
    return false;
};
const isIconMixed = (currentIconIndex, ratingValue) => {
    if (currentIconIndex > ratingValue && currentIconIndex - 1 < ratingValue) {
        return true;
    }
    return false;
};

const RatingIcon = ({ icon, fill, className, }) => {
    return (React__namespace.createElement(Field.View, { as: "span", className: ui.ComponentClassName.RatingItem, "aria-hidden": "true" },
        React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(ui.ComponentClassName.RatingIcon, className), color: fill }, icon)));
};
RatingIcon.displayName = 'RatingIcon';

const RatingMixedIcon = ({ emptyColor, emptyIcon, fillColor, fillIcon, value, }) => {
    const widthPercentage = `${(value % 1) * 100}%`;
    return (React__namespace.createElement(Field.View, { as: "span", className: ui.ComponentClassName.RatingItem, "aria-hidden": "true" },
        React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(ui.ComponentClassName.RatingIcon, ui.classNameModifier(ui.ComponentClassName.RatingIcon, 'empty')), color: emptyColor }, emptyIcon),
        React__namespace.createElement(Field.View, { as: "span", className: ui.classNames(ui.ComponentClassName.RatingIcon, ui.classNameModifier(ui.ComponentClassName.RatingIcon, 'filled')), width: widthPercentage, color: fillColor }, fillIcon)));
};
RatingMixedIcon.displayName = 'RatingMixedIcon';

const RATING_DEFAULT_MAX_VALUE = 5;
const RATING_DEFAULT_VALUE = 0;
const RatingPrimitive = ({ className, emptyColor, emptyIcon, fillColor, icon, maxValue = RATING_DEFAULT_MAX_VALUE, size, value = RATING_DEFAULT_VALUE, ...rest }, ref) => {
    const icons = Field.useIcons('rating');
    const filledIcon = icon ?? icons?.filled ?? React__namespace.createElement(Field.IconStar, null);
    const _emptyIcon = emptyIcon ?? icon ?? icons?.empty ?? React__namespace.createElement(Field.IconStar, null);
    const items = new Array(Math.ceil(maxValue)).fill(1).map((_, index) => {
        const currentIconIndex = index + 1;
        if (isIconFilled(currentIconIndex, value))
            return (React__namespace.createElement(RatingIcon, { key: index.toString(), icon: filledIcon, fill: fillColor, className: ui.classNameModifier(ui.ComponentClassName.RatingIcon, 'filled') }));
        if (isIconEmpty(currentIconIndex, value))
            return (React__namespace.createElement(RatingIcon, { key: index.toString(), icon: _emptyIcon, fill: emptyColor, className: ui.classNameModifier(ui.ComponentClassName.RatingIcon, 'empty') }));
        if (isIconMixed(currentIconIndex, value))
            return (React__namespace.createElement(RatingMixedIcon, { key: index.toString(), fillIcon: filledIcon, emptyIcon: _emptyIcon, value: value, fillColor: fillColor, emptyColor: emptyColor }));
    });
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Rating, ui.classNameModifier(ui.ComponentClassName.Rating, size), className), ref: ref, ...rest },
        items,
        React__namespace.createElement(VisuallyHidden, null,
            value,
            " out of ",
            maxValue,
            " rating")));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/rating)
 */
const Rating = Field.primitiveWithForwardRef(RatingPrimitive);
Rating.displayName = 'Rating';

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { Range, Root, Thumb, Track } = ui.sanitizeNamespaceImport(RadixSlider__namespace);
const SLIDER_LABEL_TEST_ID = 'slider-label';
const SLIDER_ROOT_TEST_ID = 'slider-root';
const SLIDER_TRACK_TEST_ID = 'slider-track';
const SLIDER_RANGE_TEST_ID = 'slider-range';
const SliderFieldPrimitive = ({ ariaValuetext, className, defaultValue = 0, descriptiveText, emptyTrackColor, errorMessage, filledTrackColor, formatValue, hasError = false, id, isDisabled, isValueHidden = false, label, labelHidden = false, onChange, orientation = 'horizontal', outerEndComponent, outerStartComponent, testId, thumbColor, trackSize, value, size, ..._rest }, ref) => {
    const { isFieldsetDisabled } = Field.useFieldset();
    const fieldId = useStableId(id);
    const stableId = useStableId();
    const descriptionId = descriptiveText
        ? getUniqueComponentId(stableId, DESCRIPTION_SUFFIX)
        : undefined;
    const errorId = hasError
        ? getUniqueComponentId(stableId, ERROR_SUFFIX)
        : undefined;
    const ariaDescribedBy = createSpaceSeparatedIds([errorId, descriptionId]);
    const disabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const { styleProps, rest } = splitPrimitiveProps(_rest);
    const isControlled = value !== undefined;
    const [currentValue, setCurrentValue] = React__namespace.useState(isControlled ? value : defaultValue);
    const values = isControlled ? [value] : undefined;
    const defaultValues = !isControlled ? [defaultValue] : undefined;
    const onValueChange = React__namespace.useCallback((value) => {
        setCurrentValue(value[0]);
        if (ui.isFunction(onChange)) {
            // Do not have multiple thumbs support yet
            onChange(value[0]);
        }
    }, [onChange]);
    const renderedValue = React__namespace.useMemo(() => {
        const formattedValue = ui.isFunction(formatValue)
            ? formatValue(currentValue)
            : currentValue;
        return typeof formatValue === 'string' ? (React__namespace.createElement(Field.View, { as: "span" }, formattedValue)) : (formattedValue);
    }, [currentValue, formatValue]);
    const isVertical = orientation === 'vertical';
    const componentClasses = ui.classNames(ui.ComponentClassName.SliderFieldTrack, ui.classNameModifier(ui.ComponentClassName.SliderFieldTrack, orientation), ui.classNameModifier(ui.ComponentClassName.SliderFieldTrack, size));
    const rootComponentClasses = ui.classNames(ui.ComponentClassName.SliderFieldRoot, ui.classNameModifier(ui.ComponentClassName.SliderFieldRoot, orientation), ui.classNameModifier(ui.ComponentClassName.SliderFieldRoot, size), ui.classNameModifierByFlag(ui.ComponentClassName.SliderFieldRoot, 'disabled', disabled), className);
    return (React__namespace.createElement(Field.Flex
    // Custom classnames will be added to Root below
    , { 
        // Custom classnames will be added to Root below
        className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.SliderField), testId: testId, ...styleProps },
        React__namespace.createElement(Field.Label, { className: ui.ComponentClassName.SliderFieldLabel, id: stableId, testId: SLIDER_LABEL_TEST_ID, visuallyHidden: labelHidden },
            React__namespace.createElement(Field.View, { as: "span" }, label),
            !isValueHidden ? renderedValue : null),
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React__namespace.createElement(FieldGroup, { className: ui.ComponentClassName.SliderFieldGroup, id: fieldId, orientation: orientation, outerStartComponent: outerStartComponent, outerEndComponent: outerEndComponent },
            React__namespace.createElement(Root, { className: rootComponentClasses, "data-testid": SLIDER_ROOT_TEST_ID, disabled: disabled, defaultValue: defaultValues, onValueChange: onValueChange, orientation: orientation, ref: ref, value: values, ...rest },
                React__namespace.createElement(Track, { className: componentClasses, "data-testid": SLIDER_TRACK_TEST_ID, style: {
                        backgroundColor: String(emptyTrackColor),
                        [`${isVertical ? 'width' : 'height'}`]: trackSize,
                    } },
                    React__namespace.createElement(Range, { className: ui.classNames(ui.ComponentClassName.SliderFieldRange, ui.classNameModifier(ui.ComponentClassName.SliderFieldRange, orientation), ui.classNameModifierByFlag(ui.ComponentClassName.SliderFieldRange, 'disabled', disabled)), "data-testid": SLIDER_RANGE_TEST_ID, style: { backgroundColor: String(filledTrackColor) } })),
                React__namespace.createElement(Thumb, { "aria-describedby": ariaDescribedBy, "aria-labelledby": stableId, "aria-valuetext": ariaValuetext, className: ui.classNames(ui.ComponentClassName.SliderFieldThumb, ui.classNameModifier(ui.ComponentClassName.SliderFieldThumb, size), ui.classNameModifierByFlag(ui.ComponentClassName.SliderFieldThumb, 'disabled', disabled)), style: { backgroundColor: String(thumbColor) } }))),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/sliderfield)
 */
const SliderField = Field.primitiveWithForwardRef(SliderFieldPrimitive);
SliderField.displayName = 'SliderField';

const getCorrectSteppingValue = ({ max, min, step, value, }) => {
    // Round it to the closest step value
    // It will be based off min to be consistent with native input[type="number"]
    // This allows keyboard accessible
    const remainder = (value - min) % step;
    value = value - remainder + Math.round(remainder / step) * step;
    // Make sure new value is not outside the bound
    value = Math.max(min, value);
    if (value > max) {
        value = max - ((max - min) % step);
    }
    return value;
};
const useStepper = ({ defaultValue = 0, value: controlledValue, step = 1, max = Number.MAX_SAFE_INTEGER, min = Number.MIN_SAFE_INTEGER, isDisabled, isReadOnly, onChange, onDecrease, onIncrease, onStepChange, }) => {
    const isControlled = controlledValue !== undefined;
    // Make sure max value is greater than or equal to min value
    max = Math.max(min, max);
    // Maintain an internal state for uncontrolled components
    // This allows to take over the input value and correct any invalid versus purely relying on the native uncontrolled input
    const [uncontrolledValue, setUncontrolledValue] = React__namespace.useState(() => 
    // This is required for users could provide any defaultValue
    getCorrectSteppingValue({ min, max, step, value: defaultValue }));
    // Same for controlled components on the first render because users could provide invalid initial value.
    // It seems redundant afterwards but necessary for the first render
    const value = isControlled
        ? getCorrectSteppingValue({ min, max, step, value: controlledValue })
        : uncontrolledValue;
    const shouldDisableIncreaseButton = isDisabled ?? isReadOnly ?? value + step > max;
    const shouldDisableDecreaseButton = isDisabled ?? isReadOnly ?? value - step < min;
    // This is the exact value to be rendered on screen
    // It could be a string, like '-' or empty string when users clear the input
    const [inputValue, setInputValue] = React__namespace.useState(value);
    const handleOnChange = React__namespace.useCallback((event) => {
        setInputValue(event.target.value);
        if (ui.isFunction(onChange)) {
            onChange(event);
        }
    }, [onChange]);
    const handleOnBlur = React__namespace.useCallback((event) => {
        const parsedValue = parseFloat(event.target.value);
        // Though input[type='number'] has built-in validation to reject non-numerical entries
        // The entered value could still be empty string or minus '-'
        // in these cases, no need to do the following validation
        if (isNaN(parsedValue)) {
            return;
        }
        const newValue = getCorrectSteppingValue({
            min,
            max,
            step,
            value: parsedValue,
        });
        if (!isControlled) {
            setUncontrolledValue(newValue);
        }
        if (ui.isFunction(onStepChange)) {
            onStepChange(newValue);
        }
        setInputValue(newValue);
    }, [min, max, step, isControlled, onStepChange]);
    const handleIncrease = React__namespace.useCallback(() => {
        // No need to check if the value will be outside the bounds
        // The button will be disabled if so
        if (!isControlled) {
            setUncontrolledValue(value + step);
        }
        if (ui.isFunction(onStepChange)) {
            onStepChange(value + step);
        }
        if (ui.isFunction(onIncrease)) {
            onIncrease();
        }
        setInputValue(value + step);
    }, [step, value, isControlled, onIncrease, onStepChange]);
    const handleDecrease = React__namespace.useCallback(() => {
        // No need to check if the value will be outside the bounds
        // The button will be disabled if so
        if (!isControlled) {
            setUncontrolledValue(value - step);
        }
        if (ui.isFunction(onStepChange)) {
            onStepChange(value - step);
        }
        if (ui.isFunction(onDecrease)) {
            onDecrease();
        }
        setInputValue(value - step);
    }, [step, value, isControlled, onDecrease, onStepChange]);
    // This aims to disable unwanted behaviors on React input[type='number']
    // When the input gets focused, rotating a wheel will change its value
    // But the parent container(mostly the entire window) will be scrolling to elsewhere
    const handleOnWheel = React__namespace.useCallback((event) => {
        event.currentTarget.blur();
    }, []);
    return {
        step,
        value,
        inputValue,
        handleDecrease,
        handleIncrease,
        handleOnBlur,
        handleOnChange,
        handleOnWheel,
        setInputValue,
        shouldDisableDecreaseButton,
        shouldDisableIncreaseButton,
    };
};

const DECREASE_ICON = 'decrease-icon';
const INCREASE_ICON = 'increase-icon';
const StepperFieldPrimitive = (props, ref) => {
    const { className, 
    // destructure to prevent `defaultValue` from being passed to underlying `Input` via `_rest`
    defaultValue, descriptiveText, errorMessage, hasError = false, id, inputStyles, isDisabled, isReadOnly, isRequired, increaseButtonLabel = Field.ComponentText.StepperField.increaseButtonLabel, decreaseButtonLabel = Field.ComponentText.StepperField.decreaseButtonLabel, label, labelHidden = false, 
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
    const icons = Field.useIcons('stepperField');
    const { step, value, inputValue, handleDecrease, handleIncrease, handleOnBlur, handleOnChange, handleOnWheel, setInputValue, shouldDisableDecreaseButton, shouldDisableIncreaseButton, } = useStepper({ ...props, defaultValue, onStepChange });
    React__namespace.useEffect(() => {
        const isControlled = controlledValue !== undefined;
        if (isControlled) {
            setInputValue(controlledValue);
        }
    }, [controlledValue, setInputValue]);
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.StepperField, className), testId: testId, ...styleProps },
        React__namespace.createElement(Field.Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        React__namespace.createElement(FieldGroup, { outerStartComponent: React__namespace.createElement(Field.FieldGroupIconButton, { "aria-controls": fieldId, ariaLabel: `${decreaseButtonLabel} ${value - step}`, className: ui.classNames(ui.ComponentClassName.StepperFieldButtonDecrease, ui.classNameModifier(ui.ComponentClassName.StepperFieldButtonDecrease, variation), ui.classNameModifierByFlag(ui.ComponentClassName.StepperFieldButtonDecrease, 'disabled', shouldDisableDecreaseButton)), "data-invalid": hasError, isDisabled: shouldDisableDecreaseButton, onClick: handleDecrease, size: size }, icons?.remove ?? React__namespace.createElement(Field.IconRemove, { "data-testid": DECREASE_ICON })), outerEndComponent: React__namespace.createElement(Field.FieldGroupIconButton, { "aria-controls": fieldId, ariaLabel: `${increaseButtonLabel} ${value + step}`, className: ui.classNames(ui.ComponentClassName.StepperFieldButtonIncrease, ui.classNameModifier(ui.ComponentClassName.StepperFieldButtonIncrease, variation), ui.classNameModifierByFlag(ui.ComponentClassName.StepperFieldButtonIncrease, 'disabled', shouldDisableIncreaseButton)), "data-invalid": hasError, isDisabled: shouldDisableIncreaseButton, onClick: handleIncrease, size: size }, icons?.add ?? React__namespace.createElement(Field.IconAdd, { "data-testid": INCREASE_ICON })) },
            React__namespace.createElement(Input, { "aria-describedby": ariaDescribedBy, className: ui.ComponentClassName.StepperFieldInput, hasError: hasError, id: fieldId, isDisabled: isDisabled, isReadOnly: isReadOnly, isRequired: isRequired, onBlur: handleOnBlur, onChange: handleOnChange, onWheel: handleOnWheel, ref: ref, size: size, variation: variation, type: "number", value: inputValue, ...inputStyles, ...rest })),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/stepperfield)
 */
const StepperField = Field.primitiveWithForwardRef(StepperFieldPrimitive);
StepperField.displayName = 'StepperField';

const useSwitch = (props) => {
    const { onChange, isChecked, defaultChecked, isDisabled } = props;
    const isControlled = typeof isChecked !== 'undefined';
    const [isOn, setIsOn] = React.useState(isControlled ? isChecked : !!defaultChecked);
    const [isFocused, setIsFocused] = React.useState(false);
    const changeHandler = React.useCallback((event) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }
        if (ui.isFunction(onChange)) {
            onChange(event);
        }
        setIsOn(event.target.checked);
    }, [onChange, isDisabled]);
    if (isControlled && isOn !== isChecked) {
        setIsOn(isChecked);
    }
    return {
        isOn,
        changeHandler,
        isFocused,
        setIsFocused,
    };
};

const SwitchFieldPrimitive = ({ className, defaultChecked, id, isChecked, isDisabled, isLabelHidden, label, labelPosition, name, onChange, size, thumbColor, trackCheckedColor, trackColor, value, hasError, errorMessage, ...rest }, ref) => {
    const { isOn, changeHandler, isFocused, setIsFocused } = useSwitch({
        onChange,
        isChecked,
        defaultChecked,
        isDisabled,
    });
    const { isFieldsetDisabled } = Field.useFieldset();
    const shouldBeDisabled = isFieldsetDisabled ? isFieldsetDisabled : isDisabled;
    const fieldId = useStableId(id);
    const wrapperClasses = ui.classNames(ui.ComponentClassName.SwitchTrack, ui.classNameModifierByFlag(ui.ComponentClassName.SwitchTrack, 'checked', isOn), ui.classNameModifierByFlag(ui.ComponentClassName.SwitchTrack, 'disabled', shouldBeDisabled), ui.classNameModifierByFlag(ui.ComponentClassName.SwitchTrack, 'focused', isFocused), ui.classNameModifierByFlag(ui.ComponentClassName.SwitchTrack, 'error', hasError));
    const componentClasses = ui.classNames(ui.ComponentClassName.SwitchThumb, ui.classNameModifierByFlag(ui.ComponentClassName.SwitchThumb, 'checked', isOn), ui.classNameModifierByFlag(ui.ComponentClassName.SwitchThumb, 'disabled', shouldBeDisabled));
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.SwitchField, ui.classNameModifier(ui.ComponentClassName.SwitchField, size), labelPosition ? `amplify-label-${labelPosition}` : null, className), ref: ref, ...rest },
        React__namespace.createElement(VisuallyHidden, null,
            React__namespace.createElement(Input, { role: "switch", type: "checkbox", id: fieldId, onChange: changeHandler, disabled: isDisabled, name: name, checked: isOn, value: value, onFocus: () => {
                    setIsFocused(true);
                }, onBlur: () => {
                    setIsFocused(false);
                } })),
        React__namespace.createElement(Field.Label, { htmlFor: fieldId, className: ui.classNames(ui.ComponentClassName.SwitchWrapper, ui.classNameModifier(ui.ComponentClassName.SwitchWrapper, labelPosition)) },
            isLabelHidden ? (React__namespace.createElement(VisuallyHidden, { as: "span", className: ui.ComponentClassName.SwitchLabel }, label)) : (React__namespace.createElement(Field.View, { as: "span", className: ui.ComponentClassName.SwitchLabel }, label)),
            React__namespace.createElement(Field.View, { as: "span", className: wrapperClasses, backgroundColor: isOn ? trackCheckedColor : trackColor },
                React__namespace.createElement(Field.View, { as: "span", className: componentClasses, "data-checked": isOn, "data-disabled": shouldBeDisabled, backgroundColor: thumbColor }))),
        React__namespace.createElement(Field.FieldErrorMessage, { hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/switchfield)
 */
const SwitchField = Field.primitiveWithForwardRef(SwitchFieldPrimitive);
SwitchField.displayName = 'SwitchField';

const TablePrimitive = ({ caption, children, className, highlightOnHover = false, size, variation, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Table, ui.classNameModifier(ui.ComponentClassName.Table, size), ui.classNameModifier(ui.ComponentClassName.Table, variation), className);
    return (React__namespace.createElement(Field.View, { as: "table", className: componentClasses, "data-highlightonhover": highlightOnHover, ref: ref, ...rest },
        caption && (React__namespace.createElement(Field.View, { as: "caption", className: ui.ComponentClassName.TableCaption }, caption)),
        children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/table)
 */
const Table = Field.primitiveWithForwardRef(TablePrimitive);
Table.displayName = 'Table';

const TableBodyPrimitive = ({ children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: "tbody", className: ui.classNames(ui.ComponentClassName.TableBody, className), ref: ref, ...rest }, children));
const TableBody = Field.primitiveWithForwardRef(TableBodyPrimitive);
TableBody.displayName = 'TableBody';

const TableCellPrimitive = ({ as: asElementTag = 'td', children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: asElementTag, className: ui.classNames(asElementTag === 'td'
        ? ui.ComponentClassName.TableTd
        : ui.ComponentClassName.TableTh, className), ref: ref, ...rest }, children));
const TableCell = Field.primitiveWithForwardRef(TableCellPrimitive);
TableCell.displayName = 'TableCell';

const TableFootPrimitive = ({ children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: "tfoot", className: ui.classNames(ui.ComponentClassName.TableFoot, className), ref: ref, ...rest }, children));
const TableFoot = Field.primitiveWithForwardRef(TableFootPrimitive);
TableFoot.displayName = 'TableFoot';

const TableHeadPrimitive = ({ children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: "thead", className: ui.classNames(ui.ComponentClassName.TableHead, className), ref: ref, ...rest }, children));
const TableHead = Field.primitiveWithForwardRef(TableHeadPrimitive);
TableHead.displayName = 'TableHead';

const TableRowPrimitive = ({ children, className, ...rest }, ref) => (React__namespace.createElement(Field.View, { as: "tr", className: ui.classNames(ui.ComponentClassName.TableRow, className), ref: ref, ...rest }, children));
const TableRow = Field.primitiveWithForwardRef(TableRowPrimitive);
TableRow.displayName = 'TableRow';

const TabsContext = React__namespace.createContext({
    groupId: '',
    activeTab: '',
    setActiveTab: () => { },
});

/* WHITESPACE_VALUE is used to fill whitespace present in user-inputed `value` when creating id for TabsItem and TabsPanel */
const WHITESPACE_VALUE = '-';

const TabsItemPrimitive = ({ className, value, children, onClick, as = 'button', role = 'tab', ...rest }, ref) => {
    const { activeTab, setActiveTab, groupId } = React__namespace.useContext(TabsContext);
    let idValue = value;
    if (typeof idValue === 'string') {
        idValue = idValue.replace(' ', WHITESPACE_VALUE);
    }
    const isActive = activeTab === value;
    const handleOnClick = (e) => {
        if (ui.isTypedFunction(onClick)) {
            onClick?.(e);
        }
        setActiveTab(value);
    };
    return (React__namespace.createElement(Field.View, { ...rest, role: role, as: as, id: `${groupId}-tab-${idValue}`, "aria-selected": isActive, "aria-controls": `${groupId}-panel-${idValue}`, tabIndex: !isActive ? -1 : undefined, className: ui.classNames(ui.ComponentClassName.TabsItem, ui.classNameModifierByFlag(ui.ComponentClassName.TabsItem, 'active', activeTab === value), className), ref: ref, onClick: handleOnClick }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabsItem = Field.primitiveWithForwardRef(TabsItemPrimitive);
TabsItem.displayName = 'Tabs.Item';

const isValidTab = (child) => React__namespace.isValidElement(child);
const TabListPrimitive = ({ className, children, indicatorPosition, spacing, role = 'tablist', ...rest }, ref) => {
    const internalRef = React__namespace.useRef(null);
    const { activeTab, setActiveTab } = React__namespace.useContext(TabsContext);
    React__namespace.useImperativeHandle(ref, () => internalRef.current);
    const values = React__namespace.useMemo(() => React__namespace.Children.toArray(children)
        .map((child) => {
        if (child && isValidTab(child)) {
            return child.props.value;
        }
    })
        .filter((child) => !!child), [children]);
    const currentIndex = values.indexOf(activeTab);
    const nextTab = React__namespace.useCallback(() => {
        let nextIndex = currentIndex === values.length - 1 ? 0 : currentIndex + 1;
        const elems = internalRef.current?.querySelectorAll('button') ?? [];
        while (elems[nextIndex].disabled) {
            if (nextIndex === values.length - 1) {
                nextIndex = 0;
            }
            else {
                nextIndex++;
            }
        }
        const value = values[nextIndex];
        if (value) {
            setActiveTab(value);
            const elem = elems[nextIndex];
            elem?.focus();
            elem?.click();
        }
    }, [currentIndex, setActiveTab, values]);
    const prevTab = React__namespace.useCallback(() => {
        let prevIndex = currentIndex === 0 ? values.length - 1 : currentIndex - 1;
        const elems = internalRef.current?.querySelectorAll('button') ?? [];
        while (elems[prevIndex].disabled) {
            if (prevIndex === 0) {
                prevIndex = values.length - 1;
            }
            else {
                prevIndex--;
            }
        }
        const value = values[prevIndex];
        if (value) {
            setActiveTab(value);
            const elem = elems[prevIndex];
            elem?.focus();
            elem?.click();
        }
    }, [currentIndex, setActiveTab, values]);
    const onKeyDown = React__namespace.useCallback((event) => {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                event.stopPropagation();
                prevTab();
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                event.preventDefault();
                event.stopPropagation();
                nextTab();
                break;
        }
    }, [prevTab, nextTab]);
    return (React__namespace.createElement(Field.View, { ...rest, role: role, onKeyDown: onKeyDown, className: ui.classNames(ui.ComponentClassName.TabsList, indicatorPosition
            ? ui.classNameModifier(ui.ComponentClassName.TabsList, indicatorPosition)
            : null, spacing
            ? ui.classNameModifier(ui.ComponentClassName.TabsList, spacing)
            : null, className), ref: internalRef }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabList = Field.primitiveWithForwardRef(TabListPrimitive);
TabList.displayName = 'Tabs.List';

const TabPanelPrimitive = ({ className, value, children, role = 'tabpanel', ...rest }, ref) => {
    const { activeTab, isLazy, groupId } = React__namespace.useContext(TabsContext);
    if (isLazy && activeTab !== value)
        return null;
    let idValue = value;
    if (typeof idValue === 'string') {
        idValue = idValue.replace(' ', WHITESPACE_VALUE);
    }
    return (React__namespace.createElement(Field.View, { ...rest, role: role, id: `${groupId}-panel-${idValue}`, "aria-labelledby": `${groupId}-tab-${idValue}`, className: ui.classNames(ui.ComponentClassName.TabsPanel, ui.classNameModifierByFlag(ui.ComponentClassName.TabsPanel, 'active', activeTab === value), className), ref: ref }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabPanel = Field.primitiveWithForwardRef(TabPanelPrimitive);
TabPanel.displayName = 'Tabs.Panel';

const TabsContainerPrimitive = ({ children, defaultValue, className, value: controlledValue, onValueChange, isLazy, ...rest }, ref) => {
    const groupId = useStableId(); // groupId is used to ensure uniqueness between Tab Groups in IDs
    const isControlled = controlledValue !== undefined;
    const [localValue, setLocalValue] = React__namespace.useState(() => isControlled ? controlledValue : defaultValue);
    const activeTab = isControlled ? controlledValue : localValue ?? '';
    const setActiveTab = React__namespace.useCallback((newValue) => {
        if (ui.isFunction(onValueChange)) {
            onValueChange(newValue);
        }
        if (!isControlled) {
            setLocalValue(newValue);
        }
    }, [onValueChange, isControlled]);
    const _value = React__namespace.useMemo(() => {
        return {
            activeTab,
            isLazy,
            setActiveTab,
            groupId,
        };
    }, [activeTab, setActiveTab, isLazy, groupId]);
    return (React__namespace.createElement(TabsContext.Provider, { value: _value },
        React__namespace.createElement(Field.View, { ...rest, ref: ref, className: ui.classNames(className, ui.ComponentClassName.Tabs) }, children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const TabsContainer = Field.primitiveWithForwardRef(TabsContainerPrimitive);
TabsContainer.displayName = 'Tabs.Container';

const TabsPrimitive = ({ items, indicatorPosition, justifyContent, spacing, ...rest }, ref) => {
    return (React__namespace.createElement(TabsContainer, { ...rest, ref: ref },
        React__namespace.createElement(TabList, { indicatorPosition: indicatorPosition, justifyContent: justifyContent, spacing: spacing }, items?.map(({ value, label, content, ...rest }) => (React__namespace.createElement(TabsItem, { ...rest, key: value, value: value }, label)))),
        items?.map(({ value, content, isDisabled }) => (React__namespace.createElement(TabPanel, { key: value, value: value, isDisabled: isDisabled }, content)))));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/tabs)
 */
const Tabs = Object.assign(Field.primitiveWithForwardRef(TabsPrimitive), {
    Item: TabsItem,
    List: TabList,
    Panel: TabPanel,
    Container: TabsContainer,
});
Tabs.displayName = 'Tabs';

const TextAreaPrimitive = ({ className, isDisabled, isReadOnly, isRequired, size, hasError = false, variation, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Textarea, ui.ComponentClassName.FieldGroupControl, ui.classNameModifier(ui.ComponentClassName.Textarea, variation), ui.classNameModifier(ui.ComponentClassName.Textarea, size), ui.classNameModifierByFlag(ui.ComponentClassName.Textarea, 'error', hasError), className);
    const { isFieldsetDisabled } = Field.useFieldset();
    return (React__namespace.createElement(Field.View, { "aria-invalid": hasError, as: "textarea", className: componentClasses, disabled: isFieldsetDisabled ? isFieldsetDisabled : isDisabled, readOnly: isReadOnly, ref: ref, required: isRequired, ...rest }));
};
const TextArea = Field.primitiveWithForwardRef(TextAreaPrimitive);
TextArea.displayName = 'TextArea';

// Updates the height of a <textarea> when the value changes.
const useAutoresizeTextArea = (textAreaRef, value) => {
    React.useEffect(() => {
        const resizeTextArea = () => {
            if (textAreaRef && value) {
                // We need to reset the height momentarily to get the correct scrollHeight for the textarea
                textAreaRef.style.height = 'auto';
                const { scrollHeight } = textAreaRef;
                // We then set the height directly, outside of the render loop
                // Trying to set this with state or a ref will product an incorrect value.
                textAreaRef.style.height = `${scrollHeight}px`;
            }
        };
        resizeTextArea();
        window.addEventListener('resize', resizeTextArea);
        return () => {
            window.removeEventListener('resize', resizeTextArea);
        };
    }, [
        textAreaRef,
        // Trigger the effect if the value changes
        value,
    ]);
};

const AutoresizeTextAreaPrimitive = ({ value, ...rest }, externalRef) => {
    const internalRef = React__namespace.useRef(null);
    useAutoresizeTextArea(internalRef.current, value);
    const composedRef = useComposeRefsCallback({
        externalRef,
        internalRef,
    });
    return React__namespace.createElement(TextArea, { ...rest, ref: composedRef, value: value });
};
const AutoresizeTextArea = Field.primitiveWithForwardRef(AutoresizeTextAreaPrimitive);
AutoresizeTextArea.displayName = 'AutoresizeTextArea';

const DEFAULT_ROW_COUNT = 3;
const TextAreaFieldPrimitive = (props, ref) => {
    const { className, descriptiveText, errorMessage, hasError = false, id, label, labelHidden = false, rows, size, testId, inputStyles, autoResize, 
    // Destructuring the 'resize' style prop because while it is a style prop
    // it should go on the textarea element and not the wrapper div.
    resize, ..._rest } = props;
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
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), ui.ComponentClassName.TextAreaField, className), testId: testId, ...styleProps },
        React__namespace.createElement(Field.Label, { htmlFor: fieldId, visuallyHidden: labelHidden }, label),
        React__namespace.createElement(Field.FieldDescription, { id: descriptionId, labelHidden: labelHidden, descriptiveText: descriptiveText }),
        autoResize ? (React__namespace.createElement(AutoresizeTextArea, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, rows: rows ?? DEFAULT_ROW_COUNT, size: size, resize: resize, ...rest, ...inputStyles })) : (React__namespace.createElement(TextArea, { "aria-describedby": ariaDescribedBy, hasError: hasError, id: fieldId, ref: ref, rows: rows ?? DEFAULT_ROW_COUNT, size: size, resize: resize, ...rest, ...inputStyles })),
        React__namespace.createElement(Field.FieldErrorMessage, { id: errorId, hasError: hasError, errorMessage: errorMessage })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/textareafield)
 */
const TextAreaField = Field.primitiveWithForwardRef(TextAreaFieldPrimitive);
TextAreaField.displayName = 'TextAreaField';

const useToggleButton = ({ isPressed, defaultPressed, onClick, onChange, value, }) => {
    const isControlled = isPressed !== undefined;
    // Maintain internal selected state for uncontrolled component
    const [pressed, setPressed] = React__namespace.useState(defaultPressed);
    isPressed = isControlled ? isPressed : pressed;
    const handleClick = React__namespace.useCallback((event) => {
        if (ui.isFunction(onClick)) {
            onClick(event);
        }
        if (!isControlled) {
            setPressed(!pressed);
        }
        if (isControlled && ui.isFunction(onChange)) {
            onChange(value);
        }
    }, [isControlled, onClick, onChange, pressed, value]);
    return { isPressed, handleClick };
};

const ToggleButtonPrimitive = ({ className, children, defaultPressed = false, isDisabled, isPressed: isPressedProp, onChange, onClick, size, value, variation, ...rest }, ref) => {
    const { isPressed, handleClick } = useToggleButton({
        isPressed: isPressedProp,
        defaultPressed,
        onChange,
        onClick,
        value,
    });
    const componentClasses = ui.classNames(ui.ComponentClassName.ToggleButton, ui.classNameModifier(ui.ComponentClassName.ToggleButton, variation), ui.classNameModifierByFlag(ui.ComponentClassName.ToggleButton, 'pressed', isPressed), className);
    return (React__namespace.createElement(Field.Button, { "aria-pressed": isPressed, className: componentClasses, isDisabled: isDisabled, onClick: handleClick, ref: ref, size: size, type: "button", variation: variation, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/togglebutton)
 */
const ToggleButton = Field.primitiveWithForwardRef(ToggleButtonPrimitive);
ToggleButton.displayName = 'ToggleButton';

const useToggleButtonGroup = ({ onChange, value, isExclusive = false, isSelectionRequired = false, }) => {
    // Multiple selection
    const handleChange = React__namespace.useCallback((buttonValue) => {
        if (!ui.isFunction(onChange) || !Array.isArray(value)) {
            return;
        }
        const index = ui.isString(buttonValue) ? value.indexOf(buttonValue) : -1;
        let newValue;
        const shouldToggleOff = index >= 0;
        if (shouldToggleOff) {
            // Toggle off
            newValue = [...value];
            if (!isSelectionRequired || newValue.length > 1) {
                newValue.splice(index, 1);
            }
        }
        else {
            // Toggle on
            newValue = [...value, buttonValue];
        }
        onChange(newValue);
    }, [onChange, value, isSelectionRequired]);
    // Exclusive selection
    const handleExclusiveChange = React__namespace.useCallback((buttonValue) => {
        if (!ui.isFunction(onChange)) {
            return;
        }
        onChange(value === buttonValue && !isSelectionRequired ? undefined : buttonValue);
    }, [onChange, value, isSelectionRequired]);
    return isExclusive ? handleExclusiveChange : handleChange;
};

const ToggleButtonGroupPrimitive = ({ children, className, isExclusive, isSelectionRequired, onChange, size, value, variation, ...rest }, ref) => {
    const handleChange = useToggleButtonGroup({
        onChange,
        value,
        isExclusive,
        isSelectionRequired,
    });
    return (React__namespace.createElement(Field.Flex, { className: ui.classNames(ui.ComponentClassName.ToggleButtonGroup, className), ref: ref, role: "group", ...rest }, React__namespace.Children.map(children, (child) => {
        if (React__namespace.isValidElement(child)) {
            return React__namespace.cloneElement(child, {
                isPressed: isExclusive
                    ? value === child.props.value
                    : ui.isString(child.props.value) &&
                        value.includes(child.props.value),
                onChange: handleChange,
                size,
                variation,
            });
        }
        return child;
    })));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/togglebutton#togglebuttongroup)
 */
const ToggleButtonGroup = Field.primitiveWithForwardRef(ToggleButtonGroupPrimitive);
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IconsProvider: IconsProvider,
    Alert: Alert,
    Autocomplete: Autocomplete,
    Avatar: Avatar,
    Badge: Badge,
    Breadcrumbs: Breadcrumbs,
    Button: Field.Button,
    ButtonGroup: ButtonGroup,
    Card: Card,
    CheckboxField: CheckboxField,
    Collection: Collection,
    Divider: Divider,
    DropZone: DropZone,
    Accordion: Accordion,
    FieldGroupIcon: Field.FieldGroupIcon,
    FieldGroupIconButton: Field.FieldGroupIconButton,
    Fieldset: Fieldset,
    Flex: Field.Flex,
    Grid: Grid,
    Heading: Heading,
    HighlightMatch: HighlightMatch,
    Icon: Field.Icon,
    Image: Image,
    Input: Input,
    Label: Field.Label,
    Link: Link,
    Loader: Field.Loader,
    Menu: Menu,
    MenuButton: MenuButton,
    MenuItem: MenuItem,
    Message: Message,
    Pagination: Pagination,
    PasswordField: PasswordField,
    PhoneNumberField: PhoneNumberField,
    Placeholder: Placeholder,
    Radio: Radio,
    RadioGroupField: RadioGroupField,
    Rating: Rating,
    ScrollView: ScrollView,
    SearchField: SearchField,
    SelectField: SelectField,
    SliderField: SliderField,
    StepperField: StepperField,
    SwitchField: SwitchField,
    Tabs: Tabs,
    Text: Field.Text,
    TextAreaField: TextAreaField,
    TextField: TextField,
    ToggleButton: ToggleButton,
    ToggleButtonGroup: ToggleButtonGroup,
    View: Field.View,
    VisuallyHidden: VisuallyHidden,
    Table: Table,
    TableBody: TableBody,
    TableCell: TableCell,
    TableFoot: TableFoot,
    TableHead: TableHead,
    TableRow: TableRow,
    usePagination: usePagination,
    ComponentPropsToStylePropsMap: Field.ComponentPropsToStylePropsMap,
    ComponentPropsToStylePropsMapKeys: Field.ComponentPropsToStylePropsMapKeys
});

var ComponentClassName;
(function (ComponentClassName) {
    ComponentClassName["ChangePassword"] = "amplify-accountsettings-changepassword";
    ComponentClassName["DeleteUser"] = "amplify-accountsettings-deleteuser";
})(ComponentClassName || (ComponentClassName = {}));

const ValidationErrors = ({ errors, id, dataAttr, }) => {
    if (!(errors?.length > 0))
        return null;
    const dataAttrProp = dataAttr ? { [dataAttr]: true } : {};
    return (React__default["default"].createElement(Field.View, { ...dataAttrProp, id: id }, errors.map((error) => {
        return (React__default["default"].createElement(Field.Text, { key: error, role: "alert", variation: "error" }, ui.translate(error)));
    })));
};

const DefaultErrorMessage = (props) => {
    return React__default["default"].createElement(Alert, { variation: "error", ...props });
};

const DefaultPasswordField = ({ fieldValidationErrors, label, ...rest }) => {
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(PasswordField, { ...rest, label: label }),
        fieldValidationErrors ? (React__default["default"].createElement(ValidationErrors, { errors: fieldValidationErrors })) : null));
};
const DEFAULTS$1 = {
    CurrentPasswordField: DefaultPasswordField,
    NewPasswordField: DefaultPasswordField,
    ConfirmPasswordField: DefaultPasswordField,
    SubmitButton: Field.Button,
    ErrorMessage: DefaultErrorMessage,
};

const defaultChangePasswordDisplayText = {
    confirmPasswordFieldLabel: 'Confirm Password',
    currentPasswordFieldLabel: 'Current Password',
    newPasswordFieldLabel: 'New Password',
    updatePasswordButtonText: 'Update password',
};
const defaultDeleteUserDisplayText = {
    cancelButtonText: 'Cancel',
    confirmDeleteButtonText: 'Delete',
    deleteAccountButtonText: 'Delete Account',
    warningText: 'Deleting your account is not reversible. You will lose access to your account and all data associated with it.',
};

const VERSION = '6.5.0';

const logger$2 = ui.getLogger('AccountSettings');
const getIsDisabled = (formValues, validationError) => {
    const { currentPassword, newPassword, confirmPassword } = formValues;
    const hasEmptyField = !currentPassword || !newPassword || !confirmPassword;
    if (hasEmptyField) {
        return true;
    }
    const arePasswordsInvalid = validationError.newPassword?.length > 0 ||
        validationError.confirmPassword?.length > 0;
    return arePasswordsInvalid;
};
function ChangePassword({ components, displayText: overrideDisplayText, onError, onSuccess, validators, }) {
    const [errorMessage, setErrorMessage] = React__default["default"].useState(null);
    const [formValues, setFormValues] = React__default["default"].useState({});
    const [validationError, setValidationError] = React__default["default"].useState({});
    const blurredFields = React__default["default"].useRef([]);
    const { user, isLoading } = Field.useAuth();
    const isDisabled = getIsDisabled(formValues, validationError);
    const passwordValidators = React__default["default"].useMemo(() => {
        return validators ?? ui.getDefaultPasswordValidators();
    }, [validators]);
    uiReactCore.useSetUserAgent({
        componentName: 'ChangePassword',
        packageName: 'react',
        version: VERSION,
    });
    /*
     * Note that formValues and other states are passed in as props so that
     * it does not depend on whether or not those states have been updated yet
     */
    const validateNewPassword = React__default["default"].useCallback(({ formValues, eventType }) => {
        const { newPassword } = formValues;
        const hasBlurred = blurredFields.current.includes('newPassword');
        return ui.runFieldValidators({
            value: newPassword,
            validators: passwordValidators,
            eventType,
            hasBlurred,
        });
    }, [passwordValidators]);
    const validateConfirmPassword = React__default["default"].useCallback(({ formValues, eventType }) => {
        const { newPassword, confirmPassword } = formValues;
        const hasBlurred = blurredFields.current.includes('confirmPassword');
        const confirmPasswordValidators = ui.getDefaultConfirmPasswordValidators(newPassword);
        return ui.runFieldValidators({
            value: confirmPassword,
            validators: confirmPasswordValidators,
            eventType,
            hasBlurred,
        });
    }, []);
    const runValidation = React__default["default"].useCallback((param) => {
        const passwordErrors = validateNewPassword(param);
        const confirmPasswordErrors = validateConfirmPassword(param);
        const newValidationError = {
            newPassword: passwordErrors,
            confirmPassword: confirmPasswordErrors,
        };
        // only re-render if errors have changed
        if (!isEqual__default["default"](validationError, newValidationError)) {
            setValidationError(newValidationError);
        }
    }, [validateConfirmPassword, validateNewPassword, validationError]);
    /* Translations */
    const displayText = {
        ...defaultChangePasswordDisplayText,
        ...overrideDisplayText,
    };
    const { confirmPasswordFieldLabel, currentPasswordFieldLabel, newPasswordFieldLabel, updatePasswordButtonText, } = displayText;
    /* Subcomponents */
    const { CurrentPasswordField, NewPasswordField, ConfirmPasswordField, SubmitButton, ErrorMessage, } = React__default["default"].useMemo(() => ({ ...DEFAULTS$1, ...(components ?? {}) }), [components]);
    /* Event Handlers */
    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const newFormValues = { ...formValues, [name]: value };
        runValidation({ formValues: newFormValues, eventType: 'change' });
        setFormValues(newFormValues);
    };
    const handleBlur = (event) => {
        event.preventDefault();
        const { name } = event.target;
        // only update state and run validation if this is the first time blurring the field
        if (!blurredFields.current.includes(name)) {
            const newBlurredFields = [...blurredFields.current, name];
            blurredFields.current = newBlurredFields;
            runValidation({ formValues, eventType: 'blur' });
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user) {
            return;
        }
        const { currentPassword, newPassword } = formValues;
        if (errorMessage) {
            setErrorMessage(null);
        }
        ui.changePassword({ currentPassword, newPassword })
            .then(() => {
            // notify success to the parent
            onSuccess?.();
        })
            .catch((e) => {
            const error = e;
            if (error.message)
                setErrorMessage(error.message);
            onError?.(error); // notify error to the parent
        });
    };
    // Return null if Auth.getgetCurrentUser is still in progress
    if (isLoading) {
        return null;
    }
    // Return null if user isn't authenticated in the first place
    if (!user) {
        logger$2.warn('<ChangePassword /> requires user to be authenticated.');
        return null;
    }
    return (React__default["default"].createElement(Field.View, { as: "form", className: ComponentClassName.ChangePassword, onSubmit: handleSubmit },
        React__default["default"].createElement(Field.Flex, { direction: "column" },
            React__default["default"].createElement(CurrentPasswordField, { autoComplete: "current-password", isRequired: true, label: currentPasswordFieldLabel, name: "currentPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default["default"].createElement(NewPasswordField, { autoComplete: "new-password", fieldValidationErrors: validationError?.newPassword, isRequired: true, label: newPasswordFieldLabel, name: "newPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default["default"].createElement(ConfirmPasswordField, { autoComplete: "new-password", fieldValidationErrors: validationError?.confirmPassword, isRequired: true, label: confirmPasswordFieldLabel, name: "confirmPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default["default"].createElement(SubmitButton, { isDisabled: isDisabled, type: "submit" }, updatePasswordButtonText),
            errorMessage ? React__default["default"].createElement(ErrorMessage, null, errorMessage) : null)));
}
ChangePassword.CurrentPasswordField = DEFAULTS$1.CurrentPasswordField;
ChangePassword.NewPasswordField = DEFAULTS$1.NewPasswordField;
ChangePassword.ConfirmPasswordField = DEFAULTS$1.ConfirmPasswordField;
ChangePassword.SubmitButton = DEFAULTS$1.SubmitButton;
ChangePassword.ErrorMessage = DEFAULTS$1.ErrorMessage;

const DefaultWarningView = ({ displayText: overrideDisplayText, isDisabled, onCancel, onConfirm, }) => {
    // translations
    const displayText = {
        ...defaultDeleteUserDisplayText,
        ...overrideDisplayText,
    };
    const { cancelButtonText, confirmDeleteButtonText, warningText } = displayText;
    return (React__default["default"].createElement(Card, null,
        React__default["default"].createElement(Field.Flex, { direction: "column" },
            React__default["default"].createElement(Field.Text, { color: "font.error" }, warningText),
            React__default["default"].createElement(Field.Flex, null,
                React__default["default"].createElement(Field.Button, { variation: "link", onClick: onCancel, isDisabled: isDisabled }, cancelButtonText),
                React__default["default"].createElement(Field.Button, { variation: "destructive", onClick: onConfirm, isDisabled: isDisabled }, confirmDeleteButtonText)))));
};
const DefaultDeleteButton = (props) => (React__default["default"].createElement(Field.Button, { ...props, variation: "warning" }));
const DEFAULTS = {
    ErrorMessage: DefaultErrorMessage,
    DeleteButton: DefaultDeleteButton,
    WarningView: DefaultWarningView,
};

const logger$1 = ui.getLogger('AccountSettings');
function DeleteUser({ components, displayText: overrideDisplayText, handleDelete, onError, onSuccess, }) {
    const [state, setState] = React__default["default"].useState('IDLE');
    const [errorMessage, setErrorMessage] = React__default["default"].useState(null);
    uiReactCore.useSetUserAgent({
        componentName: 'DeleteUser',
        packageName: 'react',
        version: VERSION,
    });
    // translations
    const displayText = {
        ...defaultDeleteUserDisplayText,
        ...overrideDisplayText,
    };
    const { deleteAccountButtonText } = displayText;
    const { user, isLoading } = Field.useAuth();
    // subcomponents
    const { ErrorMessage, DeleteButton, WarningView } = React__default["default"].useMemo(() => ({ ...DEFAULTS, ...(components ?? {}) }), [components]);
    const startConfirmation = (event) => {
        event.preventDefault();
        setState('CONFIRMATION');
    };
    const runDeleteUser = React__default["default"].useCallback(async () => {
        if (!user) {
            return;
        }
        setState('DELETING');
        if (errorMessage) {
            setErrorMessage(null);
        }
        try {
            if (handleDelete) {
                /*
                 * run custom delete handler, if provided. We pass `user` so that
                 * developer can do whichever cleanup with the user object they wish.
                 */
                await handleDelete(user);
            }
            else {
                // else, run default deleteUser function.
                await ui.deleteUser();
            }
            setState('DONE');
            onSuccess?.();
        }
        catch (e) {
            const error = e;
            setState('ERROR');
            setErrorMessage(error.message);
            onError?.(error);
        }
    }, [errorMessage, handleDelete, onError, onSuccess, user]);
    // called when end user cancels account deletion confirmation
    const handleCancel = React__default["default"].useCallback(() => {
        setState('IDLE');
    }, []);
    const handleConfirmDelete = React__default["default"].useCallback(() => {
        runDeleteUser();
    }, [runDeleteUser]);
    // Return null if Auth.getgetCurrentUser is still in progress
    if (isLoading) {
        return null;
    }
    // Return null if user isn't authenticated
    if (!user) {
        logger$1.warn('<DeleteUser /> requires user to be authenticated.');
        return null;
    }
    // Return null if delete user was successful
    if (state === 'DONE') {
        return null;
    }
    return (React__default["default"].createElement(Field.Flex, { className: ComponentClassName.DeleteUser, direction: "column" },
        React__default["default"].createElement(DeleteButton, { isDisabled: state === 'CONFIRMATION' || state === 'DELETING', onClick: startConfirmation }, deleteAccountButtonText),
        state === 'CONFIRMATION' || state === 'DELETING' ? (React__default["default"].createElement(WarningView, { displayText: displayText, isDisabled: state === 'DELETING', onCancel: handleCancel, onConfirm: handleConfirmDelete })) : null,
        errorMessage ? React__default["default"].createElement(ErrorMessage, null, errorMessage) : null));
}
DeleteUser.ErrorMessage = DEFAULTS.ErrorMessage;
DeleteUser.DeleteButton = DEFAULTS.DeleteButton;
DeleteUser.WarningView = DEFAULTS.WarningView;

var AccountSettings = { ChangePassword, DeleteUser };

const CustomComponentsContext = 
// @ts-ignore
React__namespace.createContext(null);
const useCustomComponents = () => {
    const context = React__namespace.useContext(CustomComponentsContext);
    if (!context) {
        throw new Error('`useCustomComponents` cannot be used outside of a `CustomComponentsContext.Provider`');
    }
    return context;
};

// TODO replace usage of this util with the `isSignInOrSignUpRoute` util in v3.
// Currently `hasTabs` always returns `undefined` as the right condition always
// resolves to truthy. This prevents the "data-amplify-router-content" attribute
// from being applied below. Fixing it will cause consumer snapshot tests to break,
// so wait to update.
const hasTabs = (route) => {
    return route === 'signIn' || 'signUp';
};
function RouteContainer({ children, className, variation = 'default', }) {
    const { route } = uiReactCore.useAuthenticator(({ route }) => [route]);
    const { 
    // @ts-ignore
    components: { Header, Footer }, } = useCustomComponents();
    return (React__default["default"].createElement(Field.View, { className: className, "data-amplify-authenticator": "", "data-variation": variation },
        React__default["default"].createElement(Field.View, { "data-amplify-container": "" },
            React__default["default"].createElement(Header, null),
            React__default["default"].createElement(Field.View, { "data-amplify-router": "", "data-amplify-router-content": hasTabs(route) ? undefined : '' }, children),
            React__default["default"].createElement(Footer, null))));
}

const getFormDataFromEvent = (event) => {
    const formData = new FormData(event.target);
    return Object.fromEntries(formData);
};

function useFormHandlers() {
    const { submitForm, updateBlur, updateForm } = uiReactCore.useAuthenticator((context) => [
        context.submitForm,
        context.updateBlur,
        context.updateForm,
    ]);
    const handleBlur = React.useCallback(({ target: { name } }) => {
        updateBlur({ name });
    }, [updateBlur]);
    // @TODO: align multiple input type handling with react docs example for 3.0 release
    // example: https://reactjs.org/docs/forms.html#handling-multiple-inputs
    const handleChange = React.useCallback(({ target: { checked, name, type, value }, }) => {
        const isUncheckedCheckbox = type === 'checkbox' && !checked;
        updateForm({
            name,
            value: isUncheckedCheckbox ? undefined : value,
        });
    }, [updateForm]);
    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        submitForm(getFormDataFromEvent(event));
    }, [submitForm]);
    return { handleBlur, handleChange, handleSubmit };
}

const RemoteErrorMessage = () => {
    const { error } = uiReactCore.useAuthenticator((context) => [context.error]);
    return (React__default["default"].createElement(React__default["default"].Fragment, null, error ? (React__default["default"].createElement(Alert, { variation: "error", isDismissible: true }, ui.translate(error))) : null));
};

function FormField({ autocomplete: autoComplete, dialCode, name, type, ...props }) {
    const { validationErrors } = uiReactCore.useAuthenticator(({ validationErrors }) => [
        validationErrors,
    ]);
    const errors = React__namespace.useMemo(() => ui.getErrors(validationErrors[name]), [name, validationErrors]);
    const hasError = errors?.length > 0;
    const errorId = useStableId();
    const ariaDescribedBy = hasError ? errorId : undefined;
    if (type === 'tel') {
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(PhoneNumberField, { ...props, name: name, defaultDialCode: dialCode, dialCodeName: "country_code", autoComplete: autoComplete, hasError: hasError, "aria-describedby": ariaDescribedBy }),
            React__namespace.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
    else if (type === 'password') {
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(PasswordField, { ...props, name: name, autoCapitalize: "off", autoComplete: autoComplete, hasError: hasError, "aria-describedby": ariaDescribedBy }),
            React__namespace.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
    else {
        return (React__namespace.createElement(React__namespace.Fragment, null,
            React__namespace.createElement(TextField, { ...props, name: name, autoCapitalize: "off", autoComplete: autoComplete, hasError: hasError, type: type, "aria-describedby": ariaDescribedBy }),
            React__namespace.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
}

function FormFields() {
    const { fields } = uiReactCore.useAuthenticator(({ route }) => [route]);
    const formFields = React__namespace.useRef(fields.map((field, index) => (React__namespace.createElement(FormField
    // use index for key, field order is static
    , { 
        // use index for key, field order is static
        key: index, ...field })))).current;
    return React__namespace.createElement(React__namespace.Fragment, null, formFields);
}

const { getDeliveryMessageText, getDeliveryMethodText, getConfirmingText: getConfirmingText$1, getConfirmText: getConfirmText$1, getResendCodeText: getResendCodeText$1, } = ui.authenticatorTextUtil;
function ConfirmSignUp({ className, variation, }) {
    const { isPending, resendCode, codeDeliveryDetails } = uiReactCore.useAuthenticator((context) => [
        context.isPending,
        context.resendCode,
        context.codeDeliveryDetails,
    ]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ConfirmSignUp: { Header = ConfirmSignUp.Header, Footer = ConfirmSignUp.Footer, }, }, } = useCustomComponents();
    return (
    // TODO Automatically add these namespaces again from `useAmplify`
    React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-confirmsignup": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(Field.Text, { className: "amplify-authenticator__subtitle" }, getDeliveryMessageText(codeDeliveryDetails)),
                    React__default["default"].createElement(FormFields, null),
                    React__default["default"].createElement(RemoteErrorMessage, null),
                    React__default["default"].createElement(Field.Button, { variation: "primary", isDisabled: isPending, type: "submit", loadingText: getConfirmingText$1(), isLoading: isPending }, getConfirmText$1()),
                    React__default["default"].createElement(Field.Button, { onClick: resendCode, type: "button" }, getResendCodeText$1())),
                React__default["default"].createElement(Footer, null)))));
}
const DefaultHeader = () => {
    const { codeDeliveryDetails } = uiReactCore.useAuthenticator((context) => [
        context.codeDeliveryDetails,
    ]);
    return (React__default["default"].createElement(Heading, { level: 4 }, getDeliveryMethodText(codeDeliveryDetails)));
};
ConfirmSignUp.Header = DefaultHeader;
ConfirmSignUp.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getChangePasswordText, getChangingText, getBackToSignInText: getBackToSignInText$2 } = ui.authenticatorTextUtil;
const ForceNewPassword = ({ className, variation, }) => {
    const { isPending, toSignIn } = uiReactCore.useAuthenticator((context) => [
        context.isPending,
        context.toSignIn,
    ]);
    const { handleBlur, handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ForceNewPassword: { FormFields = ForceNewPassword.FormFields, Header = ForceNewPassword.Header, Footer = ForceNewPassword.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-forcenewpassword": "", method: "post", onChange: handleChange, onSubmit: handleSubmit, onBlur: handleBlur },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(FormFields, null),
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(Field.Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getChangingText() }, getChangePasswordText()),
                React__default["default"].createElement(Field.Button, { onClick: toSignIn, type: "button", variation: "link", size: "small" }, getBackToSignInText$2()),
                React__default["default"].createElement(Footer, null)))));
};
ForceNewPassword.FormFields = function FormFields$1() {
    return React__default["default"].createElement(FormFields, null);
};
ForceNewPassword.Header = function Header() {
    return React__default["default"].createElement(Heading, { level: 4 }, getChangePasswordText());
};
ForceNewPassword.Footer = function Footer() {
    return null;
};

const { getConfirmText, getConfirmingText, getBackToSignInText: getBackToSignInText$1 } = ui.authenticatorTextUtil;
const ConfirmSignInFooter = () => {
    const { isPending, toSignIn } = uiReactCore.useAuthenticator((context) => [
        context.isPending,
        context.toSignIn,
    ]);
    return (React__default["default"].createElement(Field.Flex, { direction: "column" },
        React__default["default"].createElement(Field.Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getConfirmingText() }, getConfirmText()),
        React__default["default"].createElement(Field.Button, { onClick: toSignIn, type: "button", variation: "link", size: "small" }, getBackToSignInText$1())));
};

const logger = new utils.ConsoleLogger('SetupTotp-logger');
const { getSetupTotpText, getCopiedText, getLoadingText } = ui.authenticatorTextUtil;
const SetupTotp = ({ className, variation, }) => {
    const { totpSecretCode, isPending, username, QRFields } = uiReactCore.useAuthenticator((context) => [context.isPending, context.totpSecretCode, context.username]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SetupTotp: { Header = SetupTotp.Header, Footer = SetupTotp.Footer }, }, } = useCustomComponents();
    const [isLoading, setIsLoading] = React__namespace.useState(true);
    const [qrCode, setQrCode] = React__namespace.useState();
    const [copyTextLabel, setCopyTextLabel] = React__namespace.useState('COPY');
    const { totpIssuer = 'AWSCognito', totpUsername = username } = QRFields ?? {};
    const generateQRCode = React__namespace.useCallback(async () => {
        try {
            const totpCode = ui.getTotpCodeURL(totpIssuer, totpUsername, totpSecretCode);
            const qrCodeImageSource = await QRCode__default["default"].toDataURL(totpCode);
            setQrCode(qrCodeImageSource);
        }
        catch (error) {
            logger.error(error);
        }
        finally {
            setIsLoading(false);
        }
    }, [totpIssuer, totpUsername, totpSecretCode]);
    React__namespace.useEffect(() => {
        if (!qrCode) {
            generateQRCode();
        }
    }, [generateQRCode, qrCode]);
    const copyText = () => {
        navigator.clipboard.writeText(totpSecretCode);
        setCopyTextLabel(getCopiedText());
    };
    return (React__namespace.createElement(RouteContainer, { className: className, variation: variation },
        React__namespace.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-setup-totp": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__namespace.createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__namespace.createElement(Header, null),
                React__namespace.createElement(Field.Flex, { direction: "column" },
                    isLoading ? (React__namespace.createElement("p", null,
                        getLoadingText(),
                        "\u2026")) : (React__namespace.createElement("img", { "data-amplify-qrcode": true, src: qrCode, alt: "qr code", width: "228", height: "228" })),
                    React__namespace.createElement(Field.Flex, { "data-amplify-copy": true },
                        React__namespace.createElement("div", null, totpSecretCode),
                        React__namespace.createElement(Field.Flex, { "data-amplify-copy-svg": true, onClick: copyText },
                            React__namespace.createElement("div", { "data-amplify-copy-tooltip": true }, copyTextLabel),
                            React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
                                React__namespace.createElement("path", { d: "M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z" })))),
                    React__namespace.createElement(FormFields, null),
                    React__namespace.createElement(RemoteErrorMessage, null)),
                React__namespace.createElement(ConfirmSignInFooter, null),
                React__namespace.createElement(Footer, null)))));
};
SetupTotp.Header = function Header() {
    return React__namespace.createElement(Heading, { level: 3 }, getSetupTotpText());
};
SetupTotp.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getSubmitText, getSubmittingText } = ui.authenticatorTextUtil;
const TwoButtonSubmitFooter = (props) => {
    const { cancelButtonSendType, cancelButtonText, submitButtonText } = props;
    const { isPending, resendCode, skipVerification, toSignIn } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const onClick = () => {
        switch (cancelButtonSendType) {
            case 'SKIP':
                skipVerification();
                break;
            case 'RESEND':
                resendCode();
                break;
            case 'SIGN_IN':
                toSignIn();
                break;
            default:
                return;
        }
    };
    const defaultSubmitText = isPending ? (React__default["default"].createElement(React__default["default"].Fragment, null,
        getSubmittingText(),
        "\u2026")) : (React__default["default"].createElement(React__default["default"].Fragment, null, getSubmitText()));
    const submitText = submitButtonText ?? defaultSubmitText;
    return (React__default["default"].createElement(Field.Flex, { direction: "column" },
        React__default["default"].createElement(Field.Button, { variation: "primary", isDisabled: isPending, type: "submit" }, submitText),
        React__default["default"].createElement(Field.Flex, { direction: "column", alignItems: "center" },
            React__default["default"].createElement(Field.Button, { onClick: onClick, type: "button", variation: "link", size: "small" }, cancelButtonText))));
};

const AppleIcon = () => {
    return (React__default["default"].createElement("svg", { "aria-label": "Apple icon", className: "amplify-icon federated-sign-in-icon", fill: "#000", preserveAspectRatio: "xMidYMid", stroke: "#000", strokeWidth: "0", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg" },
        React__default["default"].createElement("path", { d: "M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" })));
};
const GoogleIcon = () => {
    return (React__default["default"].createElement("svg", { "aria-label": "Google icon", className: "amplify-icon federated-sign-in-icon", viewBox: "0 0 256 262", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" },
        React__default["default"].createElement("path", { d: "M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027", fill: "#4285F4" }),
        React__default["default"].createElement("path", { d: "M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1", fill: "#34A853" }),
        React__default["default"].createElement("path", { d: "M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782", fill: "#FBBC05" }),
        React__default["default"].createElement("path", { d: "M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251", fill: "#EB4335" })));
};
const FacebookIcon = () => {
    return (React__default["default"].createElement(Field.Icon, { className: "federated-sign-in-icon", ariaLabel: "Facebook icon", viewBox: { minX: 0, minY: 0, width: 279, height: 538 }, pathData: "M82.3409742,538 L82.3409742,292.936652 L0,292.936652 L0,196.990154 L82.2410458,196.990154 L82.2410458,126.4295 C82.2410458,44.575144 132.205229,0 205.252865,0 C240.227794,0 270.306232,2.59855099 279,3.79788222 L279,89.2502322 L228.536175,89.2502322 C188.964542,89.2502322 181.270057,108.139699 181.270057,135.824262 L181.270057,196.89021 L276.202006,196.89021 L263.810888,292.836708 L181.16913,292.836708 L181.16913,538 L82.3409742,538 Z", fill: "#1877F2" }));
};
const AmazonIcon = () => {
    return (React__default["default"].createElement("svg", { "aria-label": "Amazon icon", className: "amplify-icon federated-sign-in-icon", viewBox: "0 0 243 264", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" },
        React__default["default"].createElement("path", { d: "M230.826 208.039C227.468 203.683 208.551 205.982 200.056 206.998C197.471 207.321 197.076 205.042 199.407 203.405C214.475 192.665 239.201 195.766 242.082 199.364C244.966 202.982 241.337 228.071 227.173 240.049C225.001 241.888 222.93 240.904 223.898 238.468C227.077 230.431 234.205 212.419 230.826 208.039ZM123.769 264C71.0234 264 39.0764 241.955 14.7853 217.542C9.97339 212.706 3.71799 206.296 0.311513 200.691C-1.09773 198.372 2.59096 195.022 5.04421 196.844C35.239 219.268 79.1012 239.538 122.53 239.538C151.82 239.538 188.046 227.47 217.669 214.868C222.147 212.966 222.147 219.18 221.512 221.061C221.183 222.032 206.515 236.221 186.247 247.047C167.304 257.166 143.397 264 123.769 264Z", fill: "#F2541B" }),
        React__default["default"].createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M142.943 111.185C142.943 124.756 143.268 136.054 136.406 148.123C130.856 157.913 122.027 163.95 112.222 163.95C98.8288 163.95 90.9806 153.772 90.9806 138.693C90.9806 109.036 117.677 103.647 142.943 103.647V111.185ZM178.166 196.081C175.858 198.15 171.635 198.22 169.914 196.894C157.974 187.684 149.89 173.688 149.89 173.688C130.706 193.156 117.127 199 92.2879 199C62.8772 199 40 180.905 40 144.729C40 116.461 55.3552 97.2408 77.2563 87.823C96.2094 79.5256 122.684 78.0173 142.943 75.7517C142.943 75.7517 144.633 53.933 138.699 45.9806C134.098 39.8163 126.272 36.9329 119.089 36.9329C106.127 36.8829 93.61 43.9051 91.1262 57.4188C90.4136 61.2829 87.5533 64.5261 84.54 64.206L51.0823 60.5922C48.5156 60.2951 45.0381 57.6639 45.8636 53.3081C53.644 12.3684 90.7373 0 123.989 0C140.983 0 163.21 4.51651 176.608 17.3349C193.597 33.1648 191.969 54.2755 191.969 77.2722V131.51C191.969 147.835 198.768 154.987 205.151 163.775C207.376 166.953 207.886 170.714 205.04 173.032C197.902 178.999 178.166 196.081 178.166 196.081Z", fill: "#F2541B" })));
};
const FederatedSignInButton = (props) => {
    const { icon, provider, text } = props;
    const { toFederatedSignIn } = uiReactCore.useAuthenticator();
    const handleClick = (event) => {
        event.preventDefault();
        toFederatedSignIn({ provider });
    };
    let iconComponent;
    if (icon === 'facebook') {
        iconComponent = React__default["default"].createElement(FacebookIcon, null);
    }
    else if (icon === 'google') {
        iconComponent = React__default["default"].createElement(GoogleIcon, null);
    }
    else if (icon === 'amazon') {
        iconComponent = React__default["default"].createElement(AmazonIcon, null);
    }
    else if (icon === 'apple') {
        iconComponent = React__default["default"].createElement(AppleIcon, null);
    }
    return (React__default["default"].createElement(Field.Button, { onClick: handleClick, className: "federated-sign-in-button", gap: "1rem" },
        iconComponent,
        React__default["default"].createElement(Field.Text, { as: "span" }, text)));
};

const { getSignInWithFederationText, getOrText } = ui.authenticatorTextUtil;
function FederatedSignIn() {
    const { route, socialProviders } = uiReactCore.useAuthenticator(({ route, socialProviders }) => [route, socialProviders]);
    if (socialProviders.length === 0) {
        // @ts-ignore
        return null;
    }
    return (React__default["default"].createElement(Field.Flex, { direction: "column", padding: `0 0 1rem 0`, className: "federated-sign-in-container" },
        socialProviders.map((provider) => {
            switch (provider) {
                case 'amazon':
                    return (React__default["default"].createElement(FederatedSignInButton, { icon: "amazon", key: provider, provider: ui.FederatedIdentityProviders.Amazon, text: getSignInWithFederationText(route, provider) }));
                case 'apple':
                    return (React__default["default"].createElement(FederatedSignInButton, { icon: "apple", key: provider, provider: ui.FederatedIdentityProviders.Apple, text: getSignInWithFederationText(route, provider) }));
                case 'facebook':
                    return (React__default["default"].createElement(FederatedSignInButton, { icon: "facebook", key: provider, provider: ui.FederatedIdentityProviders.Facebook, text: getSignInWithFederationText(route, provider) }));
                case 'google':
                    return (React__default["default"].createElement(FederatedSignInButton, { icon: "google", key: provider, provider: ui.FederatedIdentityProviders.Google, text: getSignInWithFederationText(route, provider) }));
                default:
                    // eslint-disable-next-line no-console
                    console.error(`Authenticator does not support ${provider}. Please open an issue: https://github.com/aws-amplify/amplify-ui/issues/choose`);
            }
        }),
        React__default["default"].createElement(Divider, { size: "small", label: getOrText() })));
}

const { getSignInText, getSigningInText, getForgotPasswordText } = ui.authenticatorTextUtil;
function SignIn() {
    const { isPending } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SignIn: { Header = SignIn.Header, Footer = SignIn.Footer }, }, } = useCustomComponents();
    return (React__default["default"].createElement(Field.View, null,
        React__default["default"].createElement(Header, null),
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-signin": "", method: "post", onSubmit: handleSubmit, onChange: handleChange },
            React__default["default"].createElement(FederatedSignIn, null),
            React__default["default"].createElement(Field.Flex, { direction: "column" },
                React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                    React__default["default"].createElement(VisuallyHidden, null,
                        React__default["default"].createElement("legend", null, getSignInText())),
                    React__default["default"].createElement(FormFields, null)),
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(Field.Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getSigningInText() }, getSignInText()),
                React__default["default"].createElement(Footer, null)))));
}
const DefaultFooter = () => {
    const { toForgotPassword } = uiReactCore.useAuthenticator((context) => [
        context.toForgotPassword,
    ]);
    return (React__default["default"].createElement(Field.View, { "data-amplify-footer": "" },
        React__default["default"].createElement(Field.Button, { onClick: toForgotPassword, size: "small", variation: "link" }, getForgotPasswordText())));
};
SignIn.Footer = DefaultFooter;
SignIn.Header = function Header() {
    // @ts-ignore
    return null;
};

const { getCreateAccountText, getCreatingAccountText } = ui.authenticatorTextUtil;
function SignUp() {
    const { hasValidationErrors, isPending } = uiReactCore.useAuthenticator((context) => [
        context.hasValidationErrors,
        context.isPending,
    ]);
    const { handleChange, handleBlur, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SignUp: { Header = SignUp.Header, FormFields = SignUp.FormFields, Footer = SignUp.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(Field.View, null,
        React__default["default"].createElement(Header, null),
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-signup": "", method: "post", onChange: handleChange, onSubmit: handleSubmit, onBlur: handleBlur },
            React__default["default"].createElement(FederatedSignIn, null),
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(FormFields, null),
                    React__default["default"].createElement(RemoteErrorMessage, null)),
                React__default["default"].createElement(Field.Button, { isDisabled: hasValidationErrors || isPending, isFullWidth: true, type: "submit", variation: "primary", isLoading: isPending, loadingText: getCreatingAccountText() }, getCreateAccountText()),
                React__default["default"].createElement(Footer, null)))));
}
SignUp.Header = function Header() {
    // @ts-ignore
    return null;
};
SignUp.FormFields = function FormFields$1() {
    return React__default["default"].createElement(FormFields, null);
};
SignUp.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getSignInTabText, getSignUpTabText } = ui.authenticatorTextUtil;
const SignInSignUpTabs = ({ className, hideSignUp, variation, }) => {
    const { route, toSignIn, toSignUp } = uiReactCore.useAuthenticator((context) => [
        context.route,
        context.toSignIn,
        context.toSignUp,
    ]);
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation }, hideSignUp ? (React__default["default"].createElement(Field.View, { "data-amplify-router-content": "" }, route === 'signIn' && React__default["default"].createElement(SignIn, null))) : (React__default["default"].createElement(Tabs.Container, { value: route, isLazy: true, onValueChange: () => (route === 'signIn' ? toSignUp() : toSignIn()) },
        React__default["default"].createElement(Tabs.List, { spacing: "equal", indicatorPosition: "top" },
            React__default["default"].createElement(Tabs.Item, { value: "signIn" }, getSignInTabText()),
            React__default["default"].createElement(Tabs.Item, { value: "signUp" }, getSignUpTabText())),
        React__default["default"].createElement(Tabs.Panel, { value: "signIn", "data-amplify-router-content": "" },
            React__default["default"].createElement(SignIn, null)),
        React__default["default"].createElement(Tabs.Panel, { value: "signUp", "data-amplify-router-content": "" },
            React__default["default"].createElement(SignUp, null))))));
};

const { getAccountRecoveryInfoText: getAccountRecoveryInfoText$1, getSkipText: getSkipText$1 } = ui.authenticatorTextUtil;
const ConfirmVerifyUser = ({ className, variation, }) => {
    const { isPending } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ConfirmVerifyUser: { Header = ConfirmVerifyUser.Header, Footer = ConfirmVerifyUser.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-confirmverifyuser": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(FormFields, null)),
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(TwoButtonSubmitFooter, { cancelButtonText: getSkipText$1(), cancelButtonSendType: "SKIP" }),
                React__default["default"].createElement(Footer, null)))));
};
ConfirmVerifyUser.Header = function Header() {
    return React__default["default"].createElement(Heading, { level: 3 }, getAccountRecoveryInfoText$1());
};
ConfirmVerifyUser.Footer = function Footer() {
    return null;
};

const { getSkipText, getVerifyText, getVerifyContactText, getAccountRecoveryInfoText, } = ui.authenticatorTextUtil;
const generateRadioGroup = (attributes) => {
    return Object.entries(attributes).map(([key, value], index) => {
        const verificationType = ui.defaultFormFieldOptions[key].label;
        return (React__default["default"].createElement(Radio, { name: "unverifiedAttr", value: key, key: key, defaultChecked: index === 0 },
            ui.translate(verificationType),
            ":",
            ' ',
            ui.censorContactMethod(verificationType, value)));
    });
};
const VerifyUser = ({ className, variation, }) => {
    const { components: { 
    // @ts-ignore
    VerifyUser: { Header = VerifyUser.Header, Footer = VerifyUser.Footer }, }, } = useCustomComponents();
    const { isPending, unverifiedUserAttributes } = uiReactCore.useAuthenticator(({ isPending, unverifiedUserAttributes }) => [
        isPending,
        unverifiedUserAttributes,
    ]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const footerSubmitText = isPending ? (React__default["default"].createElement(React__default["default"].Fragment, null, "Verifying\u2026")) : (React__default["default"].createElement(React__default["default"].Fragment, null, getVerifyText()));
    const verificationRadioGroup = (React__default["default"].createElement(RadioGroupField, { legend: getVerifyContactText(), name: "verify_context", isDisabled: isPending, legendHidden: true }, generateRadioGroup(unverifiedUserAttributes)));
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-verifyuser": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                verificationRadioGroup,
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(TwoButtonSubmitFooter, { cancelButtonText: getSkipText(), cancelButtonSendType: "SKIP", submitButtonText: footerSubmitText }),
                React__default["default"].createElement(Footer, null)))));
};
VerifyUser.Header = function Header() {
    return React__default["default"].createElement(Heading, { level: 3 }, getAccountRecoveryInfoText());
};
VerifyUser.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getChallengeText } = ui.authenticatorTextUtil;
const ConfirmSignIn = ({ className, variation, }) => {
    const { isPending } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ConfirmSignIn: { Header = ConfirmSignIn.Header, Footer = ConfirmSignIn.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-confirmsignin": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(FormFields, null),
                    React__default["default"].createElement(RemoteErrorMessage, null)),
                React__default["default"].createElement(ConfirmSignInFooter, null),
                React__default["default"].createElement(Footer, null)))));
};
function Header() {
    const { challengeName } = uiReactCore.useAuthenticator(({ challengeName }) => [
        challengeName,
    ]);
    return React__default["default"].createElement(Heading, { level: 3 }, getChallengeText(challengeName));
}
ConfirmSignIn.Header = Header;
ConfirmSignIn.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getResendCodeText, getResetYourPasswordText: getResetYourPasswordText$1 } = ui.authenticatorTextUtil;
const ConfirmResetPassword = ({ className, variation, }) => {
    const { isPending } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const { handleBlur, handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ConfirmResetPassword: { Header = ConfirmResetPassword.Header, Footer = ConfirmResetPassword.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-confirmresetpassword": "", method: "post", onSubmit: handleSubmit, onChange: handleChange, onBlur: handleBlur },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(FormFields, null)),
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(TwoButtonSubmitFooter, { cancelButtonSendType: "RESEND", cancelButtonText: getResendCodeText() }),
                React__default["default"].createElement(Footer, null)))));
};
ConfirmResetPassword.Header = function Header() {
    const headerText = getResetYourPasswordText$1();
    return React__default["default"].createElement(Heading, { level: 3 }, headerText);
};
ConfirmResetPassword.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const { getBackToSignInText, getSendingText, getSendCodeText, getResetYourPasswordText, } = ui.authenticatorTextUtil;
const ForgotPassword = ({ className, variation, }) => {
    const { isPending } = uiReactCore.useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ForgotPassword: { Header = ForgotPassword.Header, Footer = ForgotPassword.Footer, }, }, } = useCustomComponents();
    return (React__default["default"].createElement(RouteContainer, { className: className, variation: variation },
        React__default["default"].createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-forgotpassword": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default["default"].createElement(Field.Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default["default"].createElement(Header, null),
                React__default["default"].createElement(Field.Flex, { direction: "column" },
                    React__default["default"].createElement(FormFields, null)),
                React__default["default"].createElement(RemoteErrorMessage, null),
                React__default["default"].createElement(TwoButtonSubmitFooter, { cancelButtonText: getBackToSignInText(), cancelButtonSendType: "SIGN_IN", submitButtonText: isPending ? (React__default["default"].createElement(React__default["default"].Fragment, null,
                        getSendingText(),
                        "\u2026")) : (React__default["default"].createElement(React__default["default"].Fragment, null, getSendCodeText())) }),
                React__default["default"].createElement(Footer, null)))));
};
ForgotPassword.Header = function Header() {
    return React__default["default"].createElement(Heading, { level: 3 }, getResetYourPasswordText());
};
ForgotPassword.Footer = function Footer() {
    // @ts-ignore
    return null;
};

const isSignInOrSignUpRoute = (route) => route === 'signIn' || route === 'signUp';

function RenderNothing() {
    // @ts-ignore
    return null;
}
const getRouteComponent = (route) => {
    switch (route) {
        case 'authenticated':
        case 'idle':
        case 'setup':
        case 'transition':
            return RenderNothing;
        case 'confirmSignUp':
            return ConfirmSignUp;
        case 'confirmSignIn':
            return ConfirmSignIn;
        case 'setupTotp':
            return SetupTotp;
        case 'signIn':
        case 'signUp':
            return SignInSignUpTabs;
        case 'forceNewPassword':
            return ForceNewPassword;
        case 'forgotPassword':
            return ForgotPassword;
        case 'confirmResetPassword':
            return ConfirmResetPassword;
        case 'verifyUser':
            return VerifyUser;
        case 'confirmVerifyUser':
            return ConfirmVerifyUser;
        default:
            // eslint-disable-next-line no-console
            console.warn(`Unhandled Authenticator route - please open an issue: ${route}`);
            return RenderNothing;
    }
};
function Router({ className, hideSignUp, variation, }) {
    const { route } = uiReactCore.useAuthenticator(({ route }) => [route]);
    const RouterChildren = React.useMemo(() => getRouteComponent(route), [route]);
    return (React__default["default"].createElement(RouterChildren, { className: className, 
        // @ts-ignore
        hideSignUp: isSignInOrSignUpRoute(route) ? hideSignUp : undefined, variation: variation }));
}

const defaultComponents = {
    // @ts-ignore
    Header: () => null,
    SignIn: {
        Header: SignIn.Header,
        Footer: SignIn.Footer,
    },
    SignUp: {
        Header: SignUp.Header,
        FormFields: SignUp.FormFields,
        Footer: SignUp.Footer,
    },
    ConfirmSignUp: {
        Header: ConfirmSignUp.Header,
        Footer: ConfirmSignUp.Footer,
    },
    SetupTotp: {
        Header: SetupTotp.Header,
        Footer: SetupTotp.Footer,
    },
    ConfirmResetPassword: {
        Header: ConfirmResetPassword.Header,
        Footer: ConfirmResetPassword.Footer,
    },
    ConfirmSignIn: {
        Header: ConfirmSignIn.Header,
        Footer: ConfirmSignIn.Footer,
    },
    VerifyUser: {
        Header: VerifyUser.Header,
        Footer: VerifyUser.Footer,
    },
    ConfirmVerifyUser: {
        Header: ConfirmVerifyUser.Header,
        // @ts-ignore
        Footer: ConfirmVerifyUser.Footer,
    },
    ForceNewPassword: {
        Header: ForceNewPassword.Header,
        Footer: ForceNewPassword.Footer,
        FormFields: ForceNewPassword.FormFields,
    },
    ForgotPassword: {
        Header: ForgotPassword.Header,
        Footer: ForgotPassword.Footer,
    },
    // @ts-ignore
    Footer: () => null,
};

// `AuthenticatorInternal` exists to give access to the context returned via `useAuthenticator`,
// which allows the `Authenticator` to just return `children` if a user is authenticated.
// Once the `Provider` is removed from the `Authenticator` component and exported as
// `AuthenticatorProvider`, this component should be renamed to `Authenticator`.
function AuthenticatorInternal({ children, className, components: customComponents, formFields, hideSignUp, initialState, loginMechanisms, passwordSettings, signUpAttributes, services, socialProviders, variation, }) {
    Field.useDeprecationWarning({
        message: 'The `passwordSettings` prop has been deprecated and will be removed in a future major version of Amplify UI.',
        // shouldWarn: !!passwordSettings,
        /**
         * @migration turn off until getConfig returns zero config
         */
        shouldWarn: false,
    });
    const { route, signOut, user } = uiReactCore.useAuthenticator(({ route, signOut, user }) => [route, signOut, user]);
    uiReactCore.useAuthenticatorInitMachine({
        initialState,
        loginMechanisms,
        passwordSettings,
        services,
        signUpAttributes,
        socialProviders,
        formFields,
    });
    const value = React__namespace.useMemo(() => ({ components: { ...defaultComponents, ...customComponents } }), [customComponents]);
    const isAuthenticatedRoute = route === 'authenticated' || route === 'signOut';
    if (isAuthenticatedRoute) {
        // `Authenticator` might not have user defined `children` for non SPA use cases.
        if (!children) {
            // @ts-ignore
            return null;
        }
        return (React__namespace.createElement(React__namespace.Fragment, null, ui.isFunction(children)
            ? children({ signOut, user }) // children is a render prop
            : children));
    }
    return (React__namespace.createElement(CustomComponentsContext.Provider, { value: value },
        React__namespace.createElement(Router, { className: className, hideSignUp: hideSignUp, variation: variation })));
}
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
function Authenticator(props) {
    uiReactCore.useSetUserAgent({
        componentName: 'Authenticator',
        packageName: 'react',
        version: VERSION,
    });
    return (React__namespace.createElement(uiReactCore.AuthenticatorProvider, null,
        React__namespace.createElement(AuthenticatorInternal, { ...props })));
}
Authenticator.Provider = uiReactCore.AuthenticatorProvider;
Authenticator.ForgotPassword = ForgotPassword;
Authenticator.SetupTotp = SetupTotp;
Authenticator.SignIn = SignIn;
Authenticator.SignUp = SignUp;
Authenticator.ForceNewPassword = ForceNewPassword;

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/connected-components/authenticator)
 */
function withAuthenticator(Component, options = {}) {
    const { variation = 'modal' } = options;
    return function WrappedWithAuthenticator(props) {
        return (React__default["default"].createElement(Authenticator, { variation: variation, ...options }, (withAuthenticatorProps) => (React__default["default"].createElement(Component, { ...props, ...withAuthenticatorProps }))));
    };
}

// Radix packages don't support ESM in Node, in some scenarios(e.g. SSR)
// We have to use namespace import and sanitize it to ensure the interoperablity between ESM and CJS
const { DirectionProvider } = ui.sanitizeNamespaceImport(RadixDirection__namespace);
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/theming)
 */
function ThemeProvider({ children, colorMode, direction = 'ltr', nonce, theme, }) {
    const value = React__namespace.useMemo(() => ({ theme: ui.createTheme(theme), colorMode }), [theme, colorMode]);
    return (React__namespace.createElement(Field.ThemeContext.Provider, { value: value },
        React__namespace.createElement(DirectionProvider, { dir: direction },
            React__namespace.createElement("div", { "data-amplify-theme": value.theme.name, "data-amplify-color-mode": colorMode, dir: direction }, children),
            theme ? React__namespace.createElement(ThemeStyle.ThemeStyle, { theme: value.theme, nonce: nonce }) : null)));
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AccountSettings: AccountSettings,
    Authenticator: Authenticator,
    withAuthenticator: withAuthenticator,
    useAuthenticator: uiReactCore.useAuthenticator,
    ThemeProvider: ThemeProvider
});

Object.defineProperty(exports, 'useAuthenticator', {
    enumerable: true,
    get: function () { return uiReactCore.useAuthenticator; }
});
Object.defineProperty(exports, 'createTheme', {
    enumerable: true,
    get: function () { return ui.createTheme; }
});
Object.defineProperty(exports, 'defaultDarkModeOverride', {
    enumerable: true,
    get: function () { return ui.defaultDarkModeOverride; }
});
Object.defineProperty(exports, 'defaultTheme', {
    enumerable: true,
    get: function () { return ui.defaultTheme; }
});
Object.defineProperty(exports, 'translations', {
    enumerable: true,
    get: function () { return ui.translations; }
});
exports.Button = Field.Button;
exports.ComponentPropsToStylePropsMap = Field.ComponentPropsToStylePropsMap;
exports.ComponentPropsToStylePropsMapKeys = Field.ComponentPropsToStylePropsMapKeys;
exports.FieldGroupIcon = Field.FieldGroupIcon;
exports.FieldGroupIconButton = Field.FieldGroupIconButton;
exports.Flex = Field.Flex;
exports.Icon = Field.Icon;
exports.Label = Field.Label;
exports.Loader = Field.Loader;
exports.Text = Field.Text;
exports.View = Field.View;
exports.useTheme = Field.useTheme;
exports.Accordion = Accordion;
exports.AccountSettings = AccountSettings;
exports.Alert = Alert;
exports.Authenticator = Authenticator;
exports.Autocomplete = Autocomplete;
exports.Avatar = Avatar;
exports.Badge = Badge;
exports.Breadcrumbs = Breadcrumbs;
exports.ButtonGroup = ButtonGroup;
exports.Card = Card;
exports.CheckboxField = CheckboxField;
exports.Collection = Collection;
exports.Divider = Divider;
exports.DropZone = DropZone;
exports.Fieldset = Fieldset;
exports.Grid = Grid;
exports.Heading = Heading;
exports.HighlightMatch = HighlightMatch;
exports.IconsProvider = IconsProvider;
exports.Image = Image;
exports.Input = Input;
exports.Link = Link;
exports.Menu = Menu;
exports.MenuButton = MenuButton;
exports.MenuItem = MenuItem;
exports.Message = Message;
exports.Pagination = Pagination;
exports.PasswordField = PasswordField;
exports.PhoneNumberField = PhoneNumberField;
exports.Placeholder = Placeholder;
exports.Radio = Radio;
exports.RadioGroupField = RadioGroupField;
exports.Rating = Rating;
exports.ScrollView = ScrollView;
exports.SearchField = SearchField;
exports.SelectField = SelectField;
exports.SliderField = SliderField;
exports.StepperField = StepperField;
exports.SwitchField = SwitchField;
exports.Table = Table;
exports.TableBody = TableBody;
exports.TableCell = TableCell;
exports.TableFoot = TableFoot;
exports.TableHead = TableHead;
exports.TableRow = TableRow;
exports.Tabs = Tabs;
exports.TextAreaField = TextAreaField;
exports.TextField = TextField;
exports.ThemeProvider = ThemeProvider;
exports.ToggleButton = ToggleButton;
exports.ToggleButtonGroup = ToggleButtonGroup;
exports.VisuallyHidden = VisuallyHidden;
exports.components = index;
exports.primitives = index$1;
exports.useBreakpointValue = useBreakpointValue;
exports.usePagination = usePagination;
exports.withAuthenticator = withAuthenticator;
