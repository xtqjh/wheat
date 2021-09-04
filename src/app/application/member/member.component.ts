import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  template: `
    <div class="back-white">
      <router-outlet></router-outlet>
    </div>
  `
})
export class MemberComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
