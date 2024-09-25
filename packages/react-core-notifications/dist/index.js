'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var inAppMessaging = require('aws-amplify/in-app-messaging');
var utils = require('aws-amplify/utils');
var ui = require('@aws-amplify/ui');
var uiReactCore = require('@aws-amplify/ui-react-core');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const InAppMessagingContext = React.createContext(null);

function InAppMessagingProvider({ children, }) {
    const [message, setMessage] = React.useState(null);
    React.useEffect(() => {
        const listener = inAppMessaging.onMessageReceived(setMessage);
        return listener.remove;
    }, []);
    const clearMessage = React.useCallback(() => {
        setMessage(null);
    }, []);
    const value = React.useMemo(() => ({
        clearMessage,
        displayMessage: setMessage,
        message,
    }), [clearMessage, message]);
    return (React__default["default"].createElement(InAppMessagingContext.Provider, { value: value }, children));
}

/**
 * Utility hook used to access the InAppMessagingContext values
 *
 * @returns {InAppMessagingContextType} InAppMessaging context values
 */
function useInAppMessaging() {
    const inAppMessagingContext = React.useContext(InAppMessagingContext);
    if (!inAppMessagingContext) {
        throw new Error('InAppMessagingContext is empty, did you forget the InAppMessagingProvider?');
    }
    return inAppMessagingContext;
}

const logger$2 = new utils.ConsoleLogger('InAppMessaging');
const positions = {
    BOTTOM_BANNER: 'bottom',
    MIDDLE_BANNER: 'middle',
    TOP_BANNER: 'top',
};
const getPositionProp = (layout) => positions[layout];
const getActionHandler = (actionParams, onMessageAction, onActionCallback) => ({
    onAction() {
        try {
            onMessageAction(actionParams);
        }
        catch (e) {
            logger$2.error(`Message action failure: ${e}`);
        }
        finally {
            onActionCallback();
        }
    },
});
const getButtonProps = ({ action, url, ...baseButtonProps }, onMessageAction, onActionCallback) => ({
    ...baseButtonProps,
    ...getActionHandler({ action, url }, onMessageAction, onActionCallback),
});
const getContentProps = (content, onMessageAction, onActionCallback) => {
    const props = {};
    if (!content) {
        return props;
    }
    const { primaryButton, secondaryButton, ...restContent } = content;
    if (primaryButton) {
        props.primaryButton = getButtonProps(primaryButton, onMessageAction, onActionCallback);
    }
    if (secondaryButton) {
        props.secondaryButton = getButtonProps(secondaryButton, onMessageAction, onActionCallback);
    }
    return { ...props, ...restContent };
};

const EMPTY_PROPS = Object.freeze({});
const logger$1 = new utils.ConsoleLogger('InAppMessaging');
/**
 * Utility hook for parsing a message and retrieving its corresponding UI component and props
 *
 * @param {UseMessageParams} props - platform specific UI components, action handler, and styles
 * @returns {UseMessage} message UI component and props
 */
function useMessage({ components, onMessageAction, }) {
    const { clearMessage, message } = useInAppMessaging();
    const { BannerMessage, CarouselMessage, FullScreenMessage, ModalMessage } = components;
    if (ui.isNil(message)) {
        return {
            Component: uiReactCore.RenderNothing,
            props: EMPTY_PROPS,
        };
    }
    const { content, layout } = message;
    const onActionCallback = () => {
        inAppMessaging.notifyMessageInteraction({ type: 'messageActionTaken', message });
        clearMessage();
    };
    const onClose = () => {
        inAppMessaging.notifyMessageInteraction({ type: 'messageDismissed', message });
        clearMessage();
    };
    const onDisplay = () => {
        inAppMessaging.notifyMessageInteraction({ type: 'messageDisplayed', message });
    };
    switch (layout) {
        case 'BOTTOM_BANNER':
        case 'MIDDLE_BANNER':
        case 'TOP_BANNER': {
            const props = {
                ...getContentProps(content?.[0], onMessageAction, onActionCallback),
                layout,
                onClose,
                onDisplay,
                position: getPositionProp(layout),
            };
            return { Component: BannerMessage, props };
        }
        case 'CAROUSEL': {
            const props = {
                data: content?.map((item) => getContentProps(item, onMessageAction, onActionCallback)),
                layout,
                onClose,
                onDisplay,
            };
            return { Component: CarouselMessage, props };
        }
        case 'FULL_SCREEN': {
            const props = {
                ...getContentProps(content?.[0], onMessageAction, onActionCallback),
                layout,
                onClose,
                onDisplay,
            };
            return { Component: FullScreenMessage, props };
        }
        case 'MODAL': {
            const props = {
                ...getContentProps(content?.[0], onMessageAction, onActionCallback),
                layout,
                onClose,
                onDisplay,
            };
            return { Component: ModalMessage, props };
        }
        default: {
            logger$1.info(`Received unknown InAppMessage layout: ${layout}`);
            return {
                Component: uiReactCore.RenderNothing,
                props: EMPTY_PROPS,
            };
        }
    }
}

const logger = new utils.ConsoleLogger('InAppMessaging');
const handleMessageAction = ({ action, handleMessageLinkAction, url, }) => {
    logger.info(`Handle action: ${action}`);
    if (action === 'LINK' || action === 'DEEP_LINK') {
        if (!ui.isString(url)) {
            logger.warn(`url must be of type string. Received: ${url}`);
            return;
        }
        handleMessageLinkAction(url);
    }
};

exports.InAppMessagingProvider = InAppMessagingProvider;
exports.handleMessageAction = handleMessageAction;
exports.useInAppMessaging = useInAppMessaging;
exports.useMessage = useMessage;
