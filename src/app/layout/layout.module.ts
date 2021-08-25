import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { ZcReuseTabModule } from 'ng-ylzx/reuse-tab';
import { BullySubjectService } from 'ng-ylzx/core/service';

import { LayoutRoutingModule } from './layout-routing.module';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SettingsComponent } from './settings/settings.component';
import { HeaderTabsComponent } from './header-tabs/header-tabs.component';
import { ZcTableModule } from 'ng-ylzx/table';


@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    HeaderTabsComponent,
    HomeComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    OverlayModule,
    ZcDirectiveModule,
    ZcReuseTabModule,
    ZcTableModule,
    LayoutRoutingModule
  ],
  providers: [BullySubjectService]
})
export class LayoutModule { }
