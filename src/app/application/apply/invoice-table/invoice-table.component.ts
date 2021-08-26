import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import * as moment from 'moment';
import { ApplyService } from '../apply.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    projectName: null, status: null,
    date: null, startTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: 'id', key: 'id', show: true, width: 120 },
    { title: 'bankOfDeposit', key: 'bankOfDeposit', show: true, width: 120 },
    { title: 'categoryName', key: 'categoryName', show: true, width: 120 },
    { title: 'companyAddress', key: 'companyAddress', show: true, width: 120 },
    { title: 'companyId', key: 'companyId', show: true, width: 120 },
    { title: 'companyName', key: 'companyName', show: true, width: 120 },
    { title: 'contactPhone', key: 'contactPhone', show: true, width: 120 },
    { title: 'createTime', key: 'createTime', show: true, width: 120 },
    { title: 'fileUrl', key: 'fileUrl', show: true, width: 120 },
    { title: 'name', key: 'name', show: true, width: 120 },
    { title: 'operatorName', key: 'operatorName', show: true, width: 120 },
    { title: 'otherUrl', key: 'otherUrl', show: true, width: 120 },
    { title: 'projectId', key: 'projectId', show: true, width: 120 },
    { title: 'publicAccounts', key: 'publicAccounts', show: true, width: 120 },
    { title: 'receiveAddress', key: 'receiveAddress', show: true, width: 120 },
    { title: 'receiveName', key: 'receiveName', show: true, width: 120 },
    { title: 'receivePhone', key: 'receivePhone', show: true, width: 120 },
    { title: 'remark', key: 'remark', show: true, width: 120 },
    { title: 'status', key: 'status', show: true, width: 120 },
    { title: 'taskNos', key: 'taskNos', show: true, width: 120 },
    { title: 'taxAmount', key: 'taxAmount', show: true, width: 120 },
    { title: 'taxNo', key: 'taxNo', show: true, width: 120 },
    { title: 'taxRemark', key: 'taxRemark', show: true, width: 120 },
    { title: 'type', key: 'type', show: true, width: 120 },
  ];

  items = [];

  isLoading = false;

  constructor(
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
    this.getser$ = this.service.getListInvoice(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
