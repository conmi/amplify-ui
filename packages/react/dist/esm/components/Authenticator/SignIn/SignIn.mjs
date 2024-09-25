import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { View } from '../../../primitives/View/View.mjs';
import { VisuallyHidden } from '../../../primitives/VisuallyHidden/VisuallyHidden.mjs';
import { FederatedSignIn } from '../FederatedSignIn/FederatedSignIn.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { FormFields } from '../shared/FormFields.mjs';

const { getSignInText, getSigningInText, getForgotPasswordText } = authenticatorTextUtil;
function SignIn() {
    const { isPending } = useAuthenticator((context) => [context.isPending]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SignIn: { Header = SignIn.Header, Footer = SignIn.Footer }, }, } = useCustomComponents();
    return (React__default.createElement(View, null,
        React__default.createElement(Header, null),
        React__default.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-signin": "", method: "post", onSubmit: handleSubmit, onChange: handleChange },
            React__default.createElement(FederatedSignIn, null),
            React__default.createElement(Flex, { direction: "column" },
                React__default.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                    React__default.createElement(VisuallyHidden, null,
                        React__default.createElement("legend", null, getSignInText())),
                    React__default.createElement(FormFields, null)),
                React__default.createElement(RemoteErrorMessage, null),
                React__default.createElement(Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getSigningInText() }, getSignInText()),
                React__default.createElement(Footer, null)))));
}
const DefaultFooter = () => {
    const { toForgotPassword } = useAuthenticator((context) => [
        context.toForgotPassword,
    ]);
    return (React__default.createElement(View, { "data-amplify-footer": "" },
        React__default.createElement(Button, { onClick: toForgotPassword, size: "small", variation: "link" }, getForgotPasswordText())));
};
SignIn.Footer = DefaultFooter;
SignIn.Header = function Header() {
    // @ts-ignore
    return null;
};

export { SignIn };