import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { of } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { NzDrawerRef } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { ApplyService } from '../apply.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, OnDestroy {

  @Input() set id(id: string) {
    this.setParamr(id);
  }

  private getser$: any;

  isLoading = false;

  submitStatus = false;

  dynFormStatus = false;

  dynForm: FormGroup = this.service.createForm;

  editType = false;

  categoryList = [];

  areaNameList = [];

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private drawerRef: NzDrawerRef,
    private service: ApplyService
  ) { }

  ngOnInit() {
    this.loadDataItem();
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getCategory({ companyId: this.base.getCompany.companyId }).subscribe((res: any) => this.categoryList = res.success && res.extData || []);
    this.service.getAreaNameList({ companyId: this.base.getCompany.companyId }).subscribe((res: any) => this.areaNameList = res.success && res.extData || []);
  }

  private setParamr(id: string) {
    this.getser$ = of(id).pipe(
      tap(t => {
        t === '0' ? this.editType = true : this.editType = false;
      }),
      filter(f => f !== '0'),
      tap(v => this.isLoading = true),
      switchMap(sm => this.service.getDetailsTask(sm)),
      tap(v => this.isLoading = false)
    ).subscribe((data: any) => {
      this.dynForm.patchValue(data);
      for (const i in this.dynForm.controls) {
        if (this.dynForm.controls.hasOwnProperty(i)) {
          this.dynForm.controls[i].markAsDirty();
          this.dynForm.controls[i].updateValueAndValidity();
        }
      }
    },
      err => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  close = (flag: boolean = true) => this.drawerRef.close({ refresh: flag });

  private setSaveData = (data: any) => {
    data.approvalValidPeriod = data.approvalValidPeriod && moment(data.approvalValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    data.reportlValidPeriod = data.reportlValidPeriod && moment(data.reportlValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    if (!this.editType) {
      return this.service.patchUpdateTask(data);
    } else {
      data.companyId = this.base.getCompany.companyId;
      return this.service.postNewlyTask(data);
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
          this.msg.success(`${this.dynForm.value.name} ${this.dynForm.get('id').value ? '编辑' : '新增'}成功`);
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
