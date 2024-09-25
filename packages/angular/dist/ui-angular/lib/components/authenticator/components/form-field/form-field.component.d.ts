import { FormFieldOptions } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class FormFieldComponent {
    private authenticator;
    name: string;
    formField: FormFieldOptions;
    defaultCountryCodeValue: string;
    countryDialCodesValue: string[];
    errorId: string;
    constructor(authenticator: AuthenticatorService);
    get ariaDescribedBy(): string | undefined;
    get errors(): string[];
    onBlur($event: Event): void;
    isPasswordField(): boolean;
    isPhoneField(): boolean;
    hasError(): boolean;
    translate(phrase: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FormFieldComponent, "amplify-form-field", never, { "name": "name"; "formField": "formField"; }, {}, never, never, false>;
}
