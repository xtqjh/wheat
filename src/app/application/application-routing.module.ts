import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      { path: 'user/signing', loadChildren: () => import('./signing-agreement/signing-agreement.module').then(m => m.SigningAgreementModule), data: { title: '电签协议管理' } },
      { path: 'user/bank', loadChildren: () => import('./bank-cards/bank-cards.module').then(m => m.BankCardsModule), data: { title: '银行卡管理' } },
      { path: 'record', loadChildren: () => import('./record/record.module').then(m => m.RecordModule), data: { title: '记录管理' } },
      { path: 'apply', loadChildren: () => import('./apply/apply.module').then(m => m.ApplyModule), data: { title: '申请管理' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
