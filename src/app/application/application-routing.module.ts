import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      // { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), data: { title: '账号' } },
      // { path: 'role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule), data: { title: '角色' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
