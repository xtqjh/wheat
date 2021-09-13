import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NzModalService, UploadFile, NzDrawerService } from 'ng-zorro-antd';
import { isClone, isGuid } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { ProjectService } from '../project.service';
import * as moment from 'moment';
import { CrowdEditComponent } from '../crowd-edit/crowd-edit.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crowd-table',
  templateUrl: './crowd-table.component.html',
  styleUrls: ['./crowd-table.component.scss']
})
export class CrowdTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    projectName: null, companyId: null,
    date: null, startTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '项目名称', key: 'projectName', show: true, width: 190 },
    { title: '创建时间', key: 'createTime', show: true, width: 200 },
    { title: '接单情况', key: 'phone', show: true, width: 200 },
    { title: 'amount', key: 'amount', show: true, width: 120 },
    { title: 'peopleCount', key: 'peopleCount', show: true, width: 120 },
    { title: 'personRequirement', key: 'personRequirement', show: true, width: 120 },
    { title: 'projectDescription', key: 'projectDescription', show: true, width: 120 },
    { title: 'projectType', key: 'projectType', show: true, width: 120 },
    {
      title: '操作', key: 'operate', show: true, width: 100, right: 0,
      buttons: [
        {
          text: '编辑',
          click: (node) => this.openEdit(node, '项目众包编辑', true)
        },
        {
          text: '删除',
        }
      ]
    }
  ];

  items = [];

  isLoading = false;

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private modalService: NzModalService,
    private drawerService: NzDrawerService,
    private service: ProjectService
  ) { }

  ngOnInit() {
    this.page.companyId = this.base.getCompany.companyId;
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  clickReset = () => {
    for (const key in this.page) {
      if (Object.prototype.hasOwnProperty.call(this.page, key)) {
        if (!['total', 'page', 'size', 'companyId'].includes(key)) {
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
          this.items = this.items.map(m => Object.assign(m, { id: m.userId }));
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

  openEdit = (id: any, title: string, isShowSubmitButton?: boolean) => {
    const drawerRef = this.drawerService.create<CrowdEditComponent, { id: any, isShowSubmitButton?: boolean }, any>({
      nzBodyStyle: { height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom': '53px', 'padding-top': '16px' },
      nzTitle: title,
      nzWidth: '320px',
      nzContent: CrowdEditComponent,
      nzContentParams: { id, isShowSubmitButton }
    });
    drawerRef.afterClose.subscribe((data: any) => {
      if (data && data.refresh) {
        this.searchData();
      }
    });
  }

}
