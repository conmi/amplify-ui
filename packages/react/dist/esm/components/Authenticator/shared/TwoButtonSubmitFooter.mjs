import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';

const { getSubmitText, getSubmittingText } = authenticatorTextUtil;
const TwoButtonSubmitFooter = (props) => {
    const { cancelButtonSendType, cancelButtonText, submitButtonText } = props;
    const { isPending, resendCode, skipVerification, toSignIn } = useAuthenticator((context) => [context.isPending]);
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
    const defaultSubmitText = isPending ? (React__default.createElement(React__default.Fragment, null,
        getSubmittingText(),
        "\u2026")) : (React__default.createElement(React__default.Fragment, null, getSubmitText()));
    const submitText = submitButtonText ?? defaultSubmitText;
    return (React__default.createElement(Flex, { direction: "column" },
        React__default.createElement(Button, { variation: "primary", isDisabled: isPending, type: "submit" }, submitText),
        React__default.createElement(Flex, { direction: "column", alignItems: "center" },
            React__default.createElement(Button, { onClick: onClick, type: "button", variation: "link", size: "small" }, cancelButtonText))));
};

export { TwoButtonSubmitFooter };