import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import * as moment from 'moment';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-fund-table',
  templateUrl: './fund-table.component.html',
  styleUrls: ['./fund-table.component.scss']
})
export class FundTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 10,
    date: null, startTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '创建时间', key: 'createTime', sort: true, show: true, disabled: true, left: 60, width: 190 },
    { title: '客户单号', key: 'relateCode', sort: true, query: true, show: true, width: 160 },
    { title: '客户', key: 'ownerName', sort: true, query: true, show: true, width: 200 },
    { title: '发货方', key: 'sendName', sort: true, query: true, show: true, width: 160 },
    {
      title: '发货区域', key: 'sendRegion', show: true, width: 180,
      pipeType: 'custom', pipeContent: (node: any) => `${node.sendProv}${node.sendCity}${node.sendArea}`
    },
    { title: '收货方', key: 'receiveName', sort: true, query: true, show: true, width: 160 },
    { title: '件数', key: 'packNum', sort: true, show: true, width: 100, suffix: '件' },
    { title: '回单份数', key: 'returnBillNum', sort: true, show: true, width: 100, prefix: '回', suffix: '份' },
    {
      title: '是否温控', key: 'tempFlag', sort: true, show: true, width: 100,
      pipeType: 'enabled', pipeContent: [{ key: true, value: '是', color: '#ff9900' }, { key: false, value: '否', color: '#999999' }]
    },
  ];

  items = [];

  isLoading = false;

  constructor(
    private service: RecordService
  ) { }

  ngOnInit() {
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
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
    this.getser$ = this.service.getListFund(Object.assign({}, data, { page: data.page - 1 })).pipe(
      tap(v => this.isLoading = false)
    ).subscribe(
      (res: any) => {
        this.page.total = res && res.page.totalElements || 0;
        this.items = res && res.content || [];
      },
      error => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  onChange(value) {
    this.page.startTime = value[0] && moment(value[0]).format('YYYY-MM-DD HH:mm:ss') || null;
    this.page.endTime = value[1] && moment(value[1]).format('YYYY-MM-DD HH:mm:ss') || null;
  }

  onChangeDate = (value) => {
    this.page.date = [];
    this.page.startTime = value[0] && moment(value[0]).format('YYYY-MM-DD') + ' 00:00:00' || null;
    if (value[0]) {
      this.page.date[0] = new Date(this.page.startTime);
    }
    this.page.endTime = value[1] && moment(value[1]).format('YYYY-MM-DD') + ' 23:59:59' || null;
    if (value[1]) {
      this.page.date[1] = new Date(this.page.endTime);
    }
  }

}
