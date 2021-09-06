import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/share/service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  private getsize$: any;

  project = [];

  constructor(
    private router: Router,
    private server: HomeService
  ) {
  }

  ngOnInit() {
    this.getProjectList();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.getsize$) { this.getsize$.unsubscribe(); }
  }

  private getProjectList = () => this.server.getProjectList().subscribe(
    (result: any) => this.project = result && result.extData || null
  )

  onGoToUrl = (url) => {
    this.router.navigate([url]);
  }

  clickImportMember = (project: any) => console.log('导入成员');

  clickTelegraphic = (project: any) => console.log('电签结算');

}

