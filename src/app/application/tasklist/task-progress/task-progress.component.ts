import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';

@Component({
  selector: 'app-task-progress',
  templateUrl: './task-progress.component.html',
  styleUrls: ['./task-progress.component.scss']
})
export class TaskProgressComponent implements OnInit, OnDestroy {

  private getser$: any;

  isLoading = false;

  item = null;

  indexCurrent = 0;

  constructor(
    public base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private service: TasklistService
  ) { }

  ngOnInit() {
    this.setParamr();
  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  private setParamr() {
    this.getser$ = this.route.paramMap.pipe(
      filter((params: ParamMap) => params.get('taskNo') !== '0'),
      tap(v => this.isLoading = true),
      switchMap((params: ParamMap) => this.service.getDetailTask({ taskNo: params.get('taskNo') })),
      tap(v => this.isLoading = false)
    ).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.item = res.extData;
          this.getTaskStatus();
        } else {
          this.msg.error(res.message);
        }
      },
      err => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  getTaskStatus = () => this.service.getTaskStatus(this.item.taskNo).subscribe(
    (gts: any) => {
      switch (gts.extData.status * 1) {
        case 1:
        case 2:
        case 3:
          this.indexCurrent = 1;
          break;
        case 4:
          this.indexCurrent = 2;
          break;
        case 5:
        case 6:
          this.indexCurrent = 3;
          break;
        case 7:
          this.indexCurrent = 4;
          break;
        default:

          break;
      }
    }
  )


}
