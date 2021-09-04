import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectToString } from 'ng-ylzx/core/util';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 根据taskNo获取批次列表
   */
  getListTaskBatch = (data: any) => this.http.get(`/company/api/task/batch/list`, { params: isObjectToString(data) });

  /**
   * 根据taskNo获取status
   */
  getTaskStatus = (taskNo: any) => this.http.get(`/company/api/task/status?taskNo=${taskNo}`);

  /**
   * 发佣任务列表
   */
  getListTask = (data: any) => this.http.get(`/company/api/task/list`, { params: isObjectToString(data) });

  /**
   * 佣金任务进度信息
   */
  getDetailTask = (data: any) => {
    return this.http.get(`/company/api/task/detail`, { params: isObjectToString(data) });
  }

  /**
   * 发佣记录列表
   */
  getListRecord = (data: any) => this.http.get(`/company/api/task/recordList`, { params: isObjectToString(data) });

  /**
   * 发佣任务取消
   */
  getCancelTask = (data: any) => this.http.get(`/company/api/task/cancel`, { params: isObjectToString(data) });

  /**
   * 项目列表
   */
  getListProject = (data: any) => this.http.get(`/company/api/project/list`, { params: isObjectToString(data) });

  private uploadMultipart = (file: any, projectId: string, taskName: string, url: string): Observable<any> => {
    return new Observable(observer => of(file).pipe(
      switchMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        formData.append('projectId', projectId);
        formData.append('taskName', taskName);
        const req = new HttpRequest('POST', `${url}`, formData);
        return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
      }),
    ).subscribe(
      (res: any) => {
        observer.next(res.body);
        observer.complete();
      },
      err => {
        observer.error(err);
        observer.complete();
      }
    ));
  }

  /**
   * 一键发佣导入
   */
  postTaskImport = (data: any) => this.uploadMultipart(data.file, data.projectId, data.taskName, `/company/api/task/import`);
  // postTaskImport = (data: any) => this.http.post(`/company/api/task/import`, data);

  /**
   * 根据taskNo获取批次导入结果
   */
  getTaskBatchStatus = (data: any) => this.http.get(`/company/api/task/batch/status`, { params: isObjectToString(data) });

  /**
   * 项目资金概览
   */
  getTaskFund = (data: any) => this.http.get(`/company/api/task/fund`, { params: isObjectToString(data) });

  /**
   * 任务明细详情分页结果
   */
  getTaskRecordPage = (data: any) => this.http.get(`/company/api/task/record/page`, { params: isObjectToString(data) });

  /**
   * 发佣任务提交
   */
  getTaskCommit = (data: any) => this.http.get(`/company/api/task/commit`, { params: isObjectToString(data) });

  /**
   * 确认单下载
   */
  getTaskConfirmation = (data: any) => this.http.get(`/company/api/task/confirmation`, { params: isObjectToString(data) });

  /**
   * 企业获取验证码
   */
  getVerifyCode = (data: { phone: string, type: string }) => this.http.get(`/company/api/company/getVerifyCode`, { params: isObjectToString(data) });

  /**
   * 审核
   */
  getTaskAudit = (data: { bizNo: string, taskNo: string, verifyCode: string }) => this.http.get(`/company/api/task/audit`, { params: isObjectToString(data) });

  /**
   * 电签
   */
  getTaskESign = (data: { bizNo: string, taskNo: string, verifyCode: string, isAgree: boolean }) => this.http.get(`/company/api/task/eSign`, { params: isObjectToString(data) });


}
