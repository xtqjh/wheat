import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { isClone, isGuid } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-template-table',
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss']
})
export class TemplateTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    callback: null, idCard: null, phone: null, projectId: null, username: null,
    companyId: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '姓名', key: 'username', show: true, width: 190 },
    { title: '身份证号码', key: 'idCard', show: true, width: 200 },
    { title: '手机号', key: 'phone', show: true, width: 200 },
  ];

  items = [];

  isLoading = false;

  projectList = [];

  checkIds = [];

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private modalService: NzModalService,
    private service: ProjectService
  ) { }

  ngOnInit() {
    this.page.companyId = this.base.getCompany.companyId;
    this.loadDataItem();
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getListProject().subscribe((res: any) => this.projectList = res.success && res.extData || []);
  }

  clickReset = () => {
    for (const key in this.page) {
      if (Object.prototype.hasOwnProperty.call(this.page, key)) {
        if (!['total', 'page', 'size', 'companyId'].includes(key)) {
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
    this.getser$ = this.service.getListAllMembers(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
      tap(v => this.isLoading = false)
    ).subscribe(
      (res: any) => {
        if (res.success) {
          this.page.total = res && res.extData.total || 0;
          this.items = res && res.extData.list || [];
          this.items = this.items.map(m => Object.assign(m, { id: m.userId }));
        } else {
          this.msg.error(res.message);
        }
      },
      error => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  getDownload = () => {
    this.service.postCommissionTemplateExport({
      isAllSelect: this.checkIds.length === this.page.total ? true : false,
      projectId: this.page.projectId,
      selectUserId: this.checkIds.toString(),
    }).subscribe(
      (res: any) => {
        if (res.success) {
          const link = document.createElement('a');
          link.setAttribute('href', res.extData);
          // link.setAttribute('download', 'download');
          link.click();
        } else {
          this.msg.error(res.message);
        }
      }
    );
  }


}
