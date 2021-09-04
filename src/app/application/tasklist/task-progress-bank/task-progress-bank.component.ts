import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { NzModalService, UploadFile } from 'ng-zorro-antd';
import { BaseService, MessageService } from 'src/app/share/service';
import { TasklistService } from '../tasklist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-task-progress-bank',
  templateUrl: './task-progress-bank.component.html',
  styleUrls: ['./task-progress-bank.component.scss']
})
export class TaskProgressBankComponent implements OnInit, OnDestroy {

  private interval$: any;
  private getser$: any;

  @Input() item: any;

  isLoading = false;

  constructor(
    private base: BaseService,
    private msg: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private service: TasklistService
  ) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.getser$) { this.getser$.unsubscribe(); }
  }

  toPercent = (num, total) => (Math.round(num / total * 10000) / 100.00);

  getTaskConfirmation = () => this.service.getTaskConfirmation({ taskNo: this.item.taskNo }).subscribe(

  )


}
