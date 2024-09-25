import { AfterContentInit, QueryList, EventEmitter } from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';
import * as i0 from "@angular/core";
export declare class TabsComponent implements AfterContentInit {
    tabs: QueryList<TabItemComponent>;
    tabChange: EventEmitter<any>;
    ngAfterContentInit(): void;
    selectTab(tab: TabItemComponent): void;
    handleTabClick(tab: TabItemComponent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabsComponent, "amplify-tabs", never, {}, { "tabChange": "tabChange"; }, ["tabs"], ["*"], false>;
}