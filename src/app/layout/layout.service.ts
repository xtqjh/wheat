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

  public getInfo() {
    return this.http.get(`/member/info`);
  }

  public getLogout() {
    return this.http.get(`/member/logout`);
  }

  public getCompany() {
    return this.http.get(`/company/api/company/list`);
  }

  public getCompanyChoose(data: { companyId: string }) {
    return this.http.get(`/company/api/company/choose`, { params: isObjectToString(data) });
  }

}

