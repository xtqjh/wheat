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

  private uploadMultipart = (file: any, url: string, projectId?: string): Observable<any> => {
    return new Observable(observer => of(file).pipe(
      switchMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        if (projectId) {
          formData.append('projectId', projectId);
        }
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
  getImport = (projectId: string, file: any) => this.uploadMultipart(file, `/company/api/member/import?projectId=${projectId}`, projectId);

  /**
   * 众包项目列表
   */
  getListProjects = (data: {
    projectName: string,
    startTime: string,
    endTime: string,
    companyId: string,
    pageNum: number,
    pageSize: number,
  }) => this.http.get(`/company/api/zb/project/listProjects`, { params: isObjectToString(data) })

  /**
   * 众包项目增
   */
  getAddProjects = (data: any) => this.http.get(`/company/api/zb/project/insert`, { params: isObjectToString(data) });

  /**
   * 众包项目改
   */
  getUpdateProjects = (data: any) => this.http.get(`/company/api/zb/project/update`, { params: isObjectToString(data) });

  /**
   * 众包项目删
   */
  getDeleteProjects = (data: any) => this.http.get(`/company/api/zb/project/delete`, { params: isObjectToString(data) });

  /**
   * 众包项目 任务信息 人员跟任务信息一对一
   */
  getDetailsProjects = (data: any) => this.http.get(`/company/api/zb/project/details`, { params: isObjectToString(data) });

  /**
   * 众包项目 导入一对一execl:人员信息
   */
  getProjectsExcelImportPerson = (id: string, file: any) => this.uploadMultipart(file, `/company/api/zb/project/excelImportPerson?id=${id}`);

  /**
   * 众包项目 导入一对多execl（任务详情）：任务详情
   */
  getProjectsImport = (id: string, file: any) => this.uploadMultipart(file, `/company/api/zb/project/import?id=${id}`);

  /**
   * 众包项目 任务信息 人员跟任务详细一对多
   */
  getDetailsTransaction = (data: { zbProjectId: string, transactionType: string, idCard: string }) => this.http.get(`/company/api/zb/project/detailsTransaction`, { params: isObjectToString(data) });

}
