import {Injectable, Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {Quest} from './index';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {Subject, BehaviorSubject} from 'rxjs';

@Injectable()
export class SharedService {

  private sharedQuest = new BehaviorSubject<Quest>(new Quest());
  sharedQuestObservable = this.sharedQuest.asObservable();
  private staticDataURL = 'http://' + environment.nodejs_server + ':' + environment.nodejs_port + '/loadStaticData';

  APP_ERROR_MESSAGE = 'Error !!'
  SERVER_ERROR_MESSAGE = 'Server Error !!'
  ERROR_HEADER_CLASS = 'alert alert-danger'
  DATE_FORMAT = 'MM/DD/YYYY'
  PRICING_MESSAGE = 'Excess Risk Premium'
  PRICING_MESSAGE_CLASS = 'card-header card'

  constructor(private http: Http) {}

  updateQuestObject(quest: Quest) {
    this.sharedQuest.next(quest)
  }


  getStaticData(): Observable<any> {
    // Stringify payload
    const bodyString = JSON.stringify({});
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({'headers': headers});
    return this.http.post(this.staticDataURL, bodyString, options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  extractData(res: Response) {
    let body = JSON.parse(res.json());
    return body || {};
  }

  handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      if (error.status === 0) {
        errMsg = `Problem connecting to Server. Please contact IT Support.`;
      } else {
        errMsg = `Status : ${error.status}<br>Message : ${error.statusText || ''} ${err}`;
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }



  onErrorPopUp(modal: Modal, message: string, headerTitle: string) {
    modal.alert()
      .size('lg')
      .showClose(true)
      .isBlocking(true)
      .headerClass(this.ERROR_HEADER_CLASS)
      .title(headerTitle)
      .body('<strong>' + message + '<strong>')
      .open();
  }

  onPricingPopUp(modal: Modal, message: string, headerTitle: string) {
    modal.alert()
      .size('lg')
      .showClose(true)
      .isBlocking(true)
      .headerClass(this.PRICING_MESSAGE_CLASS)
      .title(headerTitle)
      .body('<strong>' + message + '<strong>')
      .open();
  }
}
