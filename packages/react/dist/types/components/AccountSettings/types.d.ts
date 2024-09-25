import React from 'react';
import { AlertProps, ButtonProps, PasswordFieldProps } from '../../primitives/types';
type CommonPasswordFieldProps = Partial<PasswordFieldProps> & Required<Pick<PasswordFieldProps, 'onBlur' | 'onChange' | 'name'>> & {
    fieldValidationErrors?: string[];
};
type CommonAlertProps = Partial<AlertProps> & Required<Pick<AlertProps, 'children'>>;
type CommonButtonProps<T extends 'submit' | 'default' = 'default'> = Partial<ButtonProps> & Required<Pick<ButtonProps, T extends 'submit' ? never : 'onClick'>>;
export type PasswordFieldComponent<Props = {}> = React.ComponentType<Props & CommonPasswordFieldProps>;
export type ButtonComponent<Props = {}> = React.ComponentType<Props & CommonButtonProps>;
export type SubmitButtonComponent<Props = {}> = React.ComponentType<Props & CommonButtonProps<'submit'>>;
export type ErrorMessageComponent<Props = {}> = React.ComponentType<Props & CommonAlertProps>;
export type FormValues = Record<string, string>;
export type BlurredFields = string[];
export type ValidationError = Record<string, string[]>;
export {};
