import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class AmplifySlotDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS1zbG90LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VpLWFuZ3VsYXIvc3JjL2xpYi91dGlsaXRpZXMvYW1wbGlmeS1zbG90L2FtcGxpZnktc2xvdC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQWUsTUFBTSxlQUFlLENBQUM7O0FBSzlELE1BQU0sT0FBTyxvQkFBb0I7SUFHL0IsWUFBbUIsUUFBOEI7UUFBOUIsYUFBUSxHQUFSLFFBQVEsQ0FBc0I7SUFBRyxDQUFDO0lBRXJELElBQWEsV0FBVyxDQUFDLFNBQWlCO1FBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQ3hCLENBQUM7O2lIQVBVLG9CQUFvQjtxR0FBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBSGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGVBQWU7aUJBQzFCO2tHQU1jLFdBQVc7c0JBQXZCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBUZW1wbGF0ZVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbYW1wbGlmeVNsb3RdJyxcbn0pXG5leHBvcnQgY2xhc3MgQW1wbGlmeVNsb3REaXJlY3RpdmUge1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8dW5rbm93bj4pIHt9XG5cbiAgQElucHV0KCkgc2V0IGFtcGxpZnlTbG90KGNvbXBvbmVudDogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gY29tcG9uZW50O1xuICB9XG59XG4iXX0=