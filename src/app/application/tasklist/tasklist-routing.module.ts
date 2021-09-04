import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { TasklistComponent } from './tasklist.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskProgressComponent } from './task-progress/task-progress.component';

const routes: Routes = [
  {
    path: '',
    component: TasklistComponent,
    children: [
      { path: 'task', component: TaskTableComponent, data: { title: '结算任务' } },
      { path: 'task/detail/:taskNo', component: TaskDetailComponent, data: { title: '结算任务详情' } },
      { path: 'task/progress/:taskNo', component: TaskProgressComponent, data: { title: '结算任务进度' } },
      { path: 'payment/upload', component: PaymentTableComponent, data: { title: '批量付款上传' } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasklistRoutingModule { }
