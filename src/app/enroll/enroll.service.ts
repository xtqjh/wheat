
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

  createFormLogon() {
    return this.fb.group({
      phone: ['18797886579', [Validators.required, ZcValidator.mobile]],
      // phone: [null, [Validators.required, ZcValidator.mobile]],
      smsCode: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      read: [true, [Validators.required, Validators.pattern(/true/)]]
    });
  }

  getCode(data: { phone: string, captchaId: string, captcha: string }) {
    return this.http.post(`/taxscheme/login/sms/code`, data);
    // return this.http.get(`/auth/smsCheck/code/${data.phone}`);
  }

  getSms = (data: { phone: string, smsCode: string }) => this.http.post(`/taxscheme/login/sms`, data);

  getCaptcha = () => this.http.get(`/captcha`);
}
