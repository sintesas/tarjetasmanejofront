import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() icon?: string;
  @Input() title?: string;
  @Input() items?: string;

  lstItems: any = [];

  constructor() { }

  ngOnInit(): void {
    if (this.items) {
      this.lstItems = this.items.split(',');
    }
  }

}
