import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../environments/environment';
import { SharedService, Quest } from '../../../shared/index';
import { User } from '../../../login/user';

@Injectable()
export class InitialEligibilityService {

  private serverUrl = 'http://' + environment.nodejs_server + ':' + environment.nodejs_port;

  constructor(private http: Http, private sharedService: SharedService) { }

  getDOTData(dotNum: number, user: User): Observable<any> {
    // Stringify payload
    const bodyString = JSON.stringify({ 'dotNum': dotNum}); /* , 'userID': user.userID  */
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ 'headers': headers });
    return this.http.post(this.serverUrl + '/getDOTData', bodyString, options)
      .map(this.sharedService.extractData)
      .catch(this.sharedService.handleError);
  }

}

