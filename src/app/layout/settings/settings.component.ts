import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService, MessageService } from 'src/app/share/service';
import { SettingsService, Setting } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

  public getSize$: any;

  // 容器高度
  public clientHeight = null;
  public transHeight = null;

  public setting: Setting = {
    theme: null,
    topHeight: null,
    topBgColor: null,
    topPadding: null,
    sidebarHeight: null,
    sidebarBgColor: null,
    sidebarPadding: null,
    tableSize: 'middle',
    tableShowPageJumper: null,
    tableShowPageSize: true,
    tablePageSizeOptions: null,
  };

  public themes = [
    'rgb(245, 34, 45)',
    'rgb(250, 84, 28)',
    'rgb(250, 173, 20)',
    'rgb(238, 83, 204)',
    'rgb(19, 194, 194)',
    'rgb(82, 196, 26)',
    'rgb(24, 144, 255)',
    'rgb(47, 84, 235)',
    'rgb(114, 46, 209)',
    'rgb(0, 21, 41)',
  ];

  constructor(
    public base: BaseService,
    private settingsService: SettingsService,
    private msg: MessageService,
  ) { }

  ngOnInit() {
    const settings: any = this.base.getStorageSetting();
    if (settings) {
      this.setting = settings;
    }
  }

  ngAfterViewInit() {
    this.onWindowSize();
  }

  ngOnDestroy() {
    if (this.getSize$) { this.getSize$.unsubscribe(); }
  }

  // 监听窗体大小变化
  private onWindowSize = () => {
    this.getSize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe((event) => this.onChangeSize());

    this.onChangeSize();
  }

  // 窗体变化大小
  private onChangeSize = () => {
    const [content, transFooter] = [document.querySelector('#content'), document.querySelector('#transFooter')];
    this.clientHeight = content && content.clientHeight || 0;
    this.transHeight = this.clientHeight - (transFooter && transFooter.clientHeight || 0);
  }

  // 动态编译主题
  public runLess = () => this.settingsService.runLess(this.setting.theme);

  // 独立设置
  public setViewHtml = () => this.settingsService.setViewHtml(this.setting);

  public submitForm = () => {
    localStorage.setItem(environment.storageSetting, JSON.stringify(this.setting));
    this.msg.success('保存成功');
  }

  public clickClearCache = () => {
    localStorage.clear();
    this.msg.success('缓存清除成功!  请手动刷新!');
  }

}

