
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BaseService } from 'src/app/share/service';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  private getsize$: any;

  clientHeight = null;

  meridiem = '您';

  capital = null;

  info = null;


  constructor(
    private router: Router,
    private server: HomeService
  ) {
  }

  ngOnInit() {
    this.meridiem = this.getMeridiem();

    this.getCompanyCapital();
    this.getCompanyInfo();
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

  private getCompanyCapital = () => this.server.getCompanyCapital().subscribe(
    (result: any) => this.capital = result && result.extData || null
  )

  private getCompanyInfo = () => this.server.getCompanyInfo().subscribe(
    (result: any) => this.info = result && result.extData || null
  )

  onGoToUrl = (url) => {
    this.router.navigate([url]);
  }

}

