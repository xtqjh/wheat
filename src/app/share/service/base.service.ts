import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReuseTabService } from 'ng-ylzx/reuse-tab';
import { CookieService } from 'ng-ylzx/core/service';
import { environment } from 'src/environments/environment';
import { MessageService } from './message.service';


@Injectable({
  providedIn: 'root'
})
export class BaseService {

  /**
   * 调试模式
   */
  public debuger = !environment.production;

  constructor(
    private router: Router,
    private msg: MessageService,
    private cookieService: CookieService,
    private reuseTabService: ReuseTabService
  ) {

  }

  /**
   * 关闭标签
   */
  public closeTab = (route: ActivatedRoute, targetUrl?: string, targetRefresh?: boolean | { function: string, value?: any }) => {
    if (targetUrl) {
      this.router.navigate([targetUrl], { relativeTo: route });
    }
    setTimeout(() => {
      if (targetUrl && targetRefresh) {
        if (typeof targetRefresh === 'boolean') {
          this.reuseTabService.runHook('tabReuseInit', this.reuseTabService.componentRef, 'refresh');
        }
        if (typeof targetRefresh === 'object') {
          this.reuseTabService.runHookWantonly(targetRefresh.function, this.reuseTabService.componentRef, targetRefresh.value);
        }
      }
      this.reuseTabService.close(this.reuseTabService.getUrl(route.snapshot));
    }, 300);
  }

  /**
   * 清除登录缓存
   */
  public cleanCacheRecords = () => {
    this.reuseTabService.clear();
    sessionStorage.removeItem(environment.storageUserResources);
    sessionStorage.removeItem(environment.storageWbis);
    this.cookieService.remove(environment.storageToken);
    this.cookieService.remove(environment.storageUserInfo);
    sessionStorage.clear();
  }

  /**
   * 获取个性设置
   */
  public getStorageSetting = () => {
    let settings: any = localStorage.getItem(environment.storageSetting);
    if (settings) {
      settings = JSON.parse(settings);
    }
    return settings;
  }



}

export interface UserInfo {
  id?: string;

  // *** 新的版本将不在存在 org 系列 ***
  org?: Org;
  orgId?: string;
  orgCode?: string;

  // *** 新的版本使用 company 系列 ***
  company?: Org;
  companyId?: string;
  companyCode?: string;

  name?: string;
  nickname?: string;
  loginName?: string;
  clientId?: string;
  tel?: string;
  access_token: string;
  refresh_token: string;
  resources?: Array<string>;
  roles?: Array<string>;
  parentId?: string;
  sellerId?: string;
  sellerName?: string;
}

export interface Org {
  id: string;
  businessLicense: string;
  code: string;
  name: string;
  briefName: string;
  contacts: string;
  contactTel: string;
  address: string;
  prov: string;
  provCode: string;
  city: string;
  cityCode: string;
  area: string;
  areaCode: string;
}
