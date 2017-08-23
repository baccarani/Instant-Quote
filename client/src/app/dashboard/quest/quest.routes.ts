import {Route} from '@angular/router';

import {FleetEntryRoutes} from './fleet-entry/index';
import {UnderlyingPoliciesRoutes} from './underlying-policies/index';
import {PricingIndicationRoutes} from './pricing-indication/index';
import {InitialEligibilityRoutes} from './initial-eligibility/index';
import {AdditionalDetailsRoutes} from './additional-details/index';
import {SubjectivitiesTermsRoutes} from './subjectivities-terms/index';
import {FormSelectionRoutes} from './form-selection/index';

import {QuestComponent} from './index';

export const QuestRoutes: Route[] = [
  {
    path: 'quest',
    component: QuestComponent,
    children: [
      ...FleetEntryRoutes,
      ...UnderlyingPoliciesRoutes,
      ...PricingIndicationRoutes,
      ...InitialEligibilityRoutes,
      ...FormSelectionRoutes,
      ...SubjectivitiesTermsRoutes,
      ...AdditionalDetailsRoutes,
    ]
  }
];
