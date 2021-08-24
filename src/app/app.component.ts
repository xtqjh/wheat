import { Component, OnDestroy, AfterViewInit, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  ngAfterViewInit() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
      this.renderer.addClass(preloader, 'dis-none');
    }, 1200);
  }


}
