import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';
import { concatMap, filter, switchMap, toArray } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

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

  private uploadMultipart = (file: any, projectId: string, url: string): Observable<any> => {
    return new Observable(observer => of(file).pipe(
      switchMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        formData.append('projectId', projectId);
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
   * 项目导入成员
   */
  public getImport = (projectId: string, file: any) => {
    return this.uploadMultipart(file, projectId, `/company/api/member/import?projectId=${projectId}`);
  }

  /**
   * 导入个体工商户
   */
  getImportIndividual = (projectId: string, file: any) => {
    return this.uploadMultipart(file, projectId, `/company/api/member/importIndividual?projectId=${projectId}`);
  }


}
