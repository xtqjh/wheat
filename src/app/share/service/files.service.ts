
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { concatMap, filter, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private ht: HttpClient
  ) {

  }

  /**
   * 上传文件
   * 自定义上传与返回结果
   */
  public uploadMultipart = (fileList: Array<any>): Observable<any> => {
    return new Observable(observer => from(fileList).pipe(
      concatMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        const req = new HttpRequest('POST', `/company/api/kmg/common/upload`, formData);
        // this.ht = new HttpClient(req);
        return this.ht.request(req).pipe(filter(e => e instanceof HttpResponse));
      }),
      toArray()
    ).subscribe(
      res => {
        if (fileList.length !== res.length) {
          observer.error();
          observer.complete();
          return;
        }
        const list = [];
        res.forEach((f: any) => list.push(f.body));
        observer.next(list);
        observer.complete();
      },
      err => {
        observer.error(err);
        observer.complete();
      }
    ));
  }

}

