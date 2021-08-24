/**
 * @作者: zc
 * @时间: 2021-02-21 11:58:13
 * @描述: 头部
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/share/service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public helpBox = false;

  public user: any;

  public environment = environment;

  public msgList = [];

  constructor(
    private base: BaseService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
  ) {
    this.getUserInfo();
  }

  ngOnInit() {
  }

  private getUserInfo() {
    const userInfo: any = this.base.getUserInfo;
    if (userInfo) {
      this.user = userInfo;
    }
  }

  public onClickGoto(url: string) {
    this.router.navigate([url], { relativeTo: this.activeRoute, replaceUrl: false });
  }

  public onClickExit() {
    this.base.cleanCacheRecords();
    this.router.navigate(['/login']);
  }

  public onGoToUrl(url) {
    this.router.navigate([url]);
  }

}
