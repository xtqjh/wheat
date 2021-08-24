import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, TemplateRef } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay';
import * as domtoimage from 'dom-to-image';
import { NzMessageBaseService, NzMessageContainerComponent, NzMessageData, NzMessageDataOptions, NzMessageService, NzSingletonService } from 'ng-zorro-antd';
import { MessageConfig } from 'ng-zorro-antd/core';
import { environment } from 'src/environments/environment';
import { getExplore, getOS } from 'ng-ylzx/core/util';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends NzMessageBaseService<
NzMessageContainerComponent,
NzMessageData,
MessageConfig
> {

  constructor(
    nzSingletonService: NzSingletonService,
    overlay: Overlay,
    injector: Injector,
    cfr: ComponentFactoryResolver,
    appRef: ApplicationRef,
    private msg: NzMessageService,
    private platformLocation: PlatformLocation,
  ) {
    super(nzSingletonService, overlay, NzMessageContainerComponent, injector, cfr, appRef, 'message');
  }

  loading = (content: string | TemplateRef<void>, options?: NzMessageDataOptions) => this.msg.loading(content, options);

  info = (content: string | TemplateRef<void>, options?: NzMessageDataOptions) => this.msg.info(content, options);

  success = (content: string | TemplateRef<void>, options?: NzMessageDataOptions) => this.msg.success(content, options);

  warning = (content: string | TemplateRef<void>, options?: NzMessageDataOptions) => this.msg.warning(content, options);

  error = (content: string | TemplateRef<void>, options?: NzMessageDataOptions) => {
    this.msg.error(content, options);
  }



}

function ajaxPost(url, data) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify(data));
}

function dealImage(base64, callback) {
  const newImage = new Image();
  const quality = 0.92;    // 压缩系数0-1之间
  newImage.src = base64;
  newImage.setAttribute('crossOrigin', 'Anonymous');	// url为外域时需要
  let imgWidth;
  let imgHeight;
  newImage.onload = () => {
    imgWidth = newImage.width;
    imgHeight = newImage.height;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    if (Math.max(imgWidth, imgHeight) > 800) {
      if (imgWidth > imgHeight) {
        canvas.width = 800; //  设置压缩宽度大小
        canvas.height = 800 * imgHeight / imgWidth;
      } else {
        canvas.height = 800;
        canvas.width = 800 * imgWidth / imgHeight;
      }
    } else {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
    const cbase64 = canvas.toDataURL('image/png', quality); // 压缩语句
    callback(cbase64); // 必须通过回调函数返回，否则无法及时拿到该值
  };
}
