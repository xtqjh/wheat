import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { ReuseTabService } from 'ng-ylzx/reuse-tab';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: any;

  selectTitle = null;

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;

  listEnterprise = [];

  company = { companyId: null };

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private router: Router,
    private modalService: NzModalService,
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private reuseTabService: ReuseTabService,
  ) {
    this.getUserInfo();
  }

  ngOnInit() {
    this.reuseTabService.change.subscribe(
      res => {
        const snapshotTrue = this.reuseTabService.getTruthRoute(this.activeRoute.snapshot);
        this.selectTitle = this.reuseTabService.getTitle(this.reuseTabService.curUrl, snapshotTrue);
      }
    );
  }

  private getUserInfo() {
    this.layoutService.getInfo().subscribe((res: any) => {
      if (res.code === 200 && res.success) {
        this.user = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }

  onClickGoto(url: string) {
    this.router.navigate([url], { relativeTo: this.activeRoute, replaceUrl: false });
  }

  onClickExit() {
    this.layoutService.getLogout().subscribe();
    this.base.cleanCacheRecords();
    this.router.navigate(['/login']);
  }

  onGoToUrl(url) {
    this.router.navigate([url]);
  }

  clickSelectEnterprise() {
    this.layoutService.getCompany().subscribe(
      (res: any) => {
        if (res.success) {
          this.listEnterprise = res.extData;
          const modal = this.modalService.confirm({
            nzTitle: '选择管理公司',
            nzContent: this.tplContent,
            nzWidth: '400',
            nzOnOk: () =>
              new Promise((resolve, reject) => {
                this.layoutService.getCompanyChoose(this.company).subscribe(
                  (com: any) => {
                    if (com.success) {
                      location.reload();
                      resolve();
                    } else {
                      this.msg.error(com.message);
                      reject();
                    }
                  }
                );
              })
          });
        } else {
          this.msg.error(res.message);
        }
      }
    );

  }

}
