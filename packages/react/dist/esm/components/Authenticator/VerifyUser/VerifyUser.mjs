import React__default from 'react';
import { authenticatorTextUtil, defaultFormFieldOptions, translate, censorContactMethod } from '@aws-amplify/ui';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import { Heading } from '../../../primitives/Heading/Heading.mjs';
import { Radio } from '../../../primitives/Radio/Radio.mjs';
import { RadioGroupField } from '../../../primitives/RadioGroupField/RadioGroupField.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useCustomComponents } from '../hooks/useCustomComponents/useCustomComponents.mjs';
import { useFormHandlers } from '../hooks/useFormHandlers/useFormHandlers.mjs';
import { RemoteErrorMessage } from '../shared/RemoteErrorMessage.mjs';
import { TwoButtonSubmitFooter } from '../shared/TwoButtonSubmitFooter.mjs';
import { RouteContainer } from '../RouteContainer/RouteContainer.mjs';

const { getSkipText, getVerifyText, getVerifyContactText, getAccountRecoveryInfoText, } = authenticatorTextUtil;
const generateRadioGroup = (attributes) => {
    return Object.entries(attributes).map(([key, value], index) => {
        const verificationType = defaultFormFieldOptions[key].label;
        return (React__default.createElement(Radio, { name: "unverifiedAttr", value: key, key: key, defaultChecked: index === 0 },
            translate(verificationType),
            ":",
            ' ',
            censorContactMethod(verificationType, value)));
    });
};
const VerifyUser = ({ className, variation, }) => {
    const { components: { 
    // @ts-ignore
    VerifyUser: { Header = VerifyUser.Header, Footer = VerifyUser.Footer }, }, } = useCustomComponents();
    const { isPending, unverifiedUserAttributes } = useAuthenticator(({ isPending, unverifiedUserAttributes }) => [
        isPending,
        unverifiedUserAttributes,
    ]);
    const { handleChange, handleSubmit } = useFormHandlers();
    const footerSubmitText = isPending ? (React__default.createElement(React__default.Fragment, null, "Verifying\u2026")) : (React__default.createElement(React__default.Fragment, null, getVerifyText()));
    const verificationRadioGroup = (React__default.createElement(RadioGroupField, { legend: getVerifyContactText(), name: "verify_context", isDisabled: isPending, legendHidden: true }, generateRadioGroup(unverifiedUserAttributes)));
    return (React__default.createElement(RouteContainer, { className: className, variation: variation },
        React__default.createElement("form", { "data-amplify-form": "", "data-amplify-authenticator-verifyuser": "", method: "post", onChange: handleChange, onSubmit: handleSubmit },
            React__default.createElement(Flex, { as: "fieldset", direction: "column", isDisabled: isPending },
                React__default.createElement(Header, null),
                verificationRadioGroup,
                React__default.createElement(RemoteErrorMessage, null),
                React__default.createElement(TwoButtonSubmitFooter, { cancelButtonText: getSkipText(), cancelButtonSendType: "SKIP", submitButtonText: footerSubmitText }),
                React__default.createElement(Footer, null)))));
};
VerifyUser.Header = function Header() {
    return React__default.createElement(Heading, { level: 3 }, getAccountRecoveryInfoText());
};
VerifyUser.Footer = function Footer() {
    // @ts-ignore
    return null;
};

export { VerifyUser };
