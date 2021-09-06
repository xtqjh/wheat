import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit, OnDestroy {

  private getsize$: any;

  info = null;

  capital = null;

  constructor(
    private router: Router,
    private server: HomeService
  ) {
  }

  ngOnInit() {
    this.getCompanyCapital();
    this.getCompanyInfo();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.getsize$) { this.getsize$.unsubscribe(); }
  }

  private getCompanyInfo = () => this.server.getCompanyInfo().subscribe(
    (result: any) => this.info = result && result.extData || null
  )

  private getCompanyCapital = () => this.server.getCompanyCapital().subscribe(
    (result: any) => this.capital = result && result.extData || null
  )

  onGoToUrl = (url) => {
    this.router.navigate([url]);
  }



}
