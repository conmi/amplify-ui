import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CheckboxComponent implements OnInit {
    defaultChecked: boolean;
    errorMessage: string;
    hasError: boolean;
    label: string;
    name: string;
    value: string;
    isChecked: boolean;
    ngOnInit(): void;
    handleClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CheckboxComponent, "amplify-checkbox", never, { "defaultChecked": "defaultChecked"; "errorMessage": "errorMessage"; "hasError": "hasError"; "label": "label"; "name": "name"; "value": "value"; }, {}, never, ["*"], false>;
}
