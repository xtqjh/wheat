import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { isClone } from 'ng-ylzx/core/util';
import { TableHeader } from 'ng-ylzx/table';
import { BaseService, MessageService } from 'src/app/share/service';
import { MemberService } from '../member.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-signing-table',
  templateUrl: './signing-table.component.html',
  styleUrls: ['./signing-table.component.scss']
})
export class SigningTableComponent implements OnInit, OnDestroy {

  private getser$: any;

  page: any = {
    total: 0, page: 1, size: 20,
    projectId: null, name: null, phone: null, idNo: null, workStatus: null,
    companyId: null
  };

  tableHeader: Array<TableHeader> = [
    { title: '身份证', key: 'identityCard', show: true, disabled: true, left: 60, width: 190 },
    { title: '昵称', key: 'nickName', show: true, width: 160 },
    { title: '手机号', key: 'phone', show: true, width: 200 },
    { title: 'projectId', key: 'projectId', show: false, width: 160 },
    { title: '项目名', key: 'projectName', show: true, width: 160 },
    { title: '真实姓名', key: 'trueName', show: true, width: 160 },
    { title: '用户ID', key: 'userId', show: true, width: 160 },
    { title: 'relationName', key: 'relationName', show: false, width: 160 },
    { title: 'statusTime', key: 'statusTime', show: false, width: 160 },
    { title: 'statusTimeStr', key: 'statusTimeStr', show: true, width: 160 },
    { title: '状态', key: 'moguStatus', show: false, width: 100 },
    { title: '状态描述', key: 'moguStatusStr', show: true, width: 100 },
    { title: 'workStatus', key: 'workStatus', show: false, width: 100 },
    { title: 'workStatusStr', key: 'workStatusStr', show: false, width: 100 },
    { title: '描述', key: 'remarks', show: false, width: 100 },
    {
      title: '操作', key: 'operate', show: true, width: 140, right: 0,
      buttons: [
        {
          text: '重发短信',
          click: (node) => this.service.getSendMsg({ projectId: node.getSendMsg, userId: node.userId }).subscribe(
            (res: any) => res.success ? this.msg.success(res.message) : this.msg.error(res.message)
          )
        },
        {
          text: '发起解约协议',
          pop: { title: `是否确定解除与“???”的协议？` },
          click: (node) => this.service.setWorkStatus(Object.assign(node, { workStatus: '0' })).subscribe(
            (res: any) => res.success ? this.msg.success(res.message) : this.msg.error(res.message)
          )
        }
      ]
    }
  ];

  items = [];

  isLoading = false;

  projectList = [];

  company = { projectId: null, file: null };

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private service: MemberService
  ) { }

  ngOnInit() {
    this.page.companyId = this.base.getCompany.companyId;
    this.page.projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.loadDataItem();
    this.searchData(true);
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private loadDataItem = () => {
    this.service.getProjectName().subscribe((res: any) => this.projectList = res.success && res.extData || []);
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
    this.getser$ = this.service.getListSigning(Object.assign({}, data, { pageNum: data.page, pageSize: data.size })).pipe(
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

  getDownload = () => {
    this.service.getDownload(this.page).subscribe(
      (res: any) => {
        if (res.success) {
          const link = document.createElement('a');
          link.setAttribute('href', res.extData.url);
          // link.setAttribute('download', 'download');
          link.click();
        } else {
          this.msg.error(res.message);
        }
      }
    );
  }

  changeFile = (file: UploadFile): boolean => {
    this.company.file = file;
    return false;
  }

  getImport = () => {
    const modal = this.modalService.confirm({
      nzTitle: '导入成员',
      nzContent: this.tplContent,
      nzWidth: '440',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.service.getImport(this.company.projectId, this.company.file).subscribe(
            (com: any) => {
              if (com.success) {
                this.searchData(true);
                resolve();
              } else {
                this.msg.error(com.message);
                reject();
              }
            }
          );
        })
    });
  }

  getImportIndividual = () => {
    const modal = this.modalService.confirm({
      nzTitle: '导入个体工商户',
      nzContent: this.tplContent,
      nzWidth: '440',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.service.getImportIndividual(this.company.projectId, this.company.file).subscribe(
            (com: any) => {
              if (com.success) {
                this.searchData(true);
                resolve();
              } else {
                this.msg.error(com.message);
                reject();
              }
            }
          );
        })
    });
  }



}
