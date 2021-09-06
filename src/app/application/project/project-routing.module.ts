import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectComponent } from './project.component';
import { TemplateTableComponent } from './template-table/template-table.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent,
    children: [
      { path: 'template', component: TemplateTableComponent, data: { title: '模板数据导出' } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
