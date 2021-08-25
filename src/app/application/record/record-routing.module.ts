import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordComponent } from './record.component';
import { FundTableComponent } from './fund-table/fund-table.component';
import { FlowTableComponent } from './flow-table/flow-table.component';

const routes: Routes = [
  {
    path: '',
    component: RecordComponent,
    children: [
      { path: 'fund', component: FundTableComponent, data: { title: '资金记录' } },
      { path: 'flow', component: FlowTableComponent, data: { title: '流水记录' } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordRoutingModule { }
