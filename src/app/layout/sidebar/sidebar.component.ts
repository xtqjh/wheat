
import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationError, NavigationEnd, NavigationStart } from '@angular/router';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { BullySubjectService } from 'ng-ylzx/core/service';
import { environment } from 'src/environments/environment';
import { SidebarService } from './sidebar.service';
import { MessageService } from 'src/app/share/service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {

  private getser$: any;

  // 菜单是否收起状态
  public isCollapsed = !environment.production;

  // 定义左侧菜单以及相关路由链接
  public menuList: Array<{ title?: string, text?: string, path?: string, children?: Array<any>, type?: string, urlPath?: string, isLoading?: boolean, icon?: string }> = [];

  public isLoading = true;

  public isMenuError = false;

  public isOpenMenu = false;

  constructor(
    private router: Router,
    private msg: MessageService,
    private bully: BullySubjectService,
    private sidebarService: SidebarService
  ) {
    this.getLoadMenu();
    this.setLoadRouter();

    this.getser$ = this.bully.getSubject()
      .pipe(debounceTime(100))
      .subscribe((data: any) => {
        switch (data.type) {
          case 'refresh-zc-layout-nav-menu':
            this.isOpenMenu = data.data;
            break;
          default:
            break;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  public getLoadMenu = () => {
    this.isLoading = true;
    this.sidebarService.getMenuTree()
      .pipe(
        tap(v => this.isLoading = false),
        tap((v: Array<any>) => {
          if (!v || v.length === 0) {
            this.isMenuError = true;
          } else {
            this.isMenuError = false;
          }
        }),
        filter((v: Array<any>) => v && v.length > 0)
      )
      .subscribe(
        (result: Array<any>) => {
          this.isMenuError = false;
          this.menuList = result;
          // console.log(this.menuList);
        },
        error => {
          this.isMenuError = true;
          this.msg.warning('菜单获取错误,请重新载入!');
        },
        () => this.isLoading = false
      );
  }

  /**
   * 路由方式添加tab
   */
  public tabs(path, title) {
    this.router.navigate([path || '/layout/home']);
    // this.setMenuLoading(path, true);
  }

  private setMenuLoading = (path: string, isLoading: boolean) => {
    this.menuList.map(m => {
      if (m.children) {
        m.children.map(mm => {
          if (mm.path === path) { mm.isLoading = isLoading; }
        });
      } else {
        if (m.path === path) { m.isLoading = isLoading; }
      }
    });
  }

  private setLoadRouter = () => {
    this.getser$ = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setMenuLoading(event.url, false);
      }
      if (event instanceof NavigationError) {
        this.setMenuLoading(event.url, false);
      }
      if (event instanceof NavigationStart) {
        this.setMenuLoading(event.url, true);
      }
    });
  }


}
