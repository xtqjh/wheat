import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { MessageService } from 'src/app/share/service';
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

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;

  dynForm = this.fb.group({
    companyMail: [null, [Validators.required]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private msg: MessageService,
    private server: HomeService,
    private modalService: NzModalService,
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

  openAlipay = () => this.modalService.confirm({
    nzTitle: '支付宝签约',
    nzContent: this.tplContent,
    nzWidth: '400',
    nzOnOk: () =>
      new Promise((resolve, reject) => {
        // this.editItem({ id: node.id, creditType: 2, greenTime: null, creditMsg: this.approval.rejectMsg });
        // setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

        for (const i in this.dynForm.controls) {
          if (this.dynForm.controls.hasOwnProperty(i)) {
            this.dynForm.controls[i].markAsDirty();
            this.dynForm.controls[i].updateValueAndValidity();
          }
        }
        if (this.dynForm.valid) {
          this.server.getCertUrl(this.dynForm.value).subscribe(
            (res: any) => {
              if (res.success) {
                window.open(res.extData);
                resolve(true);
              } else {
                this.msg.error(res.message);
                resolve(false);
              }
            }
          );
        } else {
          resolve(false);
        }
      })
  })

}
