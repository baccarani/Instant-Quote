import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Auth, LoginService} from '../../login//index'

declare var $: any;

@Component({
  selector: 'app-top-nav',
  templateUrl: 'topnav.html',
})

export class TopNavComponent implements OnInit {
  private user: string;

  constructor(private router: Router, private loginService: LoginService) {

  }

  ngOnInit() {
    let auth: Auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null
    if (auth && auth.isLoggedIn) {
      this.user = auth.user.name
    }
  }

  logout() {
    this.user = null
    localStorage.setItem('auth', null)
    this.router.navigate(['/'])

  }

  changeTheme(color: string): void {
    let link: any = $('<link>');
    link
      .appendTo('head')
      .attr({type: 'text/css', rel: 'stylesheet'})
      .attr('href', 'themes/app-' + color + '.css');
  }

  rtl(): void {
    let body: any = $('body');
    body.toggleClass('rtl');
  }

  sidebarToggler(): void {
    let sidebar: any = $('#sidebar');
    let mainContainer: any = $('.main-container');
    sidebar.toggleClass('sidebar-left-zero');
    mainContainer.toggleClass('main-container-ml-zero');
  }
}
