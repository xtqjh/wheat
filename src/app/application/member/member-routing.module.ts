import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberComponent } from './member.component';
import { BankTableComponent } from './bank-table/bank-table.component';
import { SigningTableComponent } from './signing-table/signing-table.component';

const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'signing', component: SigningTableComponent, data: { title: '电签协议管理' } },
      { path: 'bank', component: BankTableComponent, data: { title: '银行卡管理' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
