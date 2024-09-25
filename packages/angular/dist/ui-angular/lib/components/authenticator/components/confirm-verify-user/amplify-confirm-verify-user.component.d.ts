import { FormFieldsArray } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class ConfirmVerifyUserComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    skipText: string;
    submitText: string;
    sortedFormFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmVerifyUserComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmVerifyUserComponent, "amplify-confirm-verify-user", never, { "headerText": "headerText"; }, {}, never, never, false>;
}