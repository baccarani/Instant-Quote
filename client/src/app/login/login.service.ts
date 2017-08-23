import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {SharedService} from '../shared/shared.service';
import {Auth} from './auth';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Injectable()
export class LoginService {
  private loginUrl = 'http://' + environment.nodejs_server + ':' + environment.nodejs_port + '/login';

  constructor(private http: Http, private sharedService: SharedService) {
  }

  authenticate(auth: Auth): Observable<Auth> {
    // Stringify payload
    let bodyString = JSON.stringify(auth);
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.loginUrl, bodyString, options)
      .map(this.sharedService.extractData)
      .catch(this.sharedService.handleError);
  }
}
