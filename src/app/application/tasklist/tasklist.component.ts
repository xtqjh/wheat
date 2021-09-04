import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasklist',
  template: `
    <div class="back-white">
      <router-outlet></router-outlet>
    </div>
  `
})
export class TasklistComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
