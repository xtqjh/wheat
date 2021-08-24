import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrollComponent } from './enroll.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: EnrollComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: '登录' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollRoutingModule { }
