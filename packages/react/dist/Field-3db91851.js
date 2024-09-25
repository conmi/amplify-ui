'use strict';

var React = require('react');
var core = require('@aws-amplify/core');
var auth = require('aws-amplify/auth');
var uiReactCore = require('@aws-amplify/ui-react-core');
var ui = require('@aws-amplify/ui');

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

/**
 * Amplify Auth React hook
 * @internal
 */
const useAuth = () => {
    const [result, setResult] = React__namespace.useState({
        error: undefined,
        isLoading: true,
        user: undefined,
    });
    /**
     * Hub events like `tokenRefresh` will not give back the user object.
     * This util will be used to get current user after those events.
     */
    const fetchCurrentUser = React__namespace.useCallback(async () => {
        setResult((prevResult) => ({ ...prevResult, isLoading: true }));
        try {
            const user = await auth.getCurrentUser();
            setResult({ user, isLoading: false });
        }
        catch (e) {
            const error = e;
            setResult({ error, isLoading: false });
        }
    }, []);
    const handleAuth = React__namespace.useCallback(({ payload }) => {
        switch (payload.event) {
            // success events
            case 'signedIn':
            case 'signUp':
            case 'autoSignIn': {
                setResult({ user: payload.data, isLoading: false });
                break;
            }
            case 'signedOut': {
                setResult({ user: undefined, isLoading: false });
                break;
            }
            // failure events
            case 'tokenRefresh_failure':
            case 'signIn_failure': {
                setResult({ error: payload.data, isLoading: false });
                break;
            }
            case 'autoSignIn_failure': {
                // autoSignIn just returns error message. Wrap it to an Error object
                setResult({ error: new Error(payload.message), isLoading: false });
                break;
            }
            // events that need another fetch
            case 'tokenRefresh': {
                fetchCurrentUser();
                break;
            }
        }
    }, [fetchCurrentUser]);
    React__namespace.useEffect(() => {
        const unsubscribe = core.Hub.listen('auth', handleAuth, 'useAuth');
        fetchCurrentUser(); // on init, see if user is already logged in
        return unsubscribe;
    }, [handleAuth, fetchCurrentUser]);
    return {
        ...result,
        /** @deprecated Fetch is handled automatically, do not use this directly */
        fetch: fetchCurrentUser,
    };
};

const ThemeContext = React__namespace.createContext({
    theme: ui.createTheme(),
    colorMode: undefined,
});

/**
 * Get current Theme object value from Amplify context.
 * Returns a default theme if context is not available
 */
const getThemeFromContext = (context) => {
    if (typeof context === 'undefined' || typeof context.theme === 'undefined') {
        return ui.createTheme();
    }
    return context.theme;
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/theming)
 */
const useTheme = () => {
    const context = React__namespace.useContext(ThemeContext);
    return getThemeFromContext(context);
};
/**
 * Internal use only
 */
const useColorMode = () => {
    const context = React__namespace.useContext(ThemeContext);
    return context.colorMode;
};

// For internal use, no need to export
const ComponentText = {
    Alert: {
        dismissButtonLabel: 'Dismiss alert',
    },
    Autocomplete: {
        emptyText: 'No options found',
        loadingText: 'Loading options...',
    },
    Collection: {
        searchButtonLabel: 'Search',
        searchNoResultsFound: 'No results found',
    },
    Fields: {
        clearButtonLabel: 'Clear input',
    },
    Message: {
        dismissLabel: 'Dismiss message',
    },
    PaginationItem: {
        currentPageLabel: 'Page',
        nextLabel: 'Go to next page',
        pageLabel: 'Go to page',
        previousLabel: 'Go to previous page',
    },
    PhoneNumberField: {
        countryCodeLabel: 'Country code',
    },
    SearchField: {
        searchButtonLabel: 'Search',
    },
    PasswordField: {
        passwordIsHidden: 'Password is hidden',
        passwordIsShown: 'Password is shown',
        showPassword: 'Show password',
    },
    StepperField: {
        increaseButtonLabel: 'Increase to',
        decreaseButtonLabel: 'Decrease to',
    },
};
const stylePropsToThemeKeys = {
    backgroundColor: 'colors',
    borderColor: 'colors',
    borderWidth: 'borderWidths',
    color: 'colors',
    borderRadius: 'radii',
    fontSize: 'fontSizes',
    fontWeight: 'fontWeights',
    fontFamily: 'fonts',
    lineHeight: 'lineHeights',
    opacity: 'opacities',
    boxShadow: 'shadows',
    transform: 'transforms',
    left: 'space',
    right: 'space',
    top: 'space',
    bottom: 'space',
    height: 'space',
    width: 'space',
    letterSpacing: 'space',
    margin: 'space',
    marginBlock: 'space',
    marginBlockEnd: 'space',
    marginBlockStart: 'space',
    marginInline: 'space',
    marginInlineEnd: 'space',
    marginInlineStart: 'space',
    marginLeft: 'space',
    marginRight: 'space',
    marginTop: 'space',
    marginBottom: 'space',
    maxHeight: 'space',
    maxWidth: 'space',
    minHeight: 'space',
    minWidth: 'space',
    padding: 'space',
    paddingBlock: 'space',
    paddingBlockEnd: 'space',
    paddingBlockStart: 'space',
    paddingInline: 'space',
    paddingInlineEnd: 'space',
    paddingInlineStart: 'space',
    paddingLeft: 'space',
    paddingRight: 'space',
    paddingTop: 'space',
    paddingBottom: 'space',
    gap: 'space',
    columnGap: 'space',
    rowGap: 'space',
};
// key name
const ESCAPE_KEY = 'Escape';
const ENTER_KEY = 'Enter';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';

const isThemeStylePropKey = (key) => {
    return key in stylePropsToThemeKeys;
};

const strHasLength = (str) => typeof str === 'string' && str.length > 0;
const isEmptyString = (value) => typeof value === 'string' && value.length === 0;
const isNullOrEmptyString = (value) => value == null || isEmptyString(value);
/**
 * Create a consecutive integer array from start value to end value.
 * @param start start value
 * @param end end value
 * @returns an integer array with elements from start to end consecutively
 */
const getConsecutiveIntArray = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};
/**
 * TS helper function to make using Object.keys more typesafe
 */
const objectKeys = (obj) => {
    return Object.keys(obj);
};
const getCSSVariableIfValueIsThemeKey = (propKey, value, tokens) => {
    if (typeof value !== 'string') {
        return value;
    }
    // For shorthand properties like `padding` which can accept 1, 2, 3, or 4 values
    // run this function on each value. This would not work on CSS shorthands that
    // mix types, like border which is a composite of borderWidth, borderStyle, and
    // borderColor.
    if (value.includes(' ')) {
        return value
            .split(' ')
            .map((val) => getCSSVariableIfValueIsThemeKey(propKey, val, tokens))
            .join(' ');
    }
    if (isThemeStylePropKey(propKey)) {
        const path = value.split('.');
        const tokenKey = stylePropsToThemeKeys[propKey];
        let tokenProps = tokens[tokenKey];
        for (let i = 0; i < path.length; i++) {
            if (tokenProps) {
                // overwrite tokenProps with next nested value of tokenProps
                tokenProps = tokenProps[path[i]];
                continue;
            }
            break;
        }
        return ui.isDesignToken(tokenProps)
            ? `var(--${ui.cssNameTransform({
                path: [stylePropsToThemeKeys[propKey], ...path],
            })})`
            : value;
    }
    return value;
};

// Inspiration for getMediaQueries and useBreakpoint
const getMediaQueries = ({ breakpoints }) => {
    const sortedBreakpoints = objectKeys(breakpoints).sort((a, b) => breakpoints[b] - breakpoints[a]);
    return sortedBreakpoints.map((breakpoint, index) => {
        let query = '';
        const minWidth = breakpoints[breakpoint];
        const nextBreakpoint = sortedBreakpoints[index - 1];
        const maxWidth = nextBreakpoint ? breakpoints[nextBreakpoint] - 1 : null;
        if (minWidth >= 0) {
            query = `(min-width: ${minWidth}px)`;
        }
        if (maxWidth !== null) {
            if (query) {
                query += ' and ';
            }
            query += `(max-width: ${maxWidth}px)`;
        }
        return {
            breakpoint,
            query,
            maxWidth,
            minWidth,
        };
    });
};

// Inspiration for getMediaQueries and useBreakpoint
const useIsomorphicEffect = typeof window === 'undefined' ? React__namespace.useEffect : React__namespace.useLayoutEffect;
const useBreakpoint = ({ breakpoints, defaultBreakpoint, }) => {
    const supportMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined';
    const matchMedia = supportMatchMedia ? window.matchMedia : null;
    const mediaQueries = React__namespace.useMemo(() => getMediaQueries({ breakpoints }), [breakpoints]);
    const [breakpoint, setBreakpoint] = React__namespace.useState(defaultBreakpoint);
    const updateBreakpoint = React__namespace.useCallback((matches, breakpoint) => {
        if (matches) {
            setBreakpoint(breakpoint);
        }
    }, [setBreakpoint]);
    useIsomorphicEffect(() => {
        if (!matchMedia)
            return;
        const unsubscribeList = mediaQueries.map(({ query, breakpoint }) => {
            const queryList = matchMedia(query);
            updateBreakpoint(queryList.matches, breakpoint);
            const handleMediaChange = (event) => {
                if (event.matches) {
                    setBreakpoint(breakpoint);
                }
            };
            queryList.addEventListener('change', handleMediaChange);
            return () => queryList.removeEventListener('change', handleMediaChange);
        });
        return () => {
            unsubscribeList.forEach((unsubscribe) => unsubscribe());
        };
    }, [breakpoints, setBreakpoint, matchMedia, mediaQueries]);
    /** Print a nice debug value for React Devtools */
    React__namespace.useDebugValue(breakpoint, (breakpoint) => breakpoint);
    return breakpoint;
};

/**
 * Logs a deprecation warning `message` to the console.
 */
const useDeprecationWarning = ({ message, shouldWarn: _shouldWarn, }) => {
    const shouldWarn = _shouldWarn &&
        // show message on builds without Node `process` polyfill
        // or with process.env.NODE_ENV not production
        (typeof process === 'undefined' ||
            (process && process.env.NODE_ENV !== 'production'));
    uiReactCore.useDeprecationWarning({ message, shouldWarn });
};

/**
 * @internal May be removed in a future version
 * Maps from component style props to React `style` props
 * Note: Primarily needed to map from component style props that don't match CSS Properties directly
 * such as wrap => flexWrap and direction => flexDirection
 */
const ComponentPropsToStylePropsMap = {
    alignContent: 'alignContent',
    alignItems: 'alignItems',
    alignSelf: 'alignSelf',
    area: 'gridArea',
    aspectRatio: 'aspectRatio',
    autoColumns: 'gridAutoColumns',
    autoFlow: 'gridAutoFlow',
    autoRows: 'gridAutoRows',
    backgroundColor: 'backgroundColor',
    backgroundImage: 'backgroundImage',
    basis: 'flexBasis',
    border: 'border',
    borderRadius: 'borderRadius',
    borderColor: 'borderColor',
    borderWidth: 'borderWidth',
    borderStyle: 'borderStyle',
    bottom: 'bottom',
    boxShadow: 'boxShadow',
    color: 'color',
    column: 'gridColumn',
    columnEnd: 'gridColumnEnd',
    columnGap: 'columnGap',
    columnSpan: 'gridColumn',
    columnStart: 'gridColumnStart',
    direction: 'flexDirection',
    display: 'display',
    flex: 'flex',
    fontFamily: 'fontFamily',
    fontSize: 'fontSize',
    fontStyle: 'fontStyle',
    fontWeight: 'fontWeight',
    gap: 'gap',
    grow: 'flexGrow',
    height: 'height',
    justifyContent: 'justifyContent',
    left: 'left',
    letterSpacing: 'letterSpacing',
    lineHeight: 'lineHeight',
    margin: 'margin',
    marginBlock: 'marginBlock',
    marginBlockEnd: 'marginBlockEnd',
    marginBlockStart: 'marginBlockStart',
    marginBottom: 'marginBlockEnd',
    marginInline: 'marginInline',
    marginInlineEnd: 'marginInlineEnd',
    marginInlineStart: 'marginInlineStart',
    marginLeft: 'marginInlineStart',
    marginRight: 'marginInlineEnd',
    marginTop: 'marginBlockStart',
    maxHeight: 'maxHeight',
    maxWidth: 'maxWidth',
    minHeight: 'minHeight',
    minWidth: 'minWidth',
    objectFit: 'objectFit',
    objectPosition: 'objectPosition',
    opacity: 'opacity',
    order: 'order',
    overflow: 'overflow',
    padding: 'padding',
    paddingBlock: 'paddingBlock',
    paddingBlockEnd: 'paddingBlockEnd',
    paddingBlockStart: 'paddingBlockStart',
    paddingBottom: 'paddingBlockEnd',
    paddingInline: 'paddingInline',
    paddingInlineEnd: 'paddingInlineEnd',
    paddingInlineStart: 'paddingInlineStart',
    paddingLeft: 'paddingInlineStart',
    paddingRight: 'paddingInlineEnd',
    paddingTop: 'paddingBlockStart',
    position: 'position',
    resize: 'resize',
    right: 'right',
    row: 'gridRow',
    rowEnd: 'gridRowEnd',
    rowGap: 'rowGap',
    rowSpan: 'gridRow',
    rowStart: 'gridRowStart',
    shrink: 'flexShrink',
    templateAreas: 'gridTemplateAreas',
    templateColumns: 'gridTemplateColumns',
    templateRows: 'gridTemplateRows',
    textAlign: 'textAlign',
    textDecoration: 'textDecoration',
    textTransform: 'textTransform',
    top: 'top',
    transform: 'transform',
    transformOrigin: 'transformOrigin',
    width: 'width',
    whiteSpace: 'whiteSpace',
    wrap: 'flexWrap',
};
/**
 * @internal May be removed in a future version
 */
const ComponentPropsToStylePropsMapKeys = Object.keys(ComponentPropsToStylePropsMap);

const getClosestValueByBreakpoint = ({ breakpoint, breakpoints, values, }) => {
    const value = values[breakpoint];
    // Check if breakpoint exists in values
    if (value !== undefined) {
        return value;
    }
    // Otherwise use a lower breakpoint value
    const breakpointsDesc = objectKeys(breakpoints).sort((a, b) => breakpoints[b] - breakpoints[a]);
    const lowerBreakpoints = breakpointsDesc.slice(breakpointsDesc.indexOf(breakpoint));
    for (const breakpoint of lowerBreakpoints) {
        // Check if breakpoint exists in values
        const value = values[breakpoint];
        if (value !== undefined) {
            return value;
        }
    }
    return null;
};
/**
 * This takes an object and will return an object that only has the
 * breakpoint keys
 * @param obj
 * @returns
 */
const valueObjToBreakpoints = (obj) => {
    return objectKeys(obj).reduce((acc, key) => key in ui.defaultTheme.breakpoints.values
        ? { ...acc, [key]: obj[key] }
        : acc, {});
};
const getValueAtCurrentBreakpoint = ({ breakpoint, breakpoints, values, }) => {
    let breakpointCompatValues = {};
    const breakpointsAscending = objectKeys(breakpoints).sort((a, b) => breakpoints[a] - breakpoints[b]);
    if (Array.isArray(values)) {
        values.forEach((value, index) => {
            breakpointCompatValues[breakpointsAscending[index]] = value;
        });
    }
    else if (typeof values === 'object') {
        breakpointCompatValues = valueObjToBreakpoints(values);
    }
    return getClosestValueByBreakpoint({
        breakpoint,
        breakpoints,
        values: breakpointCompatValues,
    });
};

/**
 * This takes an unknown value, which could be a:
 * - design token: `color={tokens.colors.font.primary}`
 * - string, which could be a:
 *   - theme key: `color='font.primary'`
 *   - plain style: `color='red'`
 * - or a number: `padding={10}`
 * and returns the appropriate and resolved value
 */
const getStyleValue = ({ value, propKey, tokens, }) => {
    if (ui.isDesignToken(value)) {
        return value.toString();
    }
    if (ui.isString(value)) {
        return ui.isString(propKey)
            ? getCSSVariableIfValueIsThemeKey(propKey, value, tokens)
            : value;
    }
    return null;
};

const isSpanPrimitiveValue = (spanValue) => {
    return (spanValue === 'auto' ||
        (typeof spanValue === 'number' && !isNaN(spanValue)) ||
        (typeof spanValue === 'string' && !isNaN(parseFloat(spanValue))));
};
const getGridSpan = (spanValue) => {
    return spanValue === 'auto' ? 'auto' : `span ${spanValue}`;
};
const convertGridSpan = (spanValue) => {
    // PropertyType
    if (isSpanPrimitiveValue(spanValue)) {
        return getGridSpan(spanValue);
    }
    // PropertyType[]
    if (Array.isArray(spanValue)) {
        return spanValue.map((value) => getGridSpan(value));
    }
    // ResponsiveObject<PropertyType>
    if (typeof spanValue === 'object' && spanValue != null) {
        return Object.entries(spanValue).reduce((acc, [key, value]) => ({ ...acc, [key]: getGridSpan(value) }), {});
    }
    return null;
};
/**
 * Transforms style props to another target prop
 * where the original is a simpler API than the target.
 * This function will remove the original prop and
 * replace target prop values with calculated
 * E.g. rowSpan => row, columnSpan => column
 */
const useTransformStyleProps = (props) => {
    const { rowSpan, columnSpan, row, column, ...rest } = props;
    const { rowFromSpanValue, columnFromSpanValue } = React__namespace.useMemo(() => {
        return {
            rowFromSpanValue: convertGridSpan(rowSpan),
            columnFromSpanValue: convertGridSpan(columnSpan),
        };
    }, [rowSpan, columnSpan]);
    return {
        row: !isNullOrEmptyString(row) ? row : rowFromSpanValue,
        column: !isNullOrEmptyString(column) ? column : columnFromSpanValue,
        ...rest,
    };
};
const isComponentStyleProp = (key) => {
    return key in ComponentPropsToStylePropsMap;
};
/**
 * Convert style props to CSS variables for React style prop
 * Note: Will filter out undefined, null, and empty string prop values
 */
const convertStylePropsToStyleObj = ({ props = {}, style = {}, breakpoint, breakpoints, tokens, }) => {
    const nonStyleProps = {};
    Object.keys(props)
        .filter((propKey) => props[propKey] !== null)
        .forEach((propKey) => {
        if (isComponentStyleProp(propKey)) {
            const values = props[propKey];
            if (!values || isEmptyString(values))
                return;
            const reactStyleProp = ComponentPropsToStylePropsMap[propKey];
            // short circuit the style prop here if it is a string or design token
            // so we don't have to call getValueAtCurrentBreakpoint every time
            let value = '';
            if (ui.isDesignToken(values)) {
                value = values.toString();
            }
            else if (typeof values === 'string') {
                value = getCSSVariableIfValueIsThemeKey(propKey, values, tokens);
            }
            else if (typeof values === 'number') {
                value = values;
            }
            else if (typeof values === 'object') {
                // here values should be a responsive array or object
                value = getStyleValue({
                    propKey,
                    tokens,
                    value: getValueAtCurrentBreakpoint({
                        values,
                        breakpoint,
                        breakpoints,
                    }),
                });
            }
            style = {
                ...style,
                [reactStyleProp]: value,
            };
        }
        else if (typeof props[propKey] !== 'undefined') {
            nonStyleProps[propKey] = props[propKey];
        }
    });
    return { propStyles: style, nonStyleProps };
};
const useStyles = (props, style) => {
    const { breakpoints: { values: breakpoints, defaultBreakpoint }, tokens, } = useTheme();
    const breakpoint = useBreakpoint({
        breakpoints,
        defaultBreakpoint,
    });
    const propStyles = useTransformStyleProps(props);
    return React__namespace.useMemo(() => convertStylePropsToStyleObj({
        props: propStyles,
        style,
        breakpoint,
        breakpoints,
        tokens,
    }), [propStyles, style, breakpoints, breakpoint, tokens]);
};

/**
 * Updates the return type for primitives wrapped in `React.forwardRef` to
 * `React.ReactElement`. In React 18 the return type of `React.ExoticComponent`
 * was changed from `React.ReactElement` to `React.ReactNode`, which breaks
 * clients using React 16 and 17.
 *
 * @param primitive UI Primitive to be wrapped with `React.forwardRef`
 * @returns ForwaredRef wrapped UI Primitive
 */
const primitiveWithForwardRef = (primitive) => React__namespace.forwardRef(primitive);

const ViewPrimitive = ({ as = 'div', children, testId, ariaLabel, isDisabled, style, inert, ...rest }, ref) => {
    const { propStyles, nonStyleProps } = useStyles(rest, style);
    return React__namespace.createElement(as, {
        'aria-label': ariaLabel,
        'data-testid': testId,
        disabled: isDisabled,
        ref,
        inert: inert ? '' : null,
        style: propStyles,
        ...nonStyleProps,
    }, children);
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/view)
 */
const View = primitiveWithForwardRef(ViewPrimitive);
View.displayName = 'View';

const defaultViewBox = { minX: 0, minY: 0, width: 24, height: 24 };
const IconPrimitive = ({ className, 
// as can be used to render other icon react components too
as = 'svg', fill = 'currentColor', pathData, viewBox = defaultViewBox, children, paths, ...rest }, ref) => {
    const minX = viewBox.minX ? viewBox.minX : defaultViewBox.minX;
    const minY = viewBox.minY ? viewBox.minY : defaultViewBox.minY;
    const width = viewBox.width ? viewBox.width : defaultViewBox.width;
    const height = viewBox.height ? viewBox.height : defaultViewBox.height;
    // An icon can be drawn in 3 ways:
    // 1. Pass it children which should be valid SVG elements
    // 2. Pass an array of path-like objects to `paths` prop
    // 3. Supply `pathData` for a simple icons
    let _children;
    if (children) {
        _children = children;
    }
    if (paths) {
        _children = paths.map((path, index) => React__namespace.createElement("path", { ...path, key: index }));
    }
    if (pathData) {
        _children = React__namespace.createElement("path", { d: pathData, fill: fill });
    }
    return (React__namespace.createElement(View, { as: as, className: ui.classNames(ui.ComponentClassName.Icon, className), ref: ref, viewBox: `${minX} ${minY} ${width} ${height}`, ...rest }, _children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/icon)
 */
const Icon = primitiveWithForwardRef(IconPrimitive);
Icon.displayName = 'Icon';

const IconsContext = React__namespace.createContext({});

function useIcons(component) {
    const context = React__namespace.useContext(IconsContext);
    if (component && context) {
        return context[component];
    }
    return undefined;
}

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconAdd = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconCheckCircle = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconCheck = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M9.00016 16.1698L4.83016 11.9998L3.41016 13.4098L9.00016 18.9998L21.0002 6.99984L19.5902 5.58984L9.00016 16.1698Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconChevronLeft = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconChevronRight = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M9.99984 6L8.58984 7.41L13.1698 12L8.58984 16.59L9.99984 18L15.9998 12L9.99984 6Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconClose = (props) => {
    const { className, size, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: size ?? '1em', height: size ?? '1em', className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: size ? { width: size, height: size } : undefined },
            React__namespace.createElement("path", { d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconError = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconExpandMore = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M16.59 8.58984L12 13.1698L7.41 8.58984L6 9.99984L12 15.9998L18 9.99984L16.59 8.58984Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconIndeterminate = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24", width: "24", viewBox: "0 0 24 24" },
            React__namespace.createElement("line", { x1: "4", x2: "20", y1: "12", y2: "12", stroke: "currentColor", strokeWidth: "3" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconInfo = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconMenu = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconRemove = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M19 13H5V11H19V13Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconSearch = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14V14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconStar = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconUser = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconVisibilityOff = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 6.0002C15.79 6.0002 19.17 8.1302 20.82 11.5002C20.23 12.7202 19.4 13.7702 18.41 14.6202L19.82 16.0302C21.21 14.8002 22.31 13.2602 23 11.5002C21.27 7.1102 17 4.0002 12 4.0002C10.73 4.0002 9.51 4.2002 8.36 4.5702L10.01 6.2202C10.66 6.0902 11.32 6.0002 12 6.0002ZM10.93 7.14019L13 9.2102C13.57 9.4602 14.03 9.9202 14.28 10.4902L16.35 12.5602C16.43 12.2202 16.49 11.8602 16.49 11.4902C16.5 9.0102 14.48 7.0002 12 7.0002C11.63 7.0002 11.28 7.05019 10.93 7.14019ZM2.01 3.8702L4.69 6.5502C3.06 7.8302 1.77 9.5302 1 11.5002C2.73 15.8902 7 19.0002 12 19.0002C13.52 19.0002 14.98 18.7102 16.32 18.1802L19.74 21.6002L21.15 20.1902L3.42 2.4502L2.01 3.8702ZM9.51 11.3702L12.12 13.9802C12.08 13.9902 12.04 14.0002 12 14.0002C10.62 14.0002 9.5 12.8802 9.5 11.5002C9.5 11.4502 9.51 11.4202 9.51 11.3702V11.3702ZM6.11 7.97019L7.86 9.7202C7.63 10.2702 7.5 10.8702 7.5 11.5002C7.5 13.9802 9.52 16.0002 12 16.0002C12.63 16.0002 13.23 15.8702 13.77 15.6402L14.75 16.6202C13.87 16.8602 12.95 17.0002 12 17.0002C8.21 17.0002 4.83 14.8702 3.18 11.5002C3.88 10.0702 4.9 8.89019 6.11 7.97019Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconVisibility = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M12 6C15.79 6 19.17 8.13 20.82 11.5C19.17 14.87 15.79 17 12 17C8.21 17 4.83 14.87 3.18 11.5C4.83 8.13 8.21 6 12 6ZM12 4C7 4 2.73 7.11 1 11.5C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 11.5C21.27 7.11 17 4 12 4ZM12 9C13.38 9 14.5 10.12 14.5 11.5C14.5 12.88 13.38 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 10.12 10.62 9 12 9ZM12 7C9.52 7 7.5 9.02 7.5 11.5C7.5 13.98 9.52 16 12 16C14.48 16 16.5 13.98 16.5 11.5C16.5 9.02 14.48 7 12 7Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const IconWarning = (props) => {
    const { className, ...rest } = props;
    return (React__namespace.createElement(View, { as: "span", width: "1em", height: "1em", className: ui.classNames(ui.ComponentClassName.Icon, className), ...rest },
        React__namespace.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React__namespace.createElement("path", { d: "M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z", fill: "currentColor" }))));
};

/**
 * @internal For internal Amplify UI use only. May be removed in a future release.
 */
const AlertIcon = ({ variation, ariaHidden, ariaLabel, role, }) => {
    const icons = useIcons('alert');
    let icon;
    switch (variation) {
        case 'info':
            icon = icons?.info ?? (React__namespace.createElement(IconInfo, { "aria-hidden": ariaHidden, "aria-label": ariaLabel, role: role }));
            break;
        case 'error':
            icon = icons?.error ?? (React__namespace.createElement(IconError, { "aria-hidden": ariaHidden, "aria-label": ariaLabel, role: role }));
            break;
        case 'warning':
            icon = icons?.warning ?? (React__namespace.createElement(IconWarning, { "aria-hidden": ariaHidden, "aria-label": ariaLabel, role: role }));
            break;
        case 'success':
            icon = icons?.success ?? (React__namespace.createElement(IconCheckCircle, { "aria-hidden": ariaHidden, "aria-label": ariaLabel, role: role }));
            break;
    }
    return icon ? (React__namespace.createElement("span", { className: ui.ComponentClassName.AlertIcon }, icon)) : null;
};
AlertIcon.displayName = 'AlertIcon';

function filterAllowedFiles(files, acceptedFileTypes) {
    // Allow any files if acceptedFileTypes is undefined, empty array, or contains '*'
    if (!acceptedFileTypes ||
        acceptedFileTypes.length === 0 ||
        acceptedFileTypes.includes('*')) {
        return { acceptedFiles: files, rejectedFiles: [] };
    }
    const acceptedFiles = [];
    const rejectedFiles = [];
    function filterFile(file) {
        const { type = '', name = '' } = file;
        const mimeType = type.toLowerCase();
        const baseMimeType = mimeType.split('/')[0];
        return acceptedFileTypes.some((type) => {
            const validType = type.trim().toLowerCase();
            // if the accepted file type is a file extension
            // it will start with '.', check against the file name
            if (validType.charAt(0) === '.') {
                return name.toLowerCase().endsWith(validType);
            }
            // This is something like a image/* mime type
            if (validType.endsWith('/*')) {
                return baseMimeType === validType.split('/')[0];
            }
            return mimeType === validType;
        });
    }
    files.forEach((file) => {
        (filterFile(file) ? acceptedFiles : rejectedFiles).push(file);
    });
    return { acceptedFiles, rejectedFiles };
}

function useDropZone({ onDropComplete, onDragEnter: _onDragEnter, onDragLeave: _onDragLeave, onDragOver: _onDragOver, onDragStart: _onDragStart, onDrop: _onDrop, acceptedFileTypes = [], }) {
    const [dragState, setDragState] = React.useState('inactive');
    const onDragStart = (event) => {
        event.dataTransfer.clearData();
        if (ui.isFunction(_onDragStart)) {
            _onDragStart(event);
        }
    };
    const onDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (ui.isFunction(_onDragEnter)) {
            _onDragEnter(event);
        }
    };
    const onDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState('inactive');
        if (ui.isFunction(_onDragLeave)) {
            _onDragLeave(event);
        }
    };
    const onDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        if (ui.isFunction(_onDragOver)) {
            _onDragOver(event);
        }
        const files = Array.from(event.dataTransfer.items).map(({ kind, type }) => ({
            kind,
            type,
        }));
        const { rejectedFiles } = filterAllowedFiles(files, acceptedFileTypes);
        setDragState(rejectedFiles.length > 0 ? 'reject' : 'accept');
    };
    const onDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragState('inactive');
        const files = Array.from(event.dataTransfer.files);
        const { acceptedFiles, rejectedFiles } = filterAllowedFiles(files, acceptedFileTypes);
        if (ui.isFunction(_onDrop)) {
            _onDrop(event);
        }
        if (ui.isFunction(onDropComplete)) {
            onDropComplete({ acceptedFiles, rejectedFiles });
        }
    };
    return {
        onDragStart,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDrop,
        dragState,
    };
}

const FieldGroupIconPrimitive = ({ className, children, isVisible = true, excludeFromTabOrder = false, ...rest }, ref) => {
    return isVisible ? (React__namespace.createElement(View, { className: ui.classNames(ui.ComponentClassName.FieldGroupIcon, className), ref: ref, tabIndex: excludeFromTabOrder ? -1 : undefined, ...rest }, children)) : null;
};
const FieldGroupIcon = primitiveWithForwardRef(FieldGroupIconPrimitive);
FieldGroupIcon.displayName = 'FieldGroupIcon';

const FieldsetContext = React__namespace.createContext({
    isFieldsetDisabled: false,
});
/**
 * @description Fieldsets in HTML can be disabled, which disables all child
 * fieldsets and input controls. `useFieldset` passes the disabled state down
 * via context.
 */
const useFieldset = () => React__namespace.useContext(FieldsetContext);

const FlexPrimitive = ({ className, children, ...rest }, ref) => (React__namespace.createElement(View, { className: ui.classNames(ui.ComponentClassName.Flex, className), ref: ref, ...rest }, children));
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/flex)
 */
const Flex = primitiveWithForwardRef(FlexPrimitive);
Flex.displayName = 'Flex';

const LINEAR_EMPTY = 'linear-empty';
const LINEAR_FILLED = 'linear-filled';
const CIRCULAR_EMPTY = 'circular-empty';
const CIRCULAR_FILLED = 'circular-filled';
// radius + strokeWidth = 50
const CIRCULAR_STROKE_WIDTH = 8;
const RADIUS = 42;
// circumference = 2 * r * PI  (r = 42)
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const LoaderPrimitive = ({ className, filledColor, emptyColor, size, variation, isDeterminate = false, isPercentageTextHidden = false, percentage = 0, ...rest }, ref) => {
    percentage = Math.min(percentage, 100);
    percentage = Math.max(percentage, 0);
    const percent = `${percentage}%`;
    const componentClasses = ui.classNames(ui.ComponentClassName.Loader, ui.classNameModifier(ui.ComponentClassName.Loader, size), ui.classNameModifier(ui.ComponentClassName.Loader, variation), ui.classNameModifierByFlag(ui.ComponentClassName.Loader, 'determinate', isDeterminate), className);
    const linearLoader = (React__namespace.createElement("g", null,
        React__namespace.createElement("line", { x1: "0", x2: "100%", y1: "50%", y2: "50%", style: { stroke: String(emptyColor) }, "data-testid": LINEAR_EMPTY }),
        React__namespace.createElement("line", { x1: "0", x2: isDeterminate ? percent : '100%', y1: "50%", y2: "50%", style: {
                // To get rid of the visible stroke linecap when percentage is 0
                stroke: isDeterminate && percentage === 0
                    ? 'none'
                    : filledColor
                        ? String(filledColor)
                        : undefined,
            }, "data-testid": LINEAR_FILLED }),
        isDeterminate ? (React__namespace.createElement("text", { "aria-live": "polite", className: ui.classNames(ui.ComponentClassName.LoaderLabel, isPercentageTextHidden ? ui.ComponentClassName.VisuallyHidden : null), 
            // -1% offset makes the text position look nicest
            x: `${-1 + percentage}%`, y: "200%" }, percent)) : null));
    // r + stroke-width should add up to 50% to avoid overflow
    const circularLoader = (React__namespace.createElement("g", null,
        React__namespace.createElement("circle", { cx: "50%", cy: "50%", r: `${RADIUS}%`, strokeWidth: `${CIRCULAR_STROKE_WIDTH}%`, style: { stroke: String(emptyColor) }, "data-testid": CIRCULAR_EMPTY }),
        React__namespace.createElement("circle", { cx: "50%", cy: "50%", r: `${RADIUS}%`, strokeWidth: `${CIRCULAR_STROKE_WIDTH}%`, style: {
                stroke: String(filledColor),
                strokeDasharray: isDeterminate
                    ? `${CIRCUMFERENCE}% ${CIRCUMFERENCE}%`
                    : undefined,
                strokeDashoffset: isDeterminate
                    ? `${CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100}%`
                    : undefined,
            }, "data-testid": CIRCULAR_FILLED }),
        isDeterminate ? (React__namespace.createElement("text", { "aria-live": "polite", className: ui.classNames(ui.ComponentClassName.LoaderLabel, isPercentageTextHidden ? ui.ComponentClassName.VisuallyHidden : null), 
            // this x and y make text position look nicest
            x: "130%", y: "80%" }, percent)) : null));
    return (React__namespace.createElement(View, { as: "svg", className: componentClasses, ref: ref, role: "img", ...rest }, variation === 'linear' ? linearLoader : circularLoader));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/loader)
 */
const Loader = primitiveWithForwardRef(LoaderPrimitive);
Loader.displayName = 'Loader';

// These variations support colorThemes. 'undefined' accounts for our
// 'default' variation which is not named.
const supportedVariations = ['link', 'primary', undefined];
const ButtonPrimitive = ({ className, children, colorTheme, isFullWidth = false, isDisabled, isLoading, loadingText = '', size, type = 'button', variation, ...rest }, ref) => {
    // Creates our colorTheme modifier string based on if the variation
    // supports colorThemes and a colorTheme is used.
    const colorThemeModifier = supportedVariations.includes(variation) && colorTheme
        ? `${variation ?? 'outlined'}--${colorTheme}`
        : undefined;
    const { isFieldsetDisabled } = useFieldset();
    const shouldBeDisabled = isFieldsetDisabled
        ? isFieldsetDisabled
        : isDisabled ?? isLoading ?? rest['disabled'];
    const componentClasses = ui.classNames(ui.ComponentClassName.Button, ui.ComponentClassName.FieldGroupControl, ui.classNameModifier(ui.ComponentClassName.Button, variation), ui.classNameModifier(ui.ComponentClassName.Button, colorThemeModifier), ui.classNameModifier(ui.ComponentClassName.Button, size), ui.classNameModifierByFlag(ui.ComponentClassName.Button, 'disabled', shouldBeDisabled), ui.classNameModifierByFlag(ui.ComponentClassName.Button, 'loading', isLoading), ui.classNameModifierByFlag(ui.ComponentClassName.Button, 'fullwidth', isFullWidth), className);
    return (React__namespace.createElement(View, { ref: ref, as: "button", className: componentClasses, isDisabled: shouldBeDisabled, type: type, ...rest }, isLoading ? (React__namespace.createElement(Flex, { as: "span", className: ui.ComponentClassName.ButtonLoaderWrapper },
        React__namespace.createElement(Loader, { size: size }),
        loadingText ? loadingText : null)) : (children)));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/button)
 */
const Button = primitiveWithForwardRef(ButtonPrimitive);
Button.displayName = 'Button';

const FieldGroupIconButtonPrimitive = ({ children, className, ...rest }, ref) => (React__namespace.createElement(FieldGroupIcon, { as: Button, className: ui.classNames(ui.ComponentClassName.FieldGroupIconButton, className), ref: ref, ...rest }, children));
const FieldGroupIconButton = primitiveWithForwardRef(FieldGroupIconButtonPrimitive);
FieldGroupIconButton.displayName = 'FieldGroupIconButton';

const ariaLabelText = ComponentText.Fields.clearButtonLabel;
const FieldClearButtonPrimitive = ({ ariaLabel = ariaLabelText, size, ...rest }, ref) => {
    const icons = useIcons('field');
    return (React__namespace.createElement(FieldGroupIconButton, { ariaLabel: ariaLabel, size: size, ref: ref, ...rest }, icons?.clear ?? React__namespace.createElement(IconClose, null)));
};
const FieldClearButton = primitiveWithForwardRef(FieldClearButtonPrimitive);
FieldClearButton.displayName = 'FieldClearButton';

const TextPrimitive = ({ as = 'p', className, children, isTruncated, variation, ...rest }, ref) => {
    const componentClasses = ui.classNames(ui.ComponentClassName.Text, ui.classNameModifier(ui.ComponentClassName.Text, variation), ui.classNameModifierByFlag(ui.ComponentClassName.Text, 'truncated', isTruncated), className);
    return (React__namespace.createElement(View, { as: as, className: componentClasses, ref: ref, ...rest }, children));
};
/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/text)
 */
const Text = primitiveWithForwardRef(TextPrimitive);
Text.displayName = 'Text';

const QA_FIELD_DESCRIPTION = 'qa-field-description';
const FieldDescription = ({ descriptiveText, labelHidden, ...rest }) => descriptiveText ? (React__namespace.createElement(Text, { "data-testid": QA_FIELD_DESCRIPTION, className: ui.classNames(ui.ComponentClassName.FieldDescription, {
        [ui.ComponentClassName.VisuallyHidden]: labelHidden,
    }), ...rest }, descriptiveText)) : null;
FieldDescription.displayName = 'FieldDescription';

const FieldErrorMessage = ({ errorMessage, hasError, ...rest }) => {
    return hasError && errorMessage ? (React__namespace.createElement(Text, { className: ui.ComponentClassName.FieldErrorMessage, ...rest }, errorMessage)) : null;
};
FieldErrorMessage.displayName = 'FieldErrorMessage';

const LabelPrimitive = ({ children, className, visuallyHidden, ...rest }, ref) => {
    return (React__namespace.createElement(View, { as: "label", className: ui.classNames(ui.ComponentClassName.Label, className, {
            [ui.ComponentClassName.VisuallyHidden]: visuallyHidden,
        }), ref: ref, ...rest }, children));
};
const Label = primitiveWithForwardRef(LabelPrimitive);
Label.displayName = 'Label';

const FieldPrimitive = (props, ref) => {
    const { className, size, testId, children, label, labelHidden, errorMessage, hasError, descriptiveText, ...rest } = props;
    return (React__namespace.createElement(Flex, { className: ui.classNames(ui.ComponentClassName.Field, ui.classNameModifier(ui.ComponentClassName.Field, size), className), testId: testId, ref: ref, ...rest },
        label ? React__namespace.createElement(Label, { visuallyHidden: labelHidden }, label) : null,
        React__namespace.createElement(FieldDescription, { labelHidden: labelHidden, descriptiveText: descriptiveText }),
        children,
        errorMessage ? (React__namespace.createElement(FieldErrorMessage, { hasError: hasError, errorMessage: errorMessage })) : null));
};
const Field = primitiveWithForwardRef(FieldPrimitive);
Field.displayName = 'Field';

exports.ARROW_DOWN = ARROW_DOWN;
exports.ARROW_UP = ARROW_UP;
exports.AlertIcon = AlertIcon;
exports.Button = Button;
exports.ComponentPropsToStylePropsMap = ComponentPropsToStylePropsMap;
exports.ComponentPropsToStylePropsMapKeys = ComponentPropsToStylePropsMapKeys;
exports.ComponentText = ComponentText;
exports.ENTER_KEY = ENTER_KEY;
exports.ESCAPE_KEY = ESCAPE_KEY;
exports.Field = Field;
exports.FieldClearButton = FieldClearButton;
exports.FieldDescription = FieldDescription;
exports.FieldErrorMessage = FieldErrorMessage;
exports.FieldGroupIcon = FieldGroupIcon;
exports.FieldGroupIconButton = FieldGroupIconButton;
exports.FieldsetContext = FieldsetContext;
exports.Flex = Flex;
exports.Icon = Icon;
exports.IconAdd = IconAdd;
exports.IconCheck = IconCheck;
exports.IconCheckCircle = IconCheckCircle;
exports.IconChevronLeft = IconChevronLeft;
exports.IconChevronRight = IconChevronRight;
exports.IconClose = IconClose;
exports.IconError = IconError;
exports.IconExpandMore = IconExpandMore;
exports.IconIndeterminate = IconIndeterminate;
exports.IconInfo = IconInfo;
exports.IconMenu = IconMenu;
exports.IconRemove = IconRemove;
exports.IconSearch = IconSearch;
exports.IconStar = IconStar;
exports.IconUser = IconUser;
exports.IconVisibility = IconVisibility;
exports.IconVisibilityOff = IconVisibilityOff;
exports.IconWarning = IconWarning;
exports.IconsContext = IconsContext;
exports.Label = Label;
exports.Loader = Loader;
exports.Text = Text;
exports.ThemeContext = ThemeContext;
exports.View = View;
exports.getConsecutiveIntArray = getConsecutiveIntArray;
exports.getStyleValue = getStyleValue;
exports.getValueAtCurrentBreakpoint = getValueAtCurrentBreakpoint;
exports.primitiveWithForwardRef = primitiveWithForwardRef;
exports.strHasLength = strHasLength;
exports.useAuth = useAuth;
exports.useBreakpoint = useBreakpoint;
exports.useColorMode = useColorMode;
exports.useDeprecationWarning = useDeprecationWarning;
exports.useDropZone = useDropZone;
exports.useFieldset = useFieldset;
exports.useIcons = useIcons;
exports.useStyles = useStyles;
exports.useTheme = useTheme;
