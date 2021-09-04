import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';

import { TasklistRoutingModule } from './tasklist-routing.module';
import { TasklistComponent } from './tasklist.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { PaymentTableComponent } from './payment-table/payment-table.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskProgressComponent } from './task-progress/task-progress.component';
import { TaskProgressFileComponent } from './task-progress-file/task-progress-file.component';
import { TaskProgressSubmitComponent } from './task-progress-submit/task-progress-submit.component';
import { TaskProgressConfirmComponent } from './task-progress-confirm/task-progress-confirm.component';
import { TaskProgressBankComponent } from './task-progress-bank/task-progress-bank.component';


@NgModule({
  declarations: [
    TasklistComponent,
    TaskTableComponent,
    PaymentTableComponent,
    TaskDetailComponent,
    TaskProgressComponent,
    TaskProgressFileComponent,
    TaskProgressSubmitComponent,
    TaskProgressConfirmComponent,
    TaskProgressBankComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    TasklistRoutingModule
  ]
})
export class TasklistModule { }
