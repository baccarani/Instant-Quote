import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {InitialEligibilityComponent} from './initial-eligibility.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import 'rxjs/add/observable/throw';
import {AppTranslationModule} from '../../../translation.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MyDatePickerModule} from 'mydatepicker';
import {InitialEligibilityService} from './index'

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@NgModule({
  imports: [RouterModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule, BrowserModule, AppTranslationModule, MyDatePickerModule],
  declarations: [InitialEligibilityComponent],
  exports: [InitialEligibilityComponent],
  providers: [InitialEligibilityService]
})

export class InitialEligibilityModule {}
