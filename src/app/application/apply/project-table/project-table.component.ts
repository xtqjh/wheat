import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { ApplyService } from '../apply.service';
import * as moment from 'moment';
import { MessageService } from 'src/app/share/service';

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
    { title: '申请名称', key: 'id', show: true, width: 120 },
    { title: '申请时间', key: 'amount', show: true, width: 120 },
    { title: '申请人', key: 'companyId', show: true, width: 120 },
    { title: '业务场景说明书', key: 'createTime', show: true, width: 120 },
    { title: '合同', key: 'endTime', show: true, width: 120 },
    { title: '状态', key: 'isDelete', show: true, width: 120 },
    { title: '审核备注', key: 'peopleCount', show: true, width: 120 },
    {
      title: '操作', key: 'operate', show: true, width: 140, right: 0,
      buttons: [
        {
          text: '??',
        }
      ]
    },
  ];

  items = [];

  isLoading = false;

  constructor(
    private msg: MessageService,
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

}
