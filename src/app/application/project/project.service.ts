import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isObjectToString, setFormatGetUrl } from 'ng-ylzx/core/util';

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



}
