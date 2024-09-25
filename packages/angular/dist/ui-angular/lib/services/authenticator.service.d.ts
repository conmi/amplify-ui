import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Event, Subscription } from 'xstate';
import { AuthUser } from 'aws-amplify/auth';
import { AuthContext, AuthenticatorServiceFacade, AuthEvent, AuthInterpreter, AuthMachineState } from '@aws-amplify/ui';
import { AuthSubscriptionCallback } from '../common/types';
import * as i0 from "@angular/core";
/**
 * AuthenticatorService provides access to the authenticator state and context.
 */
export declare class AuthenticatorService implements OnDestroy {
    private _authState;
    private _authStatus;
    private _authService;
    private _machineSubscription;
    private _facade;
    private _hubSubject;
    private _unsubscribeHub;
    constructor();
    /**
     * Context facades
     */
    get error(): AuthenticatorServiceFacade['error'];
    get hasValidationErrors(): AuthenticatorServiceFacade['hasValidationErrors'];
    get isPending(): AuthenticatorServiceFacade['isPending'];
    get route(): AuthenticatorServiceFacade['route'];
    get authStatus(): AuthenticatorServiceFacade['authStatus'];
    get user(): AuthUser;
    get username(): string;
    get validationErrors(): AuthenticatorServiceFacade['validationErrors'];
    get codeDeliveryDetails(): AuthenticatorServiceFacade['codeDeliveryDetails'];
    get totpSecretCode(): AuthenticatorServiceFacade['totpSecretCode'];
    /**
     * Service facades
     */
    get initializeMachine(): AuthenticatorServiceFacade['initializeMachine'];
    get updateForm(): AuthenticatorServiceFacade['updateForm'];
    get updateBlur(): AuthenticatorServiceFacade['updateBlur'];
    get resendCode(): AuthenticatorServiceFacade['resendCode'];
    get signOut(): AuthenticatorServiceFacade['signOut'];
    get submitForm(): AuthenticatorServiceFacade['submitForm'];
    /**
     * Transition facades
     */
    get toFederatedSignIn(): AuthenticatorServiceFacade['toFederatedSignIn'];
    get toForgotPassword(): AuthenticatorServiceFacade['toForgotPassword'];
    get toSignIn(): AuthenticatorServiceFacade['toSignIn'];
    get toSignUp(): AuthenticatorServiceFacade['toSignUp'];
    get skipVerification(): AuthenticatorServiceFacade['skipVerification'];
    /**
     * Internal utility functions
     */
    /** @deprecated For internal use only */
    get authState(): AuthMachineState;
    /** @deprecated For internal use only */
    get authService(): AuthInterpreter;
    /** @deprecated For internal use only */
    get context(): AuthContext;
    /** @deprecated For internal use only */
    get slotContext(): AuthenticatorServiceFacade & {
        $implicit: AuthenticatorServiceFacade;
    };
    /** @deprecated For internal use only */
    get hubSubject(): Subject<void>;
    subscribe(callback: AuthSubscriptionCallback): Subscription;
    ngOnDestroy(): void;
    /** @deprecated For internal use only */
    send(event: Event<AuthEvent>): void;
    private getInitialAuthStatus;
    private setupHubListener;
    private setupMachineSubscription;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthenticatorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthenticatorService>;
}