import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';
import { BankCardsRoutingModule } from './bank-cards-routing.module';

import { BankCardsComponent } from './bank-cards.component';
import { TableComponent } from './table/table.component';

const COMPONENTS = [
  BankCardsComponent,
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
    BankCardsRoutingModule
  ],
  declarations: [
    ...COMPONENTS
  ]
})
export class BankCardsModule { }
