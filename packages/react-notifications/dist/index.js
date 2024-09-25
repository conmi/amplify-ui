'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uiReactCoreNotifications = require('@aws-amplify/ui-react-core-notifications');
var React = require('react');
var uiReact = require('@aws-amplify/ui-react');
var uiReactCore = require('@aws-amplify/ui-react-core');
var ui = require('@aws-amplify/ui');
var utils = require('aws-amplify/utils');
var internal = require('@aws-amplify/ui-react/internal');
var tinycolor = require('tinycolor2');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

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
var tinycolor__default = /*#__PURE__*/_interopDefault(tinycolor);

var ImagePrefetchStatus;
(function (ImagePrefetchStatus) {
    ImagePrefetchStatus["Aborted"] = "ABORTED";
    ImagePrefetchStatus["Failure"] = "FAILURE";
    ImagePrefetchStatus["Fetching"] = "FETCHING";
    ImagePrefetchStatus["Success"] = "SUCCESS";
})(ImagePrefetchStatus || (ImagePrefetchStatus = {}));

const logger$1 = new utils.ConsoleLogger('InAppMessaging');
/**
 * Handles prefetching for message images
 *
 * @param image contains image source
 * @returns message image dimensions and fetching related booleans
 */
function useMessageImage(image) {
    const { src } = image ?? {};
    const shouldPrefetch = !!src;
    // set initial status to fetching if prefetch is required
    const [prefetchStatus, setPrefetchStatus] = React.useState(shouldPrefetch ? ImagePrefetchStatus.Fetching : null);
    const isImageFetching = prefetchStatus === ImagePrefetchStatus.Fetching;
    const hasRenderableImage = prefetchStatus === ImagePrefetchStatus.Success;
    React.useEffect(() => {
        if (!shouldPrefetch) {
            return;
        }
        const img = new Image();
        img.onload = () => {
            setPrefetchStatus(ImagePrefetchStatus.Success);
        };
        img.onabort = () => {
            logger$1.error(`Image load aborted: ${src}`);
            setPrefetchStatus(ImagePrefetchStatus.Aborted);
        };
        img.onerror = () => {
            logger$1.error(`Image failed to load: ${src}`);
            setPrefetchStatus(ImagePrefetchStatus.Failure);
        };
        img.src = src;
    }, [shouldPrefetch, src]);
    return { hasRenderableImage, isImageFetching };
}

/**
 * Utility for extracting message payload style
 *
 * @param props message props
 *
 * @returns message payload-specific styles
 */
const getPayloadStyle = ({ body, container, header, primaryButton, secondaryButton, }) => ({
    body: body?.style ?? {},
    container: container?.style ?? {},
    header: header?.style ?? {},
    primaryButton: primaryButton?.style ?? {},
    secondaryButton: secondaryButton?.style ?? {},
});
/**
 * Receives message styling and returns style property values for use with in-app message
 * UI components. Handles resolving style precedence between payload and custom styles
 *
 * Styles resolve precedence from lowest to highest:
 *   1. Payload styles
 *   2. Custom (override) styles
 *
 * @param params message style params
 *
 * @returns message component styles
 */
function getMessageStyles({ styleParams, }) {
    const { payloadStyle, overrideStyle } = styleParams;
    return {
        // message body style
        body: {
            ...payloadStyle?.body,
            ...overrideStyle?.body,
        },
        // close button style - not defined in payload, override only
        closeIconButton: overrideStyle?.closeIconButton ?? {},
        // message container style
        container: {
            ...payloadStyle?.container,
            ...overrideStyle?.container,
        },
        // message header style
        header: {
            ...payloadStyle?.header,
            ...overrideStyle?.header,
        },
        // image style - not defined in payload, override only
        image: overrideStyle?.image ?? {},
        // message primary button style
        primaryButton: {
            ...payloadStyle?.primaryButton,
            ...overrideStyle?.primaryButton,
        },
        // message secondary button style
        secondaryButton: {
            ...payloadStyle?.secondaryButton,
            ...overrideStyle?.secondaryButton,
        },
    };
}

/**
 * Handle common message UI component prop logic including render booleans, and
 * style resolving
 *
 * @param props message UI component props
 *
 * @returns message UI component render related booleans and styles
 */
function useMessageProps(props) {
    const { image, onDisplay } = props;
    const hasDisplayed = React.useRef(false);
    const { hasRenderableImage, isImageFetching } = useMessageImage(image);
    const shouldRenderMessage = !isImageFetching;
    React.useEffect(() => {
        if (!hasDisplayed.current && shouldRenderMessage) {
            onDisplay?.();
            hasDisplayed.current = true;
        }
    }, [onDisplay, shouldRenderMessage]);
    const styles = React.useMemo(() => getMessageStyles({
        styleParams: {
            payloadStyle: getPayloadStyle(props),
            overrideStyle: props.style,
        },
    }), [props]);
    return { hasRenderableImage, shouldRenderMessage, styles };
}

function CloseIconButton({ className, dismissButtonLabel = 'Dismiss message', onClick, style, ...rest }) {
    return (React__namespace.createElement(uiReact.Button, { ariaLabel: dismissButtonLabel, className: className, onClick: onClick, style: style, variation: "link", ...rest },
        React__namespace.createElement(internal.IconClose, { "aria-hidden": "true", size: "1.5rem" })));
}

// Base block class for MessageLayout
const BLOCK_CLASS$3 = 'amplify-inappmessaging-messagelayout';
// Element classes for MessageLayout
const BUTTON_CLASS = `${BLOCK_CLASS$3}__button`;
const CLOSE_BUTTON_CLASS = `${BLOCK_CLASS$3}__close-button`;
const CONTENT_CLASS = `${BLOCK_CLASS$3}__content`;
const HEADER_CLASS = `${BLOCK_CLASS$3}__header`;
const IMAGE_CONTAINER_CLASS = `${BLOCK_CLASS$3}__image-container`;
const TEXT_CONTAINER_CLASS = `${BLOCK_CLASS$3}__text-container`;
// Test IDs
const BODY_TEXT_TEST_ID = 'inappmessaging-messagelayout-bodytext';
const BUTTON_GROUP_TEST_ID = 'inappmessaging-messagelayout-buttongroup';
const CONTENT_TEST_ID = 'inappmessaging-messagelayout-content';
const HEADER_TEXT_TEST_ID = 'inappmessaging-messagelayout-headertext';
const IMAGE_CONTAINER_TEST_ID = 'inappmessaging-messagelayout-imagecontainer';
const MESSAGE_LAYOUT_TEST_ID = 'inappmessaging-messagelayout';
const PRIMARY_BUTTON_TEST_ID = 'inappmessaging-messagelayout-primarybutton';
const SECONDARY_BUTTON_TEST_ID = 'inappmessaging-messagelayout-secondarybutton';
const TEXT_CONTAINER_TEST_ID = 'inappmessaging-messagelayout-textcontainer';

/**
 * Utility for determining the class modifier for an In-App Messaging button
 * based on its background color
 *
 * @param buttonStyles button styles which should contain the background color
 * @param defaultModifier modifier that should be returned in cases where
 * background color is undefined
 *
 * @returns the modifier - either 'light' or 'dark'
 */
const getButtonModifier = (buttonStyles, defaultModifier = 'light') => {
    const { backgroundColor } = buttonStyles ?? {};
    if (!backgroundColor) {
        return defaultModifier;
    }
    const color = tinycolor__default["default"](backgroundColor);
    return color.isDark() ? 'dark' : 'light';
};

const isMessageButton = (button) => !ui.isEmpty(button);
function MessageLayout({ body, buttonSize, hasRenderableImage, header, image, onClose, orientation = 'vertical', primaryButton, secondaryButton, styles, }) {
    const buttonModifiers = React__namespace.useMemo(() => ({
        primary: getButtonModifier(styles.primaryButton),
        secondary: getButtonModifier(styles.secondaryButton),
    }), [styles]);
    const isHorizontal = orientation === 'horizontal';
    const closeButton = (React__namespace.createElement(CloseIconButton, { className: CLOSE_BUTTON_CLASS, onClick: onClose, style: styles.closeIconButton }));
    const hasPrimaryButton = isMessageButton(primaryButton);
    const hasSecondaryButton = isMessageButton(secondaryButton);
    const hasButtons = hasPrimaryButton || hasSecondaryButton;
    return (React__namespace.createElement(uiReact.Flex, { className: BLOCK_CLASS$3, "data-testid": MESSAGE_LAYOUT_TEST_ID, style: styles.container },
        !isHorizontal && React__namespace.createElement(uiReact.Flex, { justifyContent: "flex-end" }, closeButton),
        React__namespace.createElement(uiReact.Flex, { className: ui.classNames(CONTENT_CLASS, `${CONTENT_CLASS}--${orientation}`), "data-testid": CONTENT_TEST_ID },
            hasRenderableImage && (React__namespace.createElement(uiReact.Flex, { className: ui.classNames(IMAGE_CONTAINER_CLASS, `${IMAGE_CONTAINER_CLASS}--${orientation}`), "data-testid": IMAGE_CONTAINER_TEST_ID },
                React__namespace.createElement(uiReact.Image, { alt: "In-App Message Image", src: image?.src, style: styles.image }))),
            React__namespace.createElement(uiReact.Flex, { className: ui.classNames(TEXT_CONTAINER_CLASS, `${TEXT_CONTAINER_CLASS}--${orientation}`), "data-testid": TEXT_CONTAINER_TEST_ID },
                header?.content && (React__namespace.createElement(uiReact.Heading, { className: HEADER_CLASS, isTruncated: true, level: 2, style: styles.header, testId: HEADER_TEXT_TEST_ID }, header.content)),
                body?.content && (React__namespace.createElement(uiReact.Text, { style: styles.body, testId: BODY_TEXT_TEST_ID }, body.content))),
            isHorizontal && React__namespace.createElement(uiReact.Flex, { alignItems: "flex-start" }, closeButton)),
        hasButtons && (React__namespace.createElement(uiReact.ButtonGroup, { size: buttonSize, testId: BUTTON_GROUP_TEST_ID },
            hasSecondaryButton && (React__namespace.createElement(uiReact.Button, { className: ui.classNames(BUTTON_CLASS, `${BUTTON_CLASS}--${buttonModifiers.secondary}`), onClick: secondaryButton.onAction, style: styles.secondaryButton, testId: SECONDARY_BUTTON_TEST_ID }, secondaryButton.title)),
            hasPrimaryButton && (React__namespace.createElement(uiReact.Button, { className: ui.classNames(BUTTON_CLASS, `${BUTTON_CLASS}--${buttonModifiers.primary}`), onClick: primaryButton.onAction, style: styles.primaryButton, testId: PRIMARY_BUTTON_TEST_ID }, primaryButton.title))))));
}

// Base block class for BannerMessage
const BLOCK_CLASS$2 = 'amplify-inappmessaging-bannermessage';

function BannerMessage(props) {
    const messageProps = useMessageProps(props);
    const shouldBeFullWidth = uiReact.useBreakpointValue([true, true, false]);
    const { shouldRenderMessage, styles } = messageProps;
    if (!shouldRenderMessage) {
        return null;
    }
    const { alignment = 'right', position = 'top' } = props;
    const isCenterMiddle = alignment === 'center' && position === 'middle';
    return (React__namespace["default"].createElement(uiReact.Flex, { className: ui.classNames(BLOCK_CLASS$2, {
            [`${BLOCK_CLASS$2}--${position}`]: !isCenterMiddle,
            [`${BLOCK_CLASS$2}--${alignment}`]: !isCenterMiddle,
            [`${BLOCK_CLASS$2}--center-middle`]: isCenterMiddle,
            [`${BLOCK_CLASS$2}--full-width`]: shouldBeFullWidth,
        }), role: "dialog", testId: `inappmessaging-${position}banner-dialog` },
        React__namespace["default"].createElement(MessageLayout, { ...props, ...messageProps, orientation: "horizontal", buttonSize: "small", styles: styles })));
}

const BACKDROP_TEST_ID = 'inappmessaging-backdrop';
function Backdrop({ onClick, ...rest }) {
    return (React__namespace["default"].createElement(uiReact.View, { className: "amplify-inappmessaging-backdrop", "data-testid": BACKDROP_TEST_ID, onClick: onClick, ...rest }));
}

function withBackdrop(Content, options = {}) {
    return function ContentWithBackdrop(props) {
        return (React__namespace["default"].createElement(React__namespace["default"].Fragment, null,
            React__namespace["default"].createElement(Backdrop, { ...options }),
            React__namespace["default"].createElement(uiReact.Flex, { className: "amplify-inappmessaging-backdrop-content-container" },
                React__namespace["default"].createElement(uiReact.View, { className: "amplify-inappmessaging-backdrop-content" },
                    React__namespace["default"].createElement(Content, { ...props })))));
    };
}

// Base block class for FullScreenMessage
const BLOCK_CLASS$1 = 'amplify-inappmessaging-fullscreenmessage';

function FullScreenMessage(props) {
    const messageProps = useMessageProps(props);
    const shouldBeFullScreen = uiReact.useBreakpointValue([true, true, false]);
    const { shouldRenderMessage, styles } = messageProps;
    const { onClose: onClick } = props;
    if (!shouldRenderMessage) {
        return null;
    }
    const Message = () => (React__namespace.createElement(uiReact.Flex, { className: ui.classNames(BLOCK_CLASS$1, {
            [`${BLOCK_CLASS$1}--fullscreen`]: shouldBeFullScreen,
        }), role: "dialog", testId: "inappmessaging-fullscreen-dialog" },
        React__namespace.createElement(MessageLayout, { ...props, ...messageProps, styles: styles })));
    if (shouldBeFullScreen) {
        return React__namespace.createElement(Message, null);
    }
    const MessageWithBackdrop = withBackdrop(Message, { onClick });
    return React__namespace.createElement(MessageWithBackdrop, null);
}

// Base block class for ModalMessage
const BLOCK_CLASS = 'amplify-inappmessaging-modalmessage';
// Element classes for ModalMessage
const DIALOG_CLASS = `${BLOCK_CLASS}__dialog`;

function ModalMessage(props) {
    const messageProps = useMessageProps(props);
    const shouldBeFullWidth = uiReact.useBreakpointValue([true, true, false]);
    const { shouldRenderMessage, styles } = messageProps;
    if (!shouldRenderMessage) {
        return null;
    }
    return (React__namespace.createElement(uiReact.Flex, { className: BLOCK_CLASS },
        React__namespace.createElement(uiReact.Flex, { className: ui.classNames(DIALOG_CLASS, {
                [`${DIALOG_CLASS}--full-width`]: shouldBeFullWidth,
            }), role: "dialog", testId: "inappmessaging-modal-dialog" },
            React__namespace.createElement(MessageLayout, { ...props, ...messageProps, styles: styles }))));
}

const logger = new utils.ConsoleLogger('InAppMessaging');
const handleMessageLinkAction = (input) => {
    let url;
    try {
        url = new URL(input);
    }
    catch {
        logger.warn(`Unsupported url provided: ${input}`);
        return;
    }
    const { protocol } = url;
    const isHttpProtocol = protocol === 'http:';
    const isHttpsProtocol = protocol === 'https:';
    if (!(isHttpProtocol || isHttpsProtocol)) {
        logger.warn(`Unsupported url protocol provided: ${protocol}`);
        return;
    }
    window.open(input);
};

const VERSION = '2.0.29';

// TODO: replace below components incrementally as they become available
function CarouselMessage(_) {
    return null;
}
const platformComponents = {
    BannerMessage,
    CarouselMessage,
    FullScreenMessage,
    ModalMessage,
};
const onMessageAction = ({ action, url }) => {
    uiReactCoreNotifications.handleMessageAction({
        action,
        url,
        handleMessageLinkAction,
    });
};
function InAppMessageDisplay({ components: overrideComponents, }) {
    const components = React__namespace["default"].useMemo(() => ({ ...platformComponents, ...overrideComponents }), [overrideComponents]);
    const { Component, props } = uiReactCoreNotifications.useMessage({
        components,
        onMessageAction,
    });
    uiReactCore.useSetUserAgent({
        componentName: 'InAppMessaging',
        packageName: 'react-notifications',
        version: VERSION,
    });
    // There is currently no way to pass In-App Message payload variants so we
    // will fix the theme around In-App Messaging components to always assume
    // light mode
    return (React__namespace["default"].createElement(uiReact.ThemeProvider, { colorMode: "light" },
        React__namespace["default"].createElement(Component, { ...props })));
}
InAppMessageDisplay.BannerMessage = BannerMessage;
InAppMessageDisplay.CarouselMessage = CarouselMessage;
InAppMessageDisplay.FullScreenMessage = FullScreenMessage;
InAppMessageDisplay.ModalMessage = ModalMessage;

function withInAppMessaging(Component, options) {
    return function WrappedWithInAppMessaging(props) {
        return (React__namespace["default"].createElement(uiReactCoreNotifications.InAppMessagingProvider, null,
            React__namespace["default"].createElement(InAppMessageDisplay, { ...options }),
            React__namespace["default"].createElement(Component, { ...props })));
    };
}

Object.defineProperty(exports, "InAppMessagingProvider", {
    enumerable: true,
    get: function () { return uiReactCoreNotifications.InAppMessagingProvider; }
});
Object.defineProperty(exports, "useInAppMessaging", {
    enumerable: true,
    get: function () { return uiReactCoreNotifications.useInAppMessaging; }
});
exports.InAppMessageDisplay = InAppMessageDisplay;
exports.withInAppMessaging = withInAppMessaging;
