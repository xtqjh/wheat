import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { RecordService } from '../record.service';
import * as moment from 'moment';
import { BaseService, MessageService } from 'src/app/share/service';

@Component({
  selector: 'app-flow-table',
  templateUrl: './flow-table.component.html',
  styleUrls: ['./flow-table.component.scss']
})
export class FlowTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    areaId: null, companyId: null, isAdd: null, isAutocommission: null,
    projectId: null, status: null, taskId: null, taskName: null, userName: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '金额', key: 'amount', show: true, width: 160 },
    { title: '税源地名称', key: 'areaName', show: true, width: 200 },
    { title: '收款账号', key: 'bankCard', show: true, width: 160 },
    { title: '企业名称', key: 'companyName', show: true, width: 160 },
    { title: '身份证号', key: 'identityCard', show: true, width: 160 },
    { title: 'longAmount', key: 'longAmount', show: true, width: 160 },
    { title: '手机号', key: 'phone', show: true, width: 160 },
    { title: '项目名称', key: 'projectName', show: true, width: 160 },
    { title: '任务名称', key: 'taskName', show: true, width: 160 },
    { title: '姓名', key: 'userName', show: true, width: 160 },
    { title: 'withdrawSatus', key: 'withdrawSatus', show: true, width: 160 },
    { title: '到账时间', key: 'withdrawTime', show: true, width: 160 },
  ];

  items = [];

  isLoading = false;

  projectList = [];

  areaNameList = [];

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private service: RecordService
  ) { }

  ngOnInit() {
    this.page.companyId = this.base.getCompany.companyId;
    this.loadDataItem();
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getListProject({}).subscribe((res: any) => this.projectList = res.success && res.extData || []);
    this.service.getAreaNameList({ companyId: this.base.getCompany.companyId }).subscribe((res: any) => this.areaNameList = res.success && res.extData || []);
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
    this.getser$ = this.service.getListFlow(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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

  getDownload = () => {
    this.service.exportReconciliation(this.page).subscribe(
      (res: any) => {
        if (res.success) {
          const link = document.createElement('a');
          link.setAttribute('href', res.extData.url);
          // link.setAttribute('download', 'download');
          link.click();
        } else {
          this.msg.error(res.message);
        }
      }
    );
  }

}
