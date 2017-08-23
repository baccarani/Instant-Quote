import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormGroup, FormArray, FormBuilder, Validators, FormControl} from '@angular/forms';
import {MovingDirection, WizardComponent} from 'ng2-archwizard';
import {SharedService, Quest, VehicleInfo, Constants} from '../../shared/index';
import {InitialEligibilityComponent} from './initial-eligibility/index'
import {FleetEntryComponent} from './fleet-entry/index'
import {UnderlyingPoliciesComponent} from './underlying-policies/index'
import {PricingIndicationComponent} from './pricing-indication/index'
import {FormSelectionComponent} from './form-selection/index'
import {SubjectivitiesTermsComponent} from './subjectivities-terms/index'
import {AdditionalDetailsComponent} from './additional-details/index'

import {QuestService} from './index'
import {Modal} from 'angular2-modal/plugins/bootstrap';
/**
*  This class represents the QuestComponent.
*/

@Component({
  selector: 'app-quest',
  templateUrl: 'quest.component.html',
  styleUrls: ['quest.component.css']
})

export class QuestComponent implements OnInit {
  private questForm: FormGroup;
  private quest: Quest

  @ViewChild(InitialEligibilityComponent)
  private initialEligibilityComponent: InitialEligibilityComponent;

  @ViewChild(FleetEntryComponent)
  private fleetEntryComponent: FleetEntryComponent;

  @ViewChild(UnderlyingPoliciesComponent)
  private underlyingPolciyComponent: UnderlyingPoliciesComponent;

  @ViewChild(PricingIndicationComponent)
  private pricingIndicationcomponent: PricingIndicationComponent;

  @ViewChild(FormSelectionComponent)
  private formSelectionComponent: FormSelectionComponent;

  @ViewChild(SubjectivitiesTermsComponent)
  private subjectivitiesTermsComponent: SubjectivitiesTermsComponent;

  @ViewChild(AdditionalDetailsComponent)
  private additionalDetailsComponent: AdditionalDetailsComponent;


  constructor(private questBuilder: FormBuilder, private sharedService: SharedService, private questService: QuestService, private modal: Modal, private cd: ChangeDetectorRef) {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest
    })
  }

  ngOnInit() {
    this.questForm = this.questBuilder.group({

      ieGroup: this.questBuilder.group({
        'dot': [null, Validators.required],
        'info': [null],
        'effDate': [null, Validators.required],
        'expDate': [null, Validators.required],
        'safetyRating': [null, Validators.required],
        'passengerInd': [null],
        'yearInBus': [null, Validators.required],
        'isDrivingExperience': [null],
        'truckersOnly': [null],
        'isSrvcProvdOrCommodHauled': [null, [Validators.required, Validators.pattern('N')]],
        'isUnschdVehicle': [null, [Validators.required, Validators.pattern('N')]],
        'primaryAL': [null, Validators.requiredTrue],
        'primaryGL': [null],
        'primaryEL': [null],
      }),
      feGroup: this.questBuilder.group({
        'vehicleInfos': this.questBuilder.array([
        ])
      }),
      upGroup: this.questBuilder.group({
        'limitAL': [null, [Validators.required, Validators.max(Constants.LIMIT_UPPER_AL), Validators.min(Constants.LIMIT_LOWER_AL)]],
        'premiumAL': [null, Validators.required],
        'numYrsLossRunsAL': [null, Validators.required],
        'numClaimsAL': [null, [Validators.required, Validators.max(2)]],
        'totIncurredLossesAL': [null],
        'largeLossesAL': [null],
        'limitGL': [null],
        'premiumGL': [null],
        'numYrsLossRunsGL': [null],
        'numClaimsGL': [null],
        'totIncurredLossesGL': [null],
        'largeLossesGL': [null],
        'limitEL': [null],
        'incurredLossesAL': this.questBuilder.array([
        ]),
        'incurredLossesGL': this.questBuilder.array([
        ])
      }),
      piGroup: this.questBuilder.group({
        'excessLimits': this.questBuilder.array([
        ], Validators.required),
        'riskPremiumCustom': [null, Validators.required],
        'riskPercent': [null, Validators.required],
        'triaPremium': [null, Validators.required],
        'triaPercent': [null, Validators.required],
        'insurerProcessingFee': [null, Validators.required],
        'totalInsrPrmFees': [null, Validators.required],
        'premiumBasis': [null, Validators.required],
        'minEarnedAtInception': [null, Validators.required],
        'commission': [null, Validators.required],
        'brokerPolicyFee': [null, Validators.required],
        'surplusLinesTaxesFees': [null, Validators.required],
        'totalPremiumTaxesFees': [null, Validators.required],
      }),
      fsGroup: this.questBuilder.group({
        'forms': this.questBuilder.array([
        ])
      }),
      stGroup: this.questBuilder.group({
        'subjectivities': this.questBuilder.array([
        ]),
        'notes': this.questBuilder.array([
        ])
      }),
      adGroup: this.questBuilder.group({
        'insuranceCompanyAL': [null, Validators.required],
        'policyNumberAL': [null, Validators.required],
        'effDateAL': [null, Validators.required],
        'expDateAL': [null, Validators.required],
        'insuranceCompanyGL': [null],
        'policyNumberGL': [null],
        'effDateGL': [null],
        'expDateGL': [null],
        'coverage': [null],
        'defenseCosts': [null],
        'insuranceCompanyEL': [null],
        'policyNumberEL': [null],
        'effDateEL': [null],
        'expDateEL': [null],

        'scheduledAL': this.questBuilder.array([
        ]),
        'scheduledGL': this.questBuilder.array([
        ]),
        'scheduledEL': this.questBuilder.array([
        ]),
        'applicantName': [null],
        'address': [null]
      }),
    });
  }

  /**
   * This method will be used to reset the form.
   *
   * @memberof QuestComponent
   */
  resetForm() {
    this.questForm.reset({ieGroup: {primaryAL: true}})
    this.quest = new Quest()
    this.quest.initialEligibility.primaryAL = true
    this.quest.underlyingPolicies.primaryAutoLiability.limit = Constants.LIMIT_LOWER_AL
    this.fleetEntryComponent.createVehicleInfo()
    this.pricingIndicationcomponent.createFinalPricings()
  }


  publishQuestChanges(movingDirection: MovingDirection, componentName: string) {
    let quest: Quest = null;
    switch (componentName) {
      case 'IE':
        quest = this.initialEligibilityComponent.quest
        break;
      case 'FE':
        quest = this.fleetEntryComponent.quest
        break;
      case 'UP':
        quest = this.underlyingPolciyComponent.quest
        if (movingDirection === MovingDirection.Forwards) {
          // if moving from Underlying to Pricing, then get the quote
          // this.underlyingPolciyComponent.generateQuote()
        }
        break;
      case 'PI':
        quest = this.pricingIndicationcomponent.quest
        break;
      case 'FS':
        quest = this.formSelectionComponent.quest
        break;
      case 'AD':
        quest = this.additionalDetailsComponent.quest
        break;

    }
    this.sharedService.updateQuestObject(quest)
  }

  generateQuote(wizard: WizardComponent) {
    this.underlyingPolciyComponent.wizard = wizard
    this.underlyingPolciyComponent.generateQuote()
  }


}
