import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';

import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';
import { BankTableComponent } from './bank-table/bank-table.component';
import { SigningTableComponent } from './signing-table/signing-table.component';


@NgModule({
  declarations: [
    MemberComponent,
    BankTableComponent,
    SigningTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    MemberRoutingModule
  ]
})
export class MemberModule { }
