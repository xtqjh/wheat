import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ng-ylzx/core/service';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EnrollService } from '../enroll.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EnrollService]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  private getsize$: any;
  private interval$: any;

  passwordVisible = false;

  // 提交状态
  submitStatus = false;

  // 表单状态
  dynFormStatus = true;

  // 表单
  dynForm: FormGroup = this.enrollService.createFormLogon();

  isCountdown = false;

  countdownNumber = 60;

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private enrollService: EnrollService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    if (this.cookieService.get(environment.storageToken)) {
      this.toLayout();
    }
  }

  ngOnDestroy() {
    if (this.getsize$) { this.getsize$.unsubscribe(); }
  }

  private toLayout(): void {
    this.router.navigate(['/layout/home']);
  }

  clickGetCode = () => {
    if (!this.isCountdown) {
      this.enrollService.getCode({ phone: this.dynForm.get('phone').value }).subscribe(
        (res: any) => {
          if (res.code === 200 && res.success) {
            this.msg.success(`验证码已发送至${this.dynForm.get('phone').value}请注意查收`);
            this.isCountdown = true;
            this.countdownNumber = 60;
            if (this.interval$) { this.interval$.unsubscribe(); }
            this.interval$ = interval(1000).subscribe(t => {
              this.countdownNumber--;
              if (t > 60) {
                this.isCountdown = false;
                if (this.interval$) { this.interval$.unsubscribe(); }
              }
            });
          } else {
            this.msg.error(res.message);
          }
        },
        error => {
          this.dynForm.controls.phone.setErrors({ duplicated: error.error.message || '未能识别错误信息' });
        }
      );
    } else {
      this.msg.warning('请勿频繁操作');
    }
  }

  submitForm = () => {
    for (const i in this.dynForm.controls) {
      if (this.dynForm.controls.hasOwnProperty(i)) {
        this.dynForm.controls[i].markAsDirty();
        this.dynForm.controls[i].updateValueAndValidity();
      }
    }

    this.dynFormStatus = this.dynForm.valid;
    if (this.dynFormStatus) {
      if (!this.submitStatus) {
        this.submitStatus = true;
        this.enrollService.getSms(this.dynForm.value).pipe(
          catchError((v: HttpResponse<any>) => {
            throw v;
          })
        ).subscribe(
          (result: any) => {
            if (result.success) {
              this.cookieService.put(environment.storageToken, result.data.token, { expires: moment().day(7).format('YYYY-MM-DD HH:mm:ss') });
              this.toLayout();
            } else {
              if (result.code === 5101) {
                this.dynForm.controls.smsCode.setErrors({ duplicated: result.message || '未能识别错误信息' });
              }
            }
            this.submitStatus = false;
          },
          error => {
            this.msg.warning(error.error.message || '未能识别错误信息');
            this.submitStatus = false;
          }
        );
      }
    }
  }

}
