import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouteConfigLoadStart, NavigationError, NavigationCancel, RouteConfigLoadEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';
import { BullySubjectService } from 'ng-ylzx/core/service';
import { BaseService } from '../share/service';
import { SettingsService } from './settings/settings.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private getser$: any;

  public isOpenMenu = false;

  private unsubscribe$ = new Subject<void>();
  private isFetching = false;

  constructor(
    private router: Router,
    private base: BaseService,
    private bully: BullySubjectService,
    private notification: NzNotificationService,
    private settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    this.setActiveUrl();
    this.setLoadRouter();
    this.setThemeSetting();
  }

  ngOnDestroy(): void {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setActiveUrl() {
    this.getser$ = this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        return;
      }
      if (!(evt instanceof NavigationEnd || evt instanceof RouteConfigLoadEnd)) {
        return;
      }
      if (this.isFetching) {
        setTimeout(() => {
          this.isFetching = false;
        }, 100);
      }
    });
  }

  private setLoadRouter = () => {
    this.getser$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationError) {
        this.notification.error(
          '???????????????????????????',
          `
            <span class="font-12">????????????${event.url}??????</span>
            <p class="mg-t10 mg-b4">????????????????????????</p>
            <span class="mg-l10 font-12">??? ??????????????????????????????</span><br/>
            <span class="mg-l10 font-12">??? ??????????????? Wi-Fi ??????</span><br/>
            <span class="mg-l10 font-12">??? ???????????????????????????</span><br/>
          `,
          { nzDuration: 0 }
        );
      }
    });
  }

  // ????????????
  private setThemeSetting = () => {
    const settings: any = this.base.getStorageSetting();
    if (settings) {
      this.settingsService.runLess(settings.theme, false);
      this.settingsService.setViewHtml(settings);
    }
  }

  public clickPngFix = () => {
    this.isOpenMenu = !this.isOpenMenu;
    this.bully.setSubject({ type: 'refresh-zc-layout-nav-menu', data: this.isOpenMenu });
  }

}
