import * as React from 'react';
import { getErrors } from '@aws-amplify/ui';
import { PasswordField } from '../../../primitives/PasswordField/PasswordField.mjs';
import { PhoneNumberField } from '../../../primitives/PhoneNumberField/PhoneNumberField.mjs';
import { TextField } from '../../../primitives/TextField/TextField.mjs';
import { useAuthenticator } from '@aws-amplify/ui-react-core';
import { useStableId } from '../../../primitives/utils/useStableId.mjs';
import { ValidationErrors } from '../../shared/ValidationErrors.mjs';

function FormField({ autocomplete: autoComplete, dialCode, name, type, ...props }) {
    const { validationErrors } = useAuthenticator(({ validationErrors }) => [
        validationErrors,
    ]);
    const errors = React.useMemo(() => getErrors(validationErrors[name]), [name, validationErrors]);
    const hasError = errors?.length > 0;
    const errorId = useStableId();
    const ariaDescribedBy = hasError ? errorId : undefined;
    if (type === 'tel') {
        return (React.createElement(React.Fragment, null,
            React.createElement(PhoneNumberField, { ...props, name: name, defaultDialCode: dialCode, dialCodeName: "country_code", autoComplete: autoComplete, hasError: hasError, "aria-describedby": ariaDescribedBy }),
            React.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
    else if (type === 'password') {
        return (React.createElement(React.Fragment, null,
            React.createElement(PasswordField, { ...props, name: name, autoCapitalize: "off", autoComplete: autoComplete, hasError: hasError, "aria-describedby": ariaDescribedBy }),
            React.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
    else {
        return (React.createElement(React.Fragment, null,
            React.createElement(TextField, { ...props, name: name, autoCapitalize: "off", autoComplete: autoComplete, hasError: hasError, type: type, "aria-describedby": ariaDescribedBy }),
            React.createElement(ValidationErrors, { dataAttr: "data-amplify-sign-up-errors", errors: errors, id: errorId })));
    }
}

export { FormField };
