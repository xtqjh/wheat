/**
 * @描述: 路由守卫 · 离开路由前
 * @注意: ************************* 功能未完成 *************************
 */
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CanDeactivate } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  dynForm?: FormGroup;
}

@Injectable()
export class DeactivateGuard implements CanDeactivate<CanComponentDeactivate> {

  constructor(private modal: NzModalService) { }

  canDeactivate(component: CanComponentDeactivate) {
    if (component.dynForm.pristine === false && component.dynForm.touched === true) {
      this.modal.confirm({
        nzTitle: '确认离开?',
        nzContent: '检测到您编辑的内容尚未保存，确定要离开吗？',
        nzOkText: '离开此页',
        nzCancelText: '留在此页'
      });
    } else {
      return true;
    }
  }
}
