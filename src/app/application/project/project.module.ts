import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { TemplateTableComponent } from './template-table/template-table.component';


@NgModule({
  declarations: [
    ProjectComponent,
    TemplateTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ZcTableModule,
    ZcDirectiveModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }