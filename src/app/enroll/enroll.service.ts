
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ZcValidator } from 'ng-ylzx';

@Injectable({
  providedIn: 'root'
})
export class EnrollService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) { }

  public createFormLogon() {
    return this.fb.group({
      // phone: ['18797886579', [Validators.required, ZcValidator.mobile]],
      phone: [null, [Validators.required, ZcValidator.mobile]],
      smsCode: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      read: [true, [Validators.required, Validators.pattern(/true/)]]
    });
  }

  public getCode(data: { phone: string, captchaId?: string, captcha?: string }) {
    return this.http.post(`/member/login/sms/code`, data);
    // return this.http.get(`/auth/smsCheck/code/${data.phone}`);
  }

  public getSms(data: { phone: string, smsCode: string }) {
    return this.http.post(`/member/login/sms`, data);
  }

  public getInfo(data: { phone: string, smsCode: string }) {
    return this.http.post(`/member/info`, data);
  }
}
