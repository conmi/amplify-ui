import { AuthenticatorService } from '../../../../services/authenticator.service';
import { FormFieldsArray } from '@aws-amplify/ui';
import * as i0 from "@angular/core";
export declare class ConfirmSignUpComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    resendCodeText: string;
    confirmText: string;
    sortedFormFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    get confirmSignUpHeading(): string;
    get subtitleText(): string;
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmSignUpComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmSignUpComponent, "amplify-confirm-sign-up", never, {}, {}, never, never, false>;
}