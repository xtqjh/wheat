import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigningAgreementComponent } from './signing-agreement.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {
    path: '',
    component: SigningAgreementComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TableComponent, data: { title: '电签协议管理' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigningAgreementRoutingModule { }
