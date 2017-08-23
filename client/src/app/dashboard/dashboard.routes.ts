import {Route} from '@angular/router';

import {QuestRoutes} from './quest/index';
import {HomeRoutes} from './home/index';
import {AuthGuard} from '../login/index'

import {DashboardComponent} from './index';

export const DashboardRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      ...QuestRoutes,
      ...HomeRoutes,
    ]
  }
];
