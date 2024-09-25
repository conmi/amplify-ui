'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var elements = require('@aws-amplify/ui-react-core/elements');
var uiReactCore = require('@aws-amplify/ui-react-core');
var ui = require('@aws-amplify/ui');
var uiReact = require('@aws-amplify/ui-react');
var internal = require('@aws-amplify/ui-react/internal');

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

const DEFAULT_ICON_PATHS = {
    attach: 'M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z',
    close: 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z',
    image: 'M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z',
    'send-message': 'M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z',
    'user-avatar': 'M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z',
};
const DEFAULT_ICON_ATTRIBUTES = {
    'aria-hidden': true,
    width: '24',
    height: '24',
    // `viewBox` coordinates map to `path` data in DEFAULT_ICON_PATHS
    viewBox: '0 -960 960 960',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
};
const BaseIconElement = elements.defineBaseElement({
    type: 'svg',
    displayName: 'Icon',
});
const getIconProps = ({ variant, ...props }) => {
    const pathData = variant ? DEFAULT_ICON_PATHS[variant] : undefined;
    const children = pathData ? (React__namespace["default"].createElement("path", { d: pathData, fill: "currentColor" })) : undefined;
    return {
        ...DEFAULT_ICON_ATTRIBUTES,
        ...props,
        children: props.children ?? children,
        variant,
    };
};
const IconElement = elements.withBaseElementProps(BaseIconElement, getIconProps);

const LabelElement$1 = elements.defineBaseElement({
    type: 'label',
    displayName: 'Label',
});
const TextElement = elements.defineBaseElement({
    type: 'p',
    displayName: 'Text',
});
const UnorderedListElement = elements.defineBaseElement({
    type: 'ul',
    displayName: 'UnorderedList',
});
const ListItemElement = elements.defineBaseElement({
    type: 'li',
    displayName: 'ListItem',
});
const HeadingElement = elements.defineBaseElement({
    type: 'h2',
    displayName: 'Title',
});
const ImageElement = elements.defineBaseElement({
    type: 'img',
    displayName: 'Image',
});
const InputElement = elements.defineBaseElement({
    type: 'input',
    displayName: 'Input',
});
const ButtonElement = elements.defineBaseElement({ type: 'button', displayName: 'Button' });
const ViewElement = elements.defineBaseElement({
    type: 'div',
    displayName: 'View',
});
const SpanElement = elements.defineBaseElement({
    type: 'span',
    displayName: 'Span',
});
const TextAreaElement = elements.defineBaseElement({
    type: 'textarea',
    displayName: 'TextArea',
});
const AIConversationElements = {
    Button: ButtonElement,
    Heading: HeadingElement,
    Icon: IconElement,
    Input: InputElement,
    Image: ImageElement,
    Label: LabelElement$1,
    ListItem: ListItemElement,
    Span: SpanElement,
    Text: TextElement,
    TextArea: TextAreaElement,
    UnorderedList: UnorderedListElement,
    View: ViewElement,
};

const ActionsContext = React__namespace["default"].createContext(undefined);
const ActionsProvider = ({ children, actions, }) => {
    return (React__namespace["default"].createElement(ActionsContext.Provider, { value: actions }, children));
};

const AvatarsContext = React__namespace["default"].createContext(undefined);
const AvatarsProvider = ({ children, avatars, }) => {
    return (React__namespace["default"].createElement(AvatarsContext.Provider, { value: avatars }, children));
};

const ConversationInputContext = React__namespace["default"].createContext({});
const ConversationInputContextProvider = ({ children, }) => {
    const [input, setInput] = React__namespace["default"].useState();
    const providerValue = React__namespace["default"].useMemo(() => ({ input, setInput }), [input, setInput]);
    return (React__namespace["default"].createElement(ConversationInputContext.Provider, { value: providerValue }, children));
};

const MessagesContext = React__namespace["default"].createContext(undefined);
// role of the user sending the message, assistant or user
const RoleContext = React__namespace["default"].createContext(undefined);
const MessagesProvider = ({ children, messages, }) => {
    return (React__namespace["default"].createElement(MessagesContext.Provider, { value: messages }, children));
};

const SuggestedPromptsContext = React__namespace["default"].createContext(undefined);
const SuggestedPromptProvider = ({ children, suggestedPrompts, }) => {
    return (React__namespace["default"].createElement(SuggestedPromptsContext.Provider, { value: suggestedPrompts }, children));
};

const MessageVariantContext = React__namespace["default"].createContext(undefined);
const MessageVariantProvider = ({ children, variant, }) => {
    return (React__namespace["default"].createElement(MessageVariantContext.Provider, { value: variant }, children));
};

function formatDate(date) {
    const dateString = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    return `${dateString} at ${timeString}`;
}
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function convertBufferToBase64(buffer, format) {
    let base64string = '';
    // Use node-based buffer if available
    // fall back on browser if not
    if (typeof Buffer !== 'undefined') {
        base64string = Buffer.from(new Uint8Array(buffer)).toString('base64');
    }
    else {
        base64string = arrayBufferToBase64(buffer);
    }
    return `data:image/${format};base64,${base64string}`;
}
function getImageTypeFromMimeType(mimeType) {
    return mimeType.split('/')[1];
}

const defaultAIConversationDisplayTextEn = {
    getMessageTimestampText: (date) => formatDate(date),
};

const { ConversationDisplayTextContext, ConversationDisplayTextProvider, useConversationDisplayText, } = uiReactCore.createContextUtilities({
    contextName: 'ConversationDisplayText',
    defaultValue: defaultAIConversationDisplayTextEn,
});

const ControlsContext = React__namespace["default"].createContext(undefined);
const ControlsProvider = ({ children, controls, }) => {
    return (React__namespace["default"].createElement(ControlsContext.Provider, { value: controls }, children));
};

const LoadingContext = React__namespace["default"].createContext(undefined);
const LoadingContextProvider = ({ children, isLoading, }) => {
    return (React__namespace["default"].createElement(LoadingContext.Provider, { value: isLoading }, children));
};

const RESPONSE_COMPONENT_PREFIX = 'AMPLIFY_UI_';
const ResponseComponentsContext = React__namespace["default"].createContext(undefined);
const prependResponseComponents = (responseComponents) => {
    if (!responseComponents)
        return responseComponents;
    return Object.keys(responseComponents).reduce((prev, key) => ((prev[`${RESPONSE_COMPONENT_PREFIX}${key}`] = responseComponents[key]),
        prev), {});
};
const ResponseComponentsProvider = ({ children, responseComponents, }) => {
    const _responseComponents = React__namespace["default"].useMemo(() => prependResponseComponents(responseComponents), [responseComponents]);
    return (React__namespace["default"].createElement(ResponseComponentsContext.Provider, { value: _responseComponents }, children));
};
const convertResponseComponentsToToolConfiguration = (responseComponents) => {
    if (!responseComponents) {
        return;
    }
    const tools = {};
    Object.keys(responseComponents).forEach((toolName) => {
        const { props } = responseComponents[toolName];
        const requiredProps = [];
        Object.keys(props).forEach((propName) => {
            if (props[propName].required)
                requiredProps.push(propName);
        });
        tools[toolName] = {
            description: responseComponents[toolName].description,
            inputSchema: {
                json: {
                    type: 'object',
                    required: requiredProps,
                    properties: {
                        ...props,
                    },
                },
            },
        };
    });
    return { tools };
};

const SendMessageContext = React__namespace["default"].createContext(undefined);
const SendMessageContextProvider = ({ children, handleSendMessage, }) => {
    return (React__namespace["default"].createElement(SendMessageContext.Provider, { value: handleSendMessage }, children));
};

const { Button: Button$5, Span: Span$3, View: View$7 } = AIConversationElements;
const ACTIONS_BAR_BLOCK = 'ai-actions-bar';
const ActionIcon = elements.withBaseElementProps(Span$3, {
    'aria-hidden': 'true',
    className: `${ACTIONS_BAR_BLOCK}__icon`,
});
const ActionButtonBase = elements.withBaseElementProps(Button$5, {
    className: `${ACTIONS_BAR_BLOCK}__button`,
});
const ActionButton = React__namespace["default"].forwardRef(function ActionButton(props, ref) {
    return React__namespace["default"].createElement(ActionButtonBase, { ...props, ref: ref });
});
const Container$4 = elements.withBaseElementProps(View$7, {
    className: `${ACTIONS_BAR_BLOCK}__container`,
});
const ActionsBarControl = ({ message, focusable, }) => {
    const actions = React__namespace["default"].useContext(ActionsContext);
    return (React__namespace["default"].createElement(Container$4, null, actions?.map((action, index) => (React__namespace["default"].createElement(ActionButton, { "aria-label": action.displayName, key: index, onClick: () => action.handler(message), tabIndex: focusable ? 0 : -1 },
        React__namespace["default"].createElement(ActionIcon, { "data-testid": `action-icon-${action.displayName}` }, action.icon))))));
};
ActionsBarControl.Button = ActionButton;
ActionsBarControl.Container = Container$4;
ActionsBarControl.Icon = ActionIcon;

const { Icon: Icon$5, Span: Span$2, Text: Text$4, View: View$6 } = AIConversationElements;
const AVATAR_BLOCK = 'ai-avatar';
const DEFAULT_USER_ICON = elements.withBaseElementProps(Icon$5, {
    variant: 'user-avatar',
});
const DEFAULT_AI_ICON = () => (React__namespace["default"].createElement("svg", { width: "28", height: "28", viewBox: "0 0 28 28", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React__namespace["default"].createElement("g", { id: "raven-logo" },
        React__namespace["default"].createElement("path", { id: "Subtract", fillRule: "evenodd", clipRule: "evenodd", d: "M16 1.29833C14.7624 0.583803 13.2376 0.583804 12 1.29833L4.00006 5.91711C2.76246 6.63165 2.00006 7.95216 2.00006 9.38122V18.6188C2.00006 20.0478 2.76246 21.3684 4.00006 22.0829L12 26.7017C13.2376 27.4162 14.7624 27.4162 16 26.7017L24 22.0829C25.2376 21.3684 26 20.0478 26 18.6188V9.38122C26 7.95215 25.2376 6.63164 24 5.91711L16 1.29833ZM14.9379 6.37317C14.6157 5.50255 13.3843 5.50255 13.0622 6.37317L11.4151 10.8243C11.3138 11.098 11.098 11.3138 10.8243 11.4151L6.37317 13.0621C5.50256 13.3843 5.50256 14.6157 6.37317 14.9378L10.8243 16.5849C11.098 16.6862 11.3138 16.902 11.4151 17.1757L13.0622 21.6268C13.3843 22.4974 14.6157 22.4974 14.9379 21.6268L16.5849 17.1757C16.6862 16.902 16.902 16.6862 17.1757 16.5849L21.6268 14.9378C22.4974 14.6157 22.4974 13.3843 21.6268 13.0621L17.1757 11.4151C16.902 11.3138 16.6862 11.098 16.5849 10.8243L14.9379 6.37317Z", fill: "#0D1A26" }))));
const AvatarDisplayName = elements.withBaseElementProps(Text$4, {
    className: `${AVATAR_BLOCK}__display-name`,
});
const AvatarIcon = elements.withBaseElementProps(Span$2, {
    'aria-hidden': true,
    className: `${AVATAR_BLOCK}__icon`,
});
const Container$3 = elements.withBaseElementProps(View$6, {
    className: `${AVATAR_BLOCK}__container`,
});
const AvatarControl = () => {
    const avatars = React__namespace["default"].useContext(AvatarsContext);
    const role = React__namespace["default"].useContext(RoleContext);
    const avatar = role === 'assistant' ? avatars?.ai : avatars?.user;
    const defaultIcon = role === 'assistant' ? React__namespace["default"].createElement(DEFAULT_AI_ICON, null) : React__namespace["default"].createElement(DEFAULT_USER_ICON, null);
    const defaultDisplayName = role === 'user' ? 'User' : 'Assistant';
    return (React__namespace["default"].createElement(Container$3, { "data-testid": 'avatar' },
        React__namespace["default"].createElement(AvatarIcon, { "data-testid": `avatar-icon-${role}` }, avatar?.avatar ?? defaultIcon),
        React__namespace["default"].createElement(AvatarDisplayName, null, avatar?.username ?? defaultDisplayName)));
};
AvatarControl.Container = Container$3;
AvatarControl.DisplayName = AvatarDisplayName;
AvatarControl.Icon = AvatarIcon;

const { View: View$5, Button: Button$4, Icon: Icon$4, Text: Text$3 } = AIConversationElements;
const HEADER_BLOCK = 'ai-header';
const HeaderTextBase = elements.withBaseElementProps(Text$3, {
    className: `${HEADER_BLOCK}__text`,
});
const HeaderText$1 = React__namespace["default"].forwardRef(function HeaderText(props, ref) {
    return React__namespace["default"].createElement(HeaderTextBase, { ...props, ref: ref });
});
const CloseIcon = elements.withBaseElementProps(Icon$4, {
    className: `${HEADER_BLOCK}__icon`,
    variant: 'close',
});
const CloseButtonBase = elements.withBaseElementProps(Button$4, {
    className: `${HEADER_BLOCK}__button`,
});
const CloseButton = React__namespace["default"].forwardRef(function CloseButton(props, ref) {
    return React__namespace["default"].createElement(CloseButtonBase, { ...props, ref: ref });
});
const Container$2 = elements.withBaseElementProps(View$5, {
    className: `${HEADER_BLOCK}__container`,
});
const HeaderControl = () => (React__namespace["default"].createElement(Container$2, null,
    React__namespace["default"].createElement(HeaderText$1, null, "Raven Chat"),
    React__namespace["default"].createElement(CloseButton, null,
        React__namespace["default"].createElement(CloseIcon, null))));
HeaderControl.Container = Container$2;
HeaderControl.Text = HeaderText$1;
HeaderControl.Button = CloseButton;

const { Button: Button$3, Icon: Icon$3, View: View$4 } = AIConversationElements;
const ATTACH_FILE_BLOCK = 'ai-attach-file';
const FIELD_BLOCK$1 = 'ai-field';
const AttachFileIcon = elements.withBaseElementProps(Icon$3, {
    className: `${ATTACH_FILE_BLOCK}__icon`,
    variant: 'attach',
});
const AttachFileContainer = elements.withBaseElementProps(View$4, {
    className: `${ATTACH_FILE_BLOCK}__container`,
});
const VisuallyHidden$1 = elements.withBaseElementProps(View$4, {
    className: `${FIELD_BLOCK$1}__visually-hidden`,
});
const AttachFileButton = elements.withBaseElementProps(Button$3, {
    'aria-label': 'Attach file',
    className: `${FIELD_BLOCK$1}__button`,
    type: 'button',
    variant: 'attach',
});
const AttachFileControl = () => {
    const hiddenInput = React__namespace["default"].useRef(null);
    const { setInput } = React__namespace["default"].useContext(ConversationInputContext);
    function handleButtonClick() {
        if (hiddenInput.current) {
            hiddenInput.current.click();
            hiddenInput.current.value = '';
        }
    }
    function handleFileChange(e) {
        const { files } = e.target;
        if (files && files?.length > 0 && setInput) {
            Array.from(files).forEach((file) => {
                setInput((prevInput) => ({
                    ...prevInput,
                    files: [...(prevInput?.files ?? []), file],
                }));
            });
        }
    }
    return (React__namespace["default"].createElement(AttachFileContainer, null,
        React__namespace["default"].createElement(AttachFileButton, { onClick: handleButtonClick },
            React__namespace["default"].createElement(AttachFileIcon, null)),
        React__namespace["default"].createElement(VisuallyHidden$1, null,
            React__namespace["default"].createElement("input", { accept: ".jpeg,.png,.webp,.gif", "data-testid": "hidden-file-input", onChange: handleFileChange, ref: hiddenInput, type: "file", multiple: true }))));
};
AttachFileControl.Icon = AttachFileIcon;
AttachFileControl.Button = AttachFileButton;
AttachFileControl.Container = AttachFileContainer;

const { Button: Button$2, Icon: Icon$2, ListItem, UnorderedList: ListElement, Span: Span$1, Text: Text$2, View: View$3, } = AIConversationElements;
const IMAGE_LIST_BLOCK = 'ai-attachment-list';
const IMAGE_ITEM_BLOCK = 'ai-attachment';
const REMOVE_IMAGE_BLOCK = 'ai-remove-attachment';
const IMAGE_TEXT_BLOCK = 'ai-attachment-text';
const RemoveIcon = elements.withBaseElementProps(Icon$2, {
    className: `${REMOVE_IMAGE_BLOCK}__icon`,
    variant: 'close',
});
const RemoveButton = elements.withBaseElementProps(Button$2, {
    'aria-label': 'Remove file',
    className: `${REMOVE_IMAGE_BLOCK}__button`,
    variant: 'remove',
    type: 'button',
});
const RemoveButtonControl = ({ onRemove }) => {
    return (React__namespace["default"].createElement(RemoveButton, { onClick: onRemove },
        React__namespace["default"].createElement(RemoveIcon, null)));
};
RemoveButtonControl.Icon = RemoveIcon;
RemoveButtonControl.Button = RemoveButton;
const ImageIcon = elements.withBaseElementProps(Icon$2, {
    className: `${IMAGE_ITEM_BLOCK}__icon`,
    variant: 'image',
});
const FileNameText = elements.withBaseElementProps(Text$2, {
    className: `${IMAGE_TEXT_BLOCK}__file-name`,
});
const FileSizeText = elements.withBaseElementProps(Text$2, {
    className: `${IMAGE_TEXT_BLOCK}__file-size`,
});
const Separator$1 = elements.withBaseElementProps(Span$1, {
    'aria-hidden': true,
    className: `${IMAGE_TEXT_BLOCK}__separator`,
    children: '|',
});
const TextContainer = elements.withBaseElementProps(View$3, {
    className: `${IMAGE_TEXT_BLOCK}__container`,
});
const TextControl = ({ fileName, fileSize }) => {
    return (React__namespace["default"].createElement(TextContainer, null,
        React__namespace["default"].createElement(FileNameText, null, fileName),
        React__namespace["default"].createElement(Separator$1, null),
        React__namespace["default"].createElement(FileSizeText, null, fileSize)));
};
TextControl.Container = TextContainer;
TextControl.FileName = FileNameText;
TextControl.FileSize = FileSizeText;
TextControl.Separator = Separator$1;
const Container$1 = elements.withBaseElementProps(ListItem, {
    className: `${IMAGE_ITEM_BLOCK}__list-item`,
});
const AttachmentControl = ({ image, onRemove }) => {
    return (React__namespace["default"].createElement(Container$1, null,
        React__namespace["default"].createElement(ImageIcon, null),
        React__namespace["default"].createElement(TextControl, { fileName: image.name, fileSize: image.size }),
        React__namespace["default"].createElement(RemoveButtonControl, { onRemove: onRemove })));
};
AttachmentControl.Container = Container$1;
AttachmentControl.ImageIcon = ImageIcon;
AttachmentControl.RemoveButton = RemoveButtonControl;
AttachmentControl.Text = TextControl;
const UnorderedList = elements.withBaseElementProps(ListElement, {
    className: `${IMAGE_LIST_BLOCK}__unordered-list`,
});
const AttachmentListControl = () => {
    const { input, setInput } = React__namespace["default"].useContext(ConversationInputContext);
    return (React__namespace["default"].createElement(UnorderedList, null, input?.files?.map((file, index) => {
        const onRemove = () => {
            if (setInput) {
                setInput((prevInput) => ({
                    ...prevInput,
                    files: prevInput?.files?.filter((_file) => _file !== file),
                }));
            }
        };
        return (React__namespace["default"].createElement(AttachmentControl, { key: index, image: file, onRemove: onRemove }));
    })));
};
AttachmentListControl.List = UnorderedList;
AttachmentListControl.Item = AttachmentControl;

const { Button: Button$1, Icon: Icon$1, Label: LabelElement, TextArea, View: View$2, } = AIConversationElements;
const FIELD_BLOCK = 'ai-field';
const SendIcon = elements.withBaseElementProps(Icon$1, {
    className: `${FIELD_BLOCK}__icon`,
    variant: 'send-message',
});
const SendButtonBase = elements.withBaseElementProps(Button$1, {
    'aria-label': 'Send message',
    className: `${FIELD_BLOCK}__button ${FIELD_BLOCK}__button--send`,
});
const SendButton = React__namespace["default"].forwardRef(function SendButton(props, ref) {
    const { input } = React__namespace["default"].useContext(ConversationInputContext);
    const isLoading = React__namespace["default"].useContext(LoadingContext);
    const hasInput = !!input?.text || !!input?.files?.length;
    return (React__namespace["default"].createElement(SendButtonBase, { ...props, 
        // we intentionally || in the case where isLoading is false we should use the value of hasInput
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        disabled: isLoading || !hasInput, type: "submit", ref: ref, "data-testid": "send-button" }));
});
const TextAreaBase = elements.withBaseElementProps(TextArea, {
    className: `${FIELD_BLOCK}__input`,
    id: `${FIELD_BLOCK}-text-input`,
    name: 'text-input',
});
const VisuallyHidden = elements.withBaseElementProps(View$2, {
    className: `${FIELD_BLOCK}__visually-hidden`,
});
const Label = elements.withBaseElementProps(LabelElement, {
    children: 'Type your message here',
    className: `${FIELD_BLOCK}__label`,
    htmlFor: 'text-input',
});
const useHandleResize = (textAreaRef) => {
    React__namespace["default"].useEffect(() => {
        const { current } = textAreaRef;
        const handleResize = () => {
            if (current) {
                current.style.height = 'auto';
                current.style.height = `${current.scrollHeight}px`;
            }
        };
        if (current) {
            current.addEventListener('input', handleResize);
            handleResize();
        }
        return () => {
            if (current) {
                current.removeEventListener('input', handleResize);
            }
        };
    }, [textAreaRef]);
};
const TextInput = React__namespace["default"].forwardRef(function TextInput(props, ref) {
    const { setInput } = React__namespace["default"].useContext(ConversationInputContext);
    const messages = React__namespace["default"].useContext(MessagesContext);
    const textAreaRef = React__namespace["default"].useRef(null);
    useHandleResize(textAreaRef);
    const isFirstMessage = !messages || messages.length === 0;
    React__namespace["default"].useEffect(() => {
        if (textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [textAreaRef]);
    return (React__namespace["default"].createElement(TextAreaBase, { ...props, "data-testid": "text-input", id: "text-input", onChange: (e) => props.onChange ??
            (setInput &&
                setInput((prevInput) => ({ ...prevInput, text: e.target.value }))), placeholder: props.placeholder ?? isFirstMessage
            ? 'Ask anything...'
            : 'Message Raven', ref: (node) => {
            textAreaRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            }
            else if (ref) {
                ref.current = node;
            }
        }, autoFocus: true }));
});
const InputContainer = elements.withBaseElementProps(View$2, {
    className: `${FIELD_BLOCK}__input-container`,
});
const FieldControl = () => {
    const { input, setInput } = React__namespace["default"].useContext(ConversationInputContext);
    const handleSendMessage = React__namespace["default"].useContext(SendMessageContext);
    const ref = React__namespace["default"].useRef(null);
    const responseComponents = React__namespace["default"].useContext(ResponseComponentsContext);
    const controls = React__namespace["default"].useContext(ControlsContext);
    const submitMessage = async () => {
        ref.current?.reset();
        const submittedContent = [];
        if (input?.text) {
            const textContent = {
                text: input.text,
            };
            submittedContent.push(textContent);
        }
        if (input?.files) {
            for (const file of input.files) {
                const buffer = await file.arrayBuffer();
                const fileContent = {
                    image: {
                        format: getImageTypeFromMimeType(file.type),
                        source: { bytes: new Uint8Array(buffer) },
                    },
                };
                submittedContent.push(fileContent);
            }
        }
        if (handleSendMessage) {
            handleSendMessage({
                content: submittedContent,
                toolConfiguration: convertResponseComponentsToToolConfiguration(responseComponents),
            });
        }
        if (setInput)
            setInput({ text: '', files: [] });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        submitMessage();
    };
    const handleOnKeyDown = (event) => {
        const { key, shiftKey } = event;
        if (key === 'Enter' && !shiftKey) {
            event.preventDefault();
            const hasInput = !!input?.text || (input?.files?.length && input?.files?.length > 0);
            if (hasInput) {
                submitMessage();
            }
        }
    };
    if (controls?.Form) {
        return (React__namespace["default"].createElement(controls.Form, { handleSubmit: handleSubmit, input: input, setInput: setInput }));
    }
    return (React__namespace["default"].createElement("form", { className: `${FIELD_BLOCK}__form`, onSubmit: handleSubmit, method: "post", ref: ref },
        React__namespace["default"].createElement(AttachFileControl, null),
        React__namespace["default"].createElement(InputContainer, null,
            React__namespace["default"].createElement(VisuallyHidden, null,
                React__namespace["default"].createElement(Label, null)),
            React__namespace["default"].createElement(TextInput, { onKeyDown: handleOnKeyDown }),
            React__namespace["default"].createElement(AttachmentListControl, null)),
        React__namespace["default"].createElement(SendButton, null,
            React__namespace["default"].createElement(SendIcon, null))));
};
FieldControl.AttachFile = AttachFileControl;
FieldControl.InputContainer = InputContainer;
FieldControl.Label = Label;
FieldControl.TextInput = TextInput;
FieldControl.SendButton = SendButton;
FieldControl.SendIcon = SendIcon;

const { Image, Span, Text: Text$1, View: View$1 } = AIConversationElements;
const MESSAGES_BLOCK = 'ai-messages';
const MESSAGE_BLOCK = 'ai-message';
const MediaContentBase = elements.withBaseElementProps(Image, {
    alt: 'Image attachment',
});
const MediaContent = React__namespace["default"].forwardRef(function MediaContent(props, ref) {
    const variant = React__namespace["default"].useContext(MessageVariantContext);
    const role = React__namespace["default"].useContext(RoleContext);
    return (React__namespace["default"].createElement(MediaContentBase, { ref: ref, className: `${MESSAGE_BLOCK}__image ${MESSAGE_BLOCK}__image--${variant} ${MESSAGE_BLOCK}__image--${role}`, ...props }));
});
const TextContent = React__namespace["default"].forwardRef(function TextContent(props, ref) {
    return React__namespace["default"].createElement(Text$1, { ref: ref, className: `${MESSAGE_BLOCK}__text`, ...props });
});
const ContentContainer = React__namespace["default"].forwardRef(function ContentContainer(props, ref) {
    const variant = React__namespace["default"].useContext(MessageVariantContext);
    return (React__namespace["default"].createElement(View$1, { "data-testid": 'content', className: `${MESSAGE_BLOCK}__content ${MESSAGE_BLOCK}__content--${variant}`, ref: ref, ...props }));
});
const MessageControl = ({ message }) => {
    const responseComponents = React__namespace["default"].useContext(ResponseComponentsContext);
    return (React__namespace["default"].createElement(ContentContainer, null, message.content.map((content, index) => {
        if (content.text) {
            return (React__namespace["default"].createElement(TextContent, { "data-testid": 'text-content', key: index }, content.text));
        }
        else if (content.image) {
            return (React__namespace["default"].createElement(MediaContent, { "data-testid": 'image-content', key: index, src: convertBufferToBase64(content.image?.source.bytes, content.image?.format) }));
        }
        else if (content.toolUse) {
            // For now tool use is limited to custom response components
            const { name, input } = content.toolUse;
            if (!responseComponents ||
                !name ||
                !name.startsWith(RESPONSE_COMPONENT_PREFIX)) {
                return;
            }
            else {
                const response = responseComponents[name];
                const CustomComponent = response.component;
                return React__namespace["default"].createElement(CustomComponent, { ...input, key: index });
            }
        }
    })));
};
MessageControl.Container = ContentContainer;
MessageControl.MediaContent = MediaContent;
MessageControl.TextContent = TextContent;
const Separator = elements.withBaseElementProps(Span, {
    'aria-hidden': true,
    children: '|',
    className: `${MESSAGE_BLOCK}__separator`,
});
const Timestamp = elements.withBaseElementProps(Text$1, {
    className: `${MESSAGE_BLOCK}__timestamp`,
});
const HeaderContainer = React__namespace["default"].forwardRef(function HeaderContainer(props, ref) {
    const variant = React__namespace["default"].useContext(MessageVariantContext);
    return (React__namespace["default"].createElement(View$1, { ref: ref, className: `${MESSAGE_BLOCK}__header__container ${MESSAGE_BLOCK}__header__container--${variant}`, ...props }));
});
const MessageContainer = React__namespace["default"].forwardRef(function MessageContainer(props, ref) {
    const variant = React__namespace["default"].useContext(MessageVariantContext);
    const role = React__namespace["default"].useContext(RoleContext);
    return (React__namespace["default"].createElement(View$1, { ref: ref, className: `${MESSAGE_BLOCK} ${MESSAGE_BLOCK}--${variant} ${MESSAGE_BLOCK}--${role}`, ...props }));
});
const Layout = React__namespace["default"].forwardRef(function Layout(props, ref) {
    const variant = React__namespace["default"].useContext(MessageVariantContext);
    return (React__namespace["default"].createElement(View$1, { ref: ref, className: `${MESSAGES_BLOCK}__container ${MESSAGES_BLOCK}__container--${variant}`, "aria-live": 'assertive', ...props }));
});
const MessagesControl = ({ renderMessage }) => {
    const messages = React__namespace["default"].useContext(MessagesContext);
    const controls = React__namespace["default"].useContext(ControlsContext);
    const { getMessageTimestampText } = useConversationDisplayText();
    const messagesRef = React__namespace["default"].useRef([]);
    const [focusedItemIndex, setFocusedItemIndex] = React__namespace["default"].useState(messages ? messages.length - 1 : 0);
    const handleFocus = (index) => setFocusedItemIndex(index);
    const onKeyDown = React__namespace["default"].useCallback((index, { key }) => {
        let newIndex;
        switch (key) {
            case 'ArrowUp':
                newIndex = Math.max(0, index - 1);
                setFocusedItemIndex(newIndex);
                messagesRef.current[newIndex]?.focus();
                break;
            case 'ArrowDown':
                newIndex = Math.min(index + 1, messages.length - 1);
                setFocusedItemIndex(newIndex);
                messagesRef.current[newIndex]?.focus();
                break;
            case 'Home':
                newIndex = 0;
                setFocusedItemIndex(newIndex);
                messagesRef.current[newIndex]?.focus();
                break;
            case 'End':
                newIndex = messages.length - 1;
                setFocusedItemIndex(newIndex);
                messagesRef.current[newIndex]?.focus();
                break;
        }
        return;
    }, [messages]);
    if (controls?.MessageList) {
        return React__namespace["default"].createElement(controls.MessageList, { messages: messages });
    }
    const messagesWithRenderableContent = messages?.filter((message) => message.content.some((content) => content.image ??
        content.text ??
        content.toolUse?.name.startsWith(RESPONSE_COMPONENT_PREFIX))) ?? [];
    return (React__namespace["default"].createElement(Layout, null, messagesWithRenderableContent?.map((message, index) => {
        return renderMessage ? (renderMessage(message)) : (React__namespace["default"].createElement(RoleContext.Provider, { value: message.role, key: `message-${index}` },
            React__namespace["default"].createElement(MessageContainer, { "data-testid": `message`, key: `message-${index}`, tabIndex: focusedItemIndex === index ? 0 : -1, onFocus: () => handleFocus(index), onKeyDown: (event) => onKeyDown(index, event), ref: (el) => (messagesRef.current[index] = el) },
                React__namespace["default"].createElement(HeaderContainer, null,
                    React__namespace["default"].createElement(AvatarControl, null),
                    React__namespace["default"].createElement(Separator, null),
                    React__namespace["default"].createElement(Timestamp, null, getMessageTimestampText(new Date(message.createdAt)))),
                React__namespace["default"].createElement(MessageControl, { message: message }),
                message.role === 'assistant' ? (React__namespace["default"].createElement(ActionsBarControl, { message: message, focusable: focusedItemIndex === index })) : null)));
    })));
};
MessagesControl.ActionsBar = ActionsBarControl;
MessagesControl.Avatar = AvatarControl;
MessagesControl.Container = MessageContainer;
MessagesControl.HeaderContainer = HeaderContainer;
MessagesControl.Layout = Layout;
MessagesControl.Message = MessageControl;
MessagesControl.Separator = Separator;

const { View, Button, Text, Heading, Icon } = AIConversationElements;
const PROMPT_BLOCK = 'ai-prompts';
const PROMPT_CONTROL = `${PROMPT_BLOCK}__prompt`;
const PROMPT_CARD = `${PROMPT_CONTROL}__card`;
const PromptCard = elements.withBaseElementProps(Button, {
    className: PROMPT_CARD,
    type: 'button',
});
const AIIconProps = () => ({
    children: (React__namespace["default"].createElement(React__namespace["default"].Fragment, null,
        React__namespace["default"].createElement("path", { d: "M17.5 1.64858C19.047 0.755412 20.953 0.755412 22.5 1.64858L34.6428 8.65923C36.1898 9.55239 37.1428 11.203 37.1428 12.9894V27.0107C37.1428 28.797 36.1898 30.4476 34.6428 31.3408L22.5 38.3514C20.953 39.2446 19.047 39.2446 17.5 38.3514L5.35718 31.3408C3.81017 30.4476 2.85718 28.797 2.85718 27.0107V12.9894C2.85718 11.203 3.81017 9.55239 5.35718 8.65923L17.5 1.64858Z", fill: "white" }),
        React__namespace["default"].createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M22.5 1.64851C20.953 0.755347 19.047 0.755347 17.5 1.64851L5.35718 8.65916C3.81017 9.55233 2.85718 11.203 2.85718 12.9893V27.0106C2.85718 28.7969 3.81017 30.4476 5.35718 31.3407L17.5 38.3514C19.047 39.2445 20.953 39.2445 22.5 38.3514L34.6428 31.3407C36.1898 30.4476 37.1428 28.7969 37.1428 27.0106V12.9893C37.1428 11.203 36.1898 9.55233 34.6428 8.65916L22.5 1.64851ZM20.9378 8.01826C20.6156 7.14764 19.3843 7.14764 19.0621 8.01825L16.2388 15.648C16.1375 15.9217 15.9217 16.1375 15.648 16.2388L8.01826 19.0621C7.14765 19.3842 7.14765 20.6156 8.01826 20.9378L15.648 23.7611C15.9217 23.8623 16.1375 24.0782 16.2388 24.3519L19.0621 31.9816C19.3843 32.8522 20.6156 32.8522 20.9378 31.9816L23.7611 24.3519C23.8624 24.0782 24.0782 23.8623 24.3519 23.7611L31.9816 20.9378C32.8523 20.6156 32.8523 19.3842 31.9816 19.0621L24.3519 16.2388C24.0782 16.1375 23.8624 15.9217 23.7611 15.648L20.9378 8.01826Z", fill: "url(#paint0_linear_395_1815)" }),
        React__namespace["default"].createElement("defs", null,
            React__namespace["default"].createElement("linearGradient", { id: "paint0_linear_395_1815", x1: "20", y1: "0.978638", x2: "20", y2: "39.0213", gradientUnits: "userSpaceOnUse" },
                React__namespace["default"].createElement("stop", { stopColor: "#7DD6E8" }),
                React__namespace["default"].createElement("stop", { offset: "1", stopColor: "#BF40BF" }))))),
    className: `${PROMPT_CONTROL}__icon`,
    width: '40',
    height: '40',
    viewBox: '0 0 40 40',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
});
const AIIcon = elements.withBaseElementProps(Icon, AIIconProps);
const HeaderText = elements.withBaseElementProps(Heading, {
    className: `${PROMPT_CONTROL}__header`,
});
const PromptGroupBase = elements.withBaseElementProps(View, {
    className: `${PROMPT_CONTROL}__buttongroup`,
});
const PromptGroup = React__namespace["default"].forwardRef(function ButtonGroup(props, ref) {
    const suggestedPromptsArray = React__namespace["default"].useContext(SuggestedPromptsContext);
    const { setInput } = React__namespace["default"].useContext(ConversationInputContext);
    if (!suggestedPromptsArray) {
        return;
    }
    return (React__namespace["default"].createElement(PromptGroupBase, { ...props, ref: ref }, suggestedPromptsArray.map((prompt, index) => {
        return (React__namespace["default"].createElement(PromptCard, { key: index, "aria-label": prompt.inputText, onClick: () => setInput &&
                setInput((prevInput) => ({
                    ...prevInput,
                    text: prompt.inputText,
                })) },
            React__namespace["default"].createElement(Text, { className: ui.classNames(`${PROMPT_CARD}__header`, `${PROMPT_CARD}__text`) }, prompt.header),
            React__namespace["default"].createElement(Text, { className: `${PROMPT_CARD}__text` }, prompt.inputText)));
    })));
});
const Container = elements.withBaseElementProps(View, {
    className: `${PROMPT_BLOCK}__container`,
});
const PromptControl = () => {
    const suggestedPromptsArray = React__namespace["default"].useContext(SuggestedPromptsContext);
    const controls = React__namespace["default"].useContext(ControlsContext);
    const { setInput } = React__namespace["default"].useContext(ConversationInputContext);
    if (controls?.PromptList) {
        return (React__namespace["default"].createElement(controls.PromptList, { setInput: setInput, suggestedPrompts: suggestedPromptsArray }));
    }
    return (React__namespace["default"].createElement(Container, null,
        React__namespace["default"].createElement(AIIcon, null),
        React__namespace["default"].createElement(HeaderText, null, "How can I help you today?"),
        React__namespace["default"].createElement(PromptGroup, null)));
};
const AutoHidablePromptControl = () => {
    const messages = React__namespace["default"].useContext(MessagesContext);
    if (!messages || messages.length === 0) {
        return React__namespace["default"].createElement(PromptControl, null);
    }
};
PromptControl.Container = Container;
PromptControl.Header = HeaderText;
PromptControl.Icon = AIIcon;
PromptControl.PromptGroup = PromptGroup;
PromptControl.PromptCard = PromptCard;

function Conversation() {
    return (React__namespace["default"].createElement(ViewElement, null,
        React__namespace["default"].createElement(HeaderControl, null),
        React__namespace["default"].createElement(ViewElement, null,
            React__namespace["default"].createElement(AutoHidablePromptControl, null),
            React__namespace["default"].createElement(MessagesControl, null)),
        React__namespace["default"].createElement(ViewElement, null,
            React__namespace["default"].createElement(FieldControl, null))));
}

function createProvider({ elements: elements$1, actions, suggestedPrompts, responseComponents, variant, controls, displayText, }) {
    return function Provider({ children, messages, avatars, handleSendMessage, isLoading, }) {
        const _displayText = {
            ...defaultAIConversationDisplayTextEn,
            ...displayText,
        };
        return (React__namespace["default"].createElement(elements.ElementsProvider, { elements: elements$1 },
            React__namespace["default"].createElement(ControlsProvider, { controls: controls },
                React__namespace["default"].createElement(SuggestedPromptProvider, { suggestedPrompts: suggestedPrompts },
                    React__namespace["default"].createElement(ResponseComponentsProvider, { responseComponents: responseComponents },
                        React__namespace["default"].createElement(ConversationDisplayTextProvider, { ..._displayText },
                            React__namespace["default"].createElement(ConversationInputContextProvider, null,
                                React__namespace["default"].createElement(SendMessageContextProvider, { handleSendMessage: handleSendMessage },
                                    React__namespace["default"].createElement(AvatarsProvider, { avatars: avatars },
                                        React__namespace["default"].createElement(ActionsProvider, { actions: actions },
                                            React__namespace["default"].createElement(MessageVariantProvider, { variant: variant },
                                                React__namespace["default"].createElement(MessagesProvider, { messages: messages },
                                                    React__namespace["default"].createElement(LoadingContextProvider, { isLoading: isLoading }, children)))))))))))));
    };
}

/**
 * @experimental
 */
function createAIConversation(input = {}) {
    const { elements, suggestedPrompts, actions, responseComponents, variant, controls, displayText, } = input;
    const Provider = createProvider({
        elements,
        actions,
        suggestedPrompts,
        responseComponents,
        variant,
        controls,
        displayText,
    });
    function AIConversation(props) {
        const { messages, avatars, handleSendMessage, isLoading } = props;
        return (React__namespace["default"].createElement(Provider, { messages: messages, avatars: avatars, handleSendMessage: handleSendMessage, isLoading: isLoading },
            React__namespace["default"].createElement(Conversation, null)));
    }
    const Controls = {
        ActionsBar: ActionsBarControl,
        Avatars: AvatarControl,
        Field: FieldControl,
        Header: HeaderControl,
        Messages: MessagesControl,
        SuggestedPrompts: PromptControl,
    };
    AIConversation.Provider = Provider;
    AIConversation.Conversation = Conversation;
    AIConversation.Controls = Controls;
    return { AIConversation };
}

const MessageMeta = ({ message }) => {
    // need to pass this in as props in order for it to be overridable
    const avatars = React__namespace.useContext(AvatarsContext);
    const role = React__namespace.useContext(RoleContext);
    const { getMessageTimestampText } = useConversationDisplayText();
    // maybe rename 'avatar' to something else
    const avatar = role === 'assistant' ? avatars?.ai : avatars?.user;
    return (React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageSender },
        React__namespace.createElement(uiReact.Text, { className: ui.ComponentClassName.AIConversationMessageSenderUsername }, avatar?.username),
        React__namespace.createElement(uiReact.Text, { className: ui.ComponentClassName.AIConversationMessageSenderTimestamp }, getMessageTimestampText(new Date(message.createdAt)))));
};
const LoadingMessage = () => {
    const avatars = React__namespace.useContext(AvatarsContext);
    const variant = React__namespace.useContext(MessageVariantContext);
    const avatar = avatars?.ai;
    return (React__namespace.createElement(uiReact.View, { className: ui.classNames(ui.ComponentClassName.AIConversationMessage, ui.classNameModifier(ui.ComponentClassName.AIConversationMessage, variant), ui.classNameModifier(ui.ComponentClassName.AIConversationMessage, 'assistant')) },
        React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageAvatar },
            React__namespace.createElement(uiReact.Avatar, { isLoading: true }, avatar?.avatar)),
        React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageBody },
            React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageSender },
                React__namespace.createElement(uiReact.Text, { className: ui.ComponentClassName.AIConversationMessageSenderUsername }, avatar?.username)))));
};
const Message = ({ message }) => {
    const avatars = React__namespace.useContext(AvatarsContext);
    const variant = React__namespace.useContext(MessageVariantContext);
    const avatar = message.role === 'assistant' ? avatars?.ai : avatars?.user;
    return (React__namespace.createElement(RoleContext.Provider, { value: message.role },
        React__namespace.createElement(uiReact.View, { className: ui.classNames(ui.ComponentClassName.AIConversationMessage, ui.classNameModifier(ui.ComponentClassName.AIConversationMessage, variant), ui.classNameModifier(ui.ComponentClassName.AIConversationMessage, message.role)) },
            React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageAvatar },
                React__namespace.createElement(uiReact.Avatar, null, avatar?.avatar)),
            React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageBody },
                React__namespace.createElement(MessageMeta, { message: message }),
                React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageContent },
                    React__namespace.createElement(MessageControl, { message: message }))))));
};
const MessageList = ({ messages, }) => {
    const isLoading = React__namespace.useContext(LoadingContext);
    const messagesWithRenderableContent = messages?.filter((message) => message.content.some((content) => content.image ??
        content.text ??
        content.toolUse?.name.startsWith(RESPONSE_COMPONENT_PREFIX))) ?? [];
    return (React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationMessageList },
        messagesWithRenderableContent.map((message, i) => (React__namespace.createElement(Message, { key: `message-${i}`, message: message }))),
        isLoading ? React__namespace.createElement(LoadingMessage, null) : null));
};

const Attachment = ({ file, handleRemove, }) => {
    const icons = internal.useIcons('aiConversation');
    const removeIcon = icons?.remove ?? React__namespace.createElement(internal.IconClose, null);
    return (React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationAttachment },
        React__namespace.createElement(uiReact.Image, { className: ui.ComponentClassName.AIConversationAttachmentImage, src: URL.createObjectURL(file), alt: file.name }),
        React__namespace.createElement(uiReact.Text, { as: "span", className: ui.ComponentClassName.AIConversationAttachmentName }, file.name),
        React__namespace.createElement(uiReact.Text, { as: "span", className: ui.ComponentClassName.AIConversationAttachmentSize }, ui.humanFileSize(file.size, true)),
        React__namespace.createElement(uiReact.Button, { size: "small", variation: "link", colorTheme: "error", className: ui.ComponentClassName.AIConversationAttachmentRemove, onClick: handleRemove }, removeIcon)));
};
const Attachments = ({ files, setInput, }) => {
    if (!files || files.length < 1) {
        return null;
    }
    return (React__namespace.createElement(uiReact.View, { className: ui.ComponentClassName.AIConversationAttachmentList }, files?.map((file, i) => {
        return (React__namespace.createElement(Attachment, { key: file.name, file: file, handleRemove: () => {
                setInput?.((prevInput) => ({
                    ...prevInput,
                    files: prevInput?.files?.filter((_, j) => i !== j),
                }));
            } }));
    })));
};

function isHTMLFormElement(target) {
    return 'form' in target;
}
const Form = ({ setInput, input, handleSubmit, }) => {
    const icons = internal.useIcons('aiConversation');
    const sendIcon = icons?.send ?? React__namespace.createElement(internal.IconSend, null);
    const attachIcon = icons?.attach ?? React__namespace.createElement(internal.IconAttach, null);
    const hiddenInput = React__namespace.useRef(null);
    const isLoading = React__namespace.useContext(LoadingContext);
    const isInputEmpty = !input?.text?.length && !input?.files?.length;
    return (React__namespace.createElement(uiReact.DropZone, { className: ui.ComponentClassName.AIConversationFormDropzone, onDropComplete: ({ acceptedFiles }) => {
            setInput((prevInput) => ({
                ...prevInput,
                files: [...(prevInput?.files ?? []), ...acceptedFiles],
            }));
        } },
        React__namespace.createElement(uiReact.View, { as: "form", className: ui.ComponentClassName.AIConversationForm, onSubmit: handleSubmit },
            React__namespace.createElement(uiReact.Button, { className: ui.ComponentClassName.AIConversationFormAttach, onClick: () => {
                    hiddenInput?.current?.click();
                    if (hiddenInput?.current) {
                        hiddenInput.current.value = '';
                    }
                } },
                React__namespace.createElement("span", null, attachIcon),
                React__namespace.createElement(uiReact.VisuallyHidden, null,
                    React__namespace.createElement("input", { type: "file", tabIndex: -1, ref: hiddenInput, onChange: (e) => {
                            const { files } = e.target;
                            if (!files || files.length === 0) {
                                return;
                            }
                            setInput((prevValue) => ({
                                ...prevValue,
                                files: [...(prevValue?.files ?? []), ...Array.from(files)],
                            }));
                        }, multiple: true, accept: "*", "data-testid": "hidden-file-input" }))),
            React__namespace.createElement(uiReact.TextAreaField, { className: ui.ComponentClassName.AIConversationFormField, label: "input", labelHidden: true, autoResize: true, flex: "1", rows: 1, value: input?.text ?? '', testId: "text-input", onKeyDown: (e) => {
                    // Submit on enter key if shift is not pressed also
                    const shouldSubmit = !e.shiftKey && e.key === 'Enter';
                    if (shouldSubmit && isHTMLFormElement(e.target)) {
                        e.target.form.requestSubmit();
                        e.preventDefault();
                    }
                }, onChange: (e) => {
                    setInput((prevValue) => ({
                        ...prevValue,
                        text: e.target.value,
                    }));
                } }),
            React__namespace.createElement(uiReact.Button, { type: "submit", variation: "primary", className: ui.ComponentClassName.AIConversationFormSend, 
                // we intentionally || in the case where isLoading is false we should use the value of isInputEmpty
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                isDisabled: isLoading || isInputEmpty },
                React__namespace.createElement("span", null, sendIcon))),
        React__namespace.createElement(Attachments, { setInput: setInput, files: input?.files })));
};

const PromptList = ({ setInput, suggestedPrompts = [], }) => {
    return (React__namespace.createElement(uiReact.Flex, null, suggestedPrompts.map((prompt) => {
        return (React__namespace.createElement(uiReact.Button, { className: ui.ComponentClassName.AIConversationPrompt, key: prompt.inputText, onClick: () => {
                setInput?.((prevInput) => ({
                    ...prevInput,
                    text: prompt.inputText,
                }));
            } }, prompt.header));
    })));
};

function AIConversationBase({ actions, avatars, controls, handleSendMessage, messages, responseComponents, suggestedPrompts, variant, isLoading, displayText, }) {
    const icons = internal.useIcons('aiConversation');
    const defaultAvatars = {
        ai: {
            username: 'Assistant',
            avatar: icons?.assistant ?? React__namespace.createElement(internal.IconAssistant, null),
        },
        user: {
            username: 'User',
            avatar: icons?.user ?? React__namespace.createElement(internal.IconUser, null),
        },
    };
    const Provider = createProvider({
        elements: {
            Text: React__namespace.forwardRef(function _Text(props, ref) {
                return React__namespace.createElement(uiReact.Text, { ...props, ref: ref });
            }),
        },
        actions,
        suggestedPrompts,
        responseComponents,
        variant,
        controls: {
            MessageList,
            PromptList,
            Form,
            ...controls,
        },
        displayText,
    });
    const providerProps = {
        messages,
        handleSendMessage,
        avatars: {
            ...defaultAvatars,
            ...avatars,
        },
        isLoading,
    };
    return (React__namespace.createElement(Provider, { ...providerProps },
        React__namespace.createElement(uiReact.Flex, { className: ui.ComponentClassName.AIConversation },
            React__namespace.createElement(uiReact.ScrollView, { autoScroll: "smooth", flex: "1" },
                React__namespace.createElement(AutoHidablePromptControl, null),
                React__namespace.createElement(MessagesControl, null)),
            React__namespace.createElement(FieldControl, null))));
}
/**
 * @experimental
 */
const AIConversation = Object.assign(AIConversationBase, {
    MessageList,
    PromptList,
    Form,
});

const AIContext = React__namespace["default"].createContext(undefined);
const useAIContext = () => {
    const context = React__namespace["default"].useContext(AIContext);
    const [routeToConversationsMap, setRouteToConversationsMap] = React__namespace["default"].useState({});
    if (context) {
        return context;
    }
    return { routeToConversationsMap, setRouteToConversationsMap };
};
/**
 * @experimental
 */
const AIContextProvider = ({ children, }) => {
    const context = useAIContext();
    return React__namespace["default"].createElement(AIContext.Provider, { value: context }, children);
};

function createUseAIGeneration(client) {
    const useAIGeneration = (routeName) => {
        const handleGenerate = client.generations[routeName];
        const updateAIGenerationStateAction = async (_prev, input) => {
            const result = await handleGenerate(input);
            // handleGenerate returns a Promised wrapper around Schema[Key]['returnType'] which includes data, errors, and clientExtensions
            // The type of data is Schema[Key]['returnType'] which useDataState also wraps in a data return
            // TODO: follow up with how to type handleGenerate to properly return the promise wrapper shape
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const data = result.data;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const graphqlErrors = result.errors;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
            return { ...data, ...(graphqlErrors ? { graphqlErrors } : {}) };
        };
        return uiReactCore.useDataState(updateAIGenerationStateAction, {});
    };
    return useAIGeneration;
}

function createNewConversationMessageInRoute({ previousValue, routeName, conversationId, messages, }) {
    return {
        ...previousValue,
        [routeName]: {
            ...previousValue[routeName],
            [conversationId]: messages,
        },
    };
}
function createUseAIConversation(client) {
    const useAIConversation = (routeName, input = {}) => {
        const clientRoute = client.conversations[routeName];
        const { routeToConversationsMap, setRouteToConversationsMap } = useAIContext();
        const messagesFromAIContext = input.id
            ? routeToConversationsMap[routeName]?.[input.id]
            : undefined;
        const [localMessages, setLocalMessages] = React__namespace["default"].useState(messagesFromAIContext ?? []);
        const [conversation, setConversation] = React__namespace["default"].useState(undefined);
        const [waitingForAIResponse, setWaitingForAIResponse] = React__namespace["default"].useState(false);
        const [errorMessage, setErrorMessage] = React__namespace["default"].useState();
        const [hasError, setHasError] = React__namespace["default"].useState(false);
        // On hook initialization get conversation and load all messages
        React__namespace["default"].useEffect(() => {
            async function initialize() {
                const { data: conversation } = input.id
                    ? await clientRoute.get({ id: input.id })
                    : await clientRoute.create();
                if (!conversation) {
                    const errorString = 'No conversation found';
                    setHasError(true);
                    setErrorMessage(errorString);
                    throw new Error(errorString);
                }
                const { data: messages } = await conversation.listMessages();
                setLocalMessages(messages);
                setConversation(conversation);
                setRouteToConversationsMap((previousValue) => {
                    return createNewConversationMessageInRoute({
                        previousValue,
                        routeName: routeName,
                        conversationId: conversation.id,
                        messages,
                    });
                });
            }
            initialize();
        }, [clientRoute, input.id, routeName, setRouteToConversationsMap]);
        // Update messages to match what is in AIContext if they aren't equal
        React__namespace["default"].useEffect(() => {
            if (!!messagesFromAIContext && messagesFromAIContext !== localMessages)
                setLocalMessages(messagesFromAIContext);
        }, [messagesFromAIContext, localMessages]);
        const sendMessage = React__namespace["default"].useCallback((input) => {
            const { content, aiContext, toolConfiguration } = input;
            conversation
                ?.sendMessage({ content, aiContext, toolConfiguration })
                .then((value) => {
                const { data: sentMessage } = value;
                if (sentMessage) {
                    setWaitingForAIResponse(true);
                    setLocalMessages((previousLocalMessages) => [
                        ...previousLocalMessages,
                        sentMessage,
                    ]);
                    setRouteToConversationsMap((previousValue) => {
                        return createNewConversationMessageInRoute({
                            previousValue,
                            routeName: routeName,
                            conversationId: conversation.id,
                            messages: [
                                ...previousValue[routeName][conversation.id],
                                sentMessage,
                            ],
                        });
                    });
                }
            })
                .catch((reason) => {
                setHasError(true);
                setErrorMessage(`error sending message ${reason}`);
            });
        }, [conversation, routeName, setRouteToConversationsMap]);
        const subscribe = React__namespace["default"].useCallback((handleStoreChange) => {
            const subscription = conversation &&
                conversation.onMessage((message) => {
                    if (input.onResponse)
                        input.onResponse(message);
                    setWaitingForAIResponse(false);
                    setLocalMessages((previousLocalMessages) => [
                        ...previousLocalMessages,
                        message,
                    ]);
                    setRouteToConversationsMap((previousValue) => {
                        return createNewConversationMessageInRoute({
                            previousValue,
                            routeName: routeName,
                            conversationId: conversation.id,
                            messages: [
                                ...previousValue[routeName][conversation.id],
                                message,
                            ],
                        });
                    });
                    handleStoreChange(); // should cause a re-render
                });
            return () => {
                subscription?.unsubscribe();
            };
        }, [conversation, routeName, setRouteToConversationsMap, input]);
        const getSnapshot = React__namespace["default"].useCallback(() => localMessages, [localMessages]);
        // Using useSyncExternalStore to subscribe to external data updates
        // Have to provide third optional argument in next - https://github.com/vercel/next.js/issues/54685
        const messagesFromStore = React__namespace["default"].useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
        return [
            {
                data: { messages: messagesFromStore },
                isLoading: waitingForAIResponse,
                message: errorMessage,
                hasError,
            },
            sendMessage,
        ];
    };
    return useAIConversation;
}

/**
 * @experimental
 */
function createAIHooks(_client) {
    const useAIConversation = createUseAIConversation(_client);
    const useAIGeneration = createUseAIGeneration(_client);
    return { useAIConversation, useAIGeneration };
}

exports.AIContextProvider = AIContextProvider;
exports.AIConversation = AIConversation;
exports.createAIConversation = createAIConversation;
exports.createAIHooks = createAIHooks;
