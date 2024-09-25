import React__default from 'react';
import isEqual from 'lodash/isEqual.js';
import { useSetUserAgent } from '@aws-amplify/ui-react-core';
import { getLogger, getDefaultPasswordValidators, runFieldValidators, getDefaultConfirmPasswordValidators, changePassword } from '@aws-amplify/ui';
import { useAuth } from '../../../hooks/useAuth.mjs';
import 'aws-amplify/storage';
import '../../ThemeProvider/ThemeContext.mjs';
import '../../../primitives/Alert/AlertIcon.mjs';
import { View } from '../../../primitives/View/View.mjs';
import '../../../primitives/Icon/context/IconsContext.mjs';
import '../../../primitives/Field/FieldClearButton.mjs';
import '../../../primitives/Field/FieldDescription.mjs';
import '../../../primitives/Field/FieldErrorMessage.mjs';
import '../../../primitives/Field/Field.mjs';
import '../../../primitives/Alert/Alert.mjs';
import '../../../primitives/Autocomplete/Autocomplete.mjs';
import '../../../primitives/Avatar/Avatar.mjs';
import '../../../primitives/Badge/Badge.mjs';
import '../../../primitives/Breadcrumbs/Breadcrumbs.mjs';
import '../../../primitives/Button/Button.mjs';
import '../../../primitives/ButtonGroup/ButtonGroup.mjs';
import '../../../primitives/Card/Card.mjs';
import '../../../primitives/CheckboxField/CheckboxField.mjs';
import '../../../primitives/Collection/Collection.mjs';
import '../../../primitives/Divider/Divider.mjs';
import '../../../primitives/DropZone/DropZone.mjs';
import '../../../primitives/Accordion/Accordion.mjs';
import '../../../primitives/FieldGroupIcon/FieldGroupIcon.mjs';
import '../../../primitives/FieldGroupIcon/FieldGroupIconButton.mjs';
import '../../../primitives/Fieldset/Fieldset.mjs';
import '../../../primitives/Fieldset/useFieldset.mjs';
import { Flex } from '../../../primitives/Flex/Flex.mjs';
import '../../../primitives/Grid/Grid.mjs';
import '../../../primitives/Heading/Heading.mjs';
import '../../../primitives/HighlightMatch/HighlightMatch.mjs';
import '../../../primitives/Icon/Icon.mjs';
import '../../../primitives/Image/Image.mjs';
import '../../../primitives/Input/Input.mjs';
import '../../../primitives/Label/Label.mjs';
import '../../../primitives/Link/Link.mjs';
import '../../../primitives/Loader/Loader.mjs';
import '../../../primitives/Menu/Menu.mjs';
import '../../../primitives/Menu/MenuButton.mjs';
import '../../../primitives/Menu/MenuItem.mjs';
import '../../../primitives/Message/Message.mjs';
import '../../../primitives/Pagination/Pagination.mjs';
import '../../../primitives/PasswordField/PasswordField.mjs';
import '../../../primitives/PhoneNumberField/PhoneNumberField.mjs';
import '../../../primitives/Placeholder/Placeholder.mjs';
import '../../../primitives/Radio/Radio.mjs';
import '../../../primitives/RadioGroupField/RadioGroupField.mjs';
import '../../../primitives/Rating/Rating.mjs';
import '../../../primitives/ScrollView/ScrollView.mjs';
import '../../../primitives/SearchField/SearchField.mjs';
import '../../../primitives/SelectField/SelectField.mjs';
import '../../../primitives/SliderField/SliderField.mjs';
import '../../../primitives/StepperField/StepperField.mjs';
import '../../../primitives/SwitchField/SwitchField.mjs';
import '../../../primitives/Table/Table.mjs';
import '../../../primitives/Table/TableBody.mjs';
import '../../../primitives/Table/TableCell.mjs';
import '../../../primitives/Table/TableFoot.mjs';
import '../../../primitives/Table/TableHead.mjs';
import '../../../primitives/Table/TableRow.mjs';
import '../../../primitives/Tabs/Tabs.mjs';
import '../../../primitives/Text/Text.mjs';
import '../../../primitives/TextAreaField/TextAreaField.mjs';
import '../../../primitives/TextField/TextField.mjs';
import '../../../primitives/ToggleButton/ToggleButton.mjs';
import '../../../primitives/ToggleButtonGroup/ToggleButtonGroup.mjs';
import '../../../primitives/VisuallyHidden/VisuallyHidden.mjs';
import { ComponentClassName } from '../constants.mjs';
import DEFAULTS from './defaults.mjs';
import { defaultChangePasswordDisplayText } from '../utils/displayText.mjs';
import { VERSION } from '../../../version.mjs';

const logger = getLogger('AccountSettings');
const getIsDisabled = (formValues, validationError) => {
    const { currentPassword, newPassword, confirmPassword } = formValues;
    const hasEmptyField = !currentPassword || !newPassword || !confirmPassword;
    if (hasEmptyField) {
        return true;
    }
    const arePasswordsInvalid = validationError.newPassword?.length > 0 ||
        validationError.confirmPassword?.length > 0;
    return arePasswordsInvalid;
};
function ChangePassword({ components, displayText: overrideDisplayText, onError, onSuccess, validators, }) {
    const [errorMessage, setErrorMessage] = React__default.useState(null);
    const [formValues, setFormValues] = React__default.useState({});
    const [validationError, setValidationError] = React__default.useState({});
    const blurredFields = React__default.useRef([]);
    const { user, isLoading } = useAuth();
    const isDisabled = getIsDisabled(formValues, validationError);
    const passwordValidators = React__default.useMemo(() => {
        return validators ?? getDefaultPasswordValidators();
    }, [validators]);
    useSetUserAgent({
        componentName: 'ChangePassword',
        packageName: 'react',
        version: VERSION,
    });
    /*
     * Note that formValues and other states are passed in as props so that
     * it does not depend on whether or not those states have been updated yet
     */
    const validateNewPassword = React__default.useCallback(({ formValues, eventType }) => {
        const { newPassword } = formValues;
        const hasBlurred = blurredFields.current.includes('newPassword');
        return runFieldValidators({
            value: newPassword,
            validators: passwordValidators,
            eventType,
            hasBlurred,
        });
    }, [passwordValidators]);
    const validateConfirmPassword = React__default.useCallback(({ formValues, eventType }) => {
        const { newPassword, confirmPassword } = formValues;
        const hasBlurred = blurredFields.current.includes('confirmPassword');
        const confirmPasswordValidators = getDefaultConfirmPasswordValidators(newPassword);
        return runFieldValidators({
            value: confirmPassword,
            validators: confirmPasswordValidators,
            eventType,
            hasBlurred,
        });
    }, []);
    const runValidation = React__default.useCallback((param) => {
        const passwordErrors = validateNewPassword(param);
        const confirmPasswordErrors = validateConfirmPassword(param);
        const newValidationError = {
            newPassword: passwordErrors,
            confirmPassword: confirmPasswordErrors,
        };
        // only re-render if errors have changed
        if (!isEqual(validationError, newValidationError)) {
            setValidationError(newValidationError);
        }
    }, [validateConfirmPassword, validateNewPassword, validationError]);
    /* Translations */
    const displayText = {
        ...defaultChangePasswordDisplayText,
        ...overrideDisplayText,
    };
    const { confirmPasswordFieldLabel, currentPasswordFieldLabel, newPasswordFieldLabel, updatePasswordButtonText, } = displayText;
    /* Subcomponents */
    const { CurrentPasswordField, NewPasswordField, ConfirmPasswordField, SubmitButton, ErrorMessage, } = React__default.useMemo(() => ({ ...DEFAULTS, ...(components ?? {}) }), [components]);
    /* Event Handlers */
    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        const newFormValues = { ...formValues, [name]: value };
        runValidation({ formValues: newFormValues, eventType: 'change' });
        setFormValues(newFormValues);
    };
    const handleBlur = (event) => {
        event.preventDefault();
        const { name } = event.target;
        // only update state and run validation if this is the first time blurring the field
        if (!blurredFields.current.includes(name)) {
            const newBlurredFields = [...blurredFields.current, name];
            blurredFields.current = newBlurredFields;
            runValidation({ formValues, eventType: 'blur' });
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user) {
            return;
        }
        const { currentPassword, newPassword } = formValues;
        if (errorMessage) {
            setErrorMessage(null);
        }
        changePassword({ currentPassword, newPassword })
            .then(() => {
            // notify success to the parent
            onSuccess?.();
        })
            .catch((e) => {
            const error = e;
            if (error.message)
                setErrorMessage(error.message);
            onError?.(error); // notify error to the parent
        });
    };
    // Return null if Auth.getgetCurrentUser is still in progress
    if (isLoading) {
        return null;
    }
    // Return null if user isn't authenticated in the first place
    if (!user) {
        logger.warn('<ChangePassword /> requires user to be authenticated.');
        return null;
    }
    return (React__default.createElement(View, { as: "form", className: ComponentClassName.ChangePassword, onSubmit: handleSubmit },
        React__default.createElement(Flex, { direction: "column" },
            React__default.createElement(CurrentPasswordField, { autoComplete: "current-password", isRequired: true, label: currentPasswordFieldLabel, name: "currentPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default.createElement(NewPasswordField, { autoComplete: "new-password", fieldValidationErrors: validationError?.newPassword, isRequired: true, label: newPasswordFieldLabel, name: "newPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default.createElement(ConfirmPasswordField, { autoComplete: "new-password", fieldValidationErrors: validationError?.confirmPassword, isRequired: true, label: confirmPasswordFieldLabel, name: "confirmPassword", onBlur: handleBlur, onChange: handleChange }),
            React__default.createElement(SubmitButton, { isDisabled: isDisabled, type: "submit" }, updatePasswordButtonText),
            errorMessage ? React__default.createElement(ErrorMessage, null, errorMessage) : null)));
}
ChangePassword.CurrentPasswordField = DEFAULTS.CurrentPasswordField;
ChangePassword.NewPasswordField = DEFAULTS.NewPasswordField;
ChangePassword.ConfirmPasswordField = DEFAULTS.ConfirmPasswordField;
ChangePassword.SubmitButton = DEFAULTS.SubmitButton;
ChangePassword.ErrorMessage = DEFAULTS.ErrorMessage;

export { ChangePassword as default };