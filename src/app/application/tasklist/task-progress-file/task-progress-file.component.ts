import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-progress-file',
  templateUrl: './task-progress-file.component.html',
  styleUrls: ['./task-progress-file.component.scss']
})
export class TaskProgressFileComponent implements OnInit, OnDestroy {

  private getser$: any;

  @Output() nextChange = new EventEmitter<boolean>();

  isLoading = false;

  projectList = [];

  fileList: UploadFile[] = [];

  submitStatus = false;

  dynFormStatus = false;

  dynForm: FormGroup = this.fb.group({
    projectId: [null, Validators.required],
    taskName: [null, Validators.required],
    taskNo: [null],
  });

  isImportUrl = null;

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: TasklistService
  ) { }

  ngOnInit() {
    const projectId = this.route.snapshot.queryParamMap.get('projectId');
    this.dynForm.get('projectId').setValue(projectId);
    this.getListProject();
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  beforeUpload = (file) => {
    this.fileList = [file];
    this.isImportUrl = null;
    return false;
  }

  getListProject = () => this.service.getListProject({}).subscribe((res: any) => this.projectList = res.success && res.extData || []);

  getTaskBatchStatus = (taskNo: string) => this.service.getTaskBatchStatus({ taskNo })
    .subscribe((gtbs: any) => {
      if (gtbs.success) {
        if (gtbs.extData.status === 2) {
          this.isImportUrl = gtbs.extData.fileUrl;
          this.submitStatus = false;
        } else if (gtbs.extData.status === 0) {
          setTimeout(() => this.getTaskBatchStatus(gtbs.extData.taskNo), 1000 * 1);
        } else {
          this.dynForm.get('taskNo').setValue(gtbs.extData.taskNo);
          this.submitStatus = false;
          this.router.navigate([`/layout/tasklist/task/progress/${gtbs.extData.taskNo}`]);
          this.nextChange.emit(true);
        }
      } else {
        this.msg.error(gtbs.message);
        this.submitStatus = false;
      }
    }, err => this.submitStatus = false)

  submitForm() {
    for (const i in this.dynForm.controls) {
      if (this.dynForm.controls.hasOwnProperty(i)) {
        this.dynForm.controls[i].markAsDirty();
        this.dynForm.controls[i].updateValueAndValidity();
      }
    }
    this.dynFormStatus = this.dynForm.valid;
    if (this.dynFormStatus) {
      if (!this.submitStatus) {
        this.submitStatus = true;
        const data = this.dynForm.value;
        this.getser$ = this.service.postTaskImport({
          projectId: data.projectId, taskName: data.taskName, file: this.fileList[0]
        }).subscribe((res: any) => {
          if (res.success) {
            if (res.extData.fileUrl && res.extData.fileUrl.length > 0) {
              this.isImportUrl = res.extData.fileUrl;
            } else {
              this.getTaskBatchStatus(res.extData.taskNo);
            }
            this.submitStatus = false;
          } else {
            this.msg.error(res.message);
            this.submitStatus = false;
          }
          this.submitStatus = false;
        },
          err => this.submitStatus = false
        );
      }
    }
  }

}
