import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { EnterpriseComponent } from './enterprise.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
  {
    path: 'layout',
    component: LayoutComponent,
    // canActivate: [SafeguardGuardInterceptor],
    // canActivateChild: [SafeguardGuardInterceptor],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      { path: 'company', component: CompanyComponent, data: { title: '选择企业' } },
      { path: 'settings', component: SettingsComponent, data: { title: '个性设置', keep: true } },
      { path: '', loadChildren: () => import('src/app/application/application.module').then(m => m.ApplicationModule) },
    ]
  },
  {
    path: 'enterprise',
    component: EnterpriseComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      { path: 'company', component: CompanyComponent, data: { title: '选择企业' } },
      { path: 'settings', component: SettingsComponent, data: { title: '个性设置' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
