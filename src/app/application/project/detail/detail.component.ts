import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { filter, switchMap, tap } from 'rxjs/operators';
import { BaseService, MessageService } from 'src/app/share/service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {

  private getser$: any;

  isLoading = false;

  item = null;

  workStatus = null;

  statistics = null;

  items = [];

  page: any = { total: 0, page: 1, size: 20, projectId: null };

  tableHeader: Array<TableHeader> = [
    { title: '任务名称', key: 'name', show: true, width: 200 },
    { title: '任务ID', key: 'taskNo', show: true, width: 180 },
    { title: '项目名称', key: 'projectName', show: true, width: 190 },
    { title: '金额', key: 'amount', show: true, width: 120, suffix: '元' },
    { title: '笔数', key: 'num', show: true, width: 60 },
    // { title: '发放状态', key: 'status', show: true, width: 80 },
    {
      title: '发放状态', key: 'status', show: true, width: 100,
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
    { title: '创建人手机号', key: 'operatorPhone', show: true, width: 120 },
  ];

  constructor(
    public base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private service: ProjectService
  ) { }

  ngOnInit() {
    this.setParamr();
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setParamr() {
    this.getser$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.get('id') !== '0'),
      tap(v => this.isLoading = true),
      switchMap((params: ParamMap) => this.service.getDetail({ projectId: params.get('id') })),
      tap(v => this.isLoading = false)
    ).subscribe(
      (data: any) => {
        this.item = data && data.extData;

        this.isLoading = false;
        this.page.projectId = this.item.projectId;
        this.searchData(true);
        this.getWorkStatus(this.page.projectId);
        this.getStatistics(this.page.projectId);
      },
      err => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  getWorkStatus = (id) => this.service.getWorkStatus({ projectId: id }).subscribe((res: any) => this.workStatus = res.extData);
  getStatistics = (id) => this.service.getStatistics({ projectId: id }).subscribe((res: any) => this.statistics = res.extData);

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
        } else {
          this.msg.error(res.message);
        }
      },
      error => this.isLoading = false,
      () => this.isLoading = false
    );
  }

}
