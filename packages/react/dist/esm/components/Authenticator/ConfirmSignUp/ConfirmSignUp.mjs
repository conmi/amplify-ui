import React__default from 'react';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { Button } from '../../../primitives/Button/Button.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { Heading } from '../../../primitives/Heading/Heading.mjs';
import { Text } from '../../../primitives/Text/Text.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { FormFields } from '../shared/FormFields.mjs';
import { RouteContainer } from '../RouteContainer/RouteContainer.mjs';

const { getDeliveryMessageText, getDeliveryMethodText, getConfirmingText, getConfirmText, getResendCodeText, } = authenticatorTextUtil;
function ConfirmSignUp({ className, variation, }) {
    const { isPending, resendCode, codeDeliveryDetails } = useAuthenticator((context) => [
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
    React__default.createElement(RouteContainer, { className: className, variation: variation },
        React__default.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-confirmsignup": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default.createElement(Header, null),
                React__default.createElement(Flex, { direction: "column" },
                    React__default.createElement(Text, { className: "amplify-authenticator__subtitle" }, getDeliveryMessageText(codeDeliveryDetails)),
                    React__default.createElement(FormFields, null),
                    React__default.createElement(RemoteErrorMessage, null),
                    React__default.createElement(Button, { variation: "primary", isDisabled: isPending, type: "submit", loadingText: getConfirmingText(), isLoading: isPending }, getConfirmText()),
                    React__default.createElement(Button, { onClick: resendCode, type: "button" }, getResendCodeText())),
                React__default.createElement(Footer, null)))));
}
const DefaultHeader = () => {
    const { codeDeliveryDetails } = useAuthenticator((context) => [
        context.codeDeliveryDetails,
    ]);
    return (React__default.createElement(Heading, { level: 4 }, getDeliveryMethodText(codeDeliveryDetails)));
};
ConfirmSignUp.Header = DefaultHeader;
ConfirmSignUp.Footer = function Footer() {
    // @ts-ignore
    return null;
};

export { ConfirmSignUp };