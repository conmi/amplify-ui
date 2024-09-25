import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class ForceNewPasswordComponent {
    authenticator: AuthenticatorService;
    dataAttr: string;
    headerText: string;
    changePasswordText: string;
    backToSignInText: string;
    constructor(authenticator: AuthenticatorService);
    get context(): AuthenticatorService['slotContext'];
    onInput(event: Event): void;
    onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ForceNewPasswordComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ForceNewPasswordComponent, "amplify-force-new-password", never, { "headerText": "headerText"; }, {}, never, never, false>;
}