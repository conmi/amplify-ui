import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class SignUpComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    createAccountText: string;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SignUpComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SignUpComponent, "amplify-sign-up", never, {}, {}, never, never, false>;
}