import { AfterContentInit, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { AuthenticatorMachineOptions, SocialProvider } from '@aws-amplify/ui';
import { CustomComponentsService } from '../../../../services/custom-components.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
export declare class AuthenticatorComponent implements OnInit, AfterContentInit, OnDestroy {
    private authenticator;
    private contextService;
    private changeDetector;
    formFields: AuthenticatorMachineOptions['formFields'];
    initialState: AuthenticatorMachineOptions['initialState'];
    loginMechanisms: AuthenticatorMachineOptions['loginMechanisms'];
    services: AuthenticatorMachineOptions['services'];
    signUpAttributes: AuthenticatorMachineOptions['signUpAttributes'];
    socialProviders: SocialProvider[];
    variation: 'default' | 'modal';
    hideSignUp: boolean;
    private customComponentQuery;
    signInTitle: string;
    signUpTitle: string;
    private hasInitialized;
    private isHandlingHubEvent;
    private unsubscribeMachine;
    private clearUserAgent;
    constructor(authenticator: AuthenticatorService, contextService: CustomComponentsService, changeDetector: ChangeDetectorRef);
    get context(): AuthenticatorService['slotContext'];
    get route(): AuthenticatorService['route'];
    ngOnInit(): void;
    /**
     * Lifecycle Methods
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Class Functions
     */
    onTabChange(): void;
    hasTabs(): boolean;
    hasRouteComponent(): boolean;
    private mapCustomComponents;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthenticatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AuthenticatorComponent, "amplify-authenticator", never, { "formFields": "formFields"; "initialState": "initialState"; "loginMechanisms": "loginMechanisms"; "services": "services"; "signUpAttributes": "signUpAttributes"; "socialProviders": "socialProviders"; "variation": "variation"; "hideSignUp": "hideSignUp"; }, {}, ["customComponentQuery"], ["*"], false>;
}