/**
 * @作者: zc
 * @时间: 2021-02-04 11:28:02
 * @描述: 预加载配置
 */
import { Observable, of, timer } from 'rxjs';
import { delay, flatMap, } from 'rxjs/operators';
import { PreloadingStrategy, Route } from '@angular/router';

export class PreloadSelectedModules implements PreloadingStrategy {

  /**
   * 延迟 *s 加载指定模块
   * @param route.data.preloadTime 延时时间 单位：秒
   */
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data.preloadTime ? timer(1000 * (route.data.preloadTime || 4)).pipe(flatMap(fm => load())) : of(null);
  }
}
