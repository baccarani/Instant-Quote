import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {AppTranslationModule} from '../../translation.module';
import {HttpModule} from '@angular/http';
import 'rxjs/add/observable/throw';


// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@NgModule({
  imports: [RouterModule, AppTranslationModule],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})

export class HomeModule {}

