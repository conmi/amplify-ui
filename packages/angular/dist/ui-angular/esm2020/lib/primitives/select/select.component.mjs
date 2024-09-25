import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class SelectComponent {
}
SelectComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: SelectComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
SelectComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: SelectComponent, selector: "amplify-form-select", inputs: { items: "items", name: "name", label: "label", id: "id", defaultValue: "defaultValue" }, ngImport: i0, template: "<label class=\"amplify-label amplify-visually-hidden\" [for]=\"id\">{{\n  label\n}}</label>\n<div class=\"amplify-select__wrapper\">\n  <select\n    class=\"amplify-select amplify-field-group__control\"\n    autocomplete=\"tel-country-code\"\n    [id]=\"id\"\n    [name]=\"name\"\n  >\n    <option\n      *ngFor=\"let item of items\"\n      [value]=\"item\"\n      [selected]=\"item === defaultValue\"\n    >\n      {{ item }}\n    </option>\n  </select>\n  <div\n    class=\"amplify-flex amplify-select__icon\"\n    style=\"align-items: center; justify-content: center\"\n  >\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      class=\"amplify-icon\"\n      viewBox=\"0 0 24 24\"\n      data-size=\"large\"\n      fill=\"currentColor\"\n    >\n      <path d=\"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z\"></path>\n    </svg>\n  </div>\n</div>\n", dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL3VpLWFuZ3VsYXIvc3JjL2xpYi9wcmltaXRpdmVzL3NlbGVjdC9zZWxlY3QuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWktYW5ndWxhci9zcmMvbGliL3ByaW1pdGl2ZXMvc2VsZWN0L3NlbGVjdC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBTWpELE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlO2dHQUFmLGVBQWUsNkpDTjVCLDAxQkFpQ0E7MkZEM0JhLGVBQWU7a0JBSjNCLFNBQVM7K0JBQ0UscUJBQXFCOzhCQUl0QixLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxFQUFFO3NCQUFWLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW1wbGlmeS1mb3JtLXNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zZWxlY3QuY29tcG9uZW50Lmh0bWwnLFxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RDb21wb25lbnQge1xuICBASW5wdXQoKSBpdGVtczogc3RyaW5nW107XG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZztcbiAgQElucHV0KCkgaWQ6IHN0cmluZztcbiAgQElucHV0KCkgZGVmYXVsdFZhbHVlOiBzdHJpbmc7XG59XG4iLCI8bGFiZWwgY2xhc3M9XCJhbXBsaWZ5LWxhYmVsIGFtcGxpZnktdmlzdWFsbHktaGlkZGVuXCIgW2Zvcl09XCJpZFwiPnt7XG4gIGxhYmVsXG59fTwvbGFiZWw+XG48ZGl2IGNsYXNzPVwiYW1wbGlmeS1zZWxlY3RfX3dyYXBwZXJcIj5cbiAgPHNlbGVjdFxuICAgIGNsYXNzPVwiYW1wbGlmeS1zZWxlY3QgYW1wbGlmeS1maWVsZC1ncm91cF9fY29udHJvbFwiXG4gICAgYXV0b2NvbXBsZXRlPVwidGVsLWNvdW50cnktY29kZVwiXG4gICAgW2lkXT1cImlkXCJcbiAgICBbbmFtZV09XCJuYW1lXCJcbiAgPlxuICAgIDxvcHRpb25cbiAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIGl0ZW1zXCJcbiAgICAgIFt2YWx1ZV09XCJpdGVtXCJcbiAgICAgIFtzZWxlY3RlZF09XCJpdGVtID09PSBkZWZhdWx0VmFsdWVcIlxuICAgID5cbiAgICAgIHt7IGl0ZW0gfX1cbiAgICA8L29wdGlvbj5cbiAgPC9zZWxlY3Q+XG4gIDxkaXZcbiAgICBjbGFzcz1cImFtcGxpZnktZmxleCBhbXBsaWZ5LXNlbGVjdF9faWNvblwiXG4gICAgc3R5bGU9XCJhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlclwiXG4gID5cbiAgICA8c3ZnXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgIGNsYXNzPVwiYW1wbGlmeS1pY29uXCJcbiAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgZGF0YS1zaXplPVwibGFyZ2VcIlxuICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgPlxuICAgICAgPHBhdGggZD1cIk0xNi41OSA4LjU5TDEyIDEzLjE3IDcuNDEgOC41OSA2IDEwbDYgNiA2LTZ6XCI+PC9wYXRoPlxuICAgIDwvc3ZnPlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19