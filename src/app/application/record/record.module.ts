import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { RecordRoutingModule } from './record-routing.module';

import { RecordComponent } from './record.component';
import { FundTableComponent } from './fund-table/fund-table.component';
import { FlowTableComponent } from './flow-table/flow-table.component';

const COMPONENTS = [
  RecordComponent,
  FundTableComponent,
  FlowTableComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    RecordRoutingModule
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class RecordModule { }
