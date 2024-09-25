import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PhoneNumberFieldComponent implements OnInit {
    autocomplete: string;
    disabled: boolean;
    defaultCountryCode: string;
    selectFieldId: string;
    textFieldId: string;
    initialValue: string;
    label: string;
    name: string;
    placeholder: string;
    required: boolean;
    type: string;
    labelHidden: boolean;
    dialCodeList: Array<string>;
    hasError: boolean;
    describedBy: string;
    display: string;
    countryDialCodesValues: Array<string>;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PhoneNumberFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PhoneNumberFieldComponent, "amplify-phone-number-field", never, { "autocomplete": "autocomplete"; "disabled": "disabled"; "defaultCountryCode": "defaultCountryCode"; "selectFieldId": "selectFieldId"; "textFieldId": "textFieldId"; "initialValue": "initialValue"; "label": "label"; "name": "name"; "placeholder": "placeholder"; "required": "required"; "type": "type"; "labelHidden": "labelHidden"; "dialCodeList": "dialCodeList"; "hasError": "hasError"; "describedBy": "describedBy"; }, {}, never, never, false>;
}
