import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      { path: 'member', loadChildren: () => import('./member/member.module').then(m => m.MemberModule), data: { title: '成员管理' } },
      { path: 'record', loadChildren: () => import('./record/record.module').then(m => m.RecordModule), data: { title: '记录管理' } },
      { path: 'apply', loadChildren: () => import('./apply/apply.module').then(m => m.ApplyModule), data: { title: '申请管理' } },
      { path: 'tasklist', loadChildren: () => import('./tasklist/tasklist.module').then(m => m.TasklistModule), data: { title: '结算付款' } },
      { path: 'project', loadChildren: () => import('./project/project.module').then(m => m.ProjectModule), data: { title: '项目管理' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
