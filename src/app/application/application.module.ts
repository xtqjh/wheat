import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';

import { ApplicationComponent } from './application.component';
import { ZcTableModule } from 'ng-ylzx/table';

@NgModule({
  declarations: [
    ApplicationComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ZcTableModule
  ]
})
export class ApplicationModule { }
