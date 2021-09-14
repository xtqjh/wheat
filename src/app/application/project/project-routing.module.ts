import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { TemplateTableComponent } from './template-table/template-table.component';
import { CrowdTableComponent } from './crowd-table/crowd-table.component';
import { CrowdDetailComponent } from './crowd-detail/crowd-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      { path: 'template', component: TemplateTableComponent, data: { title: '模板数据导出' } },
      { path: 'detail/:id', component: ProjectDetailComponent, data: { title: '项目详情' } },
      { path: 'crowd', component: CrowdTableComponent, data: { title: '项目众包' } },
      { path: 'crowd/:id', component: CrowdDetailComponent, data: { title: '项目详情' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
