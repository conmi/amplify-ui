import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';

const { getConfirmText, getConfirmingText, getBackToSignInText } = authenticatorTextUtil;
const ConfirmSignInFooter = () => {
    const { isPending, toSignIn } = useAuthenticator((context) => [
        context.isPending,
        context.toSignIn,
    ]);
    return (React__default.createElement(Flex, { direction: "column" },
        React__default.createElement(Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getConfirmingText() }, getConfirmText()),
        React__default.createElement(Button, { onClick: toSignIn, type: "button", variation: "link", size: "small" }, getBackToSignInText())));
};

export { ConfirmSignInFooter };