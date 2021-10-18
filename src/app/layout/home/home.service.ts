import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectToString } from 'ng-ylzx/core/util';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }


  /**
   * 企业信息
   */
  getCompanyInfo = () => this.http.get(`${environment.gateway}/company/api/company/info`);

  /**
   * 企业资金
   */
  getCompanyCapital = () => this.http.get(`${environment.gateway}/company/api/account/capital`);

  /**
   * 项目列表
   */
  getProjectList = () => this.http.get(`${environment.gateway}/company/api/project/list`);

  /**
   * 一级类型列表
   */
  getCategoryList = () => this.http.get(`${environment.gateway}/company/api/apply/category`);

  /**
   * 获取支付宝认证地址
   */
  getCertUrl = (data: { companyMail: string }) => this.http.get(`${environment.gateway}/company/api/companySign/getCertUrl`, { params: isObjectToString(data) });

  /**
   * 判断是否企业支付宝
   */
  getCompanyAliPay = (data: { authCode: string }) => this.http.get(`${environment.gateway}/company/api/companySign/companyAliPay`, { params: isObjectToString(data) });

  /**
   * 获取支付宝授权协议
   */
  getSignUrl = (data: { alipayUserId: string, companyMail: string }) => this.http.get(`${environment.gateway}/company/api/companySign/getSignUrl`, { params: isObjectToString(data) });

  /**
   * 获取授权签约结果
   */
  getSignResult = () => this.http.get(`${environment.gateway}/company/api/companySign/getSignResult`);

  /**
   * 企业项目申请
   */
  getProjectApply = (data: any) => this.http.get(`${environment.gateway}/company/api/apply/project/apply`, { params: isObjectToString(data) });

  uploadFile = (file: any): Observable<any> => {
    return of(file).pipe(
      switchMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        const req = new HttpRequest('POST', `${environment.gateway}/company/api/kmg/common/upload`, formData);
        return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
      }),
    );
  }
}

