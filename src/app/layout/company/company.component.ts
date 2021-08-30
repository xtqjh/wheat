import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReuseTabService } from 'ng-ylzx';
import { BaseService, MessageService } from 'src/app/share/service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  isLoading = false;

  company = { companyId: null };

  listEnterprise = [];

  constructor(
    private router: Router,
    private msg: MessageService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {

    this.getCompany();

  }

  private getCompany = () => {
    this.isLoading = true;
    this.layoutService.getCompany().subscribe(
      (res: any) => {
        if (res.success) {
          this.listEnterprise = res.extData;
        }
        this.isLoading = false;
      },
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  clickChoose = (company: any) => this.layoutService.getCompanyChoose({
    companyId: company.companyId
  }).subscribe(
    (com: any) => {
      if (com.success) {
        this.msg.success(com.message);
        this.router.navigate(['/layout/home']);
      } else {
        this.msg.error(com.message);
      }
    }
  )

}
