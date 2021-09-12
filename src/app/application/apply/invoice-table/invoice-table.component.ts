import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isClone } from 'ng-ylzx/core/util';
import { Page, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { NzDrawerService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { BaseService, MessageService } from 'src/app/share/service';
import { TaskEditComponent } from '../task-edit/task-edit.component';
import { ApplyService } from '../apply.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    bankOfDeposit: null, categoryName: null, companyAddress: null, contactPhone: null, fileUrl: null,
    publicAccounts: null, receiveAddress: null, receiveName: null, receivePhone: null, taxAmount: null,
    type: null, callback: null, companyId: null, companyName: null, id: null, isAllSelect: null,
    name: null, otherUrl: null, selectTaskNo: null, status: null, taxRemark: null,
    date: null, beginTime: null, endTime: null,
  };

  tableHeader: Array<TableHeader> = [
    { title: '税源地', key: 'areaName', show: true, width: 120 },
    {
      title: '开票类型', key: 'invoiceType', show: true, width: 120,
      pipeType: 'enabled', pipeContent: [{ key: 0, value: '提前开票' }, { key: 1, value: '正常开票' }]
    },
    { title: '开票类目', key: 'categoryName', show: true, width: 120 },
    { title: '开票金额', key: 'taxAmount', show: true, width: 120 },
    { title: '申请时间', key: 'createTime', show: true, width: 190 },
    { title: '操作人', key: 'operatorName', show: true, width: 120 },
    {
      title: '状态', key: 'status', show: true, width: 100,
      pipeType: 'enabled', pipeContent: [
        { key: 0, value: '待开票' },
        { key: 1, value: '已开票' },
        { key: 2, value: '已拒绝', color: 'red' },
        { key: 3, value: '已作废', color: 'red' },
      ]
    },
    {
      title: '操作', key: 'operate', show: true, width: 100, right: 0,
      buttons: [
        {
          text: '详情',
          show: (node) => [1, 2, 3].includes(node.status),
          click: (node) => this.openEdit(node, '申请开票详情', false)
        },
        {
          text: '编辑',
          show: (node) => [0].includes(node.status),
          click: (node) => this.openEdit(node, '申请开票编辑', true)
        },
        {
          text: '作废',
          show: (node) => [0].includes(node.status),
          pop: { title: '确定要作废发票申请吗？' },
          click: (node) => this.service.getInvoiceCancel({ id: node.id }).subscribe(
            (res: any) => {
              if (res.success) {
                this.searchData();
              } else {
                this.msg.error(res.message);
              }
            }
          )
        }
      ]
    },
  ];

  items = [];

  isLoading = false;

  areaNameList = [];

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private service: ApplyService,
    private drawerService: NzDrawerService,
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
    this.service.getAreaNameList({ companyId: this.base.getCompany.companyId }).subscribe((res: any) => this.areaNameList = res.success && res.extData || []);
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
    this.getser$ = this.service.getListInvoice(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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

  openEdit = (id: any, title: string, isShowSubmitButton?: boolean) => {
    const drawerRef = this.drawerService.create<TaskEditComponent, { id: any, isShowSubmitButton?: boolean }, any>({
      nzBodyStyle: { height: 'calc(100% - 55px)', overflow: 'auto', 'padding-bottom': '53px', 'padding-top': '16px' },
      nzTitle: title,
      nzWidth: '70%',
      nzContent: TaskEditComponent,
      nzContentParams: { id, isShowSubmitButton }
    });
    drawerRef.afterClose.subscribe((data: any) => {
      if (data && data.refresh) {
        this.searchData();
      }
    });
  }

}
