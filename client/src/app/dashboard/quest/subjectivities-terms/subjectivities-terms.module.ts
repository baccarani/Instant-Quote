import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SubjectivitiesTermsComponent} from './subjectivities-terms.component';
import {AppTranslationModule} from '../../../translation.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import 'rxjs/add/observable/throw';
import {CurrencyMaskModule} from 'ng2-currency-mask';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@NgModule({
  imports: [RouterModule, FormsModule, ReactiveFormsModule, BrowserModule, AppTranslationModule, CurrencyMaskModule],
  declarations: [SubjectivitiesTermsComponent],
  exports: [SubjectivitiesTermsComponent]
})

export class SubjectivitiesTermsModule {}

