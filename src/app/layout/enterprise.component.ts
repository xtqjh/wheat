import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteConfigLoadStart, NavigationError, NavigationCancel, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MessageService } from '../share/service';
import { SettingsService, Setting } from './settings/settings.service';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit, OnDestroy {

  public isOpenMenu = false;

  private unsubscribe$ = new Subject<void>();
  private isFetching = false;

  constructor(
    private router: Router,
    private msg: MessageService,
    private settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    this.setActiveUrl();
    this.setThemeSetting();
  }

  ngOnDestroy(): void {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }

  private setActiveUrl() {
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((evt) => {
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

  // 设置主题
  private setThemeSetting = () => {
    let settings: any = localStorage.getItem(environment.storageSetting);
    if (settings) {
      settings = JSON.parse(settings) as Setting;
      this.settingsService.runLess(settings.theme, false);
      this.settingsService.setViewHtml(settings);
    }
  }

}
