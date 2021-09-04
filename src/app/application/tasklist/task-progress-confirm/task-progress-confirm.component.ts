import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-task-progress-confirm',
  templateUrl: './task-progress-confirm.component.html',
  styleUrls: ['./task-progress-confirm.component.scss']
})
export class TaskProgressConfirmComponent implements OnInit, OnDestroy {

  private interval$: any;
  private getser$: any;

  @Input() item: any;

  @Output() nextChange = new EventEmitter<boolean>();

  isLoading = false;

  submitStatus = false;

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;

  dynFormPrice: FormGroup = this.fb.group({
    // bizNo: [null],
    bizNo: ['1088163075712046357'],
    taskNo: [null, [Validators.required]],
    verifyCode: [null, [Validators.required]],
    isAgree: [null, [Validators.required, Validators.pattern(/true/)]],
    phone: null,
  });

  isCountdown = false;

  countdownNumber = 60;

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private service: TasklistService
  ) { }

  ngOnInit() {
    this.dynFormPrice.get('phone').setValue(this.base.getCompany.phone);
    this.dynFormPrice.get('taskNo').setValue(this.item.taskNo);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  toPercent = (num, total) => (Math.round(num / total * 10000) / 100.00);

  getTaskConfirmation = () => this.service.getTaskConfirmation({ taskNo: this.item.taskNo }).subscribe(

  )

  clickRepricing = () => {
    const modal = this.modalService.create({
      nzTitle: '进行电签',
      nzContent: this.tplContent,
      nzWidth: '650',
      nzOkText: '提交审核',
      nzOnOk: () => this.submitFormPrice()
    });
  }

  private submitFormPrice = () => {
    return new Promise((resolve, reject) => {
      for (const i in this.dynFormPrice.controls) {
        if (this.dynFormPrice.controls.hasOwnProperty(i)) {
          this.dynFormPrice.controls[i].markAsDirty();
          this.dynFormPrice.controls[i].updateValueAndValidity();
        }
      }
      const dynFormStatus = this.dynFormPrice.valid;
      if (dynFormStatus) {
        if (!this.submitStatus) {
          this.submitStatus = true;
          this.getser$ = this.service.getTaskESign(this.dynFormPrice.value).pipe(
            tap(v => this.submitStatus = false)
          ).subscribe((res: any) => {
            if (res.success) {
              resolve(true);
              this.nextChange.emit(true);
            } else {
              this.msg.error(res.message);
              reject(false);
            }
          }, error => { this.submitStatus = false; resolve(false); },
            () => this.submitStatus = false
          );
        }
      } else {
        reject(false);
      }
    });
  }

  getVerifyCode = () => {
    if (!this.isCountdown) {
      this.service.getVerifyCode({ phone: this.dynFormPrice.get('phone').value, type: '2' }).subscribe(
        (res: any) => {
          if (res.success) {
            this.dynFormPrice.get('bizNo').setValue(res.extData.bizNo);
            this.msg.success(`验证码已发送至${this.dynFormPrice.get('phone').value}请注意查收`);
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
        }
      );
    }
  }

}
