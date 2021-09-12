import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { NzModalService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import * as moment from 'moment';
import { BaseService, MessageService } from 'src/app/share/service';
import { ApplyService } from '../apply.service';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    categoryId: null, contractUrl: null, fileUrl: null,
    name: null, rate: null, secondCategory: null, status: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '申请名称', key: 'name', show: true, width: 220 },
    { title: '申请时间', key: 'createTime', show: true, width: 190 },
    { title: '申请人', key: 'operatorName', show: true, width: 120 },
    {
      title: '业务场景说明书', key: 'fileUrl', show: true, width: 120,
      pipeType: 'custom', pipeContent: (node) => '查看',
      clickEvent: (node) => {
        const link = document.createElement('a');
        link.setAttribute('href', node.fileUrl);
        link.setAttribute('target', '_blank');
        link.click();
      }
    },
    {
      title: '合同', key: 'contractUrl', show: true, width: 100,
      pipeType: 'custom', pipeContent: (node) => '查看',
      clickEvent: (node) => {
        const link = document.createElement('a');
        link.setAttribute('href', node.contractUrl);
        link.setAttribute('target', '_blank');
        link.click();
      }
    },
    { title: '审核备注', key: 'remark', show: true, width: 120 },
    {
      title: '状态', key: 'status', show: true, width: 120,
      pipeType: 'enabled', pipeContent: [
        { key: 0, value: '待审核' },
        { key: 1, value: '已通过' },
        { key: 2, value: '已拒绝', color: 'red' },
        { key: 3, value: '已作废', color: 'red' },
      ]
    },
    {
      title: '操作', key: 'operate', show: true, width: 180, right: 0,
      buttons: [
        {
          text: '取消申请',
          show: (node) => [0].includes(node.status),
          pop: { title: '确定要取消项目申请?' },
          click: (node) => this.service.getProjectCancel({ id: node.id }).subscribe(
            (res: any) => {
              if (res.success) {
                this.searchData();
              } else {
                this.msg.error(res.message);
              }
            }
          )
        },
        {
          text: '编辑',
          show: (node) => [0].includes(node.status),
          click: (node) => this.clickOpenProject(node)
        },
        {
          text: '详情',
          click: (node) => this.clickOpenProjectDetails(node)
        }
      ]
    },
  ];

  items = [];

  isLoading = false;

  categoryList = [];

  fileListScene = [];

  fileListContract = [];

  submitStatus = false;

  applyStatus = false;

  applyForm: FormGroup = this.fb.group({
    categoryId: [null, [Validators.required]],
    secondCategory: [null, [Validators.required]],
    name: [null, [Validators.required]],
    rate: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]],
    fileUrl: [null, [Validators.required]],
    contractUrl: [null, [Validators.required]],
    id: null,
  });

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;


  constructor(
    private fb: FormBuilder,
    private msg: MessageService,
    private base: BaseService,
    private modalService: NzModalService,
    private service: ApplyService
  ) { }

  ngOnInit() {
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  clickReset = () => {
    for (const key in this.page) {
      if (Object.prototype.hasOwnProperty.call(this.page, key)) {
        if (!['total', 'page', 'size'].includes(key)) {
          this.page[key] = null;
        }
      }
    }
  }

  searchData = (reset: boolean = false) => {
    if (reset) {
      this.page.page = 1;
      this.items = [];
    }
    const data = isClone(this.page);
    this.getList(data);
  }

  private getList(data: any) {
    this.isLoading = true;
    if (this.getser$) { this.getser$.unsubscribe(); }
    this.getser$ = this.service.getListProjects(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
      tap(v => this.isLoading = false)
    ).subscribe(
      (res: any) => {
        if (res.success) {
          this.page.total = res && res.extData.total || 0;
          this.items = res && res.extData.list || [];
        } else {
          this.msg.error(res.message);
        }
      },
      error => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  onChange(value) {
    this.page.beginTime = value[0] && moment(value[0]).format('YYYY-MM-DD HH:mm:ss') || null;
    this.page.endTime = value[1] && moment(value[1]).format('YYYY-MM-DD HH:mm:ss') || null;
  }

  onChangeDate = (value) => {
    this.page.date = [];
    this.page.beginTime = value[0] && moment(value[0]).format('YYYY-MM-DD') + ' 00:00:00' || null;
    if (value[0]) {
      this.page.date[0] = new Date(this.page.beginTime);
    }
    this.page.endTime = value[1] && moment(value[1]).format('YYYY-MM-DD') + ' 23:59:59' || null;
    if (value[1]) {
      this.page.date[1] = new Date(this.page.endTime);
    }
  }

  private clickOpenProjectDetails = (data: any) => {
    data.categoryId = data.categoryId.toString();
    this.applyForm.reset();
    this.applyForm.patchValue(data);
    if (!this.categoryList || this.categoryList.length === 0) {
      this.getCategory();
    }
    const modal = this.modalService.confirm({
      nzTitle: '项目详情',
      nzContent: this.tplContent,
      nzWidth: '500',
      nzOkDisabled: true
    });
  }

  private clickOpenProject = (data: any) => {
    data.categoryId = data.categoryId.toString();
    this.applyForm.reset();
    this.applyForm.patchValue(data);
    if (!this.categoryList || this.categoryList.length === 0) {
      this.getCategory();
    }
    const modal = this.modalService.confirm({
      nzTitle: '编辑项目',
      nzContent: this.tplContent,
      nzWidth: '500',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          for (const i in this.applyForm.controls) {
            if (this.applyForm.controls.hasOwnProperty(i)) {
              this.applyForm.controls[i].markAsDirty();
              this.applyForm.controls[i].updateValueAndValidity();
            }
          }
          this.applyStatus = this.applyForm.valid;
          if (this.applyStatus) {
            if (!this.submitStatus) {
              this.submitStatus = true;
              this.service.getProjectApply(this.applyForm.value).subscribe(
                (com: any) => {
                  if (com.success) {
                    this.searchData();
                    resolve();
                  } else {
                    this.msg.error(com.message);
                    resolve(false);
                  }
                  this.submitStatus = false;
                }
              );
            }
          } else {
            resolve(false);
          }
        })
    });
  }

  private getCategory = () => this.service.getCategory({ companyId: this.base.getCompany.companyId }).subscribe(
    (result: any) => this.categoryList = result && result.extData || null
  )

  uploadRequest = (args: UploadXHRArgs) => {
    return this.service.uploadFile(args.file).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) { (event as any).percent = event.loaded / event.total * 100; }
        args.onProgress(event, args.file);
      } else if (event instanceof HttpResponse) {
        args.onSuccess(event.body, args.file, event);
        const result: any = event.body;
        if (result.success) {
          this.applyForm.get(args.action).setValue(result.extData);
        } else {
          this.msg.error(result.message);
        }
      }
    }, (err) => {
      args.onError(err, args.file);
    });
  }

}
