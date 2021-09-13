import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { ApplyRoutingModule } from './apply-routing.module';

import { ApplyComponent } from './apply.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { TaskTableComponent } from './task-table/task-table.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskEditInvoiceComponent } from './task-edit-invoice/task-edit-invoice.component';

const COMPONENTS = [
  ApplyComponent,
  ProjectTableComponent,
  InvoiceTableComponent,
  TaskTableComponent,
  TaskEditComponent,
  TaskEditInvoiceComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    ApplyRoutingModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    TaskEditComponent,
    TaskEditInvoiceComponent
  ]
})
export class ApplyModule { }
