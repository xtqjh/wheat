import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadSelectedModules } from './share/interceptor/preload-selected-modules';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', loadChildren: () => import('src/app/enroll/enroll.module').then(m => m.EnrollModule) },
  { path: '', loadChildren: () => import('src/app/layout/layout.module').then(m => m.LayoutModule), data: { preloadTime: 3 } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadSelectedModules })],
  providers: [PreloadSelectedModules],
  exports: [RouterModule]
})
export class AppRoutingModule { }
