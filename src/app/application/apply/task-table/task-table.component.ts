import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { NzDrawerService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { MessageService } from 'src/app/share/service';
import { ApplyService } from '../apply.service';
import { TaskEditComponent } from '../task-edit/task-edit.component';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    taskNo: null, invoiceMark: null, projectId: null, refundMark: null, status: null, taskName: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '税源地', key: '', show: true, width: 120 },
    { title: '项目名称', key: 'projectName', show: true, width: 120 },
    { title: '项目类型', key: '', show: true, width: 120 },
    { title: '任务名称', key: 'name', show: true, width: 120 },
    { title: '任务编号', key: 'taskNo', show: true, width: 120 },
    { title: '金额', key: 'amount', show: true, width: 120 },
    { title: '总笔数', key: 'num', show: true, width: 120 },
    { title: '成功笔数', key: 'successNum', show: true, width: 120 },
    { title: '失败笔数', key: 'failNum', show: true, width: 120 },
    { title: '创建时间', key: 'createTime', show: true, width: 120 },
    {
      title: '操作', key: 'operate', show: true, width: 140, right: 0,
      buttons: [
        {
          text: '编辑',
        },
        {
          text: '作废',
        }
      ]
    },
  ];

  items = [];

  isLoading = false;

  projectList = [];

  constructor(
    private msg: MessageService,
    private service: ApplyService,
    private drawerService: NzDrawerService,
  ) { }

  ngOnInit() {
    this.loadDataItem();
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getProjectNameList({}).subscribe((res: any) => this.projectList = res.success && res.extData || []);
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

  openEdit = (id: string, title: string) => {
    const drawerRef = this.drawerService.create<TaskEditComponent, { id: string }, any>({
      nzBodyStyle: { height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom': '53px', 'padding-top': '16px' },
      nzTitle: title,
      nzWidth: '70%',
      nzContent: TaskEditComponent,
      nzContentParams: { id }
    });
    drawerRef.afterClose.subscribe((data: any) => {
      if (data && data.refresh) {
        this.searchData();
      }
    });
  }

}
