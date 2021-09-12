import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectToString } from 'ng-ylzx/core/util';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

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
  getCompanyInfo = () => this.http.get(`/company/api/company/info`);

  /**
   * 企业资金
   */
  getCompanyCapital = () => this.http.get(`/company/api/account/capital`);

  /**
   * 项目列表
   */
  getProjectList = () => this.http.get(`/company/api/project/list`);

  /**
   * 一级类型列表
   */
  getCategoryList = () => this.http.get(`/company/api/apply/category`);

  /**
   * 企业项目申请
   */
  getProjectApply = (data: any) => this.http.get(`/company/api/apply/project/apply`, { params: isObjectToString(data) });

  uploadFile = (file: any): Observable<any> => {
    return of(file).pipe(
      switchMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        const req = new HttpRequest('POST', `/company/api/kmg/common/upload`, formData);
        return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
      }),
    );
  }
}

