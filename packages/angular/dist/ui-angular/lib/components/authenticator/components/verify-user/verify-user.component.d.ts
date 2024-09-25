import { OnInit } from '@angular/core';
import { UnverifiedUserAttributes } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class VerifyUserComponent implements OnInit {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    unverifiedUserAttributes: {};
    labelId: string;
    skipText: string;
    verifyText: string;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    ngOnInit(): void;
    getLabel(attr: keyof UnverifiedUserAttributes, value: string): string;
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<VerifyUserComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<VerifyUserComponent, "amplify-verify-user", never, { "headerText": "headerText"; }, {}, never, never, false>;
}