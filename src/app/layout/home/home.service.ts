import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
}

