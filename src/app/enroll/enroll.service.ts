
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  /**
   * 表单初始化 登录
   */
  public createFormLogon() {
    return this.fb.group({
      loginName: [null, [Validators.required, Validators.maxLength(32)]],
      password: [null, [Validators.required, Validators.maxLength(64)]],
      // jigsaw: [null, [Validators.required, Validators.pattern(/true/)]],
      jigsaw: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      clientId: environment.clientId
    });
  }

  public getLogin(data: { userName: string, password: string }) {
    data.password = Md5.hashStr(data.password).toString();
    return this.http.post(`/purchasebackgateway/oauth/accesstoken`, data);
  }
}
