import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { filter, switchMap, tap } from 'rxjs/operators';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {

  private getser$: any;

  isLoading = false;

  item = null;

  items = [];

  page: any = {
    total: 0, page: 1, size: 20, keyword: null,
    name: null, phone: null, taskNo: null, withdrawStatus: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '姓名', key: 'name', show: true, width: 100 },
    { title: '手机号', key: 'phone', show: true, width: 120 },
    { title: '身份证号', key: 'identityCard', show: false, width: 190 },
    { title: '账号', key: 'bankCode', show: true, width: 190 },
    { title: '金额', key: 'amount', show: true, width: 120, suffix: '元' },
    { title: '发放状态', key: 'withdrawStatus', show: true, width: 80 },
    { title: '发放时间', key: 'grantDateTime', show: true, width: 190 },
    { title: '失败原因', key: 'failReason', show: false, width: 190 },
  ];

  constructor(
    public base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private service: TasklistService
  ) { }

  ngOnInit() {
    this.setParamr();
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setParamr() {
    this.getser$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.get('taskNo') !== '0'),
      tap(v => this.isLoading = true),
      switchMap((params: ParamMap) => this.service.getDetailTask({ taskNo: params.get('taskNo') })),
      tap(v => this.isLoading = false)
    ).subscribe(
      (data: any) => {
        this.item = data && data.extData;

        // this.items = data && data.quotedDetailResponse || [];
        this.isLoading = false;
        this.page.taskNo = this.item.taskNo;
        this.searchData(true);
      },
      err => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  clickReset = () => {
    for (const key in this.page) {
      if (Object.prototype.hasOwnProperty.call(this.page, key)) {
        if (!['total', 'page', 'size', 'taskNo'].includes(key)) {
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
    this.getser$ = this.service.getListRecord(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
