import { Component } from '@angular/core';
import { translate } from '@aws-amplify/ui';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../button/button.component";
export class ErrorComponent {
    constructor() {
        this.isVisible = true;
        this.dismissAriaLabel = translate('Dismiss alert');
    }
    close() {
        this.isVisible = false;
    }
}
ErrorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ErrorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: ErrorComponent, selector: "amplify-error", ngImport: i0, template: "<div\n  class=\"amplify-flex amplify-alert amplify-alert--error\"\n  data-variation=\"error\"\n  style=\"align-items: center; justify-content: space-between\"\n  *ngIf=\"isVisible\"\n  role=\"alert\"\n>\n  <div class=\"amplify-flex\" style=\"align-items: center\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"\n      ></path>\n    </svg>\n    <div><ng-content></ng-content></div>\n  </div>\n  <button\n    amplify-button\n    [attr.aria-label]=\"dismissAriaLabel\"\n    variation=\"link\"\n    [fullWidth]=\"false\"\n    (click)=\"close()\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"\n      ></path>\n    </svg>\n  </button>\n</div>\n", dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: ErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-error', template: "<div\n  class=\"amplify-flex amplify-alert amplify-alert--error\"\n  data-variation=\"error\"\n  style=\"align-items: center; justify-content: space-between\"\n  *ngIf=\"isVisible\"\n  role=\"alert\"\n>\n  <div class=\"amplify-flex\" style=\"align-items: center\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"\n      ></path>\n    </svg>\n    <div><ng-content></ng-content></div>\n  </div>\n  <button\n    amplify-button\n    [attr.aria-label]=\"dismissAriaLabel\"\n    variation=\"link\"\n    [fullWidth]=\"false\"\n    (click)=\"close()\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      [attr.aria-hidden]=\"true\"\n      viewBox=\"0 0 24 24\"\n      fill=\"currentColor\"\n    >\n      <path\n        d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"\n      ></path>\n    </svg>\n  </button>\n</div>\n" }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWktYW5ndWxhci9zcmMvbGliL3ByaW1pdGl2ZXMvZXJyb3IvZXJyb3IuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWktYW5ndWxhci9zcmMvbGliL3ByaW1pdGl2ZXMvZXJyb3IvZXJyb3IuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFNNUMsTUFBTSxPQUFPLGNBQWM7SUFKM0I7UUFLUyxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLHFCQUFnQixHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUt0RDtJQUhRLEtBQUs7UUFDVixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDOzsyR0FOVSxjQUFjOytGQUFkLGNBQWMscURDUDNCLHdwQ0F5Q0E7MkZEbENhLGNBQWM7a0JBSjFCLFNBQVM7K0JBQ0UsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgdHJhbnNsYXRlIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L3VpJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW1wbGlmeS1lcnJvcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9lcnJvci5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIEVycm9yQ29tcG9uZW50IHtcbiAgcHVibGljIGlzVmlzaWJsZSA9IHRydWU7XG4gIHB1YmxpYyBkaXNtaXNzQXJpYUxhYmVsID0gdHJhbnNsYXRlKCdEaXNtaXNzIGFsZXJ0Jyk7XG5cbiAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG4gIH1cbn1cbiIsIjxkaXZcbiAgY2xhc3M9XCJhbXBsaWZ5LWZsZXggYW1wbGlmeS1hbGVydCBhbXBsaWZ5LWFsZXJ0LS1lcnJvclwiXG4gIGRhdGEtdmFyaWF0aW9uPVwiZXJyb3JcIlxuICBzdHlsZT1cImFsaWduLWl0ZW1zOiBjZW50ZXI7IGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlblwiXG4gICpuZ0lmPVwiaXNWaXNpYmxlXCJcbiAgcm9sZT1cImFsZXJ0XCJcbj5cbiAgPGRpdiBjbGFzcz1cImFtcGxpZnktZmxleFwiIHN0eWxlPVwiYWxpZ24taXRlbXM6IGNlbnRlclwiPlxuICAgIDxzdmdcbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgY2xhc3M9XCJhbXBsaWZ5LWljb25cIlxuICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwidHJ1ZVwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgID5cbiAgICAgIDxwYXRoXG4gICAgICAgIGQ9XCJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtMmgydjJ6bTAtNGgtMlY3aDJ2NnpcIlxuICAgICAgPjwvcGF0aD5cbiAgICA8L3N2Zz5cbiAgICA8ZGl2PjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5cbiAgPC9kaXY+XG4gIDxidXR0b25cbiAgICBhbXBsaWZ5LWJ1dHRvblxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZGlzbWlzc0FyaWFMYWJlbFwiXG4gICAgdmFyaWF0aW9uPVwibGlua1wiXG4gICAgW2Z1bGxXaWR0aF09XCJmYWxzZVwiXG4gICAgKGNsaWNrKT1cImNsb3NlKClcIlxuICA+XG4gICAgPHN2Z1xuICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICBjbGFzcz1cImFtcGxpZnktaWNvblwiXG4gICAgICBbYXR0ci5hcmlhLWhpZGRlbl09XCJ0cnVlXCJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgPlxuICAgICAgPHBhdGhcbiAgICAgICAgZD1cIk0xOSA2LjQxTDE3LjU5IDUgMTIgMTAuNTkgNi40MSA1IDUgNi40MSAxMC41OSAxMiA1IDE3LjU5IDYuNDEgMTkgMTIgMTMuNDEgMTcuNTkgMTkgMTkgMTcuNTkgMTMuNDEgMTJ6XCJcbiAgICAgID48L3BhdGg+XG4gICAgPC9zdmc+XG4gIDwvYnV0dG9uPlxuPC9kaXY+XG4iXX0=