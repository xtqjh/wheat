import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { SigningAgreementRoutingModule } from './signing-agreement-routing.module';

import { SigningAgreementComponent } from './signing-agreement.component';
import { TableComponent } from './table/table.component';

const COMPONENTS = [
  SigningAgreementComponent,
  TableComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    SigningAgreementRoutingModule
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class SigningAgreementModule { }
