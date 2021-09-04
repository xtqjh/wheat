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
   * 表单初始化
   */
  public get createForm() {
    return this.fb.group({
      companyName: [null, [Validators.required]], // 开票抬头
      taxNo: [null, [Validators.required]], // 纳税人识别号
      companyAddress: [null, [Validators.required]], // 地址
      contactPhone: [null, [Validators.required]], // 电话
      bankOfDeposit: [null, [Validators.required]], // 开户银行
      publicAccounts: [null, [Validators.required]], // 银行账户
      aaaa: [null, [Validators.required]], // 税源地
      bbbb: [null], // 未打款已开票金额
      taxAmount: [null, [Validators.required]], // 开票金额
      cccc: [null, [Validators.required]], // 开票类目
      dddd: [null, [Validators.required]], // 发票类型
      taxRemark: [null], // 发票备注
      invoiceRemark: [null], // 开票注意点
      receiveName: [null, [Validators.required]], // 邮寄姓名
      receivePhone: [null, [Validators.required]], // 邮寄电话
      receiveAddress: [null, [Validators.required]], // 邮寄地址
      receiveMail: [null, [Validators.required]], // 收件人邮箱

    });
  }

  /**
   * 项目申请列表
   */
  getListProjects = (data: any) => {
    return this.http.get(`/company/api/apply/project/list`, { params: isObjectToString(data) });
  }

  /**
   * 发票申请列表
   */
  getListInvoice = (data: any) => {
    return this.http.get(`/company/api/apply/invoice/list`, { params: isObjectToString(data) });
  }

  /**
   * 打款成功的任务列表
   */
  getListTask = (data: any) => {
    return this.http.get(`/company/api/apply/task/list`, { params: isObjectToString(data) });
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
   * 一级类型列表
   */
  getCategory = (data: any) => {
    return this.http.get(`/company/api/apply/category`, { params: isObjectToString(data) });
  }

  getDetailsTask = (id: string) => this.http.get(``);
  patchUpdateTask = (data: any) => this.http.get(``);
  postNewlyTask = (data: any) => this.http.get(``);

}
