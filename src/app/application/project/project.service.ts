import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectToString, setFormatGetUrl } from 'ng-ylzx/core/util';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 项目名称列表
   */
  getListProject = () => this.http.get(`/company/api/project/nameList`);

  /**
   * 发佣成员列表
   */
  getListAllMembers = (data: {
    idCard: string,
    phone: string,
    projectId: string,
    username: string,
    companyId: string,
    pageNum: number,
    pageSize: number,
  }) => this.http.get(`/company/api/project/quick/listAllMembers`, { params: isObjectToString(data) })

  /**
   * 发佣成员列表
   */
  postCommissionTemplateExport = (data: {
    isAllSelect: boolean,
    projectId: string,
    selectUserId: string,
    unSelectUserId?: string,
  }) => this.http.post(`/company/api/project/quick/commissionTemplateExport?${setFormatGetUrl(data)}`, data)

  /**
   * 项目详情
   */
  getDetail = (data: { projectId: string }) => this.http.get(`/company/api/project/detail`, { params: isObjectToString(data) });

  /**
   * 发佣任务列表
   */
  getListTask = (data: { projectId: string, pageNum: number, pageSize: number }) => this.http.get(`/company/api/task/list`, { params: isObjectToString(data) });

  /**
   * 开工状态列表
   */
  getWorkStatus = (data: { projectId: string }) => this.http.get(`/company/api/member/workStatus`, { params: isObjectToString(data) });

  /**
   * 项目佣金总计
   */
  getStatistics = (data: { projectId: string }) => this.http.get(`/company/api/project/statistics`, { params: isObjectToString(data) });

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
  getImport = (projectId: string, file: any) => this.uploadMultipart(file, projectId, `/company/api/member/import?projectId=${projectId}`);

  /**
   * 项目列表
   */
  getListProjects = (data: {
    projectName: string,
    startTime: string,
    endTime: string,
    companyId: string,
    pageNum: number,
    pageSize: number,
  }) => this.http.get(`/company/api/publish/project/listProjects`, { params: isObjectToString(data) })

  /**
   * 项目增删改
   */
  getAublishAddOrUpdate = (data: any) => this.http.get(`/company/api/publish/project/addOrUpdate`, { params: isObjectToString(data) });
}
