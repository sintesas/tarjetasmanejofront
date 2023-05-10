import { AfterViewInit, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
  @Input() menuList: any;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.menuList.forEach((x: any) => {
      $('.treeview-' + x.menu_id).addClass('is-expanded');
    });
  }

  toggleIsExpanded(id: any) {
    $('.treeview-' + id).toggleClass('is-expanded');
  }
}
