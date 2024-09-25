import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class AmplifySlotDirective {
    template: TemplateRef<unknown>;
    name: string;
    constructor(template: TemplateRef<unknown>);
    set amplifySlot(component: string);
    static ɵfac: i0.ɵɵFactoryDeclaration<AmplifySlotDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AmplifySlotDirective, "[amplifySlot]", never, { "amplifySlot": "amplifySlot"; }, {}, never, never, false>;
}
