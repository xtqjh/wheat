import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone, isNotNil, extendQuery } from 'ng-ylzx/core/util';
import { Page, Tabs, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { BankCardsService } from '../bank-cards.service';
import { MessageService } from 'src/app/share/service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 10,
    idCard: null, callback: null, phone: null, companyId: null, userName: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '身份证', key: 'identityCard', show: true, disabled: true, left: 60, width: 190 },
    { title: '昵称', key: 'nickName', show: true, width: 160 },
    { title: '手机号', key: 'phone', show: true, width: 200 },
    { title: 'projectId', key: 'projectId', show: true, width: 160 },
    { title: '项目名', key: 'projectName', show: true, width: 160 },
    { title: '真实姓名', key: 'trueName', show: true, width: 160 },
    { title: '用户ID', key: 'userId', show: true, width: 160 },
    { title: 'relationName', key: 'relationName', show: true, width: 160 },
    { title: 'statusTime', key: 'statusTime', show: true, width: 160 },
    { title: 'statusTimeStr', key: 'statusTimeStr', show: true, width: 160 },
    { title: '状态', key: 'moguStatus', show: true, width: 100 },
    { title: '状态描述', key: 'moguStatusStr', show: true, width: 100 },
    { title: 'workStatus', key: 'workStatus', show: true, width: 100 },
    { title: 'workStatusStr', key: 'workStatusStr', show: true, width: 100 },
    { title: '描述', key: 'remarks', show: true, width: 100 },
    {
      title: '操作', key: 'operate', show: true, width: 140, right: 0,
      buttons: [
        {
          text: '短信通知和绑卡',
          click: (node) => this.service.sendTiedCardSMS({ userId: node.userId }).subscribe(
            (res: any) => res.success ? this.msg.success(res.message) : this.msg.error(res.message)
          )
        }
      ]
    }
  ];

  items = [];

  isLoading = false;

  constructor(
    private msg: MessageService,
    private service: BankCardsService
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
    this.getser$ = this.service.getList(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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


}
