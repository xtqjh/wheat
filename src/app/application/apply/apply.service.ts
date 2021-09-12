import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';
import { ZcValidator } from 'ng-ylzx';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

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
      contactPhone: [null, [Validators.required, ZcValidator.mobile]], // 电话
      bankOfDeposit: [null, [Validators.required]], // 开户银行
      publicAccounts: [null, [Validators.required]], // 银行账户
      areaId: [null, [Validators.required]], // 税源地
      // bbbb: [null], // 未打款已开票金额  文档上未找到相应字段
      taxAmount: [null, [Validators.required, Validators.min(0)]], // 开票金额
      categoryName: [null, [Validators.required]], // 开票类目
      secondCategory: [null, [Validators.required]], // 开票二级类目
      type: [null, [Validators.required]], // 发票类型
      invoiceRemark: [null], // 发票备注
      taxRemark: [null], // 开票注意点
      receiveName: [null, [Validators.required]], // 邮寄姓名
      receivePhone: [null, [Validators.required, ZcValidator.mobile]], // 邮寄电话
      receiveAddress: [null, [Validators.required]], // 邮寄地址
      receiveMail: [null, [Validators.required, Validators.email]], // 收件人邮箱
      id: null
    });
  }

  /**
   * 项目申请列表
   */
  getListProjects = (data: any) => this.http.get(`/company/api/apply/project/list`, { params: isObjectToString(data) });

  /**
   * 发票申请列表
   */
  getListInvoice = (data: any) => this.http.get(`/company/api/apply/invoice/list`, { params: isObjectToString(data) });

  /**
   * 打款成功的任务列表
   */
  getListTask = (data: any) => this.http.get(`/company/api/apply/task/list`, { params: isObjectToString(data) });

  /**
   * 项目名称列表
   */
  getProjectNameList = (data: any) => this.http.get(`/company/api/company/reconciliation/projectNameList`, { params: isObjectToString(data) });

  /**
   * 企业下面的税源地名称列表
   */
  getAreaNameList = (data: any) => this.http.get(`/company/api/company/reconciliation/areaNameList`, { params: isObjectToString(data) });

  /**
   * 一级类型列表
   */
  getCategory = (data: any) => this.http.get(`/company/api/apply/category`, { params: isObjectToString(data) });

  /**
   * 获取开票信息--提前开票
   */
  getApplyHeads = () => this.http.get(`/company/api/apply/invoice/heads`);

  getDetailsTask = (id: string) => this.http.get(``);

  /**
   * 企业申请开票————提前开票
   */
  postNewlyTask = (data: any) => this.http.get(`/company/api/apply/invoice/beforeApply`, { params: isObjectToString(data) });

  /**
   * 作废申请记录
   */
  getProjectCancel = (data: { id: any }) => this.http.get(`/company/api/apply/project/cancel`, { params: isObjectToString(data) });

  /**
   * 作废申请记录
   */
  getInvoiceCancel = (data: { id: any }) => this.http.get(`/company/api/apply/invoice/cancel`, { params: isObjectToString(data) });

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
