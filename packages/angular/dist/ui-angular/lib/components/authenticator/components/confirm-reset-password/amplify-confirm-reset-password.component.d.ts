import { AuthenticatorService } from '../../../../services/authenticator.service';
import { FormFieldsArray } from '@aws-amplify/ui';
import * as i0 from "@angular/core";
export declare class ConfirmResetPasswordComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    sortedFormFields: FormFieldsArray;
    backToSignInText: string;
    resendCodeText: string;
    submitText: string;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmResetPasswordComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmResetPasswordComponent, "amplify-confirm-reset-password", never, { "headerText": "headerText"; }, {}, never, never, false>;
}
