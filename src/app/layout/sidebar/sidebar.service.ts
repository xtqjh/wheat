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
      { text: '成员管理', path: '/', icon: 'user' },
      { text: '结算付款', path: '/', icon: 'shopping-cart' },
      { text: '资金明细', path: '/', icon: 'euro' },
      { text: '项目管理', path: '/', icon: 'deployment-unit' },
      { text: '申请管理', path: '/', icon: 'audit' },
    ]));
  }

}

export interface SidebarApply {
  text: string;
  power: Array<string>;
  path?: string;
  children?: Array<SidebarApply>;
}

