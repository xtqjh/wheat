import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankCardsComponent } from './bank-cards.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {
    path: '',
    component: BankCardsComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TableComponent, data: { title: '银行卡管理' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankCardsRoutingModule { }
