import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NgZorroAntdModule, zh_CN, NZ_I18N } from 'ng-zorro-antd';
import { ReuseTabStrategy, ReuseTabService } from 'ng-ylzx/reuse-tab';
import { NG_YLZX_CONFIG } from 'ng-ylzx/core/service';

import { AppRoutingModule } from './app-routing.module';
import { HttpsInterceptor } from './share/interceptor';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

registerLocaleData(zh);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: ReuseTabStrategy, deps: [ReuseTabService] },
    { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: NG_YLZX_CONFIG, useValue: environment },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
