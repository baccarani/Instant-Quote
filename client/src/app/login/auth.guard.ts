import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Auth, LoginService} from './index'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('auth')) {
      // logged in so return true
      let auth: Auth = JSON.parse(localStorage.getItem('auth'))
      if (auth && auth.isLoggedIn) {
        return true;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate([''], {});
    return false;
  }
}
