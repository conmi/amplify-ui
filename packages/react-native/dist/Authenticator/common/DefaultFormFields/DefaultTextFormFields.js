import React, { Fragment } from 'react';
import { View } from 'react-native';
import { getErrors } from '@aws-amplify/ui';
import Field from './Field';
import { FieldErrors } from './FieldErrors';
const DefaultTextFormFields = ({ fieldContainerStyle, fieldErrorsContainer, fieldErrorStyle, fieldStyle, fields, isPending = false, style, validationErrors, }) => {
    const formFields = (fields ?? []).map(({ name, type, ...field }) => {
        const errors = validationErrors ? getErrors(validationErrors?.[name]) : [];
        const hasError = errors?.length > 0;
        return (<Fragment key={name}>
        <Field {...field} disabled={isPending} error={hasError} fieldStyle={fieldStyle} key={name} style={fieldContainerStyle} type={type}/>
        <FieldErrors errors={errors} errorStyle={fieldErrorStyle} style={fieldErrorsContainer}/>
      </Fragment>);
    });
    return <View style={style}>{formFields}</View>;
};
DefaultTextFormFields.displayName = 'FormFields';
export default DefaultTextFormFields;