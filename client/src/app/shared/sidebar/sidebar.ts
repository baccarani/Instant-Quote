import {Component} from '@angular/core';

@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.html'
})

export class SidebarComponent {
  isActive = false;
  showMenu = '';
  eventCalled() {
    this.isActive = !this.isActive;
  }
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
}
