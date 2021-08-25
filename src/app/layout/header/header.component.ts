import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BaseService, MessageService } from 'src/app/share/service';
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
    private msg: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private layoutService: LayoutService,
  ) {
    this.getUserInfo();
  }

  ngOnInit() {
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

  public onClickGoto(url: string) {
    this.router.navigate([url], { relativeTo: this.activeRoute, replaceUrl: false });
  }

  public onClickExit() {
    this.layoutService.getLogout().subscribe();
    this.base.cleanCacheRecords();
    this.router.navigate(['/login']);
  }

  public onGoToUrl(url) {
    this.router.navigate([url]);
  }

}
