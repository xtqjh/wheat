import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { Subscription } from 'rxjs/internal/Subscription';
import { BaseService, MessageService } from 'src/app/share/service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, AfterViewInit, OnDestroy {

  private getsize$: any;

  project = [];

  categoryList = [];

  fileListScene = [];

  fileListContract = [];

  submitStatus = false;

  applyStatus = false;

  applyForm: FormGroup = this.fb.group({
    categoryId: [null, [Validators.required]],
    secondCategory: [null, [Validators.required]],
    name: [null, [Validators.required]],
    rate: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]*$/)]],
    fileUrl: [null, [Validators.required]],
    contractUrl: [null, [Validators.required]],
  });

  @ViewChild('tplContent', { static: false }) tplContent: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msg: MessageService,
    private modalService: NzModalService,
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

  private getCategoryList = () => this.server.getCategoryList().subscribe(
    (result: any) => this.categoryList = result && result.extData || null
  )

  uploadRequest = (args: UploadXHRArgs) => {
    return this.server.uploadFile(args.file).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) { (event as any).percent = event.loaded / event.total * 100; }
        args.onProgress(event, args.file);
      } else if (event instanceof HttpResponse) {
        args.onSuccess(event.body, args.file, event);
        const result: any = event.body;
        if (result.success) {
          this.applyForm.get(args.action).setValue(result.extData);
        } else {
          this.msg.error(result.message);
        }
      }
    }, (err) => {
      args.onError(err, args.file);
    });
  }

  clickOpenProject = () => {
    if (!this.categoryList || this.categoryList.length === 0) {
      this.getCategoryList();
    }
    const modal = this.modalService.confirm({
      nzTitle: '发布项目',
      nzContent: this.tplContent,
      nzWidth: '500',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          for (const i in this.applyForm.controls) {
            if (this.applyForm.controls.hasOwnProperty(i)) {
              this.applyForm.controls[i].markAsDirty();
              this.applyForm.controls[i].updateValueAndValidity();
            }
          }
          this.applyStatus = this.applyForm.valid;
          if (this.applyStatus) {
            if (!this.submitStatus) {
              this.submitStatus = true;
              this.server.getProjectApply(this.applyForm.value).subscribe(
                (com: any) => {
                  if (com.success) {
                    this.getProjectList();
                    resolve();
                  } else {
                    this.msg.error(com.message);
                    resolve(false);
                  }
                  this.submitStatus = false;
                }
              );
            }
          } else {
            resolve(false);
          }
        })
    });
  }


}

