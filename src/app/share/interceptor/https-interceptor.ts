/**
 * @作者: zc
 * @时间: 2019-12-12 13:15:09
 * @描述: 拦截器 - 请求
 */
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ng-ylzx/core/service';
import { getExplore, getOS } from 'ng-ylzx/core/util';
import { environment } from 'src/environments/environment';
import { BaseService, MessageService } from '../service';


const CODEMESSAGE = {
  0: '请求响应错误，请检查网络',
  // 200: '服务器成功返回请求的数据。',
  // 201: '新建或修改数据成功。',
  // 202: '一个请求已经进入后台排队（异步任务）。',
  // 204: '删除数据成功。',

  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录超时，重新登录。',
  403: '请求权限异常。',
  404: '请求链接不存在。',
  405: '请求已经被禁用。',
  406: '请求的格式不可得。',
  408: '服务器等候请求时发生超时',
  410: '请求的资源被永久删除，且不会再得到的。',
  414: '请求的地址过长，服务器无法处理。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器错误，请稍后再试。',
  501: '服务器不支持该请求，无法完成请求。',
  502: '服务器网关错误。',
  503: '服务器不可用，服务器暂时过载或维护。',
  504: '服务器网关超时，请稍后再试。'
};

@Injectable()
export class HttpsInterceptor implements HttpInterceptor {

  private timer;

  constructor(
    private router: Router,
    private msg: MessageService,
    private platformLocation: PlatformLocation,
    private notification: NzNotificationService,
    private base: BaseService,
    private cookieService: CookieService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const started = Date.now();
    let $headers = new HttpHeaders()
      .set('X-Requested-Source', 'Browser')
      .set('X-Requested-With', 'XMLHttpRequest');
    req.headers.keys().forEach(item => {
      $headers = $headers.set(item, req.headers.get(item));
    });

    // const token = sessionStorage.getItem(environment.storageToken);
    const token = this.cookieService.get(environment.storageToken);
    if (!token) {
      this.msg.error('身份标识凭证失效,请重新登录！');
      this.router.navigate(['/login'], { replaceUrl: false });
      // this.base.cleanCacheRecords();
      return;
    }

    const authReq = req.clone({
      headers: $headers,
      url: req.url.indexOf('?') > 0 ? `${req.url}&access_token=${token}` : `${req.url}?access_token=${token}`
    });

    return next
      .handle(authReq)
      .pipe(
        finalize(() => {
          const elapsed = Date.now() - started;
          if (this.base.debuger) {
            console.log(`请求 ${authReq.urlWithParams} 耗时 ${elapsed} ms.`);
          }
        }),
        catchError((res: HttpResponse<any>) => {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.handleError(res);
          }, 1000 * 1.2);

          // 以错误的形式结束本次请求
          throw res;
        }));
  }

  // 报错信息
  private handleError(error) {
    if ((error.status >= 200 && error.status < 300) || error.status === 401) {
      if (error.status === 401) {
        this.msg.error((error.error && error.error.message || null) || (error.error && error.error.sys_message || null) || '登录超时，重新登录。');
        this.base.cleanCacheRecords();
        this.router.navigate(['/login'], { replaceUrl: false });
      }
      return;
    }
    if (error.status === 0) {
      this.notification.error(
        '网络不可用，无法连接到服务器！',
        `
          <span class="font-12">${error.message}</span>
          <p class="mg-t10 mg-b4">请试试以下办法：</p>
          <span class="mg-l10 font-12">• 检查电脑网络正常接入</span><br/>
          <span class="mg-l10 font-12">• 重新连接到 Wi-Fi 网络</span><br/>
          <span class="mg-l10 font-12">• 关闭浏览器重新打开</span><br/>
        `,
        { nzDuration: 0 }
      );
      return;
    }
    const errortext = CODEMESSAGE[error.status];
    this.msg.error((error.error && error.error.message || null) || (error.error && error.error.sys_message || null) || errortext || '未知错误，请检查网络。');
  }

}


function ajaxPost(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify(data));
}
