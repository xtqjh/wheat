import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { pxToNumber } from 'ng-ylzx/core/util';
import { ReuseTabNotify } from 'ng-ylzx/reuse-tab';
import { ReuseTabService, ReuseTabCached, ReuseItem } from 'ng-ylzx/reuse-tab';

@Component({
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.scss']
})
export class HeaderTabsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef<any>;
  @ViewChild('navContainerElement', { static: true }) navContainerElement: ElementRef<HTMLDivElement>;
  @ViewChild('navListElement', { static: true }) navListElement: ElementRef<HTMLDivElement>;

  private scrollDistance = 0;

  public tabItems = [];

  public selectTab = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private activeRoute: ActivatedRoute,
    private reuseTabService: ReuseTabService,
  ) { }

  ngOnInit() {
    this.reuseTabService.change.subscribe(
      res => {
        this.selectTab = this.reuseTabService.curUrl;
        this.genList(res);
        setTimeout(() => {
          this.scrollHeaderAuto();
        }, 100);
      }
    );
  }

  ngAfterViewInit() {
    this.elementLoad();
  }

  ngOnDestroy() {
    if (this.container && this.container.nativeElement) {
      this.container.nativeElement.remove();
    }
  }

  private elementLoad = () => {
    if (this.container && this.container.nativeElement) {
      this.elementRef.nativeElement.replaceWith(this.container.nativeElement);
    }
  }

  public onGoToUrl = (url) => {
    this.router.navigate([url]);
  }

  private genList = (notify: ReuseTabNotify | null) => {
    const ls = this.reuseTabService.items.slice().map((item: ReuseTabCached, index: number) => ({
      url: item.url,
      title: item.title,
      closable: item.closable && this.reuseTabService.count > 0,
      index,
      active: false,
      last: false,
    } as ReuseItem));

    const url = this.reuseTabService.getUrl(this.activeRoute.snapshot);
    let addCurrent = ls.findIndex(w => w.url === url) === -1;
    if (notify && notify.active === 'close' && notify.url === url) {
      addCurrent = false;
      let toPos = 0;
      // tslint:disable-next-line:no-non-null-assertion
      const curItem = this.tabItems.find(w => w.url === url)!;
      if (curItem.index === ls.length) {
        toPos = ls.length - 1;
      } else if (curItem.index < ls.length) {
        toPos = Math.max(0, curItem.index);
      }
      this.router.navigateByUrl(ls[toPos].url);
    }
    if (addCurrent) {
      const snapshotTrue = this.reuseTabService.getTruthRoute(this.activeRoute.snapshot);
      ls.push({
        url,
        title: this.reuseTabService.getTitle(url, snapshotTrue),
        closable: this.reuseTabService.count > 0 && this.reuseTabService.getClosable(url, snapshotTrue),
        active: false,
        last: false,
        index: 0
      });
    }

    ls.forEach((item, index) => (item.index = index));
    if (ls.length === 1) {
      ls[0].closable = false;
    }
    this.tabItems = ls;
  }

  // 关闭指定标签页
  public closeTab(idx: number) {
    const item = this.tabItems[idx];
    this.reuseTabService.close(item.url);
  }

  // 手动滚动切换tab视图
  public scrollHeader = (dir: string) => {
    const tabListScrollWidthPix = this.navListElement.nativeElement.scrollWidth;
    const originStyle = window.getComputedStyle(this.navContainerElement.nativeElement);
    const excludeWidthPix = pxToNumber(originStyle.paddingLeft) + pxToNumber(originStyle.paddingRight);
    const viewWidthtPix = this.navContainerElement.nativeElement.offsetWidth - excludeWidthPix;
    const getMaxScrollDistance = tabListScrollWidthPix - viewWidthtPix || 0;
    this.scrollDistance += ((dir === 'left' ? -1 : 1) * viewWidthtPix) / 3;
    if (this.scrollDistance < 0) { this.scrollDistance = 0; }
    if (this.scrollDistance > viewWidthtPix) { this.scrollDistance = viewWidthtPix; }
    this.scrollDistance = Math.max(0, Math.min(getMaxScrollDistance, this.scrollDistance));
    this.updateTabScrollPosition();
  }

  // 自动滚动切换tab视图
  private scrollHeaderAuto = () => {
    const tab = document.querySelector('.tabs-tab.active') as any;
    if (tab) {
      const labelBeforePos = tab.offsetLeft;
      const labelAfterPos = labelBeforePos + tab.offsetWidth;
      const beforeVisiblePos = this.scrollDistance;
      const originStyle = window.getComputedStyle(this.navContainerElement.nativeElement);
      const excludeWidthPix = pxToNumber(originStyle.paddingLeft) + pxToNumber(originStyle.paddingRight);
      const viewWidthtPix = this.navContainerElement.nativeElement.offsetWidth - excludeWidthPix;
      const afterVisiblePos = this.scrollDistance + viewWidthtPix;
      if (labelBeforePos < beforeVisiblePos) {
        this.scrollDistance -= beforeVisiblePos - labelBeforePos;
      }
      if (labelAfterPos > afterVisiblePos) {
        this.scrollDistance += labelAfterPos - afterVisiblePos;
      }
      this.updateTabScrollPosition();
    }
  }

  private updateTabScrollPosition = () => {
    const scrollDistance = this.scrollDistance;
    const translateX = -scrollDistance;
    this.renderer.setStyle(this.navListElement.nativeElement, 'transform', `translate3d(${translateX}px, 0, 0)`);
  }


}
