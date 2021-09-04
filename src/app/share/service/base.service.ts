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

  public get getCompany() {
    const resou = JSON.parse(sessionStorage.getItem(environment.storageCompany)) as Company;
    return resou;
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
    sessionStorage.removeItem(environment.storageCompany);
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


export interface Company {
  balance?: string;
  collapsedLogoUrl?: string;
  companyId?: string;
  companyName?: string;
  freeze?: string;
  logoUrl?: string;
  phone?: string;
  userName?: string;
}
