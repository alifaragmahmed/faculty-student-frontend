import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbList: any = null;
  public locale: string;

  constructor() {
  }

  ngOnInit() {
  }
}
