import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyComponent } from './apply.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { TaskTableComponent } from './task-table/task-table.component';

const routes: Routes = [
  {
    path: '',
    component: ApplyComponent,
    children: [
      { path: 'project', component: ProjectTableComponent, data: { title: '项目发布记录' } },
      { path: 'task', component: TaskTableComponent, data: { title: '发票申请' } },
      { path: 'invoice', component: InvoiceTableComponent, data: { title: '发票申请记录' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplyRoutingModule { }
