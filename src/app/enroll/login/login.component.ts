/**
 * @作者: zc
 * @时间: 2021-02-20 15:36:17
 * @描述: 登录
 */
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CookieService, LazyService } from 'ng-ylzx/core/service';
import { getExplore, isGuid } from 'ng-ylzx/core/util';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { EnrollService } from '../enroll.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EnrollService]
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {

  public getsize$: any;

  passwordVisible = false;

  // 提交状态
  submitStatus = false;

  // 表单状态
  dynFormStatus = true;

  // 表单
  dynForm: FormGroup = this.enrollService.createFormLogon();

  isExplore = true;
  isResolving = true;

  constructor(
    private router: Router,
    private msg: NzMessageService,
    private lazy: LazyService,
    private enrollService: EnrollService,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    const explore = getExplore();
    if (explore.indexOf('chrome') !== -1 || explore.indexOf('firefox') !== -1) {
      this.isExplore = false;
    }
    if (window.screen.height > 768 || window.screen.width > 1024) {
      this.isResolving = false;
    }
    this.loadCanvas();

    this.setVerification();

  }

  ngAfterViewInit(): void {
    if (this.cookieService.get(environment.storageToken)) {
      this.toLayout();
    }
  }

  ngOnDestroy() {
    if (this.getsize$) { this.getsize$.unsubscribe(); }
  }

  private setVerification = () => this.lazy.loadStyle('./assets/jigsaw/jigsaw.css')
    .then(() => this.lazy.loadScript('./assets/jigsaw/jigsaw.js'))
    .then(() => {
      (window as any).jigsaw.init({
        el: document.getElementById('captcha'),
        onSuccess: () => this.dynForm.get('jigsaw').setValue(isGuid(Math.round(Math.random() * (12 - 6) + 6))),
        onFail: () => this.dynForm.get('jigsaw').setValue(isGuid(Math.round(Math.random() * (22 - 14) + 14))),
        onRefresh: () => this.dynForm.get('jigsaw').setValue(null),
      });
    })

  private toLayout(): void {
    this.router.navigate(['/layout/home']);
  }

  private loadCanvas() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let cw = canvas.width = window.innerWidth;
    let cx = cw / 2;
    let ch = canvas.height = window.innerHeight;
    let cy = ch / 2;
    ctx.fillStyle = '#fff';
    const linesNum = 16;
    const linesRy = [];
    let requestId = null;

    function Line(flag) {
      this.flag = flag;
      this.a = {};
      this.b = {};
      if (flag === 'v') {
        this.a.y = 0;
        this.b.y = ch;
        this.a.x = randomIntFromInterval(0, ch);
        this.b.x = randomIntFromInterval(0, ch);
      } else if (flag === 'h') {
        this.a.x = 0;
        this.b.x = cw;
        this.a.y = randomIntFromInterval(0, cw);
        this.b.y = randomIntFromInterval(0, cw);
      }
      this.va = randomIntFromInterval(25, 100) / 100;
      this.vb = randomIntFromInterval(25, 100) / 100;

      this.draw = function() {
        ctx.strokeStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(this.a.x, this.a.y);
        ctx.lineTo(this.b.x, this.b.y);
        ctx.stroke();
      };

      this.update = function() {
        if (this.flag === 'v') {
          this.a.x += this.va;
          this.b.x += this.vb;
        } else if (flag === 'h') {
          this.a.y += this.va;
          this.b.y += this.vb;
        }

        this.edges();
      };

      this.edges = function() {
        if (this.flag === 'v') {
          if (this.a.x < 0 || this.a.x > cw) {
            this.va *= -1;
          }
          if (this.b.x < 0 || this.b.x > cw) {
            this.vb *= -1;
          }
        } else if (flag === 'h') {
          if (this.a.y < 0 || this.a.y > ch) {
            this.va *= -1;
          }
          if (this.b.y < 0 || this.b.y > ch) {
            this.vb *= -1;
          }
        }
      };
    }

    for (let i = 0; i < linesNum; i++) {
      const flag = i % 2 === 0 ? 'h' : 'v';
      const l = new Line(flag);
      linesRy.push(l);
    }

    function Draw() {
      requestId = window.requestAnimationFrame(Draw);
      ctx.clearRect(0, 0, cw, ch);

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < linesRy.length; i++) {
        const l = linesRy[i];
        l.draw();
        l.update();
      }
      for (let i = 0; i < linesRy.length; i++) {
        const l = linesRy[i];
        for (let j = i + 1; j < linesRy.length; j++) {
          const l1 = linesRy[j];
          Intersect2lines(l, l1);
        }
      }
    }

    function Init() {
      linesRy.length = 0;
      for (let i = 0; i < linesNum; i++) {
        const flag = i % 2 === 0 ? 'h' : 'v';
        const l = new Line(flag);
        linesRy.push(l);
      }

      if (requestId) {
        window.cancelAnimationFrame(requestId);
        requestId = null;
      }

      cw = canvas.width = window.innerWidth;
      cx = cw / 2;
      ch = canvas.height = window.innerHeight;
      cy = ch / 2;

      Draw();
    }

    setTimeout(() => {
      Init();
      addEventListener('resize', Init, false);
    }, 15);

    function Intersect2lines(l1, l2) {
      const p1 = l1.a;
      const p2 = l1.b;
      const p3 = l2.a;
      const p4 = l2.b;
      const denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
      const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
      const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
      const x = p1.x + ua * (p2.x - p1.x);
      const y = p1.y + ua * (p2.y - p1.y);
      if (ua > 0 && ub > 0) {
        markPoint({ x, y });
      }
    }

    function markPoint(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    function randomIntFromInterval(mn, mx) {
      // tslint:disable-next-line:no-bitwise
      return ~~(Math.random() * (mx - mn + 1) + mn);
    }

  }

  /**
   * 登录
   */
  public submitForm(): void {
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
        this.enrollService.getLogin(this.dynForm.value).pipe(
          catchError((v: HttpResponse<any>) => {
            throw v;
          })
        ).subscribe(
          (result: any) => {
            // this.cookieService.put(environment.storageToken, result.access_token, { expires: moment().second(moment().second() + 10).format('YYYY-MM-DD HH:mm:ss') });
            this.cookieService.put(environment.storageToken, result.access_token, { expires: moment().day(7).format('YYYY-MM-DD HH:mm:ss') });
            sessionStorage.setItem(environment.storageUserResources, JSON.stringify(result.resources));
            delete result.resources;
            this.cookieService.putObject(environment.storageUserInfo, result);

            this.submitStatus = false;
            this.toLayout();
          },
          error => {
            switch (error.error.sys_code) {
              case 'Err_LOGIN_01':
                this.dynForm.controls.loginName.setErrors({ duplicated: error.error.sys_message || '未能识别错误信息' });
                break;
              case 'Err_LOGIN_02':
                this.dynForm.controls.password.setErrors({ duplicated: error.error.sys_message || '未能识别错误信息' });
                break;
              case 'Err_COMMON_01':
                this.dynForm.controls.loginName.setErrors({ duplicated: error.error.sys_message || '未能识别错误信息' });
                break;
              default:
                this.msg.warning(error.error.sys_message || '未能识别错误信息');
                break;
            }
            this.submitStatus = false;
            this.dynForm.get('jigsaw').setValue(null);
            this.dynForm.get('jigsaw').reset();
            this.setVerification();
          }
        );
      }
    }
  }

}
