import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { ApplyService } from '../apply.service';
import * as moment from 'moment';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    projectName: null, projectType: null,
    date: null, startTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: 'id', key: 'id', show: true, width: 120 },
    { title: 'amount', key: 'amount', show: true, width: 120 },
    { title: 'companyId', key: 'companyId', show: true, width: 120 },
    { title: 'createTime', key: 'createTime', show: true, width: 120 },
    { title: 'endTime', key: 'endTime', show: true, width: 120 },
    { title: 'isDelete', key: 'isDelete', show: true, width: 120 },
    { title: 'peopleCount', key: 'peopleCount', show: true, width: 120 },
    { title: 'personRequirement', key: 'personRequirement', show: true, width: 120 },
    { title: 'projectCycle', key: 'projectCycle', show: true, width: 120 },
    { title: 'projectDescription', key: 'projectDescription', show: true, width: 120 },
    { title: 'projectId', key: 'projectId', show: true, width: 120 },
    { title: 'projectName', key: 'projectName', show: true, width: 120 },
    { title: 'projectType', key: 'projectType', show: true, width: 120 },
    { title: 'startTime', key: 'startTime', show: true, width: 120 },
    { title: 'updateTime', key: 'updateTime', show: true, width: 120 },
    { title: 'workMode', key: 'workMode', show: true, width: 120 },
    { title: 'workTime', key: 'workTime', show: true, width: 120 },
  ];

  items = [];

  isLoading = false;

  constructor(
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
        this.page.total = res && res.page.totalElements || 0;
        this.items = res && res.content || [];
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
