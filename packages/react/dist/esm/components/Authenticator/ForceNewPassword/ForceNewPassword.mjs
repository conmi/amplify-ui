import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { Heading } from '../../../primitives/Heading/Heading.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { FormFields } from '../shared/FormFields.mjs';
import { RouteContainer } from '../RouteContainer/RouteContainer.mjs';

const { getChangePasswordText, getChangingText, getBackToSignInText } = authenticatorTextUtil;
const ForceNewPassword = ({ className, variation, }) => {
    const { isPending, toSignIn } = useAuthenticator((context) => [
        context.isPending,
        context.toSignIn,
    ]);
    const { handleBlur, handleChange, handleSubmit } = useFormHandlers();
    const { components: { 
    // @ts-ignore
    ForceNewPassword: { FormFields = ForceNewPassword.FormFields, Header = ForceNewPassword.Header, Footer = ForceNewPassword.Footer, }, }, } = useCustomComponents();
    return (React__default.createElement(RouteContainer, { className: className, variation: variation },
        React__default.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-forcenewpassword": "", method: "post", onChange: handleChange, onSubmit: handleSubmit, onBlur: handleBlur },
            React__default.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default.createElement(Header, null),
                React__default.createElement(FormFields, null),
                React__default.createElement(RemoteErrorMessage, null),
                React__default.createElement(Button, { isDisabled: isPending, type: "submit", variation: "primary", isLoading: isPending, loadingText: getChangingText() }, getChangePasswordText()),
                React__default.createElement(Button, { onClick: toSignIn, type: "button", variation: "link", size: "small" }, getBackToSignInText()),
                React__default.createElement(Footer, null)))));
};
ForceNewPassword.FormFields = function FormFields$1() {
    return React__default.createElement(FormFields, null);
};
ForceNewPassword.Header = function Header() {
    return React__default.createElement(Heading, { level: 4 }, getChangePasswordText());
};
ForceNewPassword.Footer = function Footer() {
    return null;
};

export { ForceNewPassword };
