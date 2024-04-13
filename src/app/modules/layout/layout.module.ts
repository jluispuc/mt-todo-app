import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from 'src/app/modules/layout/components/navbar/navbar.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from "../shared/shared.module";
import { LateralMenuComponent } from './components/lateral-menu/lateral-menu.component';

@NgModule({
    declarations: [
        LayoutComponent,
        NavbarComponent,
        LateralMenuComponent
    ],
    imports: [
        CommonModule,
        LayoutRoutingModule,
        OverlayModule,
        FontAwesomeModule,
        SharedModule
    ]
})
export class LayoutModule { }
