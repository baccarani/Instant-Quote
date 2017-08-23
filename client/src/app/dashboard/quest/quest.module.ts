import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Ng2BootstrapModule} from 'ng2-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {InitialEligibilityModule} from './initial-eligibility/index';
import {FleetEntryModule} from './fleet-entry/index';
import {UnderlyingPoliciesModule} from './underlying-policies/index';
import {PricingIndicationModule} from './pricing-indication/index';
import {FormSelectionModule} from './form-selection/index';
import {SubjectivitiesTermsModule} from './subjectivities-terms/index';
import {AdditionalDetailsModule} from './additional-details/index';
import {AppTranslationModule} from '../../translation.module';
import {WizardModule} from 'ng2-archwizard';

import {QuestComponent, QuestService} from './index';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    Ng2BootstrapModule.forRoot(),
    InitialEligibilityModule,
    FleetEntryModule,
    UnderlyingPoliciesModule,
    PricingIndicationModule,
    FormSelectionModule,
    SubjectivitiesTermsModule,
    AdditionalDetailsModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    WizardModule

  ],
  providers: [QuestService],
  declarations: [QuestComponent],
  exports: [QuestComponent]
})

export class QuestModule {}
