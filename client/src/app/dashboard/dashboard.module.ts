import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Ng2BootstrapModule} from 'ng2-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HomeModule} from './home/index';
import {QuestModule} from './quest/index';

import {DashboardComponent} from './index';
import {TopNavComponent} from '../shared/index';
import {SidebarComponent} from '../shared/index';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2BootstrapModule.forRoot(),
    HomeModule,
    QuestModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [DashboardComponent, TopNavComponent, SidebarComponent],
  exports: [DashboardComponent, TopNavComponent, SidebarComponent]
})

export class DashboardModule {}

