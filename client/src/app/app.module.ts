import {BrowserModule} from '@angular/platform-browser';
import {NgModule, enableProdMode} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {SignupModule} from './signup/signup.module';
import {DashboardModule} from './dashboard/index';
import {AppTranslationModule} from './translation.module';
import {SharedService} from './shared/index';
import {LoginService, LoginModule, AuthGuard} from './login/index';
import {ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay} from 'angular2-modal';
import {Modal, BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {environment} from '../environments/environment';

import {NgxTypeaheadModule} from 'ngx-typeahead';


if (environment.production) {
  enableProdMode()
}

const MODAL_PROVIDERS = [
  Modal,
  Overlay,
  {provide: OverlayRenderer, useClass: DOMOverlayRenderer}
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    LoginModule,
    SignupModule,
    DashboardModule,
    ReactiveFormsModule,
    AppTranslationModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    NgxTypeaheadModule
  ],
  providers: [SharedService, LoginService, AuthGuard, MODAL_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {}
