import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { SharedService, PricingIndication, Quest, FinalPricing, Constants, AdditionalTerms, AdditionalCharges } from '../../../shared/index';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-pricing-indication',
  templateUrl: './pricing-indication.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class PricingIndicationComponent implements OnInit, AfterViewChecked, AfterContentChecked {

  @Input('pricingFormGroup')
  public pricingFormGroup: FormGroup;

  quest: Quest

  /************** Flag to show/hide other fields **************/
  hideAdditionalPricing = true;
  /*********** End of Flag to show/hide other fields **********/


  /************** Error messages and their flags **************/
  hideRiskPremiumErr = true;
  minRiskPremiumErrorMsg = '';
  /************** End of Error messages and their flags *******/


  constructor(private translate: TranslateService, private sharedService: SharedService, private pricingFormBuilder: FormBuilder, private modal: Modal, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest

      if (this.quest.pricingIndication.selectedPremium == null) {
        this.quest.pricingIndication.additionalTerms = new AdditionalTerms()
        this.quest.pricingIndication.additionalCharges = new AdditionalCharges()
        this.setDefaultValues()
        this.hideAdditionalPricing = true
      }
      this.quest.pricingIndication.showPopup = false
    })
    this.createFinalPricings()
    this.setDefaultValues()
    this.subscribeFormControls()
    this.createRiskPremiumValidator()
  }

  subscribeFormControls() {
    this.subscribeRiskPremium()
    this.subscribeBrokerPolicyFee()
    this.subscribeSurplusLinesTaxesFees()
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  isFormValid(): boolean {
    return (!(this.hideRiskPremiumErr))
      || (!this.pricingFormGroup.controls['brokerPolicyFee'].valid && this.pricingFormGroup.controls['brokerPolicyFee'].dirty)
      || (!this.pricingFormGroup.controls['surplusLinesTaxesFees'].valid && this.pricingFormGroup.controls['surplusLinesTaxesFees'].dirty)
  }

  // Sets the Panel Class
  setClassPanel(valid, header) {
    let classBase = ''
    let classBorderBase = 'card card-inverse mb-3'
    let classHeaderBase = 'card-header'
    let classStandard = 'card-primary'
    let classSuccess = 'card-success'
    let classError = 'card-danger'
    if (header) {
      classBase = classHeaderBase
    } else {
      classBase = classBorderBase
    }
    if (valid) {
      return classBase + ' ' + classSuccess
    } else {
      if (this.isFormValid()) {
        return classBase + ' ' + classError
      } else {
        return classBase + ' ' + classStandard
      }
    }
  }

  publishUpdatedQuest() {
    this.sharedService.updateQuestObject(this.quest)
  }

  createFinalPricings() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.pricingIndication.pricing = data['excessLimits']

          const control = <FormArray>this.pricingFormGroup.controls['excessLimits'];

          // reset the form control before create new controls
          control.controls = []

          for (let excessLimitObj of this.quest.pricingIndication.pricing) {
            control.push(this.pricingFormBuilder.group({
              excessLimit: [excessLimitObj.excessLimit],
              riskPremium: [excessLimitObj.riskPremium],
              value: [excessLimitObj.value],
              selectedPremium: [],
            }))
          }

          this.subscribeExcessLimits()
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  createFinalPricingsForGivenData(finalPricing: FinalPricing[]) {
    this.quest.pricingIndication.pricing = finalPricing
    const control = <FormArray>this.pricingFormGroup.controls['excessLimits'];

    // remove existing controls
    control.controls = []

    for (let excessLimitObj of this.quest.pricingIndication.pricing) {
      control.push(this.pricingFormBuilder.group({
        excessLimit: [excessLimitObj.excessLimit],
        riskPremium: [excessLimitObj.riskPremium],
        value: [excessLimitObj.value],
        selectedPremium: []
      }))

      this.subscribeExcessLimits()
    }
  }

  setDefaultValues() {
    this.quest.pricingIndication.premium.triaPercent = Constants.TRIA_PERCENT
    this.quest.pricingIndication.premium.insurerProcessingFee = Constants.INSURED_PROCESSING_FEE
    this.quest.pricingIndication.additionalTerms.minEarnedAtInception = Constants.MIN_EARNED_AT_INCEPTION
    this.quest.pricingIndication.additionalTerms.commission = Constants.COMMISSION
    this.quest.pricingIndication.additionalTerms.premiumBasis = Constants.PREMIUM_BASIS
  }

  subscribeExcessLimits() {
    this.pricingFormGroup.controls['excessLimits'].valueChanges.subscribe((value) => {
      let excessLimits: FinalPricing[] = value;
      excessLimits.forEach((finalPricing, index) => {
        if (this.quest.pricingIndication.selectedPremium != null && Number(this.quest.pricingIndication.selectedPremium) === Number(index)) {
          this.quest.pricingIndication.premium.riskPremium = excessLimits[index].riskPremium
          this.hideAdditionalPricing = false
        }
      });
    })
  }

  subscribeRiskPremium() {
    this.pricingFormGroup.controls['riskPremiumCustom'].valueChanges.subscribe((value) => {
      let calculateOtherPrices = true

      // TRIA % will be 0 if only Primary AL applies
      if (this.quest.initialEligibility.primaryAL && !this.quest.initialEligibility.primaryGL && !this.quest.initialEligibility.primaryEL) {
        this.quest.pricingIndication.premium.triaPercent = 0
      } else {
        this.quest.pricingIndication.premium.triaPercent = Constants.TRIA_PERCENT;
      }

      this.quest.pricingIndication.premium.triaPremium = null;
      this.quest.pricingIndication.premium.totalInsrPrmFees = null;
      this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = null;

      if (this.quest.pricingIndication.selectedPremium != null && this.validateRiskPremium()) {
        this.hideRiskPremiumErr = true
      } else if (this.quest.pricingIndication.selectedPremium != null) {
        // Do this only when one of the premiums is selected and the validation returns error
        calculateOtherPrices = false
        this.hideRiskPremiumErr = false
        let selectedPremium: number = this.quest.pricingIndication.selectedPremium
        let minAllowed: number = (Math.floor(this.quest.pricingIndication.pricing[selectedPremium].riskPremium * 0.9) >= (Number (selectedPremium) === 0 ? Constants.RISK_PREMIUM_1MIL_MIN : Constants.RISK_PREMIUM_2MIL_MIN))
          ? Math.round(this.quest.pricingIndication.pricing[selectedPremium].riskPremium * 0.9) : (Number (selectedPremium) === 0 ? Constants.RISK_PREMIUM_1MIL_MIN : Constants.RISK_PREMIUM_2MIL_MIN)

        this.minRiskPremiumErrorMsg = this.translate.instant('error.ineligible.judgementMod', { MIN_RISK_PREMIUM: minAllowed })
        this.quest.pricingIndication.premium.triaPercent = null;
      }

      if (calculateOtherPrices) {
        this.quest.pricingIndication.premium.triaPremium = Math.round(this.quest.pricingIndication.premium.riskPremium * (this.quest.pricingIndication.premium.triaPercent / 100))
        this.quest.pricingIndication.premium.totalInsrPrmFees = this.quest.pricingIndication.premium.riskPremium + this.quest.pricingIndication.premium.triaPremium + this.quest.pricingIndication.premium.insurerProcessingFee
        this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = this.quest.pricingIndication.premium.totalInsrPrmFees +
          (this.quest.pricingIndication.additionalCharges.brokerPolicyFee != null ? this.quest.pricingIndication.additionalCharges.brokerPolicyFee : 0) +
          (this.quest.pricingIndication.additionalCharges.surplusLinesTaxesFees != null ? this.quest.pricingIndication.additionalCharges.surplusLinesTaxesFees : 0)
      }

    })
  }

  subscribeBrokerPolicyFee() {
    this.pricingFormGroup.controls['brokerPolicyFee'].valueChanges.subscribe((value) => {

      this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = null;

      this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = this.quest.pricingIndication.premium.totalInsrPrmFees + value +
        (this.quest.pricingIndication.additionalCharges.surplusLinesTaxesFees != null ? this.quest.pricingIndication.additionalCharges.surplusLinesTaxesFees : 0)

    })
  }

  subscribeSurplusLinesTaxesFees() {
    this.pricingFormGroup.controls['surplusLinesTaxesFees'].valueChanges.subscribe((value) => {

      this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = null;

      this.quest.pricingIndication.additionalCharges.totalPremiumTaxesFees = this.quest.pricingIndication.premium.totalInsrPrmFees + value +
        (this.quest.pricingIndication.additionalCharges.brokerPolicyFee != null ? this.quest.pricingIndication.additionalCharges.brokerPolicyFee : 0)

    })
  }

  createRiskPremiumValidator() {
    this.pricingFormGroup.controls['riskPremiumCustom'].setValidators([Validators.required, this.riskPremiumValidator()])
  }

  validateRiskPremium(): boolean {
    let selectedPremiumMin: number = null
    let breakLoop = false
    this.quest.pricingIndication.pricing.forEach(finalPricing => {
      if (!breakLoop) {
        if (this.quest.pricingIndication.selectedPremium != null && Number(finalPricing.value) === Number(this.quest.pricingIndication.selectedPremium)) {
          this.quest.pricingIndication.premium.riskPercent = Math.floor((this.quest.pricingIndication.premium.riskPremium / finalPricing.riskPremium) * 100)
          if (Number(this.quest.pricingIndication.selectedPremium) === 0) {
            selectedPremiumMin = Constants.RISK_PREMIUM_1MIL_MIN
          } else if (Number(this.quest.pricingIndication.selectedPremium) === 1) {
            selectedPremiumMin = Constants.RISK_PREMIUM_2MIL_MIN
          }
          breakLoop = true
        } else {
          // Premium is not yet selected
          return false
        }
      }
    })
    return !(this.quest.pricingIndication.premium.riskPercent < Constants.RISK_PERCENT_MIN || this.quest.pricingIndication.premium.riskPremium < selectedPremiumMin)
  }

  riskPremiumValidator(): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      return this.validateRiskPremium() ? null : {
        'riskPremiumCustom': {
          valid: false
        }
      }
    };
  }
}
