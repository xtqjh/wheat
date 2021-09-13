import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/share/service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(
    private http: HttpClient,
    private base: BaseService,
  ) { }


  public getMenuTree = () => {
    return new Observable(observer => observer.next([
      {
        text: '成员管理', icon: 'user', children: [
          { text: '电签协议', path: '/layout/member/signing' },
          { text: '银行卡', path: '/layout/member/bank' },
        ]
      },
      {
        text: '结算付款', icon: 'shopping-cart', children: [
          { text: '结算任务', path: '/layout/tasklist/task' },
          { text: '批量付款上传', path: '/layout/tasklist/payment/upload' },
        ]
      },
      {
        text: '资金明细', icon: 'euro', children: [
          { text: '资金记录', path: '/layout/record/fund' },
          { text: '流水记录', path: '/layout/record/flow' },
        ]
      },
      {
        text: '项目管理', icon: 'deployment-unit', children: [
          { text: '模板数据导出', path: '/layout/project/template' },
          { text: '项目众包', path: '/layout/project/crowd' },
        ]
      },
      {
        text: '申请管理', icon: 'audit', children: [
          { text: '项目发布记录', path: '/layout/apply/project' },
          { text: '发票申请', path: '/layout/apply/task' },
          { text: '发票申请记录', path: '/layout/apply/invoice' },
        ]
      },
    ]));
  }

}

export interface SidebarApply {
  text: string;
  power: Array<string>;
  path?: string;
  children?: Array<SidebarApply>;
}

