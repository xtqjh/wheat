import { Injectable, NgZone, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LazyService } from 'ng-ylzx/core/service';
import { MessageService } from 'src/app/share/service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private loadedLess = false;

  constructor(
    // private cdr: ChangeDetectorRef,
    private msg: MessageService,
    private lazy: LazyService,
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: Document,
  ) { }

  // 加载主题相关资源
  private loadLess = () => {
    if (this.loadedLess) {
      return Promise.resolve();
    }
    return this.lazy
      .loadStyle('./assets/theme.less', 'stylesheet/less')
      .then(() => {
        const lessConfigNode = this.doc.createElement('script');
        lessConfigNode.innerHTML = `
          window.less = {
            async: true,
            env: 'production',
            javascriptEnabled: true
          };
        `;
        this.doc.body.appendChild(lessConfigNode);
      })
      .then(() => this.lazy.loadScript('./assets/less/less.3.8.1.min.js'))
      .then(() => {
        this.loadedLess = true;
      });
  }

  // 动态编译主题
  public runLess = (color: string, isMsg = true) => {
    const { zone, msg } = this;
    if (color) {
      let msgId;
      if (isMsg) {
        msgId = msg.loading(`正在编译主题！`, { nzDuration: 0 }).messageId;
      }
      setTimeout(() => {
        zone.runOutsideAngular(() => {
          this.loadLess().then(() => {
            (window as any).less.modifyVars({
              '@color': color
            }).then(() => {
              if (isMsg) {
                msg.success('主题编译成功');
                msg.remove(msgId);
              }
              // zone.run(() => cdr.detectChanges());
            });
          });
        });
      }, 200);
    }
  }

  // 独立设置
  public setViewHtml = (setting: any) => {
    if (setting.topBgColor) {
      document.body.style.setProperty('--top-bg-color', setting.topBgColor);
    }
    if (setting.topHeight) {
      document.body.style.setProperty('--top-height', `${setting.topHeight}px`);
    }
    if (setting.topPadding) {
      document.body.style.setProperty('--top-padding', `0px ${setting.topPadding}px`);
    }
    if (setting.sidebarBgColor) {
      document.body.style.setProperty('--sidebar-bg-color', setting.sidebarBgColor);
    }
    if (setting.sidebarHeight) {
      document.body.style.setProperty('--sidebar-height', `${setting.sidebarHeight}px`);
    }
    if (setting.sidebarPadding) {
      document.body.style.setProperty('--sidebar-padding', `${setting.sidebarPadding}px 0px`);
    }
  }

}


export interface Setting {
  /**
   * 主题色
   */
  theme: string;

  /**
   * 顶部 - 高
   */
  topHeight: number;

  /**
   * 顶部 - 背景色
   */
  topBgColor: string;

  /**
   * 顶部 - 边距
   */
  topPadding: number;

  /**
   * 侧边栏 - 高度
   */
  sidebarHeight: number;

  /**
   * 侧边栏 - 背景色
   */
  sidebarBgColor: string;

  /**
   * 侧边栏 - 边距
   */
  sidebarPadding: number;

  /**
   * 表格 - 大小类型
   */
  tableSize: 'default' | 'middle' | 'small';

  /**
   * 表格 - 快速跳转
   */
  tableShowPageJumper: boolean;

  /**
   * 表格 - 页数选择器
   */
  tableShowPageSize: boolean;

  /**
   * 表格 - 页数选择器可选值
   */
  tablePageSizeOptions: any;

}
