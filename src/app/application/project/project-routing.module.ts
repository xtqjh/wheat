import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { DetailComponent } from './detail/detail.component';
import { TemplateTableComponent } from './template-table/template-table.component';
import { CrowdTableComponent } from './crowd-table/crowd-table.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      { path: 'template', component: TemplateTableComponent, data: { title: '模板数据导出' } },
      { path: 'detail/:id', component: DetailComponent, data: { title: '项目详情' } },
      { path: 'crowd', component: CrowdTableComponent, data: { title: '项目众包' } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
