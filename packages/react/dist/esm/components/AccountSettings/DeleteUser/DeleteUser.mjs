import React__default from 'react';
import { useSetUserAgent } from '@aws-amplify/ui-react-core';
import { getLogger, deleteUser } from '@aws-amplify/ui';
import { useAuth } from '../../../hooks/useAuth.mjs';
import 'aws-amplify/storage';
import '../../ThemeProvider/ThemeContext.mjs';
import '../../../primitives/Alert/AlertIcon.mjs';
import '../../../primitives/View/View.mjs';
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
import { defaultDeleteUserDisplayText } from '../utils/displayText.mjs';
import { VERSION } from '../../../version.mjs';

const logger = getLogger('AccountSettings');
function DeleteUser({ components, displayText: overrideDisplayText, handleDelete, onError, onSuccess, }) {
    const [state, setState] = React__default.useState('IDLE');
    const [errorMessage, setErrorMessage] = React__default.useState(null);
    useSetUserAgent({
        componentName: 'DeleteUser',
        packageName: 'react',
        version: VERSION,
    });
    // translations
    const displayText = {
        ...defaultDeleteUserDisplayText,
        ...overrideDisplayText,
    };
    const { deleteAccountButtonText } = displayText;
    const { user, isLoading } = useAuth();
    // subcomponents
    const { ErrorMessage, DeleteButton, WarningView } = React__default.useMemo(() => ({ ...DEFAULTS, ...(components ?? {}) }), [components]);
    const startConfirmation = (event) => {
        event.preventDefault();
        setState('CONFIRMATION');
    };
    const runDeleteUser = React__default.useCallback(async () => {
        if (!user) {
            return;
        }
        setState('DELETING');
        if (errorMessage) {
            setErrorMessage(null);
        }
        try {
            if (handleDelete) {
                /*
                 * run custom delete handler, if provided. We pass `user` so that
                 * developer can do whichever cleanup with the user object they wish.
                 */
                await handleDelete(user);
            }
            else {
                // else, run default deleteUser function.
                await deleteUser();
            }
            setState('DONE');
            onSuccess?.();
        }
        catch (e) {
            const error = e;
            setState('ERROR');
            setErrorMessage(error.message);
            onError?.(error);
        }
    }, [errorMessage, handleDelete, onError, onSuccess, user]);
    // called when end user cancels account deletion confirmation
    const handleCancel = React__default.useCallback(() => {
        setState('IDLE');
    }, []);
    const handleConfirmDelete = React__default.useCallback(() => {
        runDeleteUser();
    }, [runDeleteUser]);
    // Return null if Auth.getgetCurrentUser is still in progress
    if (isLoading) {
        return null;
    }
    // Return null if user isn't authenticated
    if (!user) {
        logger.warn('<DeleteUser /> requires user to be authenticated.');
        return null;
    }
    // Return null if delete user was successful
    if (state === 'DONE') {
        return null;
    }
    return (React__default.createElement(Flex, { className: ComponentClassName.DeleteUser, direction: "column" },
        React__default.createElement(DeleteButton, { isDisabled: state === 'CONFIRMATION' || state === 'DELETING', onClick: startConfirmation }, deleteAccountButtonText),
        state === 'CONFIRMATION' || state === 'DELETING' ? (React__default.createElement(WarningView, { displayText: displayText, isDisabled: state === 'DELETING', onCancel: handleCancel, onConfirm: handleConfirmDelete })) : null,
        errorMessage ? React__default.createElement(ErrorMessage, null, errorMessage) : null));
}
DeleteUser.ErrorMessage = DEFAULTS.ErrorMessage;
DeleteUser.DeleteButton = DEFAULTS.DeleteButton;
DeleteUser.WarningView = DEFAULTS.WarningView;

export { DeleteUser as default };