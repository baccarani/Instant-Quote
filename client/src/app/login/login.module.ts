import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LoginComponent, LoginService, AuthGuard} from './index';

import {AppTranslationModule} from '../translation.module';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, AppTranslationModule],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})

export class LoginModule {}
