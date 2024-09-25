import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { View } from '../../../primitives/View/View.mjs';
import { FederatedSignIn } from '../FederatedSignIn/FederatedSignIn.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { FormFields } from '../shared/FormFields.mjs';

const { getCreateAccountText, getCreatingAccountText } = authenticatorTextUtil;
function SignUp() {
    const { hasValidationErrors, isPending } = useAuthenticator((context) => [
        context.hasValidationErrors,
        context.isPending,
    ]);
    const { handleChange, handleBlur, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    SignUp: { Header = SignUp.Header, FormFields = SignUp.FormFields, Footer = SignUp.Footer, }, }, } = useCustomComponents();
    return (React__default.createElement(View, null,
        React__default.createElement(Header, null),
        React__default.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-signup": "", method: "post", onChange: handleChange, onSubmit: handleSubmit, onBlur: handleBlur },
            React__default.createElement(FederatedSignIn, null),
            React__default.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default.createElement(Flex, { direction: "column" },
                    React__default.createElement(FormFields, null),
                    React__default.createElement(RemoteErrorMessage, null)),
                React__default.createElement(Button, { isDisabled: hasValidationErrors || isPending, isFullWidth: true, type: "submit", variation: "primary", isLoading: isPending, loadingText: getCreatingAccountText() }, getCreateAccountText()),
                React__default.createElement(Footer, null)))));
}
SignUp.Header = function Header() {
    // @ts-ignore
    return null;
};
SignUp.FormFields = function FormFields$1() {
    return React__default.createElement(FormFields, null);
};
SignUp.Footer = function Footer() {
    // @ts-ignore
    return null;
};

export { SignUp };
