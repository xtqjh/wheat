import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import * as moment from 'moment';
import { MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    projectId: null, transactionType: null, accountId: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '任务名称', key: 'name', show: true, width: 190 },
    { title: '任务单号', key: 'taskNo', show: true, width: 190 },
    { title: '项目名称', key: 'projectName', show: true, width: 190 },
    { title: '笔数', key: 'num', show: true, width: 60 },
    { title: '金额', key: 'amount', show: true, width: 120, suffix: '元' },
    {
      title: '发放状态', key: 'status', show: true, width: 80,
      pipeType: 'enabled', pipeContent: [
        { key: 1, value: '创建中' },
        { key: 3, value: '审核中' },
        { key: 4, value: '待确认' },
        { key: 5, value: '银行处理中' },
        { key: 6, value: '银行处理中' },
        { key: 7, value: '已完成' },
        { key: 8, value: '已作废' },
      ]
    },
    { title: '创建时间', key: 'createTime', show: true, width: 190 },
    { title: '创建人手机', key: 'operatorPhone', show: true, width: 190 },
    {
      title: '操作', key: 'operate', show: true, width: 130, right: 0,
      buttons: [
        {
          text: '进度',
          show: (node) => [1, 5, 6].includes(node.status),
          click: (node) => this.router.navigate([`./progress/${node.taskNo}`], { relativeTo: this.route })
        },
        {
          text: '明细',
          click: (node) => this.router.navigate([`./detail/${node.taskNo}`], { relativeTo: this.route })
        },
        {
          text: '确认',
          show: (node) => [3, 4].includes(node.status),
          click: (node) => this.router.navigate([`./progress/${node.taskNo}`], { relativeTo: this.route })
        },
        {
          text: '作废',
          show: (node) => [1, 3].includes(node.status),
          pop: { title: '是否确定作废当前任务？' },
          click: (node) => this.service.getCancelTask({ taskNo: node.taskNo }).subscribe(
            (res: any) => {
              if (res.success) {
                this.msg.success(`“${node.projectName}”任务已作废`);
                this.searchData();
              } else {
                this.msg.error(res.message);
              }
            }
          )
        }
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
    this.page.projectId = this.route.snapshot.queryParamMap.get('projectId');
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
    this.getser$ = this.service.getListTask(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
