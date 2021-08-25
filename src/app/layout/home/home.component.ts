
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BaseService } from 'src/app/share/service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  public getsize$: any;

  public clientHeight = null;

  public meridiem = '您';

  public item: {
    name: string;
    companyLogoWeb?: string; // 公司logo
    companyName: string; // 公司名称
    staffCount?: number; // 成员数量
    departmentCount?: number; // 部门数量
    limitNum?: number; // 成员警戒线
    telphone?: string; // 联系电话
    address?: string; // 企业地址
  };

  constructor(
    private base: BaseService,
    // private organizeService: OrganizeService,
    // private employeesService: EmployeesService,
  ) {
    // this.item = {
    //   name: this.base.getUserInfo.name,
    //   companyName: this.base.getUserInfo.company.name,
    //   telphone: this.base.getUserInfo.company.contactTel,
    //   address: this.base.getUserInfo.company.address,
    //   // companyName: 'this.base.getUserInfo.company.name',
    //   // telphone: 'this.base.getUserInfo.company.contactTel',
    //   // address: 'this.base.getUserInfo.company.address',
    //   limitNum: 200,
    //   staffCount: 0,
    //   departmentCount: 0,
    // };
  }

  ngOnInit() {
    this.meridiem = this.getMeridiem();

    // this.getOrganizeNumber();
    // this.getEmployeesNumber();
  }

  ngAfterViewInit() {
    setTimeout(() => this.onWindowSize());
  }

  ngOnDestroy() {
    if (this.getsize$) { this.getsize$.unsubscribe(); }
  }

  private onWindowSize = () => {
    this.getsize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(10))
      .subscribe((event) => this.onChangeSize());
    this.onChangeSize();
  }

  private onChangeSize = () => {
    const content = document.querySelector('body');
    this.clientHeight = content.clientHeight - 70;
  }

  private getMeridiem(date?: any) {
    const newDate = date ? new Date(date) : new Date();
    const hour = newDate.getHours();
    if (hour <= 5) {
      return '晚上';
    } else if (hour <= 9) {
      return '早上';
    } else if (hour <= 11) {
      return '上午';
    } else if (hour <= 13) {
      return '中午';
    } else if (hour <= 18) {
      return '下午';
    } else {
      return '晚上';
    }
  }

  // private getOrganizeNumber = () => {
  //   this.organizeService.getOrganizeList({ page: 0, size: 1, orgId: this.base.getUserInfo.companyId, companyId: this.base.getUserInfo.companyId }).subscribe(
  //     (result: any) => this.item.departmentCount = result && result.page.totalElements || 0
  //   );
  // }

  // private getEmployeesNumber = () => {
  //   this.employeesService.getEmployeesList({ page: 0, size: 1, orgId: this.base.getUserInfo.companyId, companyId: this.base.getUserInfo.companyId }).subscribe(
  //     (result: any) => this.item.staffCount = result && result.page.totalElements || 0
  //   );
  // }

}

