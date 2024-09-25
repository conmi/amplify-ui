import { FederatedIdentityProviders } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class FederatedSignInButtonComponent {
    private authenticator;
    provider: FederatedIdentityProviders;
    text: string;
    constructor(authenticator: AuthenticatorService);
    onClick: () => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FederatedSignInButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FederatedSignInButtonComponent, "amplify-federated-sign-in-button", never, { "provider": "provider"; "text": "text"; }, {}, never, ["*"], false>;
}