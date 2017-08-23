import {Component, OnInit} from '@angular/core';
import {User} from './user';
import {Auth} from './auth';
import {LoginService} from './index';
import {SharedService} from '../shared/shared.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {Quest} from '../shared/quest';

/**
*  This class represents the LoginComponent.
*/

@Component({
  selector: 'app-login-cmp',
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  public auth: Auth = new Auth();
  public errorMsg = '';
  public hideErr = true;
  private quest: Quest = null;

  private userPlaceHolder: string;
  private pwdPlaceHolder: string;
  private hideLoader = true;

  constructor(private loginService: LoginService, private router: Router, private translate: TranslateService, private sharedService: SharedService, private modal: Modal) {
  }

  onSubmit() {
    this.errorMsg = null
    this.hideErr = true
    this.hideLoader = false
    this.loginService.authenticate(this.auth).subscribe(
      (data) => {
        this.hideLoader = true
        if (data['error']) {
          localStorage.setItem('auth', null)
          this.auth = new Auth()
          this.errorMsg = data['error']
          this.hideErr = false
        } else {
          this.auth = data
          this.auth.isLoggedIn = true;
          localStorage.setItem('auth', JSON.stringify(this.auth))
          this.quest.user = this.auth.user
          this.sharedService.updateQuestObject(this.quest)
          this.router.navigate(['/dashboard/home']);
        }
      },
      (error) => {
        localStorage.setItem('auth', null)
        this.auth = new Auth()
        this.hideLoader = true
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  ngOnInit() {
    this.loadStaticFieldValue()
    this.sharedService.sharedQuestObservable.subscribe((quest)=>{
      this.quest = quest
    })
  }


  loadStaticFieldValue() {
    this.translate.get('login.userPlaceHolder').subscribe((data) => {
      this.userPlaceHolder = data
    })

    this.translate.get('login.pwdPlaceHolder').subscribe((data) => {
      this.pwdPlaceHolder = data
    })
  }
}
