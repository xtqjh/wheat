import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private http: HttpClient,
  ) { }

  getInfo = () => this.http.get(`${environment.gateway}/taxscheme/info`);

  getLogout = () => this.http.get(`${environment.gateway}/taxscheme/logout`);

  getCompany = () => this.http.get(`${environment.gateway}/company/api/company/list`);

  /**
   * 企业信息
   */
  getCompanyInfo = () => this.http.get(`${environment.gateway}/company/api/company/info`);

  getCompanyChoose = (data: { companyId: string }) => this.http.get(`${environment.gateway}/company/api/company/choose`, { params: isObjectToString(data) });

}

