import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import * as moment from 'moment';
import { MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';

@Component({
  selector: 'app-payment-table',
  templateUrl: './payment-table.component.html',
  styleUrls: ['./payment-table.component.scss']
})
export class PaymentTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    taskName: null, taskNo: null, status: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '任务名称', key: 'taskName', show: true, width: 190 },
    { title: '任务单号', key: 'taskNo', show: true, width: 190 },
    { title: '笔数', key: 'totalCount', show: true, width: 60 },
    {
      title: '发放状态', key: 'status', show: true, width: 80,
      pipeType: 'enabled', pipeContent: [
        { key: 0, value: '处理中' },
        { key: 1, value: '通过' },
        { key: 2, value: '不通过' },
      ]
    },
    { title: '创建时间', key: 'createTime', show: true, width: 190 },
    {
      title: '操作', key: 'operate', show: true, width: 100, right: 0,
      buttons: [
        {
          text: '明细',
          show: (node) => [0, 1].includes(node.status),
          click: (node) => this.router.navigate([`../../task/detail/${node.taskNo}`], { relativeTo: this.route })
        },
        {
          text: '下载失败列表',
          show: (node) => [2].includes(node.status),
          click: (node) => {
            const link = document.createElement('a');
            link.setAttribute('href', node.fileUrl);
            // link.setAttribute('download', 'download');
            link.click();
          }
        },
      ]
    }
  ];

  items = [];

  isLoading = false;

  accountList = [];

  total = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageService,
    private service: TasklistService
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
    this.getser$ = this.service.getListTaskBatch(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
