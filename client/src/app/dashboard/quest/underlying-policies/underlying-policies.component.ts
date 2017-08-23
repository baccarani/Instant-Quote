import { QuestService } from '../index';
import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, AfterContentChecked, AfterViewChecked, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { SharedService, UnderlyingPolicies, LiabilityInfo, Quest, IncurredLoss, Constants } from '../../../shared/index';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { WizardComponent } from 'ng2-archwizard';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-underlying-policies',
  templateUrl: 'underlying-policies.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class UnderlyingPoliciesComponent implements OnInit, AfterViewChecked, AfterViewInit, AfterContentChecked {
  /************** Inputs the Form Group and Quest **************/
  @Input('underlyingFormGroup')
  public underlyingFormGroup: FormGroup;

  quest: Quest;
  /*********** End of Inputs the Form Group and Quest ***********/


  /************** Error messages and their flags **************/
  hideLimitALErr = true;
  hideLimitGLErr = true;
  hideTotIncdLossesALErr = true;
  hideTotIncdLossesGLErr = true;
  hideLargeLossesALErr = true;
  hideLargeLossesGLErr = true;
  hideLargeIncdLossesALErr = true;
  hideLargeIncdLossesGLErr = true;
  hideLimitELErr = true;
  hideNumYrsLossRunsALErr = true;
  hideNumYrsLossRunsGLErr = true;
  hideMaxNoOfClaimsALErr = true;
  hideMaxNoOfClaimsGLErr = true;
  hideNumOfClaimsFrequencyALErr = true;
  hideNumOfClaimsFrequencyGLErr = true;
  hideTotalInrdLossSection = true;
  hideLoader = true;
  /************** End of Error messages and their flags *******/


  /*************** Static field value *************************/
  saferSysURL = null;
  smallFleetSolnURL = null;
  /*************** End of Static field value ******************/


  /************** Flag to show/hide other fields **************/
  hideALTotIncdAndLargeLosses = true;
  hideGLTotIncdAndLargeLosses = true;
  hideLargeLossesAL = true;
  hideLargeLossesGL = true;
  hideIncdLargeLossesAL = true;
  hideIncdLargeLossesGL = true;
  /*********** End of Flag to show/hide other fields **********/

  /******************* Dynamic Error Messages **************/
  noOfYearsLossRunALErrMsg = ''
  noOfYearsLossRunGLErrMsg = ''
  noOfClaimsALErrMsg = ''
  noOfClaimsGLErrMsg = ''
  largeLossesALMaxErrMsg = ''
  largeLossesGLMaxErrMsg = ''
  limitALErrorMsg = ''
  limitGLErrorMsg = ''
  limitELErrorMsg = ''
  totIncurredLossALErrMsg = ''
  totIncurredLossGLErrMsg = ''
  /************** End of  Dynamic Error Messages **********/

  incrLossListSubscr: Subscription = null
  wizard: WizardComponent = null


  constructor(private translate: TranslateService,
    private sharedService: SharedService,
    private questService: QuestService,
    private _fb: FormBuilder,
    private modal: Modal,
    private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.updateLocalQuest(quest)
    })
    this.loadStaticFieldValue()
    this.subscribeFormControls()
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewInit() {

  }

  publishUpdatedQuest() {
    this.sharedService.updateQuestObject(this.quest)
  }

  updateLocalQuest(quest: Quest) {
    quest.underlyingPolicies.primaryAutoLiability.limit = quest.underlyingPolicies.primaryAutoLiability.limit != null ? quest.underlyingPolicies.primaryAutoLiability.limit : Constants.LIMIT_LOWER_AL
    quest.underlyingPolicies.primaryGeneralLiability.limit = quest.underlyingPolicies.primaryGeneralLiability.limit != null ? quest.underlyingPolicies.primaryGeneralLiability.limit : Constants.LIMIT_LOWER_GL
    quest.underlyingPolicies.primaryEmployersLiability.limit = quest.underlyingPolicies.primaryEmployersLiability.limit != null ? quest.underlyingPolicies.primaryEmployersLiability.limit : Constants.LIMIT_LOWER_EL
    this.quest = quest;

    this.setPrimaryALValidations()
    this.setPrimaryGLValidations()
    this.setPrimaryELValidations()

    let isValidNoOfClaimsAL = true
    let isValidNoYearLossRunAL = true
    let isValidLargeLossesAL = true

    let isValidNoOfClaimsGL = true
    let isValidNoYearLossRunGL = true
    let isValidLargeLossesGL = true

    if (this.quest.initialEligibility.primaryAL) {
      isValidNoOfClaimsAL = this.validateNoOfClaims('numClaimsAL')
      isValidNoYearLossRunAL = this.validateNoOfYearLossRun(this.quest.underlyingPolicies.primaryAutoLiability.noOfYearsOfLossRuns, 'numYrsLossRunsAL')
      this.validateTotalIncurredLosses(this.quest.underlyingPolicies.primaryAutoLiability.totalIncurredLosses, 'totIncurredLossesAL')
      isValidLargeLossesAL = this.validateLargeLosses(this.quest.underlyingPolicies.primaryAutoLiability.largeLosses, 'largeLossesAL')

      // this.handleHideLargeLossesAndIncrdLargeLosses('largeLossesAL')

      if (!isValidNoYearLossRunAL) {
        this.hideALTotIncdAndLargeLosses = true
      } else {
        this.hideALTotIncdAndLargeLosses = Number(this.quest.underlyingPolicies.primaryAutoLiability.noOfClaims) === 0 ? true : !isValidNoOfClaimsAL
      }

      if (Number(this.quest.underlyingPolicies.primaryAutoLiability.noOfClaims) === 0) {
        this.quest.underlyingPolicies.primaryAutoLiability.totalIncurredLosses = null
        this.quest.underlyingPolicies.primaryAutoLiability.largeLosses = null
        this.quest.underlyingPolicies.primaryAutoLiability.incurredLosses = []
      }

      if (!this.hideALTotIncdAndLargeLosses) {
        this.totalIncurredLossesValidators('incurredLossesAL', false)
        if (isValidLargeLossesAL) {
          this.hideIncdLargeLossesAL = false
          this.createIncuredLossesListFromGivenData('incurredLossesAL', this.quest.underlyingPolicies.primaryAutoLiability.largeLosses)
        } else {
          this.hideIncdLargeLossesAL = true
        }
      } else {
        this.hideIncdLargeLossesAL = true
        let control: FormArray = <FormArray>this.underlyingFormGroup.controls['incurredLossesAL'];
        control.controls = []
        this.totalIncurredLossesValidators('incurredLossesAL', true)
        this.largeLossesValidators('incurredLossesAL', true)
        this.underlyingFormGroup.controls['incurredLossesAL'].clearValidators()
        this.underlyingFormGroup.controls['incurredLossesAL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      }
    }

    if (this.quest.initialEligibility.primaryGL) {
      isValidNoOfClaimsGL = this.validateNoOfClaims('numClaimsGL')
      isValidNoYearLossRunGL = this.validateNoOfYearLossRun(this.quest.underlyingPolicies.primaryGeneralLiability.noOfYearsOfLossRuns, 'numYrsLossRunsGL')
      this.validateTotalIncurredLosses(this.quest.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses, 'totIncurredLossesGL')
      isValidLargeLossesGL = this.validateLargeLosses(this.quest.underlyingPolicies.primaryGeneralLiability.largeLosses, 'largeLossesGL')

      // this.handleHideLargeLossesAndIncrdLargeLosses('largeLossesGL')

      if (!isValidNoYearLossRunGL) {
        this.hideGLTotIncdAndLargeLosses = true
      } else {
        this.hideGLTotIncdAndLargeLosses = Number(this.quest.underlyingPolicies.primaryGeneralLiability.noOfClaims) === 0 ? true : !isValidNoOfClaimsGL
      }

      if (Number(this.quest.underlyingPolicies.primaryGeneralLiability.noOfClaims) === 0) {
        this.quest.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses = null
        this.quest.underlyingPolicies.primaryGeneralLiability.largeLosses = null
        this.quest.underlyingPolicies.primaryGeneralLiability.incurredLosses = []
      }

      if (!this.hideGLTotIncdAndLargeLosses) {
        this.totalIncurredLossesValidators('incurredLossesGL', false)
        if (isValidLargeLossesGL) {
          this.createIncuredLossesListFromGivenData('incurredLossesGL', this.quest.underlyingPolicies.primaryGeneralLiability.largeLosses)
          this.hideIncdLargeLossesGL = false
        } else {
          this.hideIncdLargeLossesGL = true
        }
      } else {
        this.hideIncdLargeLossesGL = true
        let control: FormArray = <FormArray>this.underlyingFormGroup.controls['incurredLossesGL'];
        control.controls = []
        this.totalIncurredLossesValidators('incurredLossesGL', true)
        this.largeLossesValidators('incurredLossesGL', true)
        this.underlyingFormGroup.controls['incurredLossesGL'].clearValidators()
        this.underlyingFormGroup.controls['incurredLossesGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      }
    }
  }

  // Loads Static Url values
  loadStaticFieldValue() {
    this.translate.get('common.saferSysURL').subscribe((data) => {
      this.saferSysURL = data
    })

    this.translate.get('common.smallFleetSolnURL').subscribe((data) => {
      this.smallFleetSolnURL = data
    })
  }

  subscribeFormControls() {
    this.subscribeLimitAL()
    this.subscribePremiumAL()
    this.subscribeNumYrsLossRunsAL()
    this.subscribeNumClaimsAL()
    this.subscribeTotIncurredLossesAL()
    this.subscribeLargeLossesAL()
    this.subscribeLimitGL()
    this.subscribePremiumGL()
    this.subscribeNumYrsLossRunsGL()
    this.subscribeNumClaimsGL()
    this.subscribeTotIncurredLossesGL()
    this.subscribeLargeLossesGL()
    this.subscribeLimitEL()
  }


  isFormValid(): boolean {
    return ((!this.underlyingFormGroup.controls['numYrsLossRunsAL'].valid && this.underlyingFormGroup.controls['numYrsLossRunsAL'].dirty)
      || (!this.underlyingFormGroup.controls['numClaimsAL'].valid && this.underlyingFormGroup.controls['numClaimsAL'].dirty)
      || (!this.underlyingFormGroup.controls['largeLossesAL'].valid && this.underlyingFormGroup.controls['largeLossesAL'].dirty)
      || (!this.underlyingFormGroup.controls['totIncurredLossesAL'].valid && this.underlyingFormGroup.controls['totIncurredLossesAL'].dirty)
      || (!this.underlyingFormGroup.controls['largeLossesAL'].valid && this.underlyingFormGroup.controls['largeLossesAL'].dirty)
      || (!this.underlyingFormGroup.controls['incurredLossesAL'].valid && this.underlyingFormGroup.controls['incurredLossesAL'].dirty)
      || (!this.underlyingFormGroup.controls['numYrsLossRunsGL'].valid && this.underlyingFormGroup.controls['numYrsLossRunsGL'].dirty)
      || (!this.underlyingFormGroup.controls['numClaimsGL'].valid && this.underlyingFormGroup.controls['numClaimsGL'].dirty)
      || (!this.underlyingFormGroup.controls['largeLossesGL'].valid && this.underlyingFormGroup.controls['largeLossesGL'].dirty)
      || (!this.underlyingFormGroup.controls['totIncurredLossesGL'].valid && this.underlyingFormGroup.controls['totIncurredLossesGL'].dirty)
      || (!this.underlyingFormGroup.controls['largeLossesGL'].valid && this.underlyingFormGroup.controls['largeLossesGL'].dirty)
      || (!this.underlyingFormGroup.controls['incurredLossesGL'].valid && this.underlyingFormGroup.controls['incurredLossesGL'].dirty)
      || (!(this.hideLimitALErr && this.hideLimitGLErr && this.hideTotIncdLossesALErr && this.hideTotIncdLossesGLErr && this.hideLargeLossesALErr && this.hideLargeLossesGLErr && this.hideLargeIncdLossesALErr && this.hideLargeIncdLossesGLErr && this.hideLimitELErr && this.hideNumYrsLossRunsALErr && this.hideNumYrsLossRunsGLErr
        && this.hideMaxNoOfClaimsALErr && this.hideMaxNoOfClaimsGLErr
        && this.hideNumOfClaimsFrequencyALErr && this.hideNumOfClaimsFrequencyGLErr)))
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

  /*********************************************************** Primary Validations for EL  and GL*****************************************************************************/

  setPrimaryGLValidations() {
    if (this.quest.initialEligibility.primaryGL) {
      this.quest.underlyingPolicies.primaryGeneralLiability.limit = this.quest.underlyingPolicies.primaryGeneralLiability.limit != null ? this.quest.underlyingPolicies.primaryGeneralLiability.limit : Constants.LIMIT_LOWER_GL
      this.underlyingFormGroup.controls['limitGL'].setValidators([Validators.required])
      this.underlyingFormGroup.controls['premiumGL'].setValidators([Validators.required])
      this.underlyingFormGroup.controls['numYrsLossRunsGL'].setValidators([Validators.required])
      this.underlyingFormGroup.controls['numClaimsGL'].setValidators([Validators.required])
    } else {
      this.underlyingFormGroup.controls['limitGL'].clearValidators()
      this.underlyingFormGroup.controls['premiumGL'].clearValidators()
      this.underlyingFormGroup.controls['numYrsLossRunsGL'].clearValidators()
      this.underlyingFormGroup.controls['numClaimsGL'].clearValidators()
    }
    this.underlyingFormGroup.controls['limitGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.underlyingFormGroup.controls['premiumGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.underlyingFormGroup.controls['numYrsLossRunsGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.underlyingFormGroup.controls['numClaimsGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
  }


  // Sets AL Validation
  setPrimaryALValidations() {
    if (this.quest.initialEligibility.primaryAL) {
      this.quest.underlyingPolicies.primaryAutoLiability.limit = this.quest.underlyingPolicies.primaryAutoLiability.limit != null ? this.quest.underlyingPolicies.primaryAutoLiability.limit : Constants.LIMIT_LOWER_AL
    }
  }

  // Sets EL Validation
  setPrimaryELValidations() {
    if (this.quest.initialEligibility.primaryEL) {
      this.quest.underlyingPolicies.primaryEmployersLiability.limit = this.quest.underlyingPolicies.primaryEmployersLiability.limit != null ? this.quest.underlyingPolicies.primaryEmployersLiability.limit : Constants.LIMIT_LOWER_EL
      this.underlyingFormGroup.controls['limitEL'].setValidators([Validators.required, Validators.min(Constants.LIMIT_LOWER_EL)])
    } else {
      this.quest.underlyingPolicies.primaryEmployersLiability.limit = null
      this.underlyingFormGroup.controls['limitEL'].clearValidators()
    }
    this.underlyingFormGroup.controls['limitEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
  }

  /***********************************************************End of Primary Validations for EL  and GL*****************************************************************************/






  /************************************************************** Limit EL *****************************************************************************/

  // Handle EL limit here
  subscribeLimitEL() {
    this.underlyingFormGroup.controls['limitEL'].valueChanges.subscribe((value) => {
      if (value == null || (value != null && value >= Constants.LIMIT_LOWER_EL)) {
        this.limitELErrorMsg = '';
        this.hideLimitELErr = true
      } else {
        this.limitELErrorMsg = this.translate.instant('error.ineligible.limitEL', { LIMIT_LOWER_EL: Constants.LIMIT_LOWER_EL_STR })
        this.hideLimitELErr = false
      }

    })
  }

  /**********************************************************End of Limit EL *****************************************************************************/




  /************************************************************** Limit AL AND GL*****************************************************************************/

  // Handle AL limit here
  subscribeLimitAL() {
    this.underlyingFormGroup.controls['limitAL'].valueChanges.subscribe((value) => {
      if (value == null || (value != null && this.isLimitWithinRange('limitAL'))) {
        this.limitALErrorMsg = ''
        this.hideLimitALErr = true
      } else if (value != null) {
        this.limitALErrorMsg = this.translate.instant('error.ineligible.limit', { LIMIT_LOWER: Constants.LIMIT_LOWER_AL_STR, LIMIT_UPPER: Constants.LIMIT_UPPER_AL_STR })
        this.hideLimitALErr = false
      }
      // Value of limit also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideALTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesAL')
    })
  }

  // /Handle GL limit here
  subscribeLimitGL() {
    this.underlyingFormGroup.controls['limitGL'].valueChanges.subscribe((value) => {
      if (value == null || (value != null && this.isLimitWithinRange('limitGL'))) {
        this.limitGLErrorMsg = ''
        this.hideLimitGLErr = true
      } else if (value != null) {
        this.limitGLErrorMsg = this.translate.instant('error.ineligible.limit', { LIMIT_LOWER: Constants.LIMIT_LOWER_GL_STR, LIMIT_UPPER: Constants.LIMIT_UPPER_GL_STR })
        this.hideLimitGLErr = false
      }
      // Value of limit also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideGLTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesGL')
    })
  }

  // Checks if the limit is between $1,000,000 and $$2,000,000
  isLimitWithinRange(controlName: string): boolean {
    if (controlName === 'limitAL') {
      return (this.quest.underlyingPolicies.primaryAutoLiability.limit >= Constants.LIMIT_LOWER_AL && this.quest.underlyingPolicies.primaryAutoLiability.limit <= Constants.LIMIT_UPPER_AL)

    } else {
      return (this.quest.underlyingPolicies.primaryGeneralLiability.limit >= Constants.LIMIT_LOWER_GL && this.quest.underlyingPolicies.primaryGeneralLiability.limit <= Constants.LIMIT_UPPER_GL)

    }
  }

  /************************************************************End of Limit AL AND GL*****************************************************************************/




  /************************************************************** Premium AL AND GL*****************************************************************************/
  // Handle AL premium here
  subscribePremiumAL() {
    this.underlyingFormGroup.controls['premiumAL'].valueChanges.subscribe((value) => {
      // Value of Premium also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideALTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesAL')
    })
  }

  // Handle GL premium here
  subscribePremiumGL() {
    this.underlyingFormGroup.controls['premiumGL'].valueChanges.subscribe((value) => {
      // Value of Premium also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideGLTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesGL')

    })
  }

  /************************************************************End of Premium AL AND GL*****************************************************************************/




  /************************************************************** Num of Loss Run AL AND GL*****************************************************************************/

  // Handle AL # of Years Loss Runs here
  subscribeNumYrsLossRunsAL() {
    this.underlyingFormGroup.controls['numYrsLossRunsAL'].valueChanges.subscribe((value) => {
      this.validateNoOfYearLossRun(value != null ? (value !== '' ? Number(value) : null) : null, 'numYrsLossRunsAL')
      // Validate no of claims with the new value as it depends on Num of loss run
      this.validateNoOfClaims('numClaimsAL')

      // Value of Years of Loss runs also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideALTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesAL')

    })
  }

  // Handle GL # of Years Loss Runs here
  subscribeNumYrsLossRunsGL() {
    this.underlyingFormGroup.controls['numYrsLossRunsGL'].valueChanges.subscribe((value) => {
      this.validateNoOfYearLossRun(value != null ? (value !== '' ? Number(value) : null) : null, 'numYrsLossRunsGL')
      // Validate no of claims with the new value as it depends on Num of loss run
      this.validateNoOfClaims('numClaimsGL')

      // Value of No of Years of Loss Run also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideGLTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesGL')
    })
  }



  validateNoOfYearLossRun(noOfLossRun: number, controlName: string): boolean {
    let hideErr = true
    this.underlyingFormGroup.controls[controlName].clearValidators()


    let maxYearLossRunAllowed: number = Math.min(this.quest.initialEligibility.yearInBus, controlName === 'numYrsLossRunsAL' ? Constants.MAX_YEARS_LOSS_RUN_AL : Constants.MAX_YEARS_LOSS_RUN_GL)

    let minYearLossRunAllowed = Math.min(controlName === 'numYrsLossRunsAL' ? Constants.MIN_YEARS_LOSS_RUN_AL : Constants.MIN_YEARS_LOSS_RUN_GL, maxYearLossRunAllowed)

    if (noOfLossRun != null) {
      if (noOfLossRun >= minYearLossRunAllowed && noOfLossRun <= maxYearLossRunAllowed) {
        hideErr = true
      } else {
        hideErr = false
      }
    } else {
      hideErr = true
    }

    if (controlName === 'numYrsLossRunsAL') {
      this.hideNumYrsLossRunsALErr = hideErr
      if (!hideErr) {
        if (noOfLossRun < minYearLossRunAllowed) {
          this.noOfYearsLossRunALErrMsg = this.translate.instant('error.ineligible.noYrsLossRunMin', { MIN_NO_LOSS_RUN_YEARS: minYearLossRunAllowed })
        } else {
          this.noOfYearsLossRunALErrMsg = this.translate.instant('error.ineligible.noYrsLossRunMax', { MAX_NO_LOSS_RUN_YEARS: maxYearLossRunAllowed })
        }
      }
    } else {
      this.hideNumYrsLossRunsGLErr = hideErr
      if (!hideErr) {
        if (noOfLossRun < minYearLossRunAllowed) {
          this.noOfYearsLossRunGLErrMsg = this.translate.instant('error.ineligible.noYrsLossRunMin', { MIN_NO_LOSS_RUN_YEARS: minYearLossRunAllowed })
        } else {
          this.noOfYearsLossRunGLErrMsg = this.translate.instant('error.ineligible.noYrsLossRunMax', { MAX_NO_LOSS_RUN_YEARS: maxYearLossRunAllowed })
        }
      }
    }

    this.underlyingFormGroup.controls[controlName].setValidators([Validators.required, this.numYrsLossRunsValidator(noOfLossRun, this.quest.initialEligibility.yearInBus, controlName)])
    this.underlyingFormGroup.controls[controlName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    return hideErr
  }

  numYrsLossRunsValidator(noYrsLossRuns: number, yearInBus: number, controlName: string): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      let maxYearsInBus: number = Math.min(yearInBus, controlName === 'numYrsLossRunsAL' ? Constants.MAX_YEARS_LOSS_RUN_AL : Constants.MAX_YEARS_LOSS_RUN_GL)
      let minYearLossRunAllowed = Math.min(Math.min(controlName === 'numYrsLossRunsAL' ? Constants.MIN_YEARS_LOSS_RUN_AL : Constants.MIN_YEARS_LOSS_RUN_GL, maxYearsInBus), maxYearsInBus)

      if (noYrsLossRuns != null) {
        if (noYrsLossRuns >= minYearLossRunAllowed && noYrsLossRuns <= maxYearsInBus) {
          return null
        } else {
          return {
            controlName: {
              valid: false
            }
          }
        }
      } else {
        return null
      }
    };
  }

  /********************************************************End of Num of Loss Run AL AND GL*****************************************************************************/






  /************************************************************** Num of Claims AL AND GL*****************************************************************************/
  // Handle AL # of Claims here
  subscribeNumClaimsAL() {
    this.underlyingFormGroup.controls['numClaimsAL'].valueChanges.subscribe((value) => {
      this.validateNoOfClaims('numClaimsAL')
      let noOfYearLossRun: number = this.quest.underlyingPolicies.primaryAutoLiability.noOfYearsOfLossRuns
      // Value of No of Claims also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideALTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesAL')
    })
  }


  // /Handle GL # of Claims here
  subscribeNumClaimsGL() {
    this.underlyingFormGroup.controls['numClaimsGL'].valueChanges.subscribe((value) => {
      this.validateNoOfClaims('numClaimsGL')
      let noOfYearLossRun: number = this.quest.underlyingPolicies.primaryGeneralLiability.noOfYearsOfLossRuns
      // Value of No of Claims also controls TotalIncurredLosses and 50k Claims(Large losses) fields. So check if we should display them or not.
      this.hideGLTotIncdAndLargeLosses = this.hideTotalIncurrAndLargeLosses('incurredLossesGL')
    })
  }

  getMaxAllowed(noOfClaimsControlName: string): number {
    let liabilityInfo: LiabilityInfo = null
    let maxAllowed = 0
    if (noOfClaimsControlName === 'numClaimsAL') {
      liabilityInfo = this.quest.underlyingPolicies.primaryAutoLiability
      // For AL Max AL Claims = Max[2 , .30 * (# Years * # Units)]
      if (liabilityInfo.noOfClaims > 0) {
        maxAllowed = Math.floor(Math.max(2, (this.quest.fleetEntry.numOfUnit * liabilityInfo.noOfYearsOfLossRuns) * Constants.CLAIMS_FREQUENCY_AL))
      }
    } else {

      liabilityInfo = this.quest.underlyingPolicies.primaryGeneralLiability
      // For GL Max GL claim count = 1 if # years <=3 else Max GL Claim Count = 2
      if (this.quest.initialEligibility.yearInBus <= 3) {
        maxAllowed = 1
      } else {
        maxAllowed = 2
      }
    }
    return maxAllowed
  }

  validateNoOfClaims(noOfClaimsControlName: string) {
    let liabilityInfo: LiabilityInfo = null
    if (noOfClaimsControlName === 'numClaimsAL') {
      liabilityInfo = this.quest.underlyingPolicies.primaryAutoLiability
    } else {
      liabilityInfo = this.quest.underlyingPolicies.primaryGeneralLiability
    }

    this.underlyingFormGroup.controls[noOfClaimsControlName].clearValidators()

    if (liabilityInfo.noOfClaims == null || liabilityInfo.noOfYearsOfLossRuns == null || this.quest.fleetEntry.numOfUnit == null) {
      this.underlyingFormGroup.controls[noOfClaimsControlName].setValidators([Validators.required])
      this.underlyingFormGroup.controls[noOfClaimsControlName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      return true;
    }

    let hideErr = true

    let maxAllowed: number = this.getMaxAllowed(noOfClaimsControlName)

    hideErr = liabilityInfo.noOfClaims > maxAllowed ? false : true

    if (noOfClaimsControlName === 'numClaimsAL') {
      this.noOfClaimsALErrMsg = this.translate.instant('error.ineligible.noOfClaimsMax', { MAX_NO_CLAIMS: maxAllowed })
      this.hideMaxNoOfClaimsALErr = hideErr
    } else {
      this.noOfClaimsGLErrMsg = this.translate.instant('error.ineligible.noOfClaimsMax', { MAX_NO_CLAIMS: maxAllowed })
      this.hideMaxNoOfClaimsGLErr = hideErr
    }

    this.underlyingFormGroup.controls[noOfClaimsControlName].setValidators([Validators.required, this.numOfClaimsValidator(noOfClaimsControlName)])
    this.underlyingFormGroup.controls[noOfClaimsControlName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    return hideErr
  }

  numOfClaimsValidator(controlName: string): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      let liabilityInfo: LiabilityInfo = null
      if (controlName === 'numClaimsAL') {
        liabilityInfo = this.quest.underlyingPolicies.primaryAutoLiability
      } else {
        liabilityInfo = this.quest.underlyingPolicies.primaryGeneralLiability
      }
      let maxAllowed: number = this.getMaxAllowed(controlName)

      return liabilityInfo.noOfClaims > maxAllowed ? {
        controlName: {
          valid: false
        }
      } : null

    };
  }


  /*******************************************************End of Num of Claims AL AND GL*****************************************************************************/







  /*******************************************************Total Incurred Losses AL AND GL*****************************************************************************/

  // Handle AL Total Incurred Losses here
  subscribeTotIncurredLossesAL() {
    this.underlyingFormGroup.controls['totIncurredLossesAL'].valueChanges.subscribe((value) => {
      // Hides Large Losses and Claims over 50k when Total Incurred Losses is being entered AL
      this.hideLargeLossesAndIncdLargeLossesAL()

      this.validateTotalIncurredLosses(value, 'totIncurredLossesAL')
    })
  }

  // Handle GL Total Incurred Losses here
  subscribeTotIncurredLossesGL() {
    this.underlyingFormGroup.controls['totIncurredLossesGL'].valueChanges.subscribe((value) => {
      // Hides Large Losses and Claims over 50k when Total Incurred Losses is being entered Gl
      this.hideLargeLossesAndIncdLargeLossesGL()

      this.validateTotalIncurredLosses(value, 'totIncurredLossesGL')
    })
  }

  validateTotalIncurredLosses(totIncurredLosses: number, controlName: string) {
    if (controlName === 'totIncurredLossesAL') {
      // Total Incurred Losses must be less than $500,000
      if (totIncurredLosses >= Constants.TOTAL_INCURRED_LOSS_UPPER_AL) {
        this.totIncurredLossALErrMsg = this.translate.instant('error.ineligible.totIncurredLosses', { TOTAL_INCURRED_LOSS_UPPER_STR: Constants.TOTAL_INCURRED_LOSS_UPPER_AL_STR })
        this.hideTotIncdLossesALErr = false
      } else {
        this.totIncurredLossALErrMsg = ''
        this.hideTotIncdLossesALErr = true
        // Total Incurred Losses is less than $50,000 then Claims over 50K(Large losses) stays hidden
        if (totIncurredLosses <= Constants.TOTAL_INCURRED_LOSS_LOWER_AL) {
          this.hideLargeLossesAL = true
          this.largeLossesValidators('largeLossesAL', true)
        } else {
          this.hideLargeLossesAL = false
          this.largeLossesValidators('largeLossesAL', false)
        }
      }
      if (totIncurredLosses != null) {
        this.totalIncurredLossesValidators('totIncurredLossesAL', true)
      }
    } else {
      // Total Incurred Losses must be less than $500,000
      if (totIncurredLosses >= Constants.TOTAL_INCURRED_LOSS_UPPER_GL) {
        this.totIncurredLossGLErrMsg = this.translate.instant('error.ineligible.totIncurredLosses', { TOTAL_INCURRED_LOSS_UPPER_STR: Constants.TOTAL_INCURRED_LOSS_UPPER_GL_STR })
        this.hideTotIncdLossesGLErr = false
      } else {
        this.totIncurredLossGLErrMsg = ''
        this.hideTotIncdLossesGLErr = true
        // Total Incurred Losses is less than $100,000 then Claims over 50K stays hidden
        if (totIncurredLosses <= Constants.TOTAL_INCURRED_LOSS_LOWER_GL) {
          this.hideLargeLossesGL = true
          this.largeLossesValidators('largeLossesGL', true)
        } else {
          this.hideLargeLossesGL = false
          this.largeLossesValidators('largeLossesGL', false)
        }
      }
      if (totIncurredLosses != null) {
        this.totalIncurredLossesValidators('totIncurredLossesGL', true)
      }
    }
  }

  // Total Incurred Losses Validation
  totalIncurredLossesValidators(liabilityName: string, removeValidators: boolean) {
    let maxValue: number = (liabilityName === 'incurredLossesAL') ? Constants.TOTAL_INCURRED_LOSS_UPPER_AL : Constants.TOTAL_INCURRED_LOSS_UPPER_GL;
    let controlName: string = (liabilityName === 'incurredLossesAL') ? 'totIncurredLossesAL' : 'totIncurredLossesGL';

    if (!removeValidators) {
      this.underlyingFormGroup.controls[controlName].setValidators([Validators.required, Validators.max(maxValue - 1)])
    } else {
      this.underlyingFormGroup.controls[controlName].clearValidators()
    }
    this.underlyingFormGroup.controls[controlName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
  }

  /***************************************************End of Total Incurred Losses AL AND GL*****************************************************************************/









  /******************************************************* Large Losses AL AND GL*****************************************************************************/

  // Handle AL # of Claims over 50k here
  subscribeLargeLossesAL() {
    this.underlyingFormGroup.controls['largeLossesAL'].valueChanges.subscribe((value) => {
      // # of Claims over 50K must be less than 3 and less than or equal to number of Claims

      this.largeLossesALMaxErrMsg = ''
      this.hideIncdLargeLossesAL = true
      this.hideLargeLossesALErr = true
      this.underlyingFormGroup.controls['largeLossesAL'].clearValidators()

      if (this.validateLargeLosses(value, 'largeLossesAL')) {
        this.createIncuredLossesList('incurredLossesAL', value)
      }
    })
  }

  // Handle GL # of Claims over 50k here
  subscribeLargeLossesGL() {
    this.underlyingFormGroup.controls['largeLossesGL'].valueChanges.subscribe((value) => {
      this.hideLargeLossesGLErr = true
      this.hideIncdLargeLossesGL = true
      this.largeLossesGLMaxErrMsg = ''
      this.underlyingFormGroup.controls['largeLossesGL'].clearValidators()

      if (this.validateLargeLosses(value, 'largeLossesGL')) {
        this.createIncuredLossesList('incurredLossesGL', value)
      }
    })
  }

  validateLargeLosses(noOfLargeLosses: number, controlName: string): boolean {
    if (controlName === 'largeLossesAL') {
      if (noOfLargeLosses != null) {
        if (noOfLargeLosses > Constants.NUM_CLAIMS_50K_UPPER_AL) {
          this.hideIncdLargeLossesAL = true
          this.hideLargeLossesALErr = false
          this.largeLossesALMaxErrMsg = this.translate.instant('error.ineligible.largeLossesMax', { MAX_NO_50K_LOSSES: Constants.NUM_CLAIMS_50K_UPPER_AL })
        } else if (noOfLargeLosses > Number(this.quest.underlyingPolicies.primaryAutoLiability.noOfClaims)) {
          this.hideIncdLargeLossesAL = true
          this.hideLargeLossesALErr = false
          this.largeLossesALMaxErrMsg = this.translate.instant('error.ineligible.largeLossesMaxALByNoOfClaims')
        } else if (((this.quest.underlyingPolicies.primaryAutoLiability.totalIncurredLosses / this.quest.underlyingPolicies.primaryAutoLiability.noOfClaims) > Constants.AVG_SEVERITY_AL)
          && noOfLargeLosses < Constants.MIN_CLAIM_AL_AVG_SEVERITY) {
          // Average Severity = Total Incurred Losses / # of Claims  and If Average Severity > 50000 then there has to be at least 1 large claim
          this.hideIncdLargeLossesAL = true
          this.hideLargeLossesALErr = false
          this.largeLossesALMaxErrMsg = this.translate.instant('error.ineligible.largeLossesMaxByAvgSeverity', { MIN_CLAIM_AVG_SEVERITY: Constants.MIN_CLAIM_AL_AVG_SEVERITY })
        } else {
          this.hideIncdLargeLossesAL = false
          this.hideLargeLossesALErr = true
        }
      }

      if (noOfLargeLosses != null) {
        this.largeLossesValidators('largeLossesAL', false)
      }
      return this.hideLargeLossesALErr
    } else {
      if (noOfLargeLosses != null) {
        if (noOfLargeLosses > Constants.NUM_CLAIMS_50K_UPPER_GL) {
          this.hideLargeLossesGLErr = false
          this.hideIncdLargeLossesGL = true
          this.largeLossesGLMaxErrMsg = this.translate.instant('error.ineligible.largeLossesMax', { MAX_NO_50K_LOSSES: Constants.NUM_CLAIMS_50K_UPPER_GL })
        } else if (((this.quest.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses / this.quest.underlyingPolicies.primaryGeneralLiability.noOfClaims) > Constants.AVG_SEVERITY_GL)
          && noOfLargeLosses < Constants.MIN_CLAIM_GL_AVG_SEVERITY) {
          // Average Severity = Total Incurred Losses / # of Claims  and If Average Severity > 50000 then there has to be at least 1 large claim
          this.hideIncdLargeLossesGL = true
          this.hideLargeLossesGLErr = false
          this.largeLossesGLMaxErrMsg = this.translate.instant('error.ineligible.largeLossesMaxByAvgSeverity', { MIN_CLAIM_AVG_SEVERITY: Constants.MIN_CLAIM_GL_AVG_SEVERITY })
        } else {
          this.hideIncdLargeLossesGL = false
          this.hideLargeLossesGLErr = true
        }
      }

      if (noOfLargeLosses != null) {
        this.largeLossesValidators('largeLossesGL', false)
      }
      return this.hideLargeLossesGLErr
    }
  }


  largeLossesValidators(controlName: string, removeValidators: boolean) {
    let liabilityInfo: LiabilityInfo = null
    if (controlName === 'largeLossesAL') {
      liabilityInfo = this.quest.underlyingPolicies.primaryAutoLiability
    } else {
      liabilityInfo = this.quest.underlyingPolicies.primaryGeneralLiability
    }
    let maxValue = 0
    let avgSeverity: number = (controlName === 'largeLossesAL') ? Constants.AVG_SEVERITY_AL : Constants.AVG_SEVERITY_GL
    let maxAllowed: number = (controlName === 'largeLossesAL') ? Constants.NUM_CLAIMS_50K_UPPER_AL : Constants.NUM_CLAIMS_50K_UPPER_GL
    let minClaimForAvgSeverity: number = (controlName === 'largeLossesAL') ? Constants.MIN_CLAIM_AL_AVG_SEVERITY : Constants.MIN_CLAIM_AL_AVG_SEVERITY
    let minAllowed: number = null;

    // If Average Severity > 50000 then there has to be at least 1 large claim
    if (liabilityInfo.totalIncurredLosses / liabilityInfo.noOfClaims > avgSeverity) {
      minAllowed = minClaimForAvgSeverity
    }

    if (liabilityInfo.noOfClaims <= maxAllowed) {
      maxValue = liabilityInfo.noOfClaims
    } else if (liabilityInfo.noOfClaims > maxAllowed) {
      maxValue = Constants.NUM_CLAIMS_50K_UPPER_AL
    }
    if (!removeValidators) {
      this.underlyingFormGroup.controls[controlName].setValidators([Validators.required, Validators.max(maxValue), Validators.min(minAllowed)])
    } else {
      this.underlyingFormGroup.controls[controlName].clearValidators()
    }
    this.underlyingFormGroup.controls[controlName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
  }


  /**************************************************End of  Large Losses AL AND GL*****************************************************************************/




  /*************************************************** Large losses Incurred list *******************************************************************************/

  // Creates the Large Losses Incurred Boxes dynamically based on Claims 50k value
  createIncuredLossesList(liabilityName: string, largeLosses: number) {
    let control: FormArray = <FormArray>this.underlyingFormGroup.controls[liabilityName];
    control.controls = []
    if (this.incrLossListSubscr != null) {
      this.incrLossListSubscr.unsubscribe()
      this.incrLossListSubscr = null
    }

    if (largeLosses != null && largeLosses > 0) {
      for (let i = 0; i < largeLosses; i++) {
        control.push(this._fb.group({
          incurred: [null, [Validators.required]],
        }))
      }
      this.subscribeIncurredLossList(liabilityName)
    } else {
      this.underlyingFormGroup.controls[liabilityName].clearValidators()
      this.underlyingFormGroup.controls[liabilityName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    }
  }

  // Creates the Large Losses Incurred Boxes dynamically based on Claims 50k value
  createIncuredLossesListFromGivenData(liabilityName: string, largeLosses: number) {
    let control: FormArray = <FormArray>this.underlyingFormGroup.controls[liabilityName];
    control.controls = []
    if (this.incrLossListSubscr != null) {
      this.incrLossListSubscr.unsubscribe()
      this.incrLossListSubscr = null
    }
    if (largeLosses != null && largeLosses > 0) {
      for (let i = 0; i < largeLosses; i++) {
        let incurred: number = null
        if (liabilityName === 'incurredLossesAL') {
          incurred = this.quest.underlyingPolicies.primaryAutoLiability.incurredLosses[i] != null ? this.quest.underlyingPolicies.primaryAutoLiability.incurredLosses[i].incurred : null
          control.push(this._fb.group({
            incurred: [incurred, [Validators.required]],
          }))
        } else {
          incurred = this.quest.underlyingPolicies.primaryGeneralLiability.incurredLosses[i].incurred
          control.push(this._fb.group({
            incurred: [incurred, [Validators.required]],
          }))
        }
      }
      this.subscribeIncurredLossList(liabilityName)
    } else {
      this.underlyingFormGroup.controls[liabilityName].clearValidators()
      this.underlyingFormGroup.controls[liabilityName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    }
  }


  // Handles Large Loss Incurred Values
  subscribeIncurredLossList(liabilityName: string) {
    this.incrLossListSubscr = this.underlyingFormGroup.controls[liabilityName].valueChanges.subscribe((value) => {
      let incurredLosses: IncurredLoss[] = value
      let total: number = incurredLosses.reduce(function (sum, incurredLossObj) {
        return sum + ((incurredLossObj['incurred'] == null) ? 0 : Number(incurredLossObj['incurred']))
      }, 0)

      let liabilityInfoLocal: LiabilityInfo = null;

      let that = this

      // Based on Liability Type
      if (liabilityName === 'incurredLossesAL') {
        this.quest.underlyingPolicies.primaryAutoLiability.incurredLosses = []
        // associate the new incurred loss list to the liability object
        incurredLosses.forEach(function (curValue, index) {
          let incurredLoss: IncurredLoss = new IncurredLoss()
          incurredLoss.incurred = curValue.incurred
          that.quest.underlyingPolicies.primaryAutoLiability.incurredLosses.push(incurredLoss)
        })
        liabilityInfoLocal = this.quest.underlyingPolicies.primaryAutoLiability

        this.underlyingFormGroup.controls[liabilityName].setValidators([Validators.required, this.createIncurredLossListTotalValidator(liabilityInfoLocal.totalIncurredLosses, liabilityName)])

        // Sum of Incurred Losses cannot exceed Total Incurred Losses For AL
        if (total > liabilityInfoLocal.totalIncurredLosses) {
          this.hideLargeIncdLossesALErr = false
        } else {
          this.hideLargeIncdLossesALErr = true
        }
      } else {
        this.quest.underlyingPolicies.primaryGeneralLiability.incurredLosses = []
        // associate the new incurred loss list to the liability object
        incurredLosses.forEach(function (curValue, index) {
          let incurredLoss: IncurredLoss = new IncurredLoss()
          incurredLoss.incurred = curValue.incurred
          that.quest.underlyingPolicies.primaryGeneralLiability.incurredLosses.push(incurredLoss)
        })
        liabilityInfoLocal = this.quest.underlyingPolicies.primaryGeneralLiability

        this.underlyingFormGroup.controls[liabilityName].setValidators([Validators.required, this.createIncurredLossListTotalValidator(liabilityInfoLocal.totalIncurredLosses, liabilityName)])
        // Sum of Incurred Losses cannot exceed Total Incurred Losses For GL
        if (total > liabilityInfoLocal.totalIncurredLosses) {
          this.hideLargeIncdLossesGLErr = false
        } else {
          this.hideLargeIncdLossesGLErr = true
        }
      }
      this.underlyingFormGroup.controls[liabilityName].updateValueAndValidity({ onlySelf: false, emitEvent: false })

    })
  }


  createIncurredLossListTotalValidator(totalIncurredLosses: number, controlName: string): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {

      let total: number = c.value.reduce(function (sum, value) {
        return sum + Number(value['incurredLoss'])
      }, 0)

      return total > totalIncurredLosses ?
        {
          controlName: {
            valid: false
          }
        } : null;
    };
  }

  /*************************************************** End of Large losses Incurred list *******************************************************************************/




  /*************************************************** Hide Total left side section *******************************************************************************/



  // Hides Total Incurred and Claims 50k
  hideTotalIncurrAndLargeLosses(liabilityName: string): boolean {
    let liabilityInfo: LiabilityInfo = null
    let noOfClaimsControlName = ''
    let noOfLossRunControlName = ''
    let largeLossesControlName = ''
    let limitControlName = ''
    let hideTotalIncrdLoss = true

    // Hides Claims 50k and Large Losses based on Incurred Losses for both Liability types
    if (liabilityName === 'incurredLossesAL') {
      this.hideLargeLossesAndIncdLargeLossesAL()
      this.hideIncdLargeLossesAL = true
      noOfClaimsControlName = 'numClaimsAL'
      noOfLossRunControlName = 'numYrsLossRunsAL'
      largeLossesControlName = 'largeLossesAL'
      limitControlName = 'limitAL'

      // Sets Total Incurred and Claims over 50k to null when hidden
      this.quest.underlyingPolicies.primaryAutoLiability.totalIncurredLosses = null
      this.quest.underlyingPolicies.primaryAutoLiability.largeLosses = null
      liabilityInfo = this.quest.underlyingPolicies.primaryAutoLiability
    } else {
      this.hideLargeLossesAndIncdLargeLossesGL()
      this.hideIncdLargeLossesGL = true
      noOfClaimsControlName = 'numClaimsGL'
      noOfLossRunControlName = 'numYrsLossRunsGL'
      largeLossesControlName = 'largeLossesGL'
      limitControlName = 'limitGL'

      // Sets Total Incurred and Claims over 50k to null when hidden
      this.quest.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses = null
      this.quest.underlyingPolicies.primaryGeneralLiability.largeLosses = null
      liabilityInfo = this.quest.underlyingPolicies.primaryGeneralLiability
    }

    // Limit, Premium, # Years Loss Runs, and # of Claims values null do not display Total Incurred and Claims 50k
    if (liabilityInfo.limit == null || liabilityInfo.premium == null || liabilityInfo.noOfYearsOfLossRuns == null || liabilityInfo.noOfClaims == null) {
      // Remove any left over Incurred Loss control if we are going to hide Totalincurred lossess and large losses
      let control: FormArray = <FormArray>this.underlyingFormGroup.controls[liabilityName];
      control.controls = []
      this.totalIncurredLossesValidators(liabilityName, true)
      this.largeLossesValidators(largeLossesControlName, true)
      this.underlyingFormGroup.controls[liabilityName].clearValidators()
      this.underlyingFormGroup.controls[liabilityName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      return true
      // Total Units valid and Limit valid display Total Incurred and Claims 50k
    } else if (this.quest.fleetEntry.numOfUnit != null && this.quest.fleetEntry.numOfUnit <= Constants.NO_OF_UNITS_ALLOWED && this.isLimitWithinRange(limitControlName)) {
      if (!this.validateNoOfYearLossRun(liabilityInfo.noOfYearsOfLossRuns, noOfLossRunControlName)) {
        hideTotalIncrdLoss = true
      } else {
        hideTotalIncrdLoss = Number(liabilityInfo.noOfClaims) === 0 ? true : !this.validateNoOfClaims(noOfClaimsControlName)
      }
    }
    // Remove any left over Incurred Loss control if we are going to hide Totalincurred losses and large losses
    if (hideTotalIncrdLoss) {
      let control: FormArray = <FormArray>this.underlyingFormGroup.controls[liabilityName];
      control.controls = []
      this.totalIncurredLossesValidators(liabilityName, true)
      this.largeLossesValidators(largeLossesControlName, true)
      this.underlyingFormGroup.controls[liabilityName].clearValidators()
      this.underlyingFormGroup.controls[liabilityName].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    } else {
      this.totalIncurredLossesValidators(liabilityName, false)
    }
    return hideTotalIncrdLoss
  }

  /**********************************************End of  Hide Total left side section *******************************************************************************/








  /**********************************************Hide Total large Losses and Incurred loss list section *******************************************************************************/

  hideLargeLossesAndIncdLargeLossesAL() {
    this.quest.underlyingPolicies.primaryAutoLiability.largeLosses = null
    this.handleHideLargeLossesAndIncrdLargeLosses('largeLossesAL')
  }

  hideLargeLossesAndIncdLargeLossesGL() {
    this.quest.underlyingPolicies.primaryGeneralLiability.largeLosses = null
    this.handleHideLargeLossesAndIncrdLargeLosses('largeLossesGL')
  }

  handleHideLargeLossesAndIncrdLargeLosses(controlName: string) {
    if (controlName === 'largeLossesAL') {
      if (!(this.hideLargeLossesAL && this.hideIncdLargeLossesAL)) {
        this.hideLargeLossesAL = true
        this.hideIncdLargeLossesAL = true
        this.largeLossesValidators('largeLossesAL', false)
      } else {
        if (this.hideLargeLossesAL) {
          this.largeLossesValidators('largeLossesAL', true)
        }
      }
    } else {
      if (!(this.hideLargeLossesGL && this.hideIncdLargeLossesGL)) {
        this.hideLargeLossesGL = true
        this.hideIncdLargeLossesGL = true
        this.largeLossesValidators('largeLossesGL', false)
      } else {
        if (this.hideLargeLossesAL) {
          this.largeLossesValidators('largeLossesGL', true)
        }
      }
    }

  }


  /**************************************End of Hide Total large Losses and Incurred loss list section *******************************************************************************/


  generateQuote() {
    this.clearPricing()
    this.hideLoader = false;
    this.quest.pricingIndication.selectedPremium = null
    this.questService.generateQuote(this.quest).subscribe(
      (data) => {
        this.hideLoader = true;
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest = data;
          this.quest.pricingIndication.showPopup = true;
          this.sharedService.updateQuestObject(this.quest);
          this.wizard.goToNextStep()
        }
      },
      (error) => {
        this.hideLoader = true
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  clearPricing() {
    this.quest.pricingIndication.pricing.map((finalPricing) => {
      finalPricing.riskPremium = null
    })
  }
}
