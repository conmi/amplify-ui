import * as i0 from '@angular/core';
import { Directive, Input, Injectable, Component, HostBinding, EventEmitter, Output, ViewEncapsulation, ContentChildren, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import { createAuthenticatorMachine, translate, listenToAuthHub, defaultAuthHubHandler, getServiceFacade, classNames, ComponentClassName, countryDialCodes, getErrors, getSortedFormFields, authenticatorTextUtil, getFormDataFromEvent, getActorContext, getTotpCodeURL, FederatedIdentityProviders, defaultFormFieldOptions, getActorState, censorContactMethod, setUserAgent } from '@aws-amplify/ui';
export { translations } from '@aws-amplify/ui';
import { Subject } from 'rxjs';
import { interpret } from 'xstate';
import { getCurrentUser } from 'aws-amplify/auth';
import { ConsoleLogger } from 'aws-amplify/utils';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

class AmplifySlotDirective {
    constructor(template) {
        this.template = template;
    }
    set amplifySlot(component) {
        this.name = component;
    }
}
AmplifySlotDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifySlotDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
AmplifySlotDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.3.0", type: AmplifySlotDirective, selector: "[amplifySlot]", inputs: { amplifySlot: "amplifySlot" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifySlotDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[amplifySlot]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { amplifySlot: [{
                type: Input
            }] } });

/**
 * Stores and provides custom components that users provide with `amplify-slot`.
 */
class CustomComponentsService {
    constructor() {
        this._customComponents = {};
    }
    get customComponents() {
        return this._customComponents;
    }
    set customComponents(customComponents) {
        this._customComponents = { ...this._customComponents, ...customComponents };
    }
}
CustomComponentsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: CustomComponentsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CustomComponentsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: CustomComponentsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: CustomComponentsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

const VERSION = '5.0.25';

const logger$1 = new ConsoleLogger('state-machine');
/**
 * AuthenticatorService provides access to the authenticator state and context.
 */
class AuthenticatorService {
    constructor() {
        this._authStatus = 'configuring';
        const machine = createAuthenticatorMachine();
        this._authService = interpret(machine).start();
        this.getInitialAuthStatus();
        this.setupMachineSubscription();
        this.setupHubListener();
    }
    /**
     * Context facades
     */
    get error() {
        return translate(this._facade?.error);
    }
    get hasValidationErrors() {
        return this._facade?.hasValidationErrors;
    }
    get isPending() {
        return this._facade?.isPending;
    }
    get route() {
        return this._facade?.route;
    }
    get authStatus() {
        return this._authStatus;
    }
    get user() {
        return this._facade?.user;
    }
    get username() {
        return this._facade?.username;
    }
    get validationErrors() {
        return this._facade?.validationErrors;
    }
    get codeDeliveryDetails() {
        return this._facade?.codeDeliveryDetails;
    }
    get totpSecretCode() {
        return this._facade?.totpSecretCode;
    }
    /**
     * Service facades
     */
    get initializeMachine() {
        return this._facade.initializeMachine;
    }
    get updateForm() {
        return this._facade.updateForm;
    }
    get updateBlur() {
        return this._facade.updateBlur;
    }
    get resendCode() {
        return this._facade.resendCode;
    }
    get signOut() {
        return this._facade.signOut;
    }
    get submitForm() {
        return this._facade.submitForm;
    }
    /**
     * Transition facades
     */
    get toFederatedSignIn() {
        return this._facade.toFederatedSignIn;
    }
    get toForgotPassword() {
        return this._facade.toForgotPassword;
    }
    get toSignIn() {
        return this._facade.toSignIn;
    }
    get toSignUp() {
        return this._facade.toSignUp;
    }
    get skipVerification() {
        return this._facade.skipVerification;
    }
    /**
     * Internal utility functions
     */
    /** @deprecated For internal use only */
    get authState() {
        return this._authState;
    }
    /** @deprecated For internal use only */
    get authService() {
        return this._authService;
    }
    /** @deprecated For internal use only */
    get context() {
        return this._authState.context;
    }
    /** @deprecated For internal use only */
    get slotContext() {
        return {
            ...this._facade,
            $implicit: this._facade,
        };
    }
    /** @deprecated For internal use only */
    get hubSubject() {
        return this._hubSubject;
    }
    subscribe(callback) {
        if (!this._authService) {
            logger$1.error('Subscription attempted before machine was created. This is likely a bug on the library, please consider filing a bug.');
        }
        const subscription = this._authService.subscribe(() => {
            callback(this._facade);
        });
        return subscription;
    }
    ngOnDestroy() {
        if (this._machineSubscription)
            this._machineSubscription.unsubscribe();
        if (this._unsubscribeHub)
            this._unsubscribeHub();
    }
    /** @deprecated For internal use only */
    send(event) {
        this.authService.send(event);
    }
    async getInitialAuthStatus() {
        try {
            await getCurrentUser();
            this._authStatus = 'authenticated';
        }
        catch (e) {
            this._authStatus = 'unauthenticated';
        }
    }
    setupHubListener() {
        this._hubSubject = new Subject();
        const onSignIn = () => {
            this._authStatus = 'authenticated';
        };
        const onSignOut = () => {
            this._authStatus = 'unauthenticated';
        };
        this._unsubscribeHub = listenToAuthHub(this._authService, (data, service) => {
            defaultAuthHubHandler(data, service, { onSignIn, onSignOut });
            this._hubSubject.next();
        });
    }
    setupMachineSubscription() {
        this._machineSubscription = this._authService.subscribe((state) => {
            const newState = state;
            this._authState = newState;
            this._facade = getServiceFacade({
                send: this._authService.send,
                state: newState,
            });
        });
    }
}
AuthenticatorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AuthenticatorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AuthenticatorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AuthenticatorService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AuthenticatorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root', // ensure we have a singleton service
                }]
        }], ctorParameters: function () { return []; } });

class AmplifySlotComponent {
    constructor(propService) {
        this.propService = propService;
        this.display = 'contents';
        this.isOverriden = false;
    }
    ngAfterContentInit() {
        const { customComponents } = this.propService;
        const overridingComponent = customComponents[this.name];
        if (overridingComponent) {
            this.overridingComponent = overridingComponent;
            this.isOverriden = true;
        }
    }
}
AmplifySlotComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifySlotComponent, deps: [{ token: CustomComponentsService }], target: i0.ɵɵFactoryTarget.Component });
AmplifySlotComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: AmplifySlotComponent, selector: "amplify-slot", inputs: { name: "name", context: "context" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: "<!-- \n  if slot isn't overwritten, we display the the default coponent, which is the \n  children passed onto this component.\n-->\n<ng-content *ngIf=\"!isOverriden\"></ng-content>\n\n<!-- If slot is overwritten, we render that instead. -->\n<ng-container\n  *ngIf=\"isOverriden\"\n  [ngTemplateOutlet]=\"overridingComponent\"\n  [ngTemplateOutletContext]=\"context\"\n></ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifySlotComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-slot', template: "<!-- \n  if slot isn't overwritten, we display the the default coponent, which is the \n  children passed onto this component.\n-->\n<ng-content *ngIf=\"!isOverriden\"></ng-content>\n\n<!-- If slot is overwritten, we render that instead. -->\n<ng-container\n  *ngIf=\"isOverriden\"\n  [ngTemplateOutlet]=\"overridingComponent\"\n  [ngTemplateOutletContext]=\"context\"\n></ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: CustomComponentsService }]; }, propDecorators: { name: [{
                type: Input
            }], context: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class ButtonComponent {
    constructor() {
        this.type = 'button';
        this.fullWidth = false;
        this.isDisabled = false;
        this.size = 'medium';
        this.variation = 'default';
        this.fontWeight = 'normal';
    }
    get getDisabled() {
        return this.isDisabled ? '' : null;
    }
    get classNames() {
        let className = 'amplify-button';
        if (this.variation) {
            className += ` amplify-button--${this.variation}`;
        }
        if (this.size) {
            className += ` amplify-button--${this.size}`;
        }
        if (this.fullWidth) {
            className += ` amplify-button--fullwidth`;
        }
        if (this.isDisabled) {
            className += ` amplify-button--disabled amplify-button--loading`;
        }
        return className;
    }
    ngOnInit() {
        this.typeAttr = this.type;
        this.fullWidthAttr = this.fullWidth;
        this.sizeAttr = this.size;
        this.variationAttr = this.variation;
        this.fontWeightAttr = this.fontWeight;
    }
}
ButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ButtonComponent, selector: "button[amplify-button]", inputs: { type: "type", fullWidth: "fullWidth", isDisabled: "isDisabled", size: "size", variation: "variation", fontWeight: "fontWeight" }, host: { properties: { "type": "this.typeAttr", "attr.data-fullwidth": "this.fullWidthAttr", "attr.data-size": "this.sizeAttr", "attr.data-variation": "this.variationAttr", "style.font-weight": "this.fontWeightAttr", "attr.disabled": "this.getDisabled", "class": "this.classNames" } }, ngImport: i0, template: "<ng-content></ng-content>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'button[amplify-button]', template: "<ng-content></ng-content>\n" }]
        }], propDecorators: { type: [{
                type: Input
            }], fullWidth: [{
                type: Input
            }], isDisabled: [{
                type: Input
            }], size: [{
                type: Input
            }], variation: [{
                type: Input
            }], fontWeight: [{
                type: Input
            }], typeAttr: [{
                type: HostBinding,
                args: ['type']
            }], fullWidthAttr: [{
                type: HostBinding,
                args: ['attr.data-fullwidth']
            }], sizeAttr: [{
                type: HostBinding,
                args: ['attr.data-size']
            }], variationAttr: [{
                type: HostBinding,
                args: ['attr.data-variation']
            }], fontWeightAttr: [{
                type: HostBinding,
                args: ['style.font-weight']
            }], getDisabled: [{
                type: HostBinding,
                args: ['attr.disabled']
            }], classNames: [{
                type: HostBinding,
                args: ['class']
            }] } });

class PasswordFieldComponent {
    constructor() {
        this.autocomplete = 'new-password';
        this.disabled = false;
        this.fieldId = `amplify-field-${nanoid(12)}`;
        this.initialValue = '';
        this.label = '';
        this.placeholder = '';
        this.required = true;
        this.labelHidden = false;
        this.setBlur = new EventEmitter();
        this.type = 'password';
        this.showPassword = false;
        this.showPasswordButtonlabel = translate('Show password');
        // re-export utilities so that template html can use them
        this.classnames = classNames;
        this.ComponentClassName = ComponentClassName;
    }
    togglePasswordText() {
        this.showPassword = !this.showPassword;
        this.showPasswordButtonlabel = this.showPassword
            ? translate('Hide password')
            : translate('Show password');
        this.type = this.showPassword ? 'text' : 'password';
    }
}
PasswordFieldComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: PasswordFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PasswordFieldComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: PasswordFieldComponent, selector: "amplify-password-field", inputs: { autocomplete: "autocomplete", disabled: "disabled", fieldId: "fieldId", initialValue: "initialValue", label: "label", name: "name", placeholder: "placeholder", required: "required", labelHidden: "labelHidden", hasError: "hasError", describedBy: "describedBy" }, outputs: { setBlur: "setBlur" }, ngImport: i0, template: "<div\n  [class]=\"\n    classnames(\n      ComponentClassName.Flex,\n      ComponentClassName.Field,\n      ComponentClassName.TextField,\n      ComponentClassName.PasswordField\n    )\n  \"\n>\n  <label\n    class=\"amplify-label\"\n    [class.amplify-visually-hidden]=\"labelHidden\"\n    [for]=\"fieldId\"\n  >\n    {{ label }}\n  </label>\n  <div\n    [class]=\"classnames(ComponentClassName.Flex, ComponentClassName.FieldGroup)\"\n  >\n    <div [class]=\"ComponentClassName.FieldGroupFieldWrapper\">\n      <input\n        [class]=\"\n          classnames(\n            ComponentClassName.Input,\n            ComponentClassName.FieldGroupControl,\n            ComponentClassName.FieldShowPassword\n          )\n        \"\n        [id]=\"fieldId\"\n        [type]=\"type\"\n        [name]=\"name\"\n        [placeholder]=\"placeholder\"\n        [required]=\"required\"\n        [value]=\"initialValue\"\n        [autocomplete]=\"autocomplete\"\n        autocapitalize=\"off\"\n        [attr.disabled]=\"disabled ? '' : null\"\n        [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy\"\n        (blur)=\"setBlur.emit($event)\"\n      />\n    </div>\n    <div [class]=\"ComponentClassName.FieldGroupOuterEnd\">\n      <button\n        amplify-button\n        role=\"switch\"\n        (click)=\"togglePasswordText()\"\n        [attr.aria-checked]=\"type !== 'password'\"\n        [attr.aria-label]=\"showPasswordButtonlabel\"\n        [class]=\"\n          classnames(\n            ComponentClassName.Input,\n            ComponentClassName.FieldGroupControl\n          )\n        \"\n      >\n        <svg\n          *ngIf=\"!showPassword\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          fill=\"currentColor\"\n          viewBox=\"0 0 24 24\"\n          class=\"amplify-icon\"\n        >\n          <path\n            d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"\n          ></path>\n        </svg>\n        <svg\n          *ngIf=\"showPassword\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          fill=\"currentColor\"\n          viewBox=\"0 0 24 24\"\n          class=\"amplify-icon\"\n        >\n          <path\n            d=\"M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z\"\n            fill=\"none\"\n          ></path>\n          <path\n            d=\"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z\"\n          ></path>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: PasswordFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-password-field', template: "<div\n  [class]=\"\n    classnames(\n      ComponentClassName.Flex,\n      ComponentClassName.Field,\n      ComponentClassName.TextField,\n      ComponentClassName.PasswordField\n    )\n  \"\n>\n  <label\n    class=\"amplify-label\"\n    [class.amplify-visually-hidden]=\"labelHidden\"\n    [for]=\"fieldId\"\n  >\n    {{ label }}\n  </label>\n  <div\n    [class]=\"classnames(ComponentClassName.Flex, ComponentClassName.FieldGroup)\"\n  >\n    <div [class]=\"ComponentClassName.FieldGroupFieldWrapper\">\n      <input\n        [class]=\"\n          classnames(\n            ComponentClassName.Input,\n            ComponentClassName.FieldGroupControl,\n            ComponentClassName.FieldShowPassword\n          )\n        \"\n        [id]=\"fieldId\"\n        [type]=\"type\"\n        [name]=\"name\"\n        [placeholder]=\"placeholder\"\n        [required]=\"required\"\n        [value]=\"initialValue\"\n        [autocomplete]=\"autocomplete\"\n        autocapitalize=\"off\"\n        [attr.disabled]=\"disabled ? '' : null\"\n        [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy\"\n        (blur)=\"setBlur.emit($event)\"\n      />\n    </div>\n    <div [class]=\"ComponentClassName.FieldGroupOuterEnd\">\n      <button\n        amplify-button\n        role=\"switch\"\n        (click)=\"togglePasswordText()\"\n        [attr.aria-checked]=\"type !== 'password'\"\n        [attr.aria-label]=\"showPasswordButtonlabel\"\n        [class]=\"\n          classnames(\n            ComponentClassName.Input,\n            ComponentClassName.FieldGroupControl\n          )\n        \"\n      >\n        <svg\n          *ngIf=\"!showPassword\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          fill=\"currentColor\"\n          viewBox=\"0 0 24 24\"\n          class=\"amplify-icon\"\n        >\n          <path\n            d=\"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z\"\n          ></path>\n        </svg>\n        <svg\n          *ngIf=\"showPassword\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          fill=\"currentColor\"\n          viewBox=\"0 0 24 24\"\n          class=\"amplify-icon\"\n        >\n          <path\n            d=\"M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z\"\n            fill=\"none\"\n          ></path>\n          <path\n            d=\"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z\"\n          ></path>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n" }]
        }], propDecorators: { autocomplete: [{
                type: Input
            }], disabled: [{
                type: Input
            }], fieldId: [{
                type: Input
            }], initialValue: [{
                type: Input
            }], label: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], labelHidden: [{
                type: Input
            }], hasError: [{
                type: Input
            }], describedBy: [{
                type: Input
            }], setBlur: [{
                type: Output
            }] } });

class SelectComponent {
}
SelectComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
SelectComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SelectComponent, selector: "amplify-form-select", inputs: { items: "items", name: "name", label: "label", id: "id", defaultValue: "defaultValue" }, ngImport: i0, template: "<label class=\"amplify-label amplify-visually-hidden\" [for]=\"id\">{{\n  label\n}}</label>\n<div class=\"amplify-select__wrapper\">\n  <select\n    class=\"amplify-select amplify-field-group__control\"\n    autocomplete=\"tel-country-code\"\n    [id]=\"id\"\n    [name]=\"name\"\n  >\n    <option\n      *ngFor=\"let item of items\"\n      [value]=\"item\"\n      [selected]=\"item === defaultValue\"\n    >\n      {{ item }}\n    </option>\n  </select>\n  <div\n    class=\"amplify-flex amplify-select__icon\"\n    style=\"align-items: center; justify-content: center\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      viewBox=\"0 0 24 24\"\n      data-size=\"large\"\n      fill=\"currentColor\"\n    >\n      <path d=\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\"></path>\n    </svg>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-form-select', template: "<label class=\"amplify-label amplify-visually-hidden\" [for]=\"id\">{{\n  label\n}}</label>\n<div class=\"amplify-select__wrapper\">\n  <select\n    class=\"amplify-select amplify-field-group__control\"\n    autocomplete=\"tel-country-code\"\n    [id]=\"id\"\n    [name]=\"name\"\n  >\n    <option\n      *ngFor=\"let item of items\"\n      [value]=\"item\"\n      [selected]=\"item === defaultValue\"\n    >\n      {{ item }}\n    </option>\n  </select>\n  <div\n    class=\"amplify-flex amplify-select__icon\"\n    style=\"align-items: center; justify-content: center\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      viewBox=\"0 0 24 24\"\n      data-size=\"large\"\n      fill=\"currentColor\"\n    >\n      <path d=\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\"></path>\n    </svg>\n  </div>\n</div>\n" }]
        }], propDecorators: { items: [{
                type: Input
            }], name: [{
                type: Input
            }], label: [{
                type: Input
            }], id: [{
                type: Input
            }], defaultValue: [{
                type: Input
            }] } });

class PhoneNumberFieldComponent {
    constructor() {
        this.autocomplete = 'new-password';
        this.disabled = false;
        this.selectFieldId = `amplify-field-${nanoid(12)}`;
        this.textFieldId = `amplify-field-${nanoid(12)}`;
        this.initialValue = '';
        this.label = '';
        this.placeholder = '';
        this.required = true;
        this.labelHidden = false;
        this.display = 'contents';
    }
    ngOnInit() {
        this.countryDialCodesValues = this.dialCodeList ?? countryDialCodes;
    }
}
PhoneNumberFieldComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: PhoneNumberFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
PhoneNumberFieldComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: PhoneNumberFieldComponent, selector: "amplify-phone-number-field", inputs: { autocomplete: "autocomplete", disabled: "disabled", defaultCountryCode: "defaultCountryCode", selectFieldId: "selectFieldId", textFieldId: "textFieldId", initialValue: "initialValue", label: "label", name: "name", placeholder: "placeholder", required: "required", type: "type", labelHidden: "labelHidden", dialCodeList: "dialCodeList", hasError: "hasError", describedBy: "describedBy" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: "<div\n  class=\"amplify-flex amplify-field amplify-textfield amplify-phonenumberfield\"\n>\n  <label\n    class=\"amplify-label\"\n    [class.amplify-visually-hidden]=\"labelHidden\"\n    [for]=\"textFieldId\"\n  >\n    {{ label }}\n  </label>\n  <div class=\"amplify-flex amplify-field-group amplify-field-group--horizontal\">\n    <div class=\"amplify-field-group__outer-start\">\n      <div\n        class=\"amplify-flex amplify-field amplify-selectfield amplify-dialcodeselect\"\n        style=\"flex-direction: column\"\n      >\n        <amplify-form-select\n          name=\"country_code\"\n          label=\"Country Code\"\n          [id]=\"selectFieldId\"\n          [items]=\"countryDialCodesValues\"\n          [defaultValue]=\"defaultCountryCode\"\n        ></amplify-form-select>\n      </div>\n    </div>\n\n    <div\n      class=\"amplify-field-group__field-wrapper amplify-field-group__field-wrapper--horizontal\"\n    >\n      <input\n        class=\"amplify-input amplify-field-group__control\"\n        [id]=\"textFieldId\"\n        [type]=\"type\"\n        [name]=\"name\"\n        [placeholder]=\"placeholder\"\n        [required]=\"required\"\n        [value]=\"initialValue\"\n        [autocomplete]=\"autocomplete\"\n        [attr.disabled]=\"disabled ? '' : null\"\n        [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy\"\n      />\n    </div>\n  </div>\n</div>\n", dependencies: [{ kind: "component", type: SelectComponent, selector: "amplify-form-select", inputs: ["items", "name", "label", "id", "defaultValue"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: PhoneNumberFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-phone-number-field', template: "<div\n  class=\"amplify-flex amplify-field amplify-textfield amplify-phonenumberfield\"\n>\n  <label\n    class=\"amplify-label\"\n    [class.amplify-visually-hidden]=\"labelHidden\"\n    [for]=\"textFieldId\"\n  >\n    {{ label }}\n  </label>\n  <div class=\"amplify-flex amplify-field-group amplify-field-group--horizontal\">\n    <div class=\"amplify-field-group__outer-start\">\n      <div\n        class=\"amplify-flex amplify-field amplify-selectfield amplify-dialcodeselect\"\n        style=\"flex-direction: column\"\n      >\n        <amplify-form-select\n          name=\"country_code\"\n          label=\"Country Code\"\n          [id]=\"selectFieldId\"\n          [items]=\"countryDialCodesValues\"\n          [defaultValue]=\"defaultCountryCode\"\n        ></amplify-form-select>\n      </div>\n    </div>\n\n    <div\n      class=\"amplify-field-group__field-wrapper amplify-field-group__field-wrapper--horizontal\"\n    >\n      <input\n        class=\"amplify-input amplify-field-group__control\"\n        [id]=\"textFieldId\"\n        [type]=\"type\"\n        [name]=\"name\"\n        [placeholder]=\"placeholder\"\n        [required]=\"required\"\n        [value]=\"initialValue\"\n        [autocomplete]=\"autocomplete\"\n        [attr.disabled]=\"disabled ? '' : null\"\n        [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy\"\n      />\n    </div>\n  </div>\n</div>\n" }]
        }], propDecorators: { autocomplete: [{
                type: Input
            }], disabled: [{
                type: Input
            }], defaultCountryCode: [{
                type: Input
            }], selectFieldId: [{
                type: Input
            }], textFieldId: [{
                type: Input
            }], initialValue: [{
                type: Input
            }], label: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], type: [{
                type: Input
            }], labelHidden: [{
                type: Input
            }], dialCodeList: [{
                type: Input
            }], hasError: [{
                type: Input
            }], describedBy: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class TextFieldComponent {
    constructor() {
        this.autocomplete = 'new-password';
        this.disabled = false;
        this.fieldId = `amplify-field-${nanoid(12)}`;
        this.initialValue = '';
        this.label = '';
        this.placeholder = '';
        this.required = true;
        this.labelHidden = false;
        this.display = 'contents';
    }
}
TextFieldComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TextFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TextFieldComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: TextFieldComponent, selector: "amplify-text-field", inputs: { autocomplete: "autocomplete", disabled: "disabled", fieldId: "fieldId", initialValue: "initialValue", label: "label", name: "name", placeholder: "placeholder", required: "required", type: "type", labelHidden: "labelHidden", hasError: "hasError", describedBy: "describedBy" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: "<label\n  class=\"amplify-label\"\n  [class.amplify-visually-hidden]=\"labelHidden\"\n  [for]=\"fieldId\"\n>\n  {{ label }}\n</label>\n<input\n  class=\"amplify-input\"\n  autocapitalize=\"off\"\n  [id]=\"fieldId\"\n  [type]=\"type\"\n  [name]=\"name\"\n  [placeholder]=\"placeholder\"\n  [required]=\"required\"\n  [value]=\"initialValue\"\n  [autocomplete]=\"autocomplete\"\n  [attr.disabled]=\"disabled ? '' : null\"\n  [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n  [attr.aria-describedby]=\"describedBy\"\n/>\n" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TextFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-text-field', template: "<label\n  class=\"amplify-label\"\n  [class.amplify-visually-hidden]=\"labelHidden\"\n  [for]=\"fieldId\"\n>\n  {{ label }}\n</label>\n<input\n  class=\"amplify-input\"\n  autocapitalize=\"off\"\n  [id]=\"fieldId\"\n  [type]=\"type\"\n  [name]=\"name\"\n  [placeholder]=\"placeholder\"\n  [required]=\"required\"\n  [value]=\"initialValue\"\n  [autocomplete]=\"autocomplete\"\n  [attr.disabled]=\"disabled ? '' : null\"\n  [attr.aria-invalid]=\"hasError ? 'true' : 'false'\"\n  [attr.aria-describedby]=\"describedBy\"\n/>\n" }]
        }], propDecorators: { autocomplete: [{
                type: Input
            }], disabled: [{
                type: Input
            }], fieldId: [{
                type: Input
            }], initialValue: [{
                type: Input
            }], label: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], required: [{
                type: Input
            }], type: [{
                type: Input
            }], labelHidden: [{
                type: Input
            }], hasError: [{
                type: Input
            }], describedBy: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class FormFieldComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.countryDialCodesValue = countryDialCodes;
        this.errorId = nanoid(12);
    }
    get ariaDescribedBy() {
        return this.hasError() ? this.errorId : undefined;
    }
    get errors() {
        const { validationErrors } = this.authenticator;
        return getErrors(validationErrors[this.name]);
    }
    onBlur($event) {
        const { name } = $event.target;
        this.authenticator.updateBlur({ name });
    }
    isPasswordField() {
        return this.formField.type === 'password';
    }
    isPhoneField() {
        return this.formField.type === 'tel';
    }
    hasError() {
        return this.errors?.length > 0;
    }
    translate(phrase) {
        return translate(phrase);
    }
}
FormFieldComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FormFieldComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
FormFieldComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: FormFieldComponent, selector: "amplify-form-field", inputs: { name: "name", formField: "formField" }, ngImport: i0, template: "<div class=\"amplify-flex amplify-field amplify-authenticator__column\">\n  <!-- Country code field -->\n  <amplify-phone-number-field\n    *ngIf=\"isPhoneField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [defaultCountryCode]=\"formField.dialCode\"\n    [dialCodeList]=\"formField.dialCodeList\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n    type=\"tel\"\n  ></amplify-phone-number-field>\n\n  <amplify-password-field\n    *ngIf=\"isPasswordField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n    (setBlur)=\"onBlur($event)\"\n  ></amplify-password-field>\n\n  <amplify-text-field\n    *ngIf=\"!isPasswordField() && !isPhoneField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [type]=\"formField.type\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n  ></amplify-text-field>\n\n  <div data-amplify-sign-up-errors *ngIf=\"hasError()\" [id]=\"errorId\">\n    <div\n      class=\"amplify-text amplify-text--error\"\n      data-variation=\"error\"\n      *ngFor=\"let error of errors\"\n    >\n      {{ translate(error) }}\n    </div>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PasswordFieldComponent, selector: "amplify-password-field", inputs: ["autocomplete", "disabled", "fieldId", "initialValue", "label", "name", "placeholder", "required", "labelHidden", "hasError", "describedBy"], outputs: ["setBlur"] }, { kind: "component", type: PhoneNumberFieldComponent, selector: "amplify-phone-number-field", inputs: ["autocomplete", "disabled", "defaultCountryCode", "selectFieldId", "textFieldId", "initialValue", "label", "name", "placeholder", "required", "type", "labelHidden", "dialCodeList", "hasError", "describedBy"] }, { kind: "component", type: TextFieldComponent, selector: "amplify-text-field", inputs: ["autocomplete", "disabled", "fieldId", "initialValue", "label", "name", "placeholder", "required", "type", "labelHidden", "hasError", "describedBy"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FormFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-form-field', template: "<div class=\"amplify-flex amplify-field amplify-authenticator__column\">\n  <!-- Country code field -->\n  <amplify-phone-number-field\n    *ngIf=\"isPhoneField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [defaultCountryCode]=\"formField.dialCode\"\n    [dialCodeList]=\"formField.dialCodeList\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n    type=\"tel\"\n  ></amplify-phone-number-field>\n\n  <amplify-password-field\n    *ngIf=\"isPasswordField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n    (setBlur)=\"onBlur($event)\"\n  ></amplify-password-field>\n\n  <amplify-text-field\n    *ngIf=\"!isPasswordField() && !isPhoneField()\"\n    [name]=\"name\"\n    [label]=\"formField.label\"\n    [placeholder]=\"formField.placeholder\"\n    [required]=\"formField.isRequired\"\n    [labelHidden]=\"formField.labelHidden\"\n    [autocomplete]=\"formField.autocomplete\"\n    [type]=\"formField.type\"\n    [hasError]=\"hasError\"\n    [describedBy]=\"ariaDescribedBy\"\n  ></amplify-text-field>\n\n  <div data-amplify-sign-up-errors *ngIf=\"hasError()\" [id]=\"errorId\">\n    <div\n      class=\"amplify-text amplify-text--error\"\n      data-variation=\"error\"\n      *ngFor=\"let error of errors\"\n    >\n      {{ translate(error) }}\n    </div>\n  </div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { name: [{
                type: Input
            }], formField: [{
                type: Input
            }] } });

/**
 * Sorts the given formFields, then renders them in order.
 */
class BaseFormFieldsComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.display = 'contents';
        this.formFields = [];
    }
    ngOnInit() {
        const state = this.authenticator.authState;
        this.formFields = getSortedFormFields(this.route, state);
    }
}
BaseFormFieldsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: BaseFormFieldsComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
BaseFormFieldsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: { route: "route" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: "<ng-container *ngFor=\"let formField of formFields\">\n  <amplify-form-field\n    [name]=\"formField[0]\"\n    [formField]=\"formField[1]\"\n  ></amplify-form-field>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: FormFieldComponent, selector: "amplify-form-field", inputs: ["name", "formField"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: BaseFormFieldsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-base-form-fields', template: "<ng-container *ngFor=\"let formField of formFields\">\n  <amplify-form-field\n    [name]=\"formField[0]\"\n    [formField]=\"formField[1]\"\n  ></amplify-form-field>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { route: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class ErrorComponent {
    constructor() {
        this.isVisible = true;
        this.dismissAriaLabel = translate('Dismiss alert');
    }
    close() {
        this.isVisible = false;
    }
}
ErrorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ErrorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ErrorComponent, selector: "amplify-error", ngImport: i0, template: "<div\n  class=\"amplify-flex amplify-alert amplify-alert--error\"\n  data-variation=\"error\"\n  style=\"align-items: center; justify-content: space-between\"\n  *ngIf=\"isVisible\"\n  role=\"alert\"\n>\n  <div class=\"amplify-flex\" style=\"align-items: center\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"\n      ></path>\n    </svg>\n    <div><ng-content></ng-content></div>\n  </div>\n  <button\n    amplify-button\n    [attr.aria-label]=\"dismissAriaLabel\"\n    variation=\"link\"\n    [fullWidth]=\"false\"\n    (click)=\"close()\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"\n      ></path>\n    </svg>\n  </button>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-error', template: "<div\n  class=\"amplify-flex amplify-alert amplify-alert--error\"\n  data-variation=\"error\"\n  style=\"align-items: center; justify-content: space-between\"\n  *ngIf=\"isVisible\"\n  role=\"alert\"\n>\n  <div class=\"amplify-flex\" style=\"align-items: center\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"\n      ></path>\n    </svg>\n    <div><ng-content></ng-content></div>\n  </div>\n  <button\n    amplify-button\n    [attr.aria-label]=\"dismissAriaLabel\"\n    variation=\"link\"\n    [fullWidth]=\"false\"\n    (click)=\"close()\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"\n      ></path>\n    </svg>\n  </button>\n</div>\n" }]
        }] });

const { getBackToSignInText: getBackToSignInText$4, getResendCodeText: getResendCodeText$1, getSubmitText: getSubmitText$1, getResetYourPasswordText: getResetYourPasswordText$1, } = authenticatorTextUtil;
class ConfirmResetPasswordComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getResetYourPasswordText$1();
        // translated strings
        this.backToSignInText = getBackToSignInText$4();
        this.resendCodeText = getResendCodeText$1();
        this.submitText = getSubmitText$1();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ConfirmResetPasswordComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmResetPasswordComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ConfirmResetPasswordComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ConfirmResetPasswordComponent, selector: "amplify-confirm-reset-password", inputs: { headerText: "headerText" }, host: { properties: { "attr.data-amplify-authenticator-confirmsignin": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-reset-password-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-base-form-fields\n      route=\"confirmResetPassword\"\n    ></amplify-base-form-fields>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ submitText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      type=\"button\"\n      (click)=\"authenticator.resendCode()\"\n    >\n      {{ resendCodeText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"confirm-reset-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmResetPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-confirm-reset-password', template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-reset-password-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-base-form-fields\n      route=\"confirmResetPassword\"\n    ></amplify-base-form-fields>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ submitText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      type=\"button\"\n      (click)=\"authenticator.resendCode()\"\n    >\n      {{ resendCodeText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"confirm-reset-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-confirmsignin']
            }], headerText: [{
                type: Input
            }] } });

const { getConfirmText: getConfirmText$2, getBackToSignInText: getBackToSignInText$3, getChallengeText } = authenticatorTextUtil;
class ConfirmSignInComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.confirmText = getConfirmText$2();
        this.backToSignInText = getBackToSignInText$3();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    ngOnInit() {
        this.setHeaderText();
    }
    setHeaderText() {
        const state = this.authenticator.authState;
        const actorContext = getActorContext(state);
        const { challengeName } = actorContext;
        this.headerText = getChallengeText(challengeName);
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ConfirmSignInComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmSignInComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ConfirmSignInComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ConfirmSignInComponent, selector: "amplify-confirm-sign-in", host: { properties: { "attr.data-amplify-authenticator-confirmsignin": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-sign-in-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ headerText }}</h3>\n    </amplify-slot>\n    <amplify-base-form-fields route=\"confirmSignIn\"></amplify-base-form-fields>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ confirmText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot\n    name=\"confirm-sign-in-footer\"\n    [context]=\"context\"\n  ></amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmSignInComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-confirm-sign-in', template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-sign-in-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ headerText }}</h3>\n    </amplify-slot>\n    <amplify-base-form-fields route=\"confirmSignIn\"></amplify-base-form-fields>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ confirmText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot\n    name=\"confirm-sign-in-footer\"\n    [context]=\"context\"\n  ></amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-confirmsignin']
            }] } });

const { getResendCodeText, getConfirmText: getConfirmText$1, getDeliveryMethodText, getDeliveryMessageText, } = authenticatorTextUtil;
class ConfirmSignUpComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        // translated texts
        this.resendCodeText = getResendCodeText();
        this.confirmText = getConfirmText$1();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    get confirmSignUpHeading() {
        const { codeDeliveryDetails } = this.authenticator;
        return getDeliveryMethodText(codeDeliveryDetails);
    }
    get subtitleText() {
        const { codeDeliveryDetails } = this.authenticator;
        return getDeliveryMessageText(codeDeliveryDetails);
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ConfirmSignUpComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmSignUpComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ConfirmSignUpComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ConfirmSignUpComponent, selector: "amplify-confirm-sign-up", host: { properties: { "attr.data-amplify-authenticator-confirmsignup": "this.dataAttr" } }, ngImport: i0, template: "<ng-container>\n  <form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n    <fieldset\n      class=\"amplify-flex amplify-authenticator__column\"\n      data-amplify-fieldset\n      [disabled]=\"context.isPending\"\n    >\n      <amplify-slot name=\"confirm-sign-up-header\" [context]=\"context\">\n        <h3\n          class=\"amplify-heading amplify-authenticator__heading\"\n          style=\"font-size: 1.5rem\"\n        >\n          {{ confirmSignUpHeading }}\n        </h3>\n      </amplify-slot>\n      <span class=\"amplify-authenticator__subtitle\">\n        {{ subtitleText }}\n      </span>\n      <amplify-base-form-fields\n        route=\"confirmSignUp\"\n      ></amplify-base-form-fields>\n\n      <button\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n        [isDisabled]=\"authenticator.isPending\"\n      >\n        {{ confirmText }}\n      </button>\n      <button\n        amplify-button\n        fontWeight=\"normal\"\n        (click)=\"authenticator.resendCode()\"\n      >\n        {{ resendCodeText }}\n      </button>\n    </fieldset>\n\n    <amplify-error *ngIf=\"context.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n    <amplify-slot\n      name=\"confirm-sign-up-footer\"\n      [context]=\"context\"\n    ></amplify-slot>\n  </form>\n</ng-container>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmSignUpComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-confirm-sign-up', template: "<ng-container>\n  <form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n    <fieldset\n      class=\"amplify-flex amplify-authenticator__column\"\n      data-amplify-fieldset\n      [disabled]=\"context.isPending\"\n    >\n      <amplify-slot name=\"confirm-sign-up-header\" [context]=\"context\">\n        <h3\n          class=\"amplify-heading amplify-authenticator__heading\"\n          style=\"font-size: 1.5rem\"\n        >\n          {{ confirmSignUpHeading }}\n        </h3>\n      </amplify-slot>\n      <span class=\"amplify-authenticator__subtitle\">\n        {{ subtitleText }}\n      </span>\n      <amplify-base-form-fields\n        route=\"confirmSignUp\"\n      ></amplify-base-form-fields>\n\n      <button\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n        [isDisabled]=\"authenticator.isPending\"\n      >\n        {{ confirmText }}\n      </button>\n      <button\n        amplify-button\n        fontWeight=\"normal\"\n        (click)=\"authenticator.resendCode()\"\n      >\n        {{ resendCodeText }}\n      </button>\n    </fieldset>\n\n    <amplify-error *ngIf=\"context.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n    <amplify-slot\n      name=\"confirm-sign-up-footer\"\n      [context]=\"context\"\n    ></amplify-slot>\n  </form>\n</ng-container>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-confirmsignup']
            }] } });

const { getAccountRecoveryInfoText: getAccountRecoveryInfoText$1, getSkipText: getSkipText$1, getSubmitText } = authenticatorTextUtil;
class ConfirmVerifyUserComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getAccountRecoveryInfoText$1();
        // translated texts
        this.skipText = getSkipText$1();
        this.submitText = getSubmitText();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ConfirmVerifyUserComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmVerifyUserComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ConfirmVerifyUserComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ConfirmVerifyUserComponent, selector: "amplify-confirm-verify-user", inputs: { headerText: "headerText" }, host: { properties: { "attr.data-amplify-authenticator-confirmverifyuser": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (input)=\"onInput($event)\" (submit)=\"onSubmit($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-verify-user-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n    <amplify-base-form-fields\n      route=\"confirmVerifyUser\"\n    ></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ submitText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.skipVerification()\"\n    >\n      {{ skipText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"confirm-verify-user-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ConfirmVerifyUserComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-confirm-verify-user', template: "<form data-amplify-form (input)=\"onInput($event)\" (submit)=\"onSubmit($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"confirm-verify-user-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n    <amplify-base-form-fields\n      route=\"confirmVerifyUser\"\n    ></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ submitText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.skipVerification()\"\n    >\n      {{ skipText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"confirm-verify-user-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-confirmverifyuser']
            }], headerText: [{
                type: Input
            }] } });

class ForceNewPasswordFormFieldsComponent {
}
ForceNewPasswordFormFieldsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForceNewPasswordFormFieldsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ForceNewPasswordFormFieldsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ForceNewPasswordFormFieldsComponent, selector: "amplify-force-new-password-form-fields", ngImport: i0, template: "<div class=\"amplify-flex amplify-authenticator__column\" data-amplify-fieldset>\n  <amplify-base-form-fields route=\"forceNewPassword\"></amplify-base-form-fields>\n</div>\n", dependencies: [{ kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForceNewPasswordFormFieldsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-force-new-password-form-fields', template: "<div class=\"amplify-flex amplify-authenticator__column\" data-amplify-fieldset>\n  <amplify-base-form-fields route=\"forceNewPassword\"></amplify-base-form-fields>\n</div>\n" }]
        }] });

const { getChangePasswordText, getBackToSignInText: getBackToSignInText$2 } = authenticatorTextUtil;
class ForceNewPasswordComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getChangePasswordText();
        // translated texts
        this.changePasswordText = getChangePasswordText();
        this.backToSignInText = getBackToSignInText$2();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ForceNewPasswordComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForceNewPasswordComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ForceNewPasswordComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ForceNewPasswordComponent, selector: "amplify-force-new-password", inputs: { headerText: "headerText" }, host: { properties: { "attr.data-amplify-authenticator-forcenewpassword": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"force-new-password-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-slot name=\"force-new-form-fields\" [context]=\"context\">\n      <amplify-force-new-password-form-fields></amplify-force-new-password-form-fields>\n    </amplify-slot>\n\n    <button amplify-button variation=\"primary\" fullWidth=\"true\" type=\"submit\">\n      {{ changePasswordText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"force-new-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }, { kind: "component", type: ForceNewPasswordFormFieldsComponent, selector: "amplify-force-new-password-form-fields" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForceNewPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-force-new-password', template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"force-new-password-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-slot name=\"force-new-form-fields\" [context]=\"context\">\n      <amplify-force-new-password-form-fields></amplify-force-new-password-form-fields>\n    </amplify-slot>\n\n    <button amplify-button variation=\"primary\" fullWidth=\"true\" type=\"submit\">\n      {{ changePasswordText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"force-new-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-forcenewpassword']
            }], headerText: [{
                type: Input
            }] } });

const { getResetYourPasswordText, getSendCodeText, getBackToSignInText: getBackToSignInText$1 } = authenticatorTextUtil;
class ForgotPasswordComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getResetYourPasswordText();
        // translated texts
        this.sendCodeText = getSendCodeText();
        this.backToSignInText = getBackToSignInText$1();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
ForgotPasswordComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForgotPasswordComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
ForgotPasswordComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ForgotPasswordComponent, selector: "amplify-forgot-password", inputs: { headerText: "headerText" }, host: { properties: { "attr.data-amplify-authenticator-forgotpassword": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot\n      class=\"amplify-flex\"\n      name=\"forgot-password-header\"\n      [context]=\"context\"\n    >\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-base-form-fields route=\"forgotPassword\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ sendCodeText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n\n  <amplify-slot name=\"forgot-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ForgotPasswordComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-forgot-password', template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot\n      class=\"amplify-flex\"\n      name=\"forgot-password-header\"\n      [context]=\"context\"\n    >\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <amplify-base-form-fields route=\"forgotPassword\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ sendCodeText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n\n  <amplify-slot name=\"forgot-password-footer\" [context]=\"context\">\n  </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-forgotpassword']
            }], headerText: [{
                type: Input
            }] } });

const logger = new ConsoleLogger('SetupTotp');
const { getSetupTotpText, getCopyText, getBackToSignInText, getConfirmText, getCopiedText, } = authenticatorTextUtil;
class SetupTotpComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getSetupTotpText();
        this.qrCodeSource = '';
        this.totpSecretCode = '';
        this.copyTextLabel = getCopyText();
        // translated texts
        this.backToSignInText = getBackToSignInText();
        this.confirmText = getConfirmText();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    async ngOnInit() {
        await this.generateQRCode();
    }
    async generateQRCode() {
        const { authState: state, totpSecretCode, username } = this.authenticator;
        const { formFields } = getActorContext(state);
        const { totpIssuer = 'AWSCognito', totpUsername = username } = formFields?.setupTotp?.QR ?? {};
        this.totpSecretCode = totpSecretCode;
        try {
            const totpCode = getTotpCodeURL(totpIssuer, totpUsername, this.totpSecretCode);
            logger.info('totp code was generated:', totpCode);
            this.qrCodeSource = await QRCode.toDataURL(totpCode);
        }
        catch (err) {
            logger.error(err);
        }
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
    copyText() {
        navigator.clipboard.writeText(this.totpSecretCode);
        this.copyTextLabel = getCopiedText();
    }
}
SetupTotpComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SetupTotpComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
SetupTotpComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SetupTotpComponent, selector: "amplify-setup-totp", host: { properties: { "attr.data-amplify-authenticator-setup-totp": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"setup-totp-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n    <p *ngIf=\"!qrCodeSource\">Loading...</p>\n    <img\n      *ngIf=\"qrCodeSource\"\n      [src]=\"qrCodeSource\"\n      alt=\"qr code\"\n      data-amplify-qrcode\n      width=\"228\"\n      height=\"228\"\n    />\n    <div class=\"amplify-flex\" data-amplify-copy>\n      <div>{{ totpSecretCode }}</div>\n      <div data-amplify-copy-svg (click)=\"copyText()\">\n        <div data-amplify-copy-tooltip>{{ copyTextLabel }}</div>\n        <svg\n          width=\"24\"\n          height=\"24\"\n          viewBox=\"0 0 24 24\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n        >\n          <path\n            d=\"M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z\"\n          />\n        </svg>\n      </div>\n    </div>\n\n    <amplify-base-form-fields route=\"setupTotp\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ confirmText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"setup-totp-footer\" [context]=\"context\"> </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SetupTotpComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-setup-totp', template: "<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"setup-totp-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n    <p *ngIf=\"!qrCodeSource\">Loading...</p>\n    <img\n      *ngIf=\"qrCodeSource\"\n      [src]=\"qrCodeSource\"\n      alt=\"qr code\"\n      data-amplify-qrcode\n      width=\"228\"\n      height=\"228\"\n    />\n    <div class=\"amplify-flex\" data-amplify-copy>\n      <div>{{ totpSecretCode }}</div>\n      <div data-amplify-copy-svg (click)=\"copyText()\">\n        <div data-amplify-copy-tooltip>{{ copyTextLabel }}</div>\n        <svg\n          width=\"24\"\n          height=\"24\"\n          viewBox=\"0 0 24 24\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n        >\n          <path\n            d=\"M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z\"\n          />\n        </svg>\n      </div>\n    </div>\n\n    <amplify-base-form-fields route=\"setupTotp\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ confirmText }}\n    </button>\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toSignIn()\"\n    >\n      {{ backToSignInText }}\n    </button>\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"setup-totp-footer\" [context]=\"context\"> </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-setup-totp']
            }] } });

class FederatedSignInButtonComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.onClick = () => {
            this.authenticator.send({
                type: 'FEDERATED_SIGN_IN',
                data: { provider: this.provider },
            });
        };
    }
}
FederatedSignInButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FederatedSignInButtonComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
FederatedSignInButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: FederatedSignInButtonComponent, selector: "amplify-federated-sign-in-button", inputs: { provider: "provider", text: "text" }, ngImport: i0, template: "<button\n  amplify-button\n  class=\"amplify-field-group__control federated-sign-in-button\"\n  fullWidth=\"true\"\n  fontWeight=\"normal\"\n  (click)=\"onClick()\"\n>\n  <div class=\"amplify-flex federated-sign-in-button-row\">\n    <ng-content></ng-content>\n  </div>\n</button>\n", dependencies: [{ kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FederatedSignInButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-federated-sign-in-button', template: "<button\n  amplify-button\n  class=\"amplify-field-group__control federated-sign-in-button\"\n  fullWidth=\"true\"\n  fontWeight=\"normal\"\n  (click)=\"onClick()\"\n>\n  <div class=\"amplify-flex federated-sign-in-button-row\">\n    <ng-content></ng-content>\n  </div>\n</button>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { provider: [{
                type: Input
            }], text: [{
                type: Input
            }] } });

const { getSignInWithFederationText, getOrText } = authenticatorTextUtil;
class FederatedSignInComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.FederatedProviders = FederatedIdentityProviders;
        this.includeAmazon = false;
        this.includeApple = false;
        this.includeFacebook = false;
        this.includeGoogle = false;
        this.shouldShowFederatedSignIn = false;
    }
    ngOnInit() {
        const socialProviders = this.authenticator.context?.config?.socialProviders;
        this.setFederatedTexts();
        this.includeAmazon = socialProviders?.includes('amazon');
        this.includeApple = socialProviders?.includes('apple');
        this.includeGoogle = socialProviders?.includes('google');
        this.includeFacebook = socialProviders?.includes('facebook');
        this.shouldShowFederatedSignIn =
            this.includeAmazon ||
                this.includeApple ||
                this.includeFacebook ||
                this.includeGoogle;
    }
    setFederatedTexts() {
        const { route } = this.authenticator;
        this.orText = getOrText();
        this.signInAmazonText = getSignInWithFederationText(route, 'amazon');
        this.signInAppleText = getSignInWithFederationText(route, 'apple');
        this.signInFacebookText = getSignInWithFederationText(route, 'facebook');
        this.signInGoogleText = getSignInWithFederationText(route, 'google');
    }
}
FederatedSignInComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FederatedSignInComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
FederatedSignInComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: FederatedSignInComponent, selector: "amplify-federated-sign-in", ngImport: i0, template: "<div\n  class=\"amplify-flex federated-sign-in-container\"\n  *ngIf=\"shouldShowFederatedSignIn\"\n  data-orientation=\"horizontal\"\n  data-size=\"small\"\n>\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeAmazon\"\n    [text]=\"signInAmazonText\"\n    [provider]=\"FederatedProviders.Amazon\"\n  >\n    <svg\n      aria-label=\"Amazon icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 248 268\"\n    >\n      <path\n        d=\"M139.056521,147.024612 C133.548808,156.744524 124.782731,162.726926 115.087401,162.726926 C101.790721,162.726926 93.9937779,152.612964 93.9937779,137.68681 C93.9937779,108.224571 120.447551,102.879017 145.533369,102.879017 L145.533369,110.365976 C145.533369,123.831358 145.876354,135.063787 139.056521,147.024612 M207.206992,162.579655 C209.400505,165.692256 209.887066,169.437725 207.063416,171.770186 C199.996315,177.653081 187.429476,188.590967 180.513926,194.716661 L180.46208,194.621133 C178.176838,196.663031 174.862638,196.810303 172.27828,195.445057 C160.780281,185.9162 158.686473,181.494078 152.405048,172.403055 C133.405233,191.751331 119.909143,197.534719 95.309886,197.534719 C66.1281801,197.534719 43.4791563,179.599451 43.4791563,143.669212 C43.4791563,115.616003 58.6782107,96.5105248 80.4019706,87.1727225 C99.2063636,78.9096034 125.464714,77.4528107 145.533369,75.1641337 L145.533369,70.694248 C145.533369,62.4749122 146.167493,52.7510201 141.297893,45.6541312 C137.110277,39.2856386 129.018206,36.6586354 121.859376,36.6586354 C108.658413,36.6586354 96.9171331,43.4171982 94.0416364,57.4199213 C93.4593582,60.532522 91.1701278,63.5933787 88.003492,63.7406501 L54.4387473,60.1424518 C51.6150972,59.5095829 48.4484614,57.2248862 49.2740201,52.8982915 C56.9712583,12.2553679 93.7983558,0 126.732964,0 C143.587124,0 165.606011,4.47386604 178.902691,17.2148315 C195.760839,32.917146 194.149604,53.8694866 194.149604,76.6726704 L194.149604,130.542157 C194.149604,146.734049 200.87372,153.830938 207.206992,162.579655 Z M233.826346,208.038962 C230.467669,203.683255 211.550709,205.9821 203.056405,206.998432 C200.470662,207.321077 200.076227,205.042397 202.406981,203.404973 C217.475208,192.664928 242.201125,195.766353 245.081698,199.363845 C247.966255,202.981502 244.336653,228.071183 230.172839,240.049379 C228.001452,241.888455 225.929671,240.904388 226.89783,238.468418 C230.077218,230.430525 237.204944,212.418868 233.826346,208.038962 Z M126.768855,264 C74.0234043,264 42.0764048,241.955028 17.7852554,217.541992 C12.9733903,212.705982 6.71799208,206.295994 3.31151296,200.690918 C1.90227474,198.372135 5.59096074,195.021875 8.0442063,196.84375 C38.2390146,219.267578 82.1011654,239.538304 125.529506,239.538304 C154.819967,239.538304 191.046475,227.469543 220.66851,214.867659 C225.146771,212.966167 225.146771,219.180222 224.511585,221.060516 C224.183264,222.03242 209.514625,236.221149 189.247207,247.047411 C170.304273,257.166172 146.397132,264 126.768855,264 Z\"\n        fill=\"#FF9900\"\n      ></path>\n    </svg>\n\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInAmazonText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeApple\"\n    [provider]=\"FederatedProviders.Apple\"\n  >\n    <svg\n      aria-label=\"Apple icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      fill=\"#000\"\n      preserveAspectRatio=\"xMidYMid\"\n      stroke=\"#000\"\n      strokeWidth=\"0\"\n      viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n    >\n      <path\n        d=\"M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInAppleText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeFacebook\"\n    [text]=\"signInFacebookText\"\n    [provider]=\"FederatedProviders.Facebook\"\n  >\n    <svg\n      aria-label=\"Facebook icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 279 538\"\n    >\n      <path\n        d=\"M82.3409742,538 L82.3409742,292.936652 L0,292.936652 L0,196.990154 L82.2410458,196.990154 L82.2410458,126.4295 C82.2410458,44.575144 132.205229,0 205.252865,0 C240.227794,0 270.306232,2.59855099 279,3.79788222 L279,89.2502322 L228.536175,89.2502322 C188.964542,89.2502322 181.270057,108.139699 181.270057,135.824262 L181.270057,196.89021 L276.202006,196.89021 L263.810888,292.836708 L181.16913,292.836708 L181.16913,538 L82.3409742,538 Z\"\n        fill=\"#1877F2\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInFacebookText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeGoogle\"\n    [provider]=\"FederatedProviders.Google\"\n  >\n    <svg\n      aria-label=\"Google icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 256 262\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      preserveAspectRatio=\"xMidYMid\"\n    >\n      <path\n        d=\"M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027\"\n        fill=\"#4285F4\"\n      ></path>\n      <path\n        d=\"M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1\"\n        fill=\"#34A853\"\n      ></path>\n      <path\n        d=\"M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782\"\n        fill=\"#FBBC05\"\n      ></path>\n      <path\n        d=\"M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251\"\n        fill=\"#EB4335\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInGoogleText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <hr\n    class=\"amplify-divider amplify-divider--label amplify-divider--small\"\n    aria-orientation=\"horizontal\"\n    data-size=\"small\"\n    [attr.data-label]=\"orText\"\n  />\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: FederatedSignInButtonComponent, selector: "amplify-federated-sign-in-button", inputs: ["provider", "text"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: FederatedSignInComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-federated-sign-in', template: "<div\n  class=\"amplify-flex federated-sign-in-container\"\n  *ngIf=\"shouldShowFederatedSignIn\"\n  data-orientation=\"horizontal\"\n  data-size=\"small\"\n>\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeAmazon\"\n    [text]=\"signInAmazonText\"\n    [provider]=\"FederatedProviders.Amazon\"\n  >\n    <svg\n      aria-label=\"Amazon icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 248 268\"\n    >\n      <path\n        d=\"M139.056521,147.024612 C133.548808,156.744524 124.782731,162.726926 115.087401,162.726926 C101.790721,162.726926 93.9937779,152.612964 93.9937779,137.68681 C93.9937779,108.224571 120.447551,102.879017 145.533369,102.879017 L145.533369,110.365976 C145.533369,123.831358 145.876354,135.063787 139.056521,147.024612 M207.206992,162.579655 C209.400505,165.692256 209.887066,169.437725 207.063416,171.770186 C199.996315,177.653081 187.429476,188.590967 180.513926,194.716661 L180.46208,194.621133 C178.176838,196.663031 174.862638,196.810303 172.27828,195.445057 C160.780281,185.9162 158.686473,181.494078 152.405048,172.403055 C133.405233,191.751331 119.909143,197.534719 95.309886,197.534719 C66.1281801,197.534719 43.4791563,179.599451 43.4791563,143.669212 C43.4791563,115.616003 58.6782107,96.5105248 80.4019706,87.1727225 C99.2063636,78.9096034 125.464714,77.4528107 145.533369,75.1641337 L145.533369,70.694248 C145.533369,62.4749122 146.167493,52.7510201 141.297893,45.6541312 C137.110277,39.2856386 129.018206,36.6586354 121.859376,36.6586354 C108.658413,36.6586354 96.9171331,43.4171982 94.0416364,57.4199213 C93.4593582,60.532522 91.1701278,63.5933787 88.003492,63.7406501 L54.4387473,60.1424518 C51.6150972,59.5095829 48.4484614,57.2248862 49.2740201,52.8982915 C56.9712583,12.2553679 93.7983558,0 126.732964,0 C143.587124,0 165.606011,4.47386604 178.902691,17.2148315 C195.760839,32.917146 194.149604,53.8694866 194.149604,76.6726704 L194.149604,130.542157 C194.149604,146.734049 200.87372,153.830938 207.206992,162.579655 Z M233.826346,208.038962 C230.467669,203.683255 211.550709,205.9821 203.056405,206.998432 C200.470662,207.321077 200.076227,205.042397 202.406981,203.404973 C217.475208,192.664928 242.201125,195.766353 245.081698,199.363845 C247.966255,202.981502 244.336653,228.071183 230.172839,240.049379 C228.001452,241.888455 225.929671,240.904388 226.89783,238.468418 C230.077218,230.430525 237.204944,212.418868 233.826346,208.038962 Z M126.768855,264 C74.0234043,264 42.0764048,241.955028 17.7852554,217.541992 C12.9733903,212.705982 6.71799208,206.295994 3.31151296,200.690918 C1.90227474,198.372135 5.59096074,195.021875 8.0442063,196.84375 C38.2390146,219.267578 82.1011654,239.538304 125.529506,239.538304 C154.819967,239.538304 191.046475,227.469543 220.66851,214.867659 C225.146771,212.966167 225.146771,219.180222 224.511585,221.060516 C224.183264,222.03242 209.514625,236.221149 189.247207,247.047411 C170.304273,257.166172 146.397132,264 126.768855,264 Z\"\n        fill=\"#FF9900\"\n      ></path>\n    </svg>\n\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInAmazonText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeApple\"\n    [provider]=\"FederatedProviders.Apple\"\n  >\n    <svg\n      aria-label=\"Apple icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      fill=\"#000\"\n      preserveAspectRatio=\"xMidYMid\"\n      stroke=\"#000\"\n      strokeWidth=\"0\"\n      viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n    >\n      <path\n        d=\"M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInAppleText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeFacebook\"\n    [text]=\"signInFacebookText\"\n    [provider]=\"FederatedProviders.Facebook\"\n  >\n    <svg\n      aria-label=\"Facebook icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 279 538\"\n    >\n      <path\n        d=\"M82.3409742,538 L82.3409742,292.936652 L0,292.936652 L0,196.990154 L82.2410458,196.990154 L82.2410458,126.4295 C82.2410458,44.575144 132.205229,0 205.252865,0 C240.227794,0 270.306232,2.59855099 279,3.79788222 L279,89.2502322 L228.536175,89.2502322 C188.964542,89.2502322 181.270057,108.139699 181.270057,135.824262 L181.270057,196.89021 L276.202006,196.89021 L263.810888,292.836708 L181.16913,292.836708 L181.16913,538 L82.3409742,538 Z\"\n        fill=\"#1877F2\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInFacebookText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <amplify-federated-sign-in-button\n    *ngIf=\"includeGoogle\"\n    [provider]=\"FederatedProviders.Google\"\n  >\n    <svg\n      aria-label=\"Google icon\"\n      class=\"amplify-icon federated-sign-in-icon\"\n      viewBox=\"0 0 256 262\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      preserveAspectRatio=\"xMidYMid\"\n    >\n      <path\n        d=\"M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027\"\n        fill=\"#4285F4\"\n      ></path>\n      <path\n        d=\"M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1\"\n        fill=\"#34A853\"\n      ></path>\n      <path\n        d=\"M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782\"\n        fill=\"#FBBC05\"\n      ></path>\n      <path\n        d=\"M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251\"\n        fill=\"#EB4335\"\n      ></path>\n    </svg>\n    <p class=\"amplify-text amplify-authenticator__federated-text\">\n      {{ signInGoogleText }}\n    </p>\n  </amplify-federated-sign-in-button>\n\n  <hr\n    class=\"amplify-divider amplify-divider--label amplify-divider--small\"\n    aria-orientation=\"horizontal\"\n    data-size=\"small\"\n    [attr.data-label]=\"orText\"\n  />\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; } });

const { getForgotPasswordText, getSignInText } = authenticatorTextUtil;
class SignInComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.forgotPasswordText = getForgotPasswordText();
        this.signInButtonText = getSignInText();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
SignInComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignInComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
SignInComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SignInComponent, selector: "amplify-sign-in", host: { properties: { "attr.data-amplify-authenticator-signin": "this.dataAttr" } }, ngImport: i0, template: "<amplify-slot name=\"sign-in-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    style=\"flex-direction: column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <legend class=\"amplify-visually-hidden\">Sign in</legend>\n    <amplify-base-form-fields route=\"signIn\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ signInButtonText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n</form>\n\n<amplify-slot name=\"sign-in-footer\" [context]=\"context\">\n  <div data-amplify-footer>\n    <button\n      amplify-button\n      fontWeight=\"normal\"\n      size=\"small\"\n      variation=\"link\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toForgotPassword()\"\n    >\n      {{ forgotPasswordText }}\n    </button>\n  </div>\n</amplify-slot>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }, { kind: "component", type: FederatedSignInComponent, selector: "amplify-federated-sign-in" }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignInComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-sign-in', encapsulation: ViewEncapsulation.None, template: "<amplify-slot name=\"sign-in-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    style=\"flex-direction: column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <legend class=\"amplify-visually-hidden\">Sign in</legend>\n    <amplify-base-form-fields route=\"signIn\"></amplify-base-form-fields>\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ signInButtonText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n</form>\n\n<amplify-slot name=\"sign-in-footer\" [context]=\"context\">\n  <div data-amplify-footer>\n    <button\n      amplify-button\n      fontWeight=\"normal\"\n      size=\"small\"\n      variation=\"link\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.toForgotPassword()\"\n    >\n      {{ forgotPasswordText }}\n    </button>\n  </div>\n</amplify-slot>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-signin']
            }] } });

class SignUpFormFieldsComponent {
}
SignUpFormFieldsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpFormFieldsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
SignUpFormFieldsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SignUpFormFieldsComponent, selector: "amplify-sign-up-form-fields", ngImport: i0, template: "<div class=\"amplify-flex amplify-authenticator__column\" data-amplify-fieldset>\n  <amplify-base-form-fields route=\"signUp\"></amplify-base-form-fields>\n</div>\n", dependencies: [{ kind: "component", type: BaseFormFieldsComponent, selector: "amplify-base-form-fields", inputs: ["route"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpFormFieldsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-sign-up-form-fields', template: "<div class=\"amplify-flex amplify-authenticator__column\" data-amplify-fieldset>\n  <amplify-base-form-fields route=\"signUp\"></amplify-base-form-fields>\n</div>\n" }]
        }] });

const { getCreateAccountText } = authenticatorTextUtil;
class SignUpComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        // translated texts
        this.createAccountText = getCreateAccountText();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    onInput(event) {
        const { checked, name, type, value } = event.target;
        const isUncheckedCheckbox = type === 'checkbox' && !checked;
        this.authenticator.updateForm({
            name,
            value: isUncheckedCheckbox ? undefined : value,
        });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
SignUpComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
SignUpComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SignUpComponent, selector: "amplify-sign-up", host: { properties: { "attr.data-amplify-authenticator-signup": "this.dataAttr" } }, ngImport: i0, template: "<amplify-slot name=\"sign-up-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <div class=\"amplify-flex amplify-authenticator__column\">\n    <div class=\"amplify-flex amplify-authenticator__column\">\n      <amplify-slot name=\"sign-up-form-fields\" [context]=\"context\">\n        <amplify-sign-up-form-fields></amplify-sign-up-form-fields>\n      </amplify-slot>\n\n      <amplify-error *ngIf=\"authenticator.error\">\n        {{ authenticator.error }}\n      </amplify-error>\n    </div>\n\n    <amplify-slot name=\"sign-up-button\" [context]=\"context\">\n      <button\n        [isDisabled]=\"\n          authenticator.isPending || authenticator.hasValidationErrors\n        \"\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n      >\n        {{ createAccountText }}\n      </button>\n    </amplify-slot>\n  </div>\n</form>\n\n<amplify-slot name=\"sign-up-footer\" [context]=\"context\"> </amplify-slot>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }, { kind: "component", type: FederatedSignInComponent, selector: "amplify-federated-sign-in" }, { kind: "component", type: SignUpFormFieldsComponent, selector: "amplify-sign-up-form-fields" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-sign-up', template: "<amplify-slot name=\"sign-up-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <div class=\"amplify-flex amplify-authenticator__column\">\n    <div class=\"amplify-flex amplify-authenticator__column\">\n      <amplify-slot name=\"sign-up-form-fields\" [context]=\"context\">\n        <amplify-sign-up-form-fields></amplify-sign-up-form-fields>\n      </amplify-slot>\n\n      <amplify-error *ngIf=\"authenticator.error\">\n        {{ authenticator.error }}\n      </amplify-error>\n    </div>\n\n    <amplify-slot name=\"sign-up-button\" [context]=\"context\">\n      <button\n        [isDisabled]=\"\n          authenticator.isPending || authenticator.hasValidationErrors\n        \"\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n      >\n        {{ createAccountText }}\n      </button>\n    </amplify-slot>\n  </div>\n</form>\n\n<amplify-slot name=\"sign-up-footer\" [context]=\"context\"> </amplify-slot>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-signup']
            }] } });

class TabItemComponent {
    constructor() {
        this.active = false;
        this.display = 'block'; // emulate div behavior
    }
}
TabItemComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TabItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TabItemComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: TabItemComponent, selector: "amplify-tab-item", inputs: { title: "title", active: "active", id: "id", labelledById: "labelledById", tabIndex: "tabIndex" }, host: { properties: { "style.display": "this.display" } }, ngImport: i0, template: "<div\n  role=\"tabpanel\"\n  class=\"amplify-tabs__panel\"\n  [class]=\"active ? 'amplify-tabs__panel--active' : ''\"\n  [id]=\"id\"\n  [attr.aria-labelledby]=\"labelledById\"\n  [attr.tabindex]=\"tabIndex\"\n>\n  <ng-content *ngIf=\"active\"></ng-content>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TabItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-tab-item', template: "<div\n  role=\"tabpanel\"\n  class=\"amplify-tabs__panel\"\n  [class]=\"active ? 'amplify-tabs__panel--active' : ''\"\n  [id]=\"id\"\n  [attr.aria-labelledby]=\"labelledById\"\n  [attr.tabindex]=\"tabIndex\"\n>\n  <ng-content *ngIf=\"active\"></ng-content>\n</div>\n" }]
        }], propDecorators: { title: [{
                type: Input
            }], active: [{
                type: Input
            }], id: [{
                type: Input
            }], labelledById: [{
                type: Input
            }], tabIndex: [{
                type: Input
            }], display: [{
                type: HostBinding,
                args: ['style.display']
            }] } });

class TabsComponent {
    constructor() {
        this.tabChange = new EventEmitter();
    }
    ngAfterContentInit() {
        // assign ids
        this.tabs.forEach((tab, index) => {
            tab.id = `tab-${nanoid(12)}-panel-${index}`;
            tab.labelledById = `tab-${nanoid(12)}-tab-${index}`;
        });
        // find active tab
        // TODO(enhancement): more declarative way for choosing the initial tab to render
        const activeTabs = this.tabs.filter((tab) => tab.active);
        // set active tab
        if (activeTabs.length !== 1) {
            this.selectTab(this.tabs.first);
        }
    }
    selectTab(tab) {
        this.tabs.forEach((tab) => {
            tab.active = false;
        });
        tab.active = true;
    }
    handleTabClick(tab) {
        if (tab.active)
            return; // don't do anything if clicks the current active tab
        this.tabChange.emit();
        this.selectTab(tab);
    }
}
TabsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TabsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
TabsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: TabsComponent, selector: "amplify-tabs", outputs: { tabChange: "tabChange" }, queries: [{ propertyName: "tabs", predicate: TabItemComponent }], ngImport: i0, template: "<div class=\"amplify-tabs\">\n  <div\n    class=\"amplify-tabs__list amplify-tabs__list--top amplify-tabs__list--equal\"\n    role=\"tablist\"\n  >\n    <button\n      *ngFor=\"let tab of tabs\"\n      class=\"amplify-tabs__item\"\n      role=\"tab\"\n      [id]=\"tab.labelledById\"\n      [tabindex]=\"tab.active ? '0' : '-1'\"\n      [attr.aria-selected]=\"tab.active\"\n      [attr.aria-controls]=\"tab.id\"\n      [class]=\"tab.active ? 'amplify-tabs__item--active' : ''\"\n      (click)=\"handleTabClick(tab)\"\n    >\n      {{ tab.title }}\n    </button>\n  </div>\n</div>\n\n<ng-content></ng-content>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: TabsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-tabs', template: "<div class=\"amplify-tabs\">\n  <div\n    class=\"amplify-tabs__list amplify-tabs__list--top amplify-tabs__list--equal\"\n    role=\"tablist\"\n  >\n    <button\n      *ngFor=\"let tab of tabs\"\n      class=\"amplify-tabs__item\"\n      role=\"tab\"\n      [id]=\"tab.labelledById\"\n      [tabindex]=\"tab.active ? '0' : '-1'\"\n      [attr.aria-selected]=\"tab.active\"\n      [attr.aria-controls]=\"tab.id\"\n      [class]=\"tab.active ? 'amplify-tabs__item--active' : ''\"\n      (click)=\"handleTabClick(tab)\"\n    >\n      {{ tab.title }}\n    </button>\n  </div>\n</div>\n\n<ng-content></ng-content>\n" }]
        }], propDecorators: { tabs: [{
                type: ContentChildren,
                args: [TabItemComponent]
            }], tabChange: [{
                type: Output
            }] } });

const getAttributeMap = () => defaultFormFieldOptions;

const { getSkipText, getVerifyText, getAccountRecoveryInfoText } = authenticatorTextUtil;
class VerifyUserComponent {
    constructor(authenticator) {
        this.authenticator = authenticator;
        this.dataAttr = '';
        this.headerText = getAccountRecoveryInfoText();
        this.unverifiedUserAttributes = {};
        this.labelId = nanoid(12);
        // translated texts
        this.skipText = getSkipText();
        this.verifyText = getVerifyText();
    }
    get context() {
        return this.authenticator.slotContext;
    }
    ngOnInit() {
        const actorState = getActorState(this.authenticator.authState);
        this.unverifiedUserAttributes = actorState.context.unverifiedUserAttributes;
    }
    getLabel(attr, value) {
        const attributeMap = getAttributeMap();
        const { label } = attributeMap[attr];
        const translatedTypeLabel = translate(label);
        const censoredAttributeValue = censorContactMethod(label, value);
        return `${translatedTypeLabel}: ${censoredAttributeValue}`;
    }
    onInput(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.authenticator.updateForm({ name, value });
    }
    onSubmit(event) {
        event.preventDefault();
        this.authenticator.submitForm(getFormDataFromEvent(event));
    }
}
VerifyUserComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: VerifyUserComponent, deps: [{ token: AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
VerifyUserComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: VerifyUserComponent, selector: "amplify-verify-user", inputs: { headerText: "headerText" }, host: { properties: { "attr.data-amplify-authenticator-verifyuser": "this.dataAttr" } }, ngImport: i0, template: "<form data-amplify-form (input)=\"onInput($event)\" (submit)=\"onSubmit($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"verify-user-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <div\n      *ngFor=\"\n        let unverifiedUserAttribute of unverifiedUserAttributes | keyvalue\n        let i = index;\n      \"\n    >\n      <input\n        name=\"unverifiedAttr\"\n        type=\"radio\"\n        [value]=\"unverifiedUserAttribute.key\"\n        [id]=\"labelId\"\n        [checked]=\"i === 0\"\n      />\n      <label [for]=\"labelId\">{{\n        getLabel(unverifiedUserAttribute.key, unverifiedUserAttribute.value)\n      }}</label>\n    </div>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ verifyText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.skipVerification()\"\n    >\n      {{ skipText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"verify-user-footer\" [context]=\"context\"> </amplify-slot>\n</form>\n", dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: ErrorComponent, selector: "amplify-error" }, { kind: "pipe", type: i2.KeyValuePipe, name: "keyvalue" }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: VerifyUserComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-verify-user', encapsulation: ViewEncapsulation.None, template: "<form data-amplify-form (input)=\"onInput($event)\" (submit)=\"onSubmit($event)\">\n  <fieldset\n    class=\"amplify-flex amplify-authenticator__column\"\n    data-amplify-fieldset\n    [disabled]=\"authenticator.isPending\"\n  >\n    <amplify-slot name=\"verify-user-header\" [context]=\"context\">\n      <h3 class=\"amplify-heading amplify-heading--3\">{{ this.headerText }}</h3>\n    </amplify-slot>\n\n    <div\n      *ngFor=\"\n        let unverifiedUserAttribute of unverifiedUserAttributes | keyvalue\n        let i = index;\n      \"\n    >\n      <input\n        name=\"unverifiedAttr\"\n        type=\"radio\"\n        [value]=\"unverifiedUserAttribute.key\"\n        [id]=\"labelId\"\n        [checked]=\"i === 0\"\n      />\n      <label [for]=\"labelId\">{{\n        getLabel(unverifiedUserAttribute.key, unverifiedUserAttribute.value)\n      }}</label>\n    </div>\n\n    <button\n      amplify-button\n      variation=\"primary\"\n      fullWidth=\"true\"\n      type=\"submit\"\n      [isDisabled]=\"authenticator.isPending\"\n    >\n      {{ verifyText }}\n    </button>\n\n    <button\n      amplify-button\n      size=\"small\"\n      variation=\"link\"\n      fontWeight=\"normal\"\n      fullWidth=\"true\"\n      (click)=\"authenticator.skipVerification()\"\n    >\n      {{ skipText }}\n    </button>\n\n    <amplify-error *ngIf=\"authenticator.error\">\n      {{ authenticator.error }}\n    </amplify-error>\n  </fieldset>\n  <amplify-slot name=\"verify-user-footer\" [context]=\"context\"> </amplify-slot>\n</form>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-verifyuser']
            }], headerText: [{
                type: Input
            }] } });

const { getSignInTabText, getSignUpTabText } = authenticatorTextUtil;
class AuthenticatorComponent {
    constructor(authenticator, contextService, changeDetector) {
        this.authenticator = authenticator;
        this.contextService = contextService;
        this.changeDetector = changeDetector;
        this.customComponentQuery = null;
        // translated texts
        this.signInTitle = getSignInTabText();
        this.signUpTitle = getSignUpTabText();
        this.hasInitialized = false;
        this.isHandlingHubEvent = false;
    }
    // context passed to "authenticated" slot
    get context() {
        return this.authenticator.slotContext;
    }
    get route() {
        return this.authenticator.route;
    }
    ngOnInit() {
        const { initialState, loginMechanisms, services, signUpAttributes, socialProviders, formFields, } = this;
        this.clearUserAgent = setUserAgent({
            componentName: 'Authenticator',
            packageName: 'angular',
            version: VERSION,
        });
        const { initializeMachine } = this.authenticator;
        this.authenticator.hubSubject.subscribe(() => {
            /*
             * Hub events aren't properly caught by Angular, because they are
             * synchronous events. Angular tracks async network events and
             * html events, but not synchronous events like hub.
             *
             * On any notable hub events, we run change detection manually.
             */
            this.changeDetector.detectChanges();
            /*
             * Hub events that we handle can lead to multiple state changes:
             * e.g. `authenticated` -> `signOut` -> initialState.
             *
             * We want to ensure change detection runs all the way, until
             * we reach back to the initial state. Setting the below flag
             * to true to until we reach initial state.
             */
            this.isHandlingHubEvent = true;
        });
        /**
         * Subscribes to state machine changes and sends INIT event
         * once machine reaches 'setup' state.
         */
        this.unsubscribeMachine = this.authenticator.subscribe(() => {
            const { route } = this.authenticator;
            if (this.isHandlingHubEvent) {
                this.changeDetector.detectChanges();
                const initialStateWithDefault = initialState ?? 'signIn';
                // We can stop manual change detection if we're back to the initial state
                if (route === initialStateWithDefault) {
                    this.isHandlingHubEvent = false;
                }
            }
            if (!this.hasInitialized && route === 'setup') {
                initializeMachine({
                    initialState,
                    loginMechanisms,
                    services,
                    signUpAttributes,
                    socialProviders,
                    formFields,
                });
                this.hasInitialized = true;
            }
        }).unsubscribe;
        /**
         * handling translations after content init, because authenticator and its
         * translations might be initialized before the main app's `ngOnInit` is run.
         */
        this.signInTitle = getSignInTabText();
        this.signUpTitle = getSignUpTabText();
    }
    /**
     * Lifecycle Methods
     */
    ngAfterContentInit() {
        this.contextService.customComponents = this.mapCustomComponents(this.customComponentQuery);
    }
    ngOnDestroy() {
        this.clearUserAgent();
        if (this.unsubscribeMachine)
            this.unsubscribeMachine();
    }
    /**
     * Class Functions
     */
    onTabChange() {
        const { route } = this.authenticator;
        if (route === 'signIn') {
            this.authenticator.toSignUp();
        }
        else {
            this.authenticator.toSignIn();
        }
    }
    hasTabs() {
        const { route } = this.authenticator;
        return route === 'signIn' || route === 'signUp';
    }
    hasRouteComponent() {
        const { route } = this.authenticator;
        switch (route) {
            case 'authenticated':
            case 'idle':
            case 'setup':
            case 'signOut':
            case 'transition':
                return false;
            default:
                return true;
        }
    }
    mapCustomComponents(componentQuery) {
        if (!componentQuery)
            return {};
        const customComponents = {};
        componentQuery.forEach((component) => {
            customComponents[component.name] = component.template;
        });
        return customComponents;
    }
}
AuthenticatorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AuthenticatorComponent, deps: [{ token: AuthenticatorService }, { token: CustomComponentsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
AuthenticatorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: AuthenticatorComponent, selector: "amplify-authenticator", inputs: { formFields: "formFields", initialState: "initialState", loginMechanisms: "loginMechanisms", services: "services", signUpAttributes: "signUpAttributes", socialProviders: "socialProviders", variation: "variation", hideSignUp: "hideSignUp" }, providers: [CustomComponentsService], queries: [{ propertyName: "customComponentQuery", predicate: AmplifySlotDirective }], ngImport: i0, template: "<div\n  data-amplify-authenticator\n  [attr.data-variation]=\"variation\"\n  *ngIf=\"hasRouteComponent()\"\n>\n  <div data-amplify-container>\n    <amplify-slot name=\"header\" [context]=\"context\"></amplify-slot>\n    <div\n      data-amplify-router\n      [attr.data-amplify-router-content]=\"hasTabs() ? undefined : ''\"\n    >\n      <amplify-tabs\n        (tabChange)=\"onTabChange()\"\n        *ngIf=\"(route === 'signIn' || route === 'signUp') && !hideSignUp\"\n      >\n        <amplify-tab-item\n          [title]=\"signInTitle\"\n          [active]=\"route === 'signIn'\"\n          data-amplify-router-content\n        >\n          <!-- signIn component -->\n          <amplify-slot\n            name=\"sign-in\"\n            [context]=\"context\"\n            *ngIf=\"route === 'signIn'\"\n          >\n            <amplify-sign-in></amplify-sign-in>\n          </amplify-slot>\n        </amplify-tab-item>\n        <amplify-tab-item\n          [title]=\"signUpTitle\"\n          [active]=\"route === 'signUp'\"\n          data-amplify-router-content\n        >\n          <!-- signUp component -->\n          <amplify-slot\n            name=\"sign-up\"\n            [context]=\"context\"\n            *ngIf=\"route === 'signUp'\"\n          >\n            <amplify-sign-up></amplify-sign-up>\n          </amplify-slot>\n        </amplify-tab-item>\n      </amplify-tabs>\n\n      <amplify-slot\n        name=\"sign-in\"\n        [context]=\"context\"\n        *ngIf=\"route === 'signIn' && hideSignUp\"\n      >\n        <amplify-sign-in></amplify-sign-in>\n      </amplify-slot>\n\n      <!-- confirmSignUp content -->\n      <amplify-slot\n        name=\"confirm-sign-up\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmSignUp'\"\n      >\n        <amplify-confirm-sign-up></amplify-confirm-sign-up>\n      </amplify-slot>\n\n      <!-- confirmSignIn content -->\n      <amplify-slot\n        name=\"confirm-sign-in\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmSignIn'\"\n      >\n        <amplify-confirm-sign-in></amplify-confirm-sign-in>\n      </amplify-slot>\n\n      <!-- setupTotp content -->\n      <amplify-slot\n        name=\"setup-totp\"\n        [context]=\"context\"\n        *ngIf=\"route === 'setupTotp'\"\n      >\n        <amplify-setup-totp></amplify-setup-totp>\n      </amplify-slot>\n\n      <!-- forceNewPassword content -->\n      <amplify-slot\n        name=\"force-new-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'forceNewPassword'\"\n      >\n        <amplify-force-new-password></amplify-force-new-password>\n      </amplify-slot>\n\n      <!-- forgotPassword content -->\n      <amplify-slot\n        name=\"forgot-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'forgotPassword'\"\n      >\n        <amplify-forgot-password></amplify-forgot-password>\n      </amplify-slot>\n\n      <!-- confirmResetPassword content -->\n      <amplify-slot\n        name=\"confirm-reset-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmResetPassword'\"\n      >\n        <amplify-confirm-reset-password></amplify-confirm-reset-password>\n      </amplify-slot>\n\n      <!-- verifyUser content -->\n      <amplify-slot\n        name=\"verify-user\"\n        [context]=\"context\"\n        *ngIf=\"route === 'verifyUser'\"\n      >\n        <amplify-verify-user></amplify-verify-user>\n      </amplify-slot>\n\n      <!-- confirmVerifyUser content -->\n      <amplify-slot\n        name=\"confirm-verify-user\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmVerifyUser'\"\n      >\n        <amplify-confirm-verify-user></amplify-confirm-verify-user>\n      </amplify-slot>\n    </div>\n\n    <amplify-slot name=\"footer\" [context]=\"context\"></amplify-slot>\n  </div>\n</div>\n\n<!-- signedIn content is rendered outside authenticator so it's not styled by authenticator -->\n<amplify-slot\n  name=\"authenticated\"\n  [context]=\"context\"\n  *ngIf=\"route === 'authenticated'\"\n>\n  <ng-content></ng-content>\n</amplify-slot>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: ConfirmResetPasswordComponent, selector: "amplify-confirm-reset-password", inputs: ["headerText"] }, { kind: "component", type: ConfirmSignInComponent, selector: "amplify-confirm-sign-in" }, { kind: "component", type: ConfirmSignUpComponent, selector: "amplify-confirm-sign-up" }, { kind: "component", type: ConfirmVerifyUserComponent, selector: "amplify-confirm-verify-user", inputs: ["headerText"] }, { kind: "component", type: ForceNewPasswordComponent, selector: "amplify-force-new-password", inputs: ["headerText"] }, { kind: "component", type: ForgotPasswordComponent, selector: "amplify-forgot-password", inputs: ["headerText"] }, { kind: "component", type: SetupTotpComponent, selector: "amplify-setup-totp" }, { kind: "component", type: SignInComponent, selector: "amplify-sign-in" }, { kind: "component", type: SignUpComponent, selector: "amplify-sign-up" }, { kind: "component", type: TabItemComponent, selector: "amplify-tab-item", inputs: ["title", "active", "id", "labelledById", "tabIndex"] }, { kind: "component", type: TabsComponent, selector: "amplify-tabs", outputs: ["tabChange"] }, { kind: "component", type: VerifyUserComponent, selector: "amplify-verify-user", inputs: ["headerText"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AuthenticatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-authenticator', providers: [CustomComponentsService], encapsulation: ViewEncapsulation.None, template: "<div\n  data-amplify-authenticator\n  [attr.data-variation]=\"variation\"\n  *ngIf=\"hasRouteComponent()\"\n>\n  <div data-amplify-container>\n    <amplify-slot name=\"header\" [context]=\"context\"></amplify-slot>\n    <div\n      data-amplify-router\n      [attr.data-amplify-router-content]=\"hasTabs() ? undefined : ''\"\n    >\n      <amplify-tabs\n        (tabChange)=\"onTabChange()\"\n        *ngIf=\"(route === 'signIn' || route === 'signUp') && !hideSignUp\"\n      >\n        <amplify-tab-item\n          [title]=\"signInTitle\"\n          [active]=\"route === 'signIn'\"\n          data-amplify-router-content\n        >\n          <!-- signIn component -->\n          <amplify-slot\n            name=\"sign-in\"\n            [context]=\"context\"\n            *ngIf=\"route === 'signIn'\"\n          >\n            <amplify-sign-in></amplify-sign-in>\n          </amplify-slot>\n        </amplify-tab-item>\n        <amplify-tab-item\n          [title]=\"signUpTitle\"\n          [active]=\"route === 'signUp'\"\n          data-amplify-router-content\n        >\n          <!-- signUp component -->\n          <amplify-slot\n            name=\"sign-up\"\n            [context]=\"context\"\n            *ngIf=\"route === 'signUp'\"\n          >\n            <amplify-sign-up></amplify-sign-up>\n          </amplify-slot>\n        </amplify-tab-item>\n      </amplify-tabs>\n\n      <amplify-slot\n        name=\"sign-in\"\n        [context]=\"context\"\n        *ngIf=\"route === 'signIn' && hideSignUp\"\n      >\n        <amplify-sign-in></amplify-sign-in>\n      </amplify-slot>\n\n      <!-- confirmSignUp content -->\n      <amplify-slot\n        name=\"confirm-sign-up\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmSignUp'\"\n      >\n        <amplify-confirm-sign-up></amplify-confirm-sign-up>\n      </amplify-slot>\n\n      <!-- confirmSignIn content -->\n      <amplify-slot\n        name=\"confirm-sign-in\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmSignIn'\"\n      >\n        <amplify-confirm-sign-in></amplify-confirm-sign-in>\n      </amplify-slot>\n\n      <!-- setupTotp content -->\n      <amplify-slot\n        name=\"setup-totp\"\n        [context]=\"context\"\n        *ngIf=\"route === 'setupTotp'\"\n      >\n        <amplify-setup-totp></amplify-setup-totp>\n      </amplify-slot>\n\n      <!-- forceNewPassword content -->\n      <amplify-slot\n        name=\"force-new-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'forceNewPassword'\"\n      >\n        <amplify-force-new-password></amplify-force-new-password>\n      </amplify-slot>\n\n      <!-- forgotPassword content -->\n      <amplify-slot\n        name=\"forgot-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'forgotPassword'\"\n      >\n        <amplify-forgot-password></amplify-forgot-password>\n      </amplify-slot>\n\n      <!-- confirmResetPassword content -->\n      <amplify-slot\n        name=\"confirm-reset-password\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmResetPassword'\"\n      >\n        <amplify-confirm-reset-password></amplify-confirm-reset-password>\n      </amplify-slot>\n\n      <!-- verifyUser content -->\n      <amplify-slot\n        name=\"verify-user\"\n        [context]=\"context\"\n        *ngIf=\"route === 'verifyUser'\"\n      >\n        <amplify-verify-user></amplify-verify-user>\n      </amplify-slot>\n\n      <!-- confirmVerifyUser content -->\n      <amplify-slot\n        name=\"confirm-verify-user\"\n        [context]=\"context\"\n        *ngIf=\"route === 'confirmVerifyUser'\"\n      >\n        <amplify-confirm-verify-user></amplify-confirm-verify-user>\n      </amplify-slot>\n    </div>\n\n    <amplify-slot name=\"footer\" [context]=\"context\"></amplify-slot>\n  </div>\n</div>\n\n<!-- signedIn content is rendered outside authenticator so it's not styled by authenticator -->\n<amplify-slot\n  name=\"authenticated\"\n  [context]=\"context\"\n  *ngIf=\"route === 'authenticated'\"\n>\n  <ng-content></ng-content>\n</amplify-slot>\n" }]
        }], ctorParameters: function () { return [{ type: AuthenticatorService }, { type: CustomComponentsService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { formFields: [{
                type: Input
            }], initialState: [{
                type: Input
            }], loginMechanisms: [{
                type: Input
            }], services: [{
                type: Input
            }], signUpAttributes: [{
                type: Input
            }], socialProviders: [{
                type: Input
            }], variation: [{
                type: Input
            }], hideSignUp: [{
                type: Input
            }], customComponentQuery: [{
                type: ContentChildren,
                args: [AmplifySlotDirective]
            }] } });

class CheckboxComponent {
    constructor() {
        this.defaultChecked = false;
        this.hasError = false;
        this.isChecked = false;
    }
    ngOnInit() {
        if (this.defaultChecked) {
            this.isChecked = true;
        }
    }
    handleClick() {
        this.isChecked = !this.isChecked;
    }
}
CheckboxComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: CheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
CheckboxComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: CheckboxComponent, selector: "amplify-checkbox", inputs: { defaultChecked: "defaultChecked", errorMessage: "errorMessage", hasError: "hasError", label: "label", name: "name", value: "value" }, ngImport: i0, template: "<div class=\"amplify-flex amplify-field amplify-checkboxfield\">\n  <label class=\"amplify-flex amplify-checkbox\">\n    <span class=\"amplify-visually-hidden\">\n      <input\n        (click)=\"handleClick()\"\n        class=\"\n          amplify-input\n          amplify-field-group__control\n          amplify-checkbox__input\n        \"\n        aria-invalid=\"false\"\n        type=\"checkbox\"\n        [name]=\"name\"\n        [value]=\"value\"\n      />\n    </span>\n    <span\n      class=\"amplify-flex amplify-checkbox__button\"\n      aria-hidden=\"true\"\n      data-focus=\"false\"\n      [ngClass]=\"{\n        'amplify-checkbox__button--error': hasError\n      }\"\n      [attr.data-error]=\"hasError\"\n      [attr.data-checked]=\"isChecked\"\n    >\n      <svg\n        xmlns=\"http://www.w3.org/2000/svg\"\n        class=\"amplify-icon amplify-checkbox__icon\"\n        viewBox=\"0 0 24 24\"\n        fill=\"currentColor\"\n        [attr.data-checked]=\"isChecked\"\n        [ngClass]=\"{\n          'amplify-checkbox__icon--checked': isChecked\n        }\"\n      >\n        <path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"></path>\n      </svg>\n    </span>\n    <span class=\"amplify-text amplify-checkbox__label\">\n      <ng-content></ng-content>\n    </span>\n  </label>\n  <p *ngIf=\"hasError\" class=\"amplify-text amplify-field__error-message\">\n    {{ errorMessage }}\n  </p>\n</div>\n", dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: CheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-checkbox', template: "<div class=\"amplify-flex amplify-field amplify-checkboxfield\">\n  <label class=\"amplify-flex amplify-checkbox\">\n    <span class=\"amplify-visually-hidden\">\n      <input\n        (click)=\"handleClick()\"\n        class=\"\n          amplify-input\n          amplify-field-group__control\n          amplify-checkbox__input\n        \"\n        aria-invalid=\"false\"\n        type=\"checkbox\"\n        [name]=\"name\"\n        [value]=\"value\"\n      />\n    </span>\n    <span\n      class=\"amplify-flex amplify-checkbox__button\"\n      aria-hidden=\"true\"\n      data-focus=\"false\"\n      [ngClass]=\"{\n        'amplify-checkbox__button--error': hasError\n      }\"\n      [attr.data-error]=\"hasError\"\n      [attr.data-checked]=\"isChecked\"\n    >\n      <svg\n        xmlns=\"http://www.w3.org/2000/svg\"\n        class=\"amplify-icon amplify-checkbox__icon\"\n        viewBox=\"0 0 24 24\"\n        fill=\"currentColor\"\n        [attr.data-checked]=\"isChecked\"\n        [ngClass]=\"{\n          'amplify-checkbox__icon--checked': isChecked\n        }\"\n      >\n        <path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z\"></path>\n      </svg>\n    </span>\n    <span class=\"amplify-text amplify-checkbox__label\">\n      <ng-content></ng-content>\n    </span>\n  </label>\n  <p *ngIf=\"hasError\" class=\"amplify-text amplify-field__error-message\">\n    {{ errorMessage }}\n  </p>\n</div>\n" }]
        }], propDecorators: { defaultChecked: [{
                type: Input
            }], errorMessage: [{
                type: Input
            }], hasError: [{
                type: Input
            }], label: [{
                type: Input
            }], name: [{
                type: Input
            }], value: [{
                type: Input
            }] } });

class AmplifyAuthenticatorModule {
}
AmplifyAuthenticatorModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifyAuthenticatorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AmplifyAuthenticatorModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.3.0", ngImport: i0, type: AmplifyAuthenticatorModule, declarations: [AmplifySlotComponent,
        AmplifySlotDirective,
        AuthenticatorComponent,
        BaseFormFieldsComponent,
        ButtonComponent,
        CheckboxComponent,
        ConfirmResetPasswordComponent,
        ConfirmSignInComponent,
        ConfirmSignUpComponent,
        ConfirmVerifyUserComponent,
        ErrorComponent,
        FederatedSignInButtonComponent,
        FederatedSignInComponent,
        ForceNewPasswordComponent,
        ForceNewPasswordFormFieldsComponent,
        FormFieldComponent,
        PasswordFieldComponent,
        PhoneNumberFieldComponent,
        ForgotPasswordComponent,
        SelectComponent,
        SetupTotpComponent,
        SignInComponent,
        SignUpComponent,
        SignUpFormFieldsComponent,
        TabItemComponent,
        TabsComponent,
        TextFieldComponent,
        VerifyUserComponent], imports: [CommonModule], exports: [AmplifySlotDirective,
        AuthenticatorComponent,
        CheckboxComponent,
        SignUpFormFieldsComponent,
        ForceNewPasswordFormFieldsComponent,
        TextFieldComponent] });
AmplifyAuthenticatorModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifyAuthenticatorModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: AmplifyAuthenticatorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        AmplifySlotComponent,
                        AmplifySlotDirective,
                        AuthenticatorComponent,
                        BaseFormFieldsComponent,
                        ButtonComponent,
                        CheckboxComponent,
                        ConfirmResetPasswordComponent,
                        ConfirmSignInComponent,
                        ConfirmSignUpComponent,
                        ConfirmVerifyUserComponent,
                        ErrorComponent,
                        FederatedSignInButtonComponent,
                        FederatedSignInComponent,
                        ForceNewPasswordComponent,
                        ForceNewPasswordFormFieldsComponent,
                        FormFieldComponent,
                        PasswordFieldComponent,
                        PhoneNumberFieldComponent,
                        ForgotPasswordComponent,
                        SelectComponent,
                        SetupTotpComponent,
                        SignInComponent,
                        SignUpComponent,
                        SignUpFormFieldsComponent,
                        TabItemComponent,
                        TabsComponent,
                        TextFieldComponent,
                        VerifyUserComponent,
                    ],
                    imports: [CommonModule],
                    exports: [
                        AmplifySlotDirective,
                        AuthenticatorComponent,
                        CheckboxComponent,
                        SignUpFormFieldsComponent,
                        ForceNewPasswordFormFieldsComponent,
                        TextFieldComponent,
                    ],
                }]
        }] });

/*
 * Public API Surface of ui-angular
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AmplifyAuthenticatorModule, AmplifySlotDirective, AuthenticatorComponent, AuthenticatorService, BaseFormFieldsComponent, ButtonComponent, CheckboxComponent, ConfirmResetPasswordComponent, ConfirmSignInComponent, ConfirmSignUpComponent, ConfirmVerifyUserComponent, CustomComponentsService, ErrorComponent, FederatedSignInButtonComponent, FederatedSignInComponent, ForceNewPasswordComponent, ForceNewPasswordFormFieldsComponent, ForgotPasswordComponent, FormFieldComponent, PasswordFieldComponent, PhoneNumberFieldComponent, SelectComponent, SetupTotpComponent, SignInComponent, SignUpComponent, SignUpFormFieldsComponent, TabItemComponent, TabsComponent, TextFieldComponent, VerifyUserComponent, getAttributeMap };
//# sourceMappingURL=aws-amplify-ui-angular.mjs.map