
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
   * 根据文件ID查询文件信息
   */
  public getFilesId(id: string) {
    return this.ht.get<Files>(`/fileserver/files/${id}`);
  }

  /**
   * 文件下载
   */
  public download(id: string) {
    return this.ht.get(`/fileserver/files/${id}/download`, { responseType: 'blob' });
  }

  /**
   * 上传多个文件
   * 自定义上传与返回结果
   */
  public uploadMultipart = (fileList: Array<any>): Observable<any> => {
    return new Observable(observer => from(fileList).pipe(
      concatMap((ut: any) => {
        const formData = new FormData();
        formData.append('file', ut);
        const req = new HttpRequest('POST', `/fileserver/files/upload`, formData);
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

  /**
   * 上传图片
   */
  uploadImages = (fileImage: any) => {
    return new Observable(observer => {
      const formData = new FormData();
      formData.append('file', fileImage);
      const req = new HttpRequest('POST', `/fileserver/images/upload`, formData);
      this.ht.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (res: any) => {
          observer.next(res.body);
          observer.complete();
        },
        err => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }
}



/**
 * 文件
 */
export interface Files {
  fileName: string;
  fileSize: string;
  fileType: string;
  mimeType: string;
  content: string;
  ext: string;
  createTime: string;
  id: string;
}
