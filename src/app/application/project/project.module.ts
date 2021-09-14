import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ZcTableModule } from 'ng-ylzx/table';
import { ZcDirectiveModule } from 'ng-ylzx/directive';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { TemplateTableComponent } from './template-table/template-table.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CrowdTableComponent } from './crowd-table/crowd-table.component';
import { CrowdEditComponent } from './crowd-edit/crowd-edit.component';
import { CrowdDetailComponent } from './crowd-detail/crowd-detail.component';


@NgModule({
  entryComponents: [
    CrowdEditComponent
  ],
  declarations: [
    ProjectComponent,
    TemplateTableComponent,
    ProjectDetailComponent,
    CrowdTableComponent,
    CrowdEditComponent,
    CrowdDetailComponent
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
