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

  @Input() set id(id: any) {
    this.setParamr(id);
  }

  @Input() isShowSubmitButton = true;

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

  // private setParamr(id: string) {
  //   this.getser$ = of(id).pipe(
  //     tap(t => {
  //       if (t === null) {
  //         this.editType = true;
  //         this.getApplyHeads();
  //       } else {
  //         this.editType = false;
  //       }
  //     }),
  //     filter(f => f !== null),
  //     tap(v => this.isLoading = true),
  //     switchMap(sm => this.service.getDetailsTask(sm)),
  //     tap(v => this.isLoading = false)
  //   ).subscribe((data: any) => {
  //     this.dynForm.patchValue(data);
  //     for (const i in this.dynForm.controls) {
  //       if (this.dynForm.controls.hasOwnProperty(i)) {
  //         this.dynForm.controls[i].markAsDirty();
  //         this.dynForm.controls[i].updateValueAndValidity();
  //       }
  //     }
  //   },
  //     err => this.isLoading = false,
  //     () => this.isLoading = false
  //   );
  // }

  private setParamr(id: any) {
    if (id === null) {
      this.editType = true;
      this.getApplyHeads();
    } else {
      this.editType = false;
      id.type = id.type.toString(),
        this.dynForm.patchValue(id);
      for (const i in this.dynForm.controls) {
        if (this.dynForm.controls.hasOwnProperty(i)) {
          this.dynForm.controls[i].markAsDirty();
          this.dynForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }

  private getApplyHeads = () => this.service.getApplyHeads().subscribe((res: any) => {
    if (res.success) {
      const data = res.extData;
      this.dynForm.patchValue({
        companyName: data.companyName,
        taxNo: data.taxNo,
        companyAddress: data.companyAddress,
        contactPhone: data.contactPhone,
        bankOfDeposit: data.bankOfDeposit,
        publicAccounts: data.publicAccounts,
        receiveName: data.receiveName,
        receivePhone: data.receivePhone,
        receiveMail: data.receiveMail,
        receiveAddress: data.receiveAddress,
        type: data.type.toString(),
      });
    } else {
      this.msg.error(res.message);
    }
  })

  close = (flag: boolean = true) => this.drawerRef.close({ refresh: flag });

  private setSaveData = (data: any) => {
    data.approvalValidPeriod = data.approvalValidPeriod && moment(data.approvalValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    data.reportlValidPeriod = data.reportlValidPeriod && moment(data.reportlValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    if (!this.editType) {
      // return this.service.patchUpdateTask(data);
      return this.service.postNewlyTask(data);
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
