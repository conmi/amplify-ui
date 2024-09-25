import React__default from 'react';
import '../../../primitives/Alert/Alert.mjs';
import '../../../primitives/Autocomplete/Autocomplete.mjs';
import '../../../primitives/Avatar/Avatar.mjs';
import '../../../primitives/Badge/Badge.mjs';
import '../../../primitives/Breadcrumbs/Breadcrumbs.mjs';
import { Button } from '../../../primitives/Button/Button.mjs';
import '../../../primitives/ButtonGroup/ButtonGroup.mjs';
import { Card } from '../../../primitives/Card/Card.mjs';
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
import '../../../primitives/Icon/context/IconsContext.mjs';
import '@aws-amplify/ui';
import '../../../primitives/View/View.mjs';
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
import { Text } from '../../../primitives/Text/Text.mjs';
import '../../../primitives/TextAreaField/TextAreaField.mjs';
import '../../../primitives/TextField/TextField.mjs';
import '../../../primitives/ToggleButton/ToggleButton.mjs';
import '../../../primitives/ToggleButtonGroup/ToggleButtonGroup.mjs';
import '../../../primitives/VisuallyHidden/VisuallyHidden.mjs';
import { DefaultErrorMessage } from '../shared/Defaults.mjs';
import { defaultDeleteUserDisplayText } from '../utils/displayText.mjs';

const DefaultWarningView = ({ displayText: overrideDisplayText, isDisabled, onCancel, onConfirm, }) => {
    // translations
    const displayText = {
        ...defaultDeleteUserDisplayText,
        ...overrideDisplayText,
    };
    const { cancelButtonText, confirmDeleteButtonText, warningText } = displayText;
    return (React__default.createElement(Card, null,
        React__default.createElement(Flex, { direction: "column" },
            React__default.createElement(Text, { color: "font.error" }, warningText),
            React__default.createElement(Flex, null,
                React__default.createElement(Button, { variation: "link", onClick: onCancel, isDisabled: isDisabled }, cancelButtonText),
                React__default.createElement(Button, { variation: "destructive", onClick: onConfirm, isDisabled: isDisabled }, confirmDeleteButtonText)))));
};
const DefaultDeleteButton = (props) => (React__default.createElement(Button, { ...props, variation: "warning" }));
const DEFAULTS = {
    ErrorMessage: DefaultErrorMessage,
    DeleteButton: DefaultDeleteButton,
    WarningView: DefaultWarningView,
};

export { DEFAULTS as default };
