import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isClone } from 'ng-ylzx/core/util';

@Component({
  selector: 'app-task-progress-submit',
  templateUrl: './task-progress-submit.component.html',
  styleUrls: ['./task-progress-submit.component.scss']
})
export class TaskProgressSubmitComponent implements OnInit, OnDestroy {

  private getser$: any;

  @Input() set item(data: any) {
    if (data) {
      this.getTaskFund(data.taskNo);
      this.page.taskNo = data.taskNo;
      this.searchData(true);
    }
  }

  @Output() nextChange = new EventEmitter<boolean>();

  isLoading = false;

  items = [];

  fund = null;

  submitStatus = false;

  page: any = {
    total: 0, page: 1, size: 20, keyword: null,
    taskNo: null, status: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '姓名', key: 'name', show: true, width: 100 },
    { title: '付款金额', key: 'amount', show: true, width: 120, suffix: '元' },
    { title: '身份证号', key: 'idNumber', show: false, width: 190 },
    { title: '收款账号', key: 'recordId', show: true, width: 190 },
  ];

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: TasklistService
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  getTaskFund = (taskNo) => this.service.getTaskFund({ taskNo }).subscribe(
    (res: any) => {
      if (res.success) {
        this.fund = res && res.extData;
      } else {
        this.msg.error(res.message);
      }
    }
  )

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
    this.getser$ = this.service.getTaskRecordPage(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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

  getTaskCommit = () => {
    this.submitStatus = true;
    this.getser$ = this.service.getTaskCommit({ taskNo: this.page.taskNo }).subscribe(
      (res: any) => {
        this.submitStatus = false;
        if (res.success) {
          this.nextChange.emit(true);
        } else {
          this.msg.error(res.message);
        }
      },
      err => this.submitStatus = false,
      () => this.submitStatus = false
    );
  }

}
