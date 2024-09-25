import { OnInit } from '@angular/core';
import { FederatedIdentityProviders } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class FederatedSignInComponent implements OnInit {
    private authenticator;
    FederatedProviders: typeof FederatedIdentityProviders;
    includeAmazon: boolean;
    includeApple: boolean;
    includeFacebook: boolean;
    includeGoogle: boolean;
    shouldShowFederatedSignIn: boolean;
    orText: string;
    signInAmazonText: string;
    signInAppleText: string;
    signInFacebookText: string;
    signInGoogleText: string;
    constructor(authenticator: AuthenticatorService);
    ngOnInit(): void;
    private setFederatedTexts;
    static ɵfac: i0.ɵɵFactoryDeclaration<FederatedSignInComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FederatedSignInComponent, "amplify-federated-sign-in", never, {}, {}, never, never, false>;
}
