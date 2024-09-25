import { AuthenticatorService } from '../../../../services/authenticator.service';
import { FormFieldsArray } from '@aws-amplify/ui';
import * as i0 from "@angular/core";
export declare class SignInComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    forgotPasswordText: string;
    signInButtonText: string;
    sortedFormFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignInComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SignInComponent, "amplify-sign-in", never, {}, {}, never, never, false>;
}