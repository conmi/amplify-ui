import { OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ButtonComponent implements OnInit {
    type: 'submit' | 'button';
    fullWidth: boolean | string;
    isDisabled: boolean | string;
    size: 'small' | 'medium' | 'large';
    variation: 'primary' | 'default' | 'link';
    fontWeight: 'normal' | 'bold' | 'lighter';
    typeAttr: string;
    fullWidthAttr: boolean | string;
    sizeAttr: string;
    variationAttr: string;
    fontWeightAttr: string;
    get getDisabled(): string;
    get classNames(): string;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ButtonComponent, "button[amplify-button]", never, { "type": "type"; "fullWidth": "fullWidth"; "isDisabled": "isDisabled"; "size": "size"; "variation": "variation"; "fontWeight": "fontWeight"; }, {}, never, ["*"], false>;
}
