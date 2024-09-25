import { OnInit } from '@angular/core';
import { FormFieldsArray } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class ConfirmSignInComponent implements OnInit {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    confirmText: string;
    backToSignInText: string;
    sortedFormFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    ngOnInit(): void;
    setHeaderText(): void;
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfirmSignInComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ConfirmSignInComponent, "amplify-confirm-sign-in", never, {}, {}, never, never, false>;
}