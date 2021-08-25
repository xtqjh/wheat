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

const COMPONENTS = [
  ApplyComponent,
  ProjectTableComponent,
  InvoiceTableComponent,
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
  ]
})
export class ApplyModule { }
