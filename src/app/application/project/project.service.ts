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


}
