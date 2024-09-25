import { Component, HostBinding } from '@angular/core';
import { getFormDataFromEvent, authenticatorTextUtil } from '@aws-amplify/ui';
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/authenticator.service";
import * as i2 from "@angular/common";
import * as i3 from "../../../../utilities/amplify-slot/amplify-slot.component";
import * as i4 from "../../../../primitives/button/button.component";
import * as i5 from "../../../../primitives/error/error.component";
import * as i6 from "../federated-sign-in/federated-sign-in.component";
import * as i7 from "./sign-up-form-fields/sign-up-form-fields.component";
const { getCreateAccountText } = authenticatorTextUtil;
export class SignUpComponent {
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
SignUpComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpComponent, deps: [{ token: i1.AuthenticatorService }], target: i0.ɵɵFactoryTarget.Component });
SignUpComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SignUpComponent, selector: "amplify-sign-up", host: { properties: { "attr.data-amplify-authenticator-signup": "this.dataAttr" } }, ngImport: i0, template: "<amplify-slot name=\"sign-up-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <div class=\"amplify-flex amplify-authenticator__column\">\n    <div class=\"amplify-flex amplify-authenticator__column\">\n      <amplify-slot name=\"sign-up-form-fields\" [context]=\"context\">\n        <amplify-sign-up-form-fields></amplify-sign-up-form-fields>\n      </amplify-slot>\n\n      <amplify-error *ngIf=\"authenticator.error\">\n        {{ authenticator.error }}\n      </amplify-error>\n    </div>\n\n    <amplify-slot name=\"sign-up-button\" [context]=\"context\">\n      <button\n        [isDisabled]=\"\n          authenticator.isPending || authenticator.hasValidationErrors\n        \"\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n      >\n        {{ createAccountText }}\n      </button>\n    </amplify-slot>\n  </div>\n</form>\n\n<amplify-slot name=\"sign-up-footer\" [context]=\"context\"> </amplify-slot>\n", dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.AmplifySlotComponent, selector: "amplify-slot", inputs: ["name", "context"] }, { kind: "component", type: i4.ButtonComponent, selector: "button[amplify-button]", inputs: ["type", "fullWidth", "isDisabled", "size", "variation", "fontWeight"] }, { kind: "component", type: i5.ErrorComponent, selector: "amplify-error" }, { kind: "component", type: i6.FederatedSignInComponent, selector: "amplify-federated-sign-in" }, { kind: "component", type: i7.SignUpFormFieldsComponent, selector: "amplify-sign-up-form-fields" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SignUpComponent, decorators: [{
            type: Component,
            args: [{ selector: 'amplify-sign-up', template: "<amplify-slot name=\"sign-up-header\" [context]=\"context\"></amplify-slot>\n\n<form data-amplify-form (submit)=\"onSubmit($event)\" (input)=\"onInput($event)\">\n  <amplify-federated-sign-in></amplify-federated-sign-in>\n  <div class=\"amplify-flex amplify-authenticator__column\">\n    <div class=\"amplify-flex amplify-authenticator__column\">\n      <amplify-slot name=\"sign-up-form-fields\" [context]=\"context\">\n        <amplify-sign-up-form-fields></amplify-sign-up-form-fields>\n      </amplify-slot>\n\n      <amplify-error *ngIf=\"authenticator.error\">\n        {{ authenticator.error }}\n      </amplify-error>\n    </div>\n\n    <amplify-slot name=\"sign-up-button\" [context]=\"context\">\n      <button\n        [isDisabled]=\"\n          authenticator.isPending || authenticator.hasValidationErrors\n        \"\n        amplify-button\n        variation=\"primary\"\n        fullWidth=\"true\"\n        type=\"submit\"\n      >\n        {{ createAccountText }}\n      </button>\n    </amplify-slot>\n  </div>\n</form>\n\n<amplify-slot name=\"sign-up-footer\" [context]=\"context\"> </amplify-slot>\n" }]
        }], ctorParameters: function () { return [{ type: i1.AuthenticatorService }]; }, propDecorators: { dataAttr: [{
                type: HostBinding,
                args: ['attr.data-amplify-authenticator-signup']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi11cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91aS1hbmd1bGFyL3NyYy9saWIvY29tcG9uZW50cy9hdXRoZW50aWNhdG9yL2NvbXBvbmVudHMvc2lnbi11cC9zaWduLXVwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VpLWFuZ3VsYXIvc3JjL2xpYi9jb21wb25lbnRzL2F1dGhlbnRpY2F0b3IvY29tcG9uZW50cy9zaWduLXVwL3NpZ24tdXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLHFCQUFxQixFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7OztBQUU5RSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQztBQU12RCxNQUFNLE9BQU8sZUFBZTtJQU0xQixZQUFtQixhQUFtQztRQUFuQyxrQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFMQyxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBRXJFLG1CQUFtQjtRQUNaLHNCQUFpQixHQUFHLG9CQUFvQixFQUFFLENBQUM7SUFFTyxDQUFDO0lBRTFELElBQVcsT0FBTztRQUNoQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBWTtRQUNsQixNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQXFCLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDdEUsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLEtBQUssVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRTVELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO1lBQzVCLElBQUk7WUFDSixLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSztTQUMvQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQVk7UUFDbkIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQzs7NEdBekJVLGVBQWU7Z0dBQWYsZUFBZSw0SUNWNUIsZ21DQWdDQTsyRkR0QmEsZUFBZTtrQkFKM0IsU0FBUzsrQkFDRSxpQkFBaUI7MkdBSTRCLFFBQVE7c0JBQTlELFdBQVc7dUJBQUMsd0NBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXV0aGVudGljYXRvclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy9hdXRoZW50aWNhdG9yLnNlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0Rm9ybURhdGFGcm9tRXZlbnQsIGF1dGhlbnRpY2F0b3JUZXh0VXRpbCB9IGZyb20gJ0Bhd3MtYW1wbGlmeS91aSc7XG5cbmNvbnN0IHsgZ2V0Q3JlYXRlQWNjb3VudFRleHQgfSA9IGF1dGhlbnRpY2F0b3JUZXh0VXRpbDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW1wbGlmeS1zaWduLXVwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpZ24tdXAuY29tcG9uZW50Lmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBTaWduVXBDb21wb25lbnQge1xuICBASG9zdEJpbmRpbmcoJ2F0dHIuZGF0YS1hbXBsaWZ5LWF1dGhlbnRpY2F0b3Itc2lnbnVwJykgZGF0YUF0dHIgPSAnJztcblxuICAvLyB0cmFuc2xhdGVkIHRleHRzXG4gIHB1YmxpYyBjcmVhdGVBY2NvdW50VGV4dCA9IGdldENyZWF0ZUFjY291bnRUZXh0KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGF1dGhlbnRpY2F0b3I6IEF1dGhlbnRpY2F0b3JTZXJ2aWNlKSB7fVxuXG4gIHB1YmxpYyBnZXQgY29udGV4dCgpOiBBdXRoZW50aWNhdG9yU2VydmljZVsnc2xvdENvbnRleHQnXSB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRvci5zbG90Q29udGV4dDtcbiAgfVxuXG4gIG9uSW5wdXQoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgeyBjaGVja2VkLCBuYW1lLCB0eXBlLCB2YWx1ZSB9ID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZXZlbnQudGFyZ2V0O1xuICAgIGNvbnN0IGlzVW5jaGVja2VkQ2hlY2tib3ggPSB0eXBlID09PSAnY2hlY2tib3gnICYmICFjaGVja2VkO1xuXG4gICAgdGhpcy5hdXRoZW50aWNhdG9yLnVwZGF0ZUZvcm0oe1xuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlOiBpc1VuY2hlY2tlZENoZWNrYm94ID8gdW5kZWZpbmVkIDogdmFsdWUsXG4gICAgfSk7XG4gIH1cblxuICBvblN1Ym1pdChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuYXV0aGVudGljYXRvci5zdWJtaXRGb3JtKGdldEZvcm1EYXRhRnJvbUV2ZW50KGV2ZW50KSk7XG4gIH1cbn1cbiIsIjxhbXBsaWZ5LXNsb3QgbmFtZT1cInNpZ24tdXAtaGVhZGVyXCIgW2NvbnRleHRdPVwiY29udGV4dFwiPjwvYW1wbGlmeS1zbG90PlxuXG48Zm9ybSBkYXRhLWFtcGxpZnktZm9ybSAoc3VibWl0KT1cIm9uU3VibWl0KCRldmVudClcIiAoaW5wdXQpPVwib25JbnB1dCgkZXZlbnQpXCI+XG4gIDxhbXBsaWZ5LWZlZGVyYXRlZC1zaWduLWluPjwvYW1wbGlmeS1mZWRlcmF0ZWQtc2lnbi1pbj5cbiAgPGRpdiBjbGFzcz1cImFtcGxpZnktZmxleCBhbXBsaWZ5LWF1dGhlbnRpY2F0b3JfX2NvbHVtblwiPlxuICAgIDxkaXYgY2xhc3M9XCJhbXBsaWZ5LWZsZXggYW1wbGlmeS1hdXRoZW50aWNhdG9yX19jb2x1bW5cIj5cbiAgICAgIDxhbXBsaWZ5LXNsb3QgbmFtZT1cInNpZ24tdXAtZm9ybS1maWVsZHNcIiBbY29udGV4dF09XCJjb250ZXh0XCI+XG4gICAgICAgIDxhbXBsaWZ5LXNpZ24tdXAtZm9ybS1maWVsZHM+PC9hbXBsaWZ5LXNpZ24tdXAtZm9ybS1maWVsZHM+XG4gICAgICA8L2FtcGxpZnktc2xvdD5cblxuICAgICAgPGFtcGxpZnktZXJyb3IgKm5nSWY9XCJhdXRoZW50aWNhdG9yLmVycm9yXCI+XG4gICAgICAgIHt7IGF1dGhlbnRpY2F0b3IuZXJyb3IgfX1cbiAgICAgIDwvYW1wbGlmeS1lcnJvcj5cbiAgICA8L2Rpdj5cblxuICAgIDxhbXBsaWZ5LXNsb3QgbmFtZT1cInNpZ24tdXAtYnV0dG9uXCIgW2NvbnRleHRdPVwiY29udGV4dFwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBbaXNEaXNhYmxlZF09XCJcbiAgICAgICAgICBhdXRoZW50aWNhdG9yLmlzUGVuZGluZyB8fCBhdXRoZW50aWNhdG9yLmhhc1ZhbGlkYXRpb25FcnJvcnNcbiAgICAgICAgXCJcbiAgICAgICAgYW1wbGlmeS1idXR0b25cbiAgICAgICAgdmFyaWF0aW9uPVwicHJpbWFyeVwiXG4gICAgICAgIGZ1bGxXaWR0aD1cInRydWVcIlxuICAgICAgICB0eXBlPVwic3VibWl0XCJcbiAgICAgID5cbiAgICAgICAge3sgY3JlYXRlQWNjb3VudFRleHQgfX1cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvYW1wbGlmeS1zbG90PlxuICA8L2Rpdj5cbjwvZm9ybT5cblxuPGFtcGxpZnktc2xvdCBuYW1lPVwic2lnbi11cC1mb290ZXJcIiBbY29udGV4dF09XCJjb250ZXh0XCI+IDwvYW1wbGlmeS1zbG90PlxuIl19