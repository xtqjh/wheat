import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private http: HttpClient,
  ) { }

}

