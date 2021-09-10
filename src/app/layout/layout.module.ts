import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { ZcReuseTabModule } from 'ng-ylzx/reuse-tab';
import { BullySubjectService } from 'ng-ylzx/core/service';
import { ZcTableModule } from 'ng-ylzx/table';

import { LayoutRoutingModule } from './layout-routing.module';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout.component';
import { EnterpriseComponent } from './enterprise.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { SettingsComponent } from './settings/settings.component';
import { HeaderTabsComponent } from './header-tabs/header-tabs.component';
import { CompanyComponent } from './company/company.component';
import { AccountComponent } from './home/account/account.component';
import { ProjectComponent } from './home/project/project.component';


@NgModule({
  declarations: [
    LayoutComponent,
    EnterpriseComponent,
    SidebarComponent,
    HeaderComponent,
    HeaderTabsComponent,
    HomeComponent,
    SettingsComponent,
    CompanyComponent,
    AccountComponent,
    ProjectComponent,
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
