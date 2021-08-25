import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { isObjectToString } from 'ng-ylzx/core/util';

@Injectable({
  providedIn: 'root'
})
export class BankCardsService {

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) { }


  /**
   * 查询列表
   */
  public getList = (data: { pageNum: number, pageSize: number }) => {
    return this.http.get(`/company/api/project/quick/listAllBankCards`, { params: isObjectToString(data) });
  }

  /**
   * 发送绑卡短信
   */
  public sendTiedCardSMS = (data: { userId: string }) => {
    return this.http.get(`/company/api/project/quick/sendTiedCardSMS`, { params: isObjectToString(data) });
  }

}
