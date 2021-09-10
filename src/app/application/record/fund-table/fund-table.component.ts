import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import * as moment from 'moment';
import { MessageService } from 'src/app/share/service';
import { RecordService } from '../record.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fund-table',
  templateUrl: './fund-table.component.html',
  styleUrls: ['./fund-table.component.scss']
})
export class FundTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    transactionType: null, accountId: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '交易单号', key: 'transactionNo', show: true, width: 190 },
    {
      title: '交易金额', key: 'transactionAmount', show: true, width: 190, suffix: '元',
      color: (data: any) => [1, 9].includes(data.transactionType) ? 'red' : '#19be6b'
    },
    { title: '交易时间', key: 'transactionTime', show: true, width: 190 },
    { title: '任务单号', key: 'taskNo', show: true, width: 190 },
    { title: '账户名', key: 'accountName', show: true, width: 190 },
    { title: '账户余额', key: 'accountBalance', show: true, width: 190, suffix: '元' },
    { title: '账户类型', key: 'transactionType', show: false, width: 190 },
    { title: '支出', key: 'expenditure', show: false, width: 190, suffix: '元' },
    { title: '收入', key: 'income', show: false, width: 190, suffix: '元' },
    { title: '说明备注', key: 'remarks', show: true, width: 190 },
  ];

  items = [];

  isLoading = false;

  accountList = [];

  total = null;

  constructor(
    private msg: MessageService,
    private route: ActivatedRoute,
    private service: RecordService
  ) { }

  ngOnInit() {
    this.page.accountId = this.route.snapshot.queryParamMap.get('accountId');
    this.loadDataItem();
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getAccountNameList().subscribe((res: any) => this.accountList = res.success && res.extData || []);
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
    this.getser$ = this.service.getListFund(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
      tap(v => this.isLoading = false)
    ).subscribe(
      (res: any) => {
        if (res.success) {
          this.page.total = res && res.extData.total || 0;
          this.items = res && res.extData.list || [];
          this.total = {
            totalExpenditure: res.extData.totalExpenditure,
            totalIncome: res.extData.totalIncome,
            totalRefund: res.extData.totalRefund
          };
        } else {
          this.msg.error(res.message);
        }
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
