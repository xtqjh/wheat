import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';

@Injectable({
  providedIn: 'root'
})
export class ApplyService {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  /**
   * 项目列表
   */
  getListProjects = (data: any) => {
    return this.http.get(`/company/api/publish/project/listProjects`, { params: isObjectToString(data) });
  }

  /**
   * 发票申请列表
   */
  getListInvoice = (data: any) => {
    return this.http.get(`/company/api/apply/invoice/list`, { params: isObjectToString(data) });
  }

}
