import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 流水列表
   */
  getListFlow = (data: any) => {
    return this.http.get(`/company/api/company/reconciliation/list`, { params: isObjectToString(data) });
  }

  /**
   * 资金列表
   */
  getListFund = (data: any) => {
    return this.http.get(`/company/api/company/accountList`, { params: isObjectToString(data) });
  }

  /**
   * 导出对账流水
   */
  exportReconciliation = (data: any) => {
    return this.http.get(`/company/api/company/reconciliation/export`, { params: isObjectToString(data) });
  }

  /**
   * 项目名称列表
   */
  getProjectNameList = (data: any) => {
    return this.http.get(`/company/api/company/reconciliation/projectNameList`, { params: isObjectToString(data) });
  }

  /**
   * 企业下面的税源地名称列表
   */
  getAreaNameList = (data: any) => {
    return this.http.get(`/company/api/company/reconciliation/areaNameList`, { params: isObjectToString(data) });
  }

  /**
   * 账户-下拉框数据
   */
  getAccountNameList = () => {
    return this.http.get(`/company/api/company/accountName`);
  }

}
