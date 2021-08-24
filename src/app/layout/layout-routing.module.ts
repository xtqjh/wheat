import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'layout',
    component: LayoutComponent,
    // canActivate: [SafeguardGuardInterceptor],
    // canActivateChild: [SafeguardGuardInterceptor],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { title: '首页' } },
      { path: 'settings', component: SettingsComponent, data: { title: '个性设置', keep: true } },
      { path: '', loadChildren: () => import('src/app/application/application.module').then(m => m.ApplicationModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
