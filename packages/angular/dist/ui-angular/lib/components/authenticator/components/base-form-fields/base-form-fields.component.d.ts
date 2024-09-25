import { OnInit } from '@angular/core';
import { FormFieldComponents, FormFieldsArray } from '@aws-amplify/ui';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import * as i0 from "@angular/core";
/**
 * Sorts the given formFields, then renders them in order.
 */
export declare class BaseFormFieldsComponent implements OnInit {
    private authenticator;
    route: FormFieldComponents;
    display: string;
    formFields: FormFieldsArray;
    constructor(authenticator: AuthenticatorService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseFormFieldsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BaseFormFieldsComponent, "amplify-base-form-fields", never, { "route": "route"; }, {}, never, never, false>;
}
