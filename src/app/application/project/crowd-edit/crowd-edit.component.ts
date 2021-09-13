import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { of } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { NzDrawerRef } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-crowd-edit',
  templateUrl: './crowd-edit.component.html',
  styleUrls: ['./crowd-edit.component.scss']
})
export class CrowdEditComponent implements OnInit, OnDestroy {

  @Input() set id(id: any) {
    this.setParamr(id);
  }

  private getser$: any;

  isLoading = false;

  editType = false;

  submitStatus = false;

  dynFormStatus = false;

  dynForm: FormGroup = this.fb.group({
    projectName: [null, [Validators.required]], // 项目名称
    enterCustomer: [null, [Validators.required]], // 录入客户
    visitCustomer: [null, [Validators.required]], // 带看客户
    saleHouse: [null, [Validators.required]], // 房屋销售
    leaseHouse: [null, [Validators.required]], // 房屋租赁
    id: null
  });

  constructor(
    private fb: FormBuilder,
    private base: BaseService,
    private msg: MessageService,
    private drawerRef: NzDrawerRef,
    private service: ProjectService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setParamr(id: any) {
    if (id === null) {
      this.editType = true;
    } else {
      this.editType = false;
      this.dynForm.patchValue(id);
      for (const i in this.dynForm.controls) {
        if (this.dynForm.controls.hasOwnProperty(i)) {
          this.dynForm.controls[i].markAsDirty();
          this.dynForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }

  close = (flag: boolean = true) => this.drawerRef.close({ refresh: flag });

  private setSaveData = (data: any) => {
    data.approvalValidPeriod = data.approvalValidPeriod && moment(data.approvalValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    data.reportlValidPeriod = data.reportlValidPeriod && moment(data.reportlValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    if (!this.editType) {
      return this.service.getAublishAddOrUpdate(data);
    } else {
      data.companyId = this.base.getCompany.companyId;
      return this.service.getAublishAddOrUpdate(data);
    }
  }

  submitForm() {
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
        this.getser$ = this.setSaveData(this.dynForm.value).subscribe((result: any) => {
          this.submitStatus = false;
          this.msg.success(`${this.dynForm.get('id').value ? '编辑' : '新增'}成功`);
          this.close();
        },
          error => {
            this.dynForm.setErrors({ apiErr: error && error.error && error.error.sys_message || error.error.message || error.message });
            this.submitStatus = false;
          },
          () => this.submitStatus = false
        );
      }
    }
  }

}
