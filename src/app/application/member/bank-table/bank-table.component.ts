import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { isClone, isNotNil, extendQuery } from 'ng-ylzx/core/util';
import { Page, Tabs, SearchTemplate, TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-bank-table',
  templateUrl: './bank-table.component.html',
  styleUrls: ['./bank-table.component.scss']
})
export class BankTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    idCard: null, callback: null, phone: null, companyId: null, userName: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '姓名', key: 'userName', show: true, width: 100 },
    { title: '身份证号码', key: 'idCard', show: true, width: 190 },
    { title: '手机号', key: 'phone', show: true, width: 140 },
    { title: '银行卡号', key: 'bankCard', show: true, width: 200 },
    {
      title: '操作', key: 'operate', show: true, width: 140,
      buttons: [
        {
          text: '短信通知和绑卡',
          // show:(node) =>node.bankCard.
          click: (node) => this.service.sendTiedCardSMS({ userId: node.userId }).subscribe(
            (res: any) => res.success ? this.msg.success(res.message) : this.msg.error(res.message)
          )
        }
      ]
    }
  ];

  items = [];

  isLoading = false;

  constructor(
    private msg: MessageService,
    private base: BaseService,
    private service: MemberService
  ) { }

  ngOnInit() {
    this.page.companyId = this.base.getCompany.companyId;
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
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
    this.getser$ = this.service.getListBank(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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
