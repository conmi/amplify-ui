import { AfterContentInit, TemplateRef } from '@angular/core';
import { CustomComponentsService } from '../../services/custom-components.service';
import * as i0 from "@angular/core";
export declare class AmplifySlotComponent implements AfterContentInit {
    private propService;
    name: string;
    context: Record<PropertyKey, unknown>;
    display: string;
    overridingComponent: TemplateRef<unknown>;
    isOverriden: boolean;
    constructor(propService: CustomComponentsService);
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AmplifySlotComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AmplifySlotComponent, "amplify-slot", never, { "name": "name"; "context": "context"; }, {}, never, ["*"], false>;
}
