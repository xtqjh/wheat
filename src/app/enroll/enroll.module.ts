import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcDirectiveModule } from 'ng-ylzx/directive';

import { EnrollRoutingModule } from './enroll-routing.module';
import { EnrollComponent } from './enroll.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    EnrollComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ZcDirectiveModule,
    EnrollRoutingModule
  ]
})
export class EnrollModule { }
