import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ZcValidator } from 'ng-ylzx/form';
import { NzDrawerRef, UploadXHRArgs } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { ApplyService } from '../apply.service';

@Component({
  selector: 'app-task-edit-invoice',
  templateUrl: './task-edit-invoice.component.html',
  styleUrls: ['./task-edit-invoice.component.scss']
})
export class TaskEditInvoiceComponent implements OnInit, OnDestroy {

  @Input() checkIds: string[];

  @Input() isShowSubmitButton = true;

  @Input() set projectId(id: string) {
    if (id) {
      this.editType = true;
      setTimeout(() => this.getInvoiceDetails(id, this.checkIds), 200);
    }
  }

  @Input() set id(id: any) {
    if (id) {
      this.setParamr(id);
    }
  }

  private getser$: any;

  isLoading = false;

  submitStatus = false;

  dynFormStatus = false;

  dynForm: FormGroup = this.fb.group({
    taxNo: [null, [Validators.required]], // 纳税人识别号
    companyName: [null, [Validators.required]], // 开票抬头
    companyAddress: [null, [Validators.required]], // 地址
    contactPhone: [null, [Validators.required, ZcValidator.mobile]], // 电话
    bankOfDeposit: [null, [Validators.required]], // 开户银行
    publicAccounts: [null, [Validators.required]], // 银行账户

    actualTaxAmount: [null, [Validators.required, Validators.min(0)]], // 实际开票金额(返回给前端，到时前端传给后端计算)
    // bbbb: [null], // 未打款已开票金额  文档上未找到相应字段
    categoryName: [null, [Validators.required]], // 开票类目
    secondCategory: [null], // 开票二级类目
    type: [null, [Validators.required]], // 发票类型
    invoiceRemark: [null], // 发票备注
    taxRemark: [null], // 开票注意点

    fileUrl: [null, [Validators.required]], // 业务结算单路径
    otherUrl: [null], // 其他材料文件URL

    fuxiaoCategoryName: [null],
    fuxiaoTaxAmount: [null],
    fuxiaoTaxRemark: [null],
    fuxiaoType: [null],
    taskNos: [null],
    taxAmount: [null],
    invoiceType: [null],
    isFuxiao: [null],
    projectId: [null],
    beforeTaxAmount: [null],

    receiveName: [null, [Validators.required]], // 邮寄姓名
    receivePhone: [null, [Validators.required, ZcValidator.mobile]], // 邮寄电话
    receiveAddress: [null, [Validators.required]], // 邮寄地址
    receiveMail: [null, [Validators.required, Validators.email]], // 收件人邮箱
    id: null
  });

  editType = false;

  constructor(
    private fb: FormBuilder,
    private base: BaseService,
    private msg: MessageService,
    private drawerRef: NzDrawerRef,
    private service: ApplyService
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setParamr(id: any) {
    this.editType = false;
    id.type = id.type.toString();
    id.actualTaxAmount = id.taxAmount;
    this.dynForm.patchValue(id);
    for (const i in this.dynForm.controls) {
      if (this.dynForm.controls.hasOwnProperty(i)) {
        this.dynForm.controls[i].markAsDirty();
        this.dynForm.controls[i].updateValueAndValidity();
      }
    }
  }

  private getInvoiceDetails = (projectId: string, selectTaskNo: string[]) => this.service.getInvoiceDetails({ projectId, selectTaskNo }).subscribe((res: any) => {
    if (res.success) {
      const data = res.extData;
      this.dynForm.patchValue({
        taxNo: data.taxNo,
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        contactPhone: data.contactPhone,
        bankOfDeposit: data.bankOfDeposit,
        publicAccounts: data.publicAccounts,

        actualTaxAmount: data.actualTaxAmount,
        categoryName: data.categoryName,
        fuxiaoCategoryName: data.fuxiaoCategoryName,
        fuxiaoTaxAmount: data.fuxiaoTaxAmount,
        fuxiaoTaxRemark: data.fuxiaoTaxRemark,
        fuxiaoType: data.fuxiaoType,
        taskNos: data.taskNos,
        taxAmount: data.taxAmount,
        invoiceType: data.invoiceType,
        isFuxiao: data.isFuxiao,
        projectId: data.projectId,
        secondCategory: data.secondCategory,
        beforeTaxAmount: data.beforeTaxAmount,

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

  uploadRequest = (args: UploadXHRArgs) => {
    return this.service.uploadFile(args.file).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) { (event as any).percent = event.loaded / event.total * 100; }
        args.onProgress(event, args.file);
      } else if (event instanceof HttpResponse) {
        args.onSuccess(event.body, args.file, event);
        const result: any = event.body;
        if (result.success) {
          this.dynForm.get(args.action).setValue(result.extData);
        } else {
          this.msg.error(result.message);
        }
      }
    }, (err) => {
      args.onError(err, args.file);
    });
  }

  close = (flag: boolean = true) => this.drawerRef.close({ refresh: flag });

  private setSaveData = (data: any) => {
    data.approvalValidPeriod = data.approvalValidPeriod && moment(data.approvalValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    data.reportlValidPeriod = data.reportlValidPeriod && moment(data.reportlValidPeriod).format('YYYY-MM-DD HH:mm:ss') || null;
    data.companyId = this.base.getCompany.companyId;
    return this.service.getInvoiceApply(data);
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
