import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-crowd-detail',
  templateUrl: './crowd-detail.component.html',
  styleUrls: ['./crowd-detail.component.scss']
})
export class CrowdDetailComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    personName: null, phone: null, id: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '任务编号', key: 'taskNo', show: true, width: 200 },
    { title: '姓名', key: 'personName', show: true, width: 120 },
    { title: '身份证', key: 'idCard', show: true, width: 200 },
    { title: '接单手机号', key: 'phone', show: true, width: 140 },
    { title: '录入客户(条)', key: 'sale', show: true, width: 140 },
    { title: '带看客户(组)', key: 'lease', show: true, width: 140 },
    { title: '房屋销售(套)', key: 'qualifiedCount', show: true, width: 140 },
    { title: '房屋租赁(套)', key: 'visitCount', show: true, width: 140 },
  ];

  items = [];

  isLoading = false;

  constructor(
    private base: BaseService,
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

  clickReset = () => {
    for (const key in this.page) {
      if (Object.prototype.hasOwnProperty.call(this.page, key)) {
        if (!['total', 'page', 'size', 'id'].includes(key)) {
          this.page[key] = null;
        }
      }
    }
  }

  private setParamr() {
    this.getser$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.get('id') !== '0'),
      tap(v => this.isLoading = true),
      tap((params: ParamMap) => this.page.id = params.get('id')),
      tap(v => this.isLoading = false)
    ).subscribe(
      (data: any) => this.searchData(true),
      err => this.isLoading = false,
      () => this.isLoading = false
    );
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
    this.getser$ = this.service.getDetailsProjects(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
