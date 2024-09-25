import { OnInit } from '@angular/core';
import { FormFieldsArray } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class SetupTotpComponent implements OnInit {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    qrCodeSource: string;
    totpSecretCode: string;
    copyTextLabel: string;
    backToSignInText: string;
    confirmText: string;
    sortedFormFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    ngOnInit(): Promise<void>;
    generateQRCode(): Promise<void>;
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    copyText(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SetupTotpComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SetupTotpComponent, "amplify-setup-totp", never, {}, {}, never, never, false>;
}
