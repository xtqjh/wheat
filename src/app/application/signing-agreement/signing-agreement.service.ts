import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SigningAgreementService {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  /**
   * 查询列表
   */
  public getList = (data: { pageNum: number, pageSize: number }) => {
    return this.http.get(`/company/api/member/list`, { params: isObjectToString(data) });
  }

  /**
   * 项目名称列表
   */
  public getProjectName = (data?: { projectType?: string }) => {
    return this.http.get(`/company/api/project/nameList`, { params: isObjectToString(data) });
  }

  /**
   * 重发邀请短信
   */
  public getSendMsg = (data: { projectId: string, userId?: string }) => {
    return this.http.get(`/company/api/member/sendMsg`, { params: isObjectToString(data) });
  }

  /**
   * 修改开工状态
   */
  public setWorkStatus = (data: { idNo?: string, moguStatus?: string, name?: string, phone?: string, projectId?: string, userId?: string, workStatus?: string }) => {
    return this.http.get(`/company/api/member/setWorkStatus`, { params: isObjectToString(data) });
  }

  /**
   * 员工数据导出
   */
  public getDownload = (data: { pageNum: number, pageSize: number }) => {
    return this.http.get(`/company/api/member/download`, { params: isObjectToString(data) });
  }

  /**
   * 项目导入成员
   */
  public getImport = (data: { projectId: string, file: any }) => {
    console.log(data);
    const formData = new FormData();
    formData.append('file', data.file);
    // formData.append('projectId', data.projectId);
    const req = new HttpRequest('POST', `/company/api/member/import?projectId=${data.projectId}`, formData);
    return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
  }

  /**
   * 导入个体工商户
   */
  getImportIndividual = (data: { projectId: string, file: any }) => {
    const formData = new FormData();
    formData.append('file', data.file);
    // formData.append('projectId', data.projectId);
    const req = new HttpRequest('POST', `/company/api/member/importIndividual?projectId=${data.projectId}`, formData);
    return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
  }


}
