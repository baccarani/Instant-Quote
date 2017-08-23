import { Component, OnInit, Input, ChangeDetectorRef, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, FormControl } from '@angular/forms';
import { SharedService, Quest, DateModel, LiabilityDetail, Constants } from '../../../shared/index';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { QuestService } from '../index';
import { disableDebugTools } from '@angular/platform-browser';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-additional-details',
  templateUrl: './additional-details.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class AdditionalDetailsComponent implements OnInit, AfterContentChecked, AfterViewChecked {

  @Input('additionalFormGroup')
  public additionalFormGroup: FormGroup;

  quest: Quest;

  /************** Error messages and their flags **************/
  hideEffDateALErr = true;
  hideExpDateALErr = true;
  hideEffDateGLErr = true;
  hideExpDateGLErr = true;
  hideEffDateELErr = true;
  hideExpDateELErr = true;
  effDateErrorMsg = '';
  expDateErrorMsg = '';
  /************** End of Error messages and their flags *******/


  // Date picker options
  datePlaceholder = this.sharedService.DATE_FORMAT

  private effDtModelAL: DateModel = null
  private expDtModelAL: DateModel = null
  private effDtModelGL: DateModel = null
  private expDtModelGL: DateModel = null
  private effDtModelEL: DateModel = null
  private expDtModelEL: DateModel = null

  private myDatePickerOptions: IMyDpOptions = {
    //  other options...
    dateFormat: this.sharedService.DATE_FORMAT.toLocaleLowerCase(),
  };

  constructor(
    private translate: TranslateService,
    private sharedService: SharedService,
    private additionalFormBuilder: FormBuilder,
    private modal: Modal,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest

      if (this.quest.additionalDetails.primaryAutoLiability.scheduleLimits.length !== 0) {
        this.quest.additionalDetails.primaryAutoLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryAutoLiability.limit
      }
      if (this.quest.additionalDetails.primaryGeneralLiability.scheduleLimits.length !== 0) {
        this.quest.additionalDetails.primaryGeneralLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryGeneralLiability.limit
      }
      if (this.quest.additionalDetails.primaryEmployersLiability.scheduleLimits.length !== 0) {
        this.quest.additionalDetails.primaryEmployersLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryEmployersLiability.limit
      }
      /********************* Exp Date Min and Max Constants *******************/
      this.quest.additionalDetails.primaryAutoLiability.expMinDate = moment(this.quest.additionalDetails.primaryAutoLiability.effDate).add(Constants.EXP_MIN, 'days').toDate()
      this.quest.additionalDetails.primaryAutoLiability.expMaxDate = moment(this.quest.additionalDetails.primaryAutoLiability.effDate).add(Constants.EXP_MAX, 'days').toDate()

      this.quest.additionalDetails.primaryGeneralLiability.expMinDate = moment(this.quest.additionalDetails.primaryGeneralLiability.effDate).add(Constants.EXP_MIN, 'days').toDate()
      this.quest.additionalDetails.primaryGeneralLiability.expMaxDate = moment(this.quest.additionalDetails.primaryGeneralLiability.effDate).add(Constants.EXP_MAX, 'days').toDate()

      this.quest.additionalDetails.primaryEmployersLiability.expMinDate = moment(this.quest.additionalDetails.primaryEmployersLiability.effDate).add(Constants.EXP_MIN, 'days').toDate()
      this.quest.additionalDetails.primaryEmployersLiability.expMaxDate = moment(this.quest.additionalDetails.primaryEmployersLiability.effDate).add(Constants.EXP_MAX, 'days').toDate()
      /********************* Exp Date Min and Max Constants *******************/

      this.validateExpDate()
      this.setValidationsGLEL()
    })
    this.createScheduleUnderlyingAL()
    this.createScheduleUnderlyingGL()
    this.createScheduleUnderlyingEL()
    this.subscribeFormControls()
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges()
  }

  subscribeFormControls() {
    this.subscribeEffDate('effDateAL')
    this.subscribeEffDate('effDateGL')
    this.subscribeEffDate('effDateEL')
    this.subscribeExpDate('expDateAL')
    this.subscribeExpDate('expDateGL')
    this.subscribeExpDate('expDateEL')
  }

  publishUpdatedQuest() {
    this.sharedService.updateQuestObject(this.quest)
  }

  isFormValid(): boolean {
    return (((!this.additionalFormGroup.controls['insuranceCompanyAL'].valid && this.additionalFormGroup.controls['insuranceCompanyAL'].dirty)
      || (!this.additionalFormGroup.controls['insuranceCompanyGL'].valid && this.additionalFormGroup.controls['insuranceCompanyGL'].dirty)
      || (!this.additionalFormGroup.controls['insuranceCompanyEL'].valid && this.additionalFormGroup.controls['insuranceCompanyEL'].dirty)
      || (!this.additionalFormGroup.controls['policyNumberAL'].valid && this.additionalFormGroup.controls['policyNumberAL'].dirty)
      || (!this.additionalFormGroup.controls['policyNumberGL'].valid && this.additionalFormGroup.controls['policyNumberGL'].dirty)
      || (!this.additionalFormGroup.controls['policyNumberEL'].valid && this.additionalFormGroup.controls['policyNumberEL'].dirty))
      || !(this.hideEffDateALErr && this.hideExpDateALErr && this.hideEffDateGLErr
        && this.hideExpDateGLErr && this.hideEffDateELErr && this.hideExpDateELErr))
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

  setValidationsGLEL() {
    if (this.quest.initialEligibility.primaryGL) {
      this.additionalFormGroup.controls['insuranceCompanyGL'].setValidators([Validators.required])
      this.additionalFormGroup.controls['policyNumberGL'].setValidators([Validators.required])
      this.additionalFormGroup.controls['coverage'].setValidators([Validators.required])
      this.additionalFormGroup.controls['defenseCosts'].setValidators([Validators.required])
    } else {
      this.additionalFormGroup.controls['insuranceCompanyGL'].clearValidators()
      this.additionalFormGroup.controls['policyNumberGL'].clearValidators()
      this.additionalFormGroup.controls['coverage'].clearValidators()
      this.additionalFormGroup.controls['defenseCosts'].clearValidators()
    }
    if (this.quest.initialEligibility.primaryEL) {
      this.additionalFormGroup.controls['insuranceCompanyEL'].setValidators([Validators.required])
      this.additionalFormGroup.controls['policyNumberEL'].setValidators([Validators.required])
    } else {
      this.additionalFormGroup.controls['insuranceCompanyEL'].clearValidators()
      this.additionalFormGroup.controls['policyNumberEL'].clearValidators()
    }
    this.additionalFormGroup.controls['insuranceCompanyGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.additionalFormGroup.controls['policyNumberGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.additionalFormGroup.controls['coverage'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.additionalFormGroup.controls['defenseCosts'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.additionalFormGroup.controls['insuranceCompanyEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    this.additionalFormGroup.controls['policyNumberEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
  }

  // Gets the Vehicle Info data and pushes the array into the FormGroup
  createScheduleUnderlyingAL() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.additionalDetails.primaryAutoLiability.scheduleLimits = data['scheduleUnderlyingAL']
          const control = <FormArray>this.additionalFormGroup.controls['scheduledAL'];
          this.quest.additionalDetails.primaryAutoLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryAutoLiability.limit

          // reset the form control before create new controls
          control.controls = []

          for (let schedUnd of this.quest.additionalDetails.primaryAutoLiability.scheduleLimits) {
            control.push(this.additionalFormBuilder.group({
              limitLabel: [schedUnd.limitLabel],
              limit: [schedUnd.limit],
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Gets the Vehicle Info data and pushes the array into the FormGroup
  createScheduleUnderlyingGL() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.additionalDetails.primaryGeneralLiability.scheduleLimits = data['scheduleUnderlyingGL']
          const control = <FormArray>this.additionalFormGroup.controls['scheduledGL'];
          this.quest.additionalDetails.primaryGeneralLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryGeneralLiability.limit
          // reset the form control before create new controls
          control.controls = []

          for (let schedUnd of this.quest.additionalDetails.primaryGeneralLiability.scheduleLimits) {
            control.push(this.additionalFormBuilder.group({
              limitLabel: [schedUnd.limitLabel],
              limit: [schedUnd.limit],
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Gets the Vehicle Info data and pushes the array into the FormGroup
  createScheduleUnderlyingEL() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.additionalDetails.primaryEmployersLiability.scheduleLimits = data['scheduleUnderlyingEL']
          const control = <FormArray>this.additionalFormGroup.controls['scheduledEL'];
          this.quest.additionalDetails.primaryEmployersLiability.scheduleLimits[0].limit = this.quest.underlyingPolicies.primaryEmployersLiability.limit

          // reset the form control before create new controls
          control.controls = []

          for (let schedUnd of this.quest.additionalDetails.primaryEmployersLiability.scheduleLimits) {
            control.push(this.additionalFormBuilder.group({
              limitLabel: [schedUnd.limitLabel],
              limit: [schedUnd.limit],
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Handle Effective Date For AL, GL, and EL
  subscribeEffDate(controlName: string) {
    this.additionalFormGroup.controls[controlName].valueChanges.subscribe((value) => {
      if (controlName === 'effDateAL') {
        if (value && value['formatted']) {
          if (moment(this.effDtModelAL.formatted, this.sharedService.DATE_FORMAT).isBefore(moment().startOf('day')) || moment(this.effDtModelAL.formatted, this.sharedService.DATE_FORMAT).isAfter(moment().add(Constants.EFF_MAX, 'day'))) {
            this.hideEffDateALErr = false
            this.effDateErrorMsg = this.translate.instant('error.ineligible.effDate', { EFF_MAX: Constants.EFF_MAX })
          } else {
            this.effDateErrorMsg = ''
            this.hideEffDateALErr = true
            this.quest.additionalDetails.primaryAutoLiability.effDate = moment(this.effDtModelAL.formatted, this.sharedService.DATE_FORMAT).toDate()
            this.expDtModelAL = this.setExpDate(this.effDtModelAL, this.quest.additionalDetails.primaryAutoLiability)
          }
        } else {
          this.effDtModelAL = null
          this.expDtModelAL = null
        }
        this.additionalFormGroup.controls['effDateAL'].setValidators([Validators.required, this.effDateValidator(this.quest, 'effDateAL', this.effDtModelAL)])
        this.additionalFormGroup.controls['effDateAL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      } else if (controlName === 'effDateGL') {
        if (value && value['formatted']) {
          if (moment(this.effDtModelGL.formatted, this.sharedService.DATE_FORMAT).isBefore(moment().startOf('day')) || moment(this.effDtModelGL.formatted, this.sharedService.DATE_FORMAT).isAfter(moment().add(Constants.EFF_MAX, 'day'))) {
            this.hideEffDateGLErr = false
            this.effDateErrorMsg = this.translate.instant('error.ineligible.effDate', { EFF_MAX: Constants.EFF_MAX })
          } else {
            this.effDateErrorMsg = ''
            this.hideEffDateGLErr = true
            this.quest.additionalDetails.primaryGeneralLiability.effDate = moment(this.effDtModelGL.formatted, this.sharedService.DATE_FORMAT).toDate()
            this.expDtModelGL = this.setExpDate(this.effDtModelGL, this.quest.additionalDetails.primaryGeneralLiability)
          }
        } else {
          this.effDtModelGL = null
          this.expDtModelGL = null
        }
        this.additionalFormGroup.controls['effDateGL'].setValidators([Validators.required, this.effDateValidator(this.quest, 'effDateGL', this.effDtModelGL)])
        this.additionalFormGroup.controls['effDateGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      } else if (controlName === 'effDateEL') {
        if (value && value['formatted']) {
          if (moment(this.effDtModelEL.formatted, this.sharedService.DATE_FORMAT).isBefore(moment().startOf('day')) || moment(this.effDtModelEL.formatted, this.sharedService.DATE_FORMAT).isAfter(moment().add(Constants.EFF_MAX, 'day'))) {
            this.hideEffDateELErr = false
            this.effDateErrorMsg = this.translate.instant('error.ineligible.effDate', { EFF_MAX: Constants.EFF_MAX })
          } else {
            this.effDateErrorMsg = ''
            this.hideEffDateELErr = true
            this.quest.additionalDetails.primaryEmployersLiability.effDate = moment(this.effDtModelEL.formatted, this.sharedService.DATE_FORMAT).toDate()
            this.expDtModelEL = this.setExpDate(this.effDtModelEL, this.quest.additionalDetails.primaryEmployersLiability)
          }
        } else {
          this.effDtModelEL = null
          this.expDtModelEL = null
        }
        this.additionalFormGroup.controls['effDateEL'].setValidators([Validators.required, this.effDateValidator(this.quest, 'effDateEL', this.effDtModelEL)])
        this.additionalFormGroup.controls['effDateEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      }
    })
  }

  // Handle Expiration Date For AL, GL, and EL
  subscribeExpDate(controlName: string) {
    this.quest.initialEligibility.effDate = moment(this.quest.initialEligibility.effDate).toDate()
    this.additionalFormGroup.controls[controlName].valueChanges.subscribe((value) => {
      if (controlName === 'expDateAL') {
        if (value && value['formatted']) {
          this.quest.additionalDetails.primaryAutoLiability.expDate = moment(this.expDtModelAL.formatted, this.sharedService.DATE_FORMAT).toDate()
          this.validateExpDate()
        } else {
          this.expDtModelAL = null
        }
        this.quest.additionalDetails.primaryAutoLiability.diffDate = moment(this.quest.additionalDetails.primaryAutoLiability.expDate).diff(moment(this.quest.additionalDetails.primaryAutoLiability.effDate), 'days')
        this.additionalFormGroup.controls['expDateAL'].setValidators([Validators.required, this.expDateValidator(this.quest, 'expDateAL', this.effDtModelAL, this.quest.additionalDetails.primaryAutoLiability)])
        this.additionalFormGroup.controls['expDateAL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      } else if (controlName === 'expDateGL') {
        if (value && value['formatted']) {
          this.quest.additionalDetails.primaryGeneralLiability.expDate = moment(this.expDtModelGL.formatted, this.sharedService.DATE_FORMAT).toDate()
          this.validateExpDate()
        } else {
          this.expDtModelGL = null
        }
        this.quest.additionalDetails.primaryGeneralLiability.diffDate = moment(this.quest.additionalDetails.primaryGeneralLiability.expDate).diff(moment(this.quest.additionalDetails.primaryGeneralLiability.effDate), 'days')
        this.additionalFormGroup.controls['expDateGL'].setValidators([Validators.required, this.expDateValidator(this.quest, 'expDateGL', this.effDtModelGL, this.quest.additionalDetails.primaryGeneralLiability)])
        this.additionalFormGroup.controls['expDateGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      } else if (controlName === 'expDateEL') {
        if (value && value['formatted']) {
          this.quest.additionalDetails.primaryEmployersLiability.expDate = moment(this.expDtModelEL.formatted, this.sharedService.DATE_FORMAT).toDate()
          this.validateExpDate()
        } else {
          this.expDtModelEL = null
        }
        this.quest.additionalDetails.primaryEmployersLiability.diffDate = moment(this.quest.additionalDetails.primaryEmployersLiability.expDate).diff(moment(this.quest.additionalDetails.primaryEmployersLiability.effDate), 'days')
        this.additionalFormGroup.controls['expDateEL'].setValidators([Validators.required, this.expDateValidator(this.quest, 'expDateEL', this.effDtModelEL, this.quest.additionalDetails.primaryEmployersLiability)])
        this.additionalFormGroup.controls['expDateEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
      }
      this.cd.detectChanges();
    })
  }

  // Validates the Exp Date When Clicking Next to this Page
  validateExpDate() {
    let liabilityDetail: LiabilityDetail = null
    if (this.quest.initialEligibility.primaryAL) {
      liabilityDetail = this.quest.additionalDetails.primaryAutoLiability
      if (moment(liabilityDetail.expDate) == null || (moment(liabilityDetail.expDate).isBefore(moment(liabilityDetail.expMinDate)) || moment(liabilityDetail.expDate).isAfter(moment(liabilityDetail.expMaxDate)) || moment(liabilityDetail.expDate).isBefore(moment(this.quest.initialEligibility.effDate)))) {
        this.hideExpDateALErr = false
        this.expDateErrorMsg = this.translate.instant('error.ineligible.expDate', { EXP_MIN: Constants.EXP_MIN, EXP_MAX: Constants.EXP_MAX })
      } else {
        this.expDateErrorMsg = ''
        this.hideExpDateALErr = true
      }

    }

    if (this.quest.initialEligibility.primaryGL) {
      liabilityDetail = this.quest.additionalDetails.primaryGeneralLiability
      if (moment(liabilityDetail.expDate) == null || (moment(liabilityDetail.expDate).isBefore(moment(liabilityDetail.expMinDate)) || moment(liabilityDetail.expDate).isAfter(moment(liabilityDetail.expMaxDate)) || moment(liabilityDetail.expDate).isBefore(moment(this.quest.initialEligibility.effDate)))) {
        this.hideExpDateGLErr = false
        this.expDateErrorMsg = this.translate.instant('error.ineligible.expDate', { EXP_MIN: Constants.EXP_MIN, EXP_MAX: Constants.EXP_MAX })
      } else {
        this.expDateErrorMsg = ''
        this.hideExpDateGLErr = true
      }
      this.additionalFormGroup.controls['expDateGL'].setValidators([Validators.required, this.expDateValidator(this.quest, 'expDateGL', this.effDtModelGL, this.quest.additionalDetails.primaryGeneralLiability)])
      this.additionalFormGroup.controls['expDateGL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    }

    if (this.quest.initialEligibility.primaryEL) {
      liabilityDetail = this.quest.additionalDetails.primaryEmployersLiability
      if (moment(liabilityDetail.expDate) == null || (moment(liabilityDetail.expDate).isBefore(moment(liabilityDetail.expMinDate)) || moment(liabilityDetail.expDate).isAfter(moment(liabilityDetail.expMaxDate)) || moment(liabilityDetail.expDate).isBefore(moment(this.quest.initialEligibility.effDate)))) {
        this.hideExpDateELErr = false
        this.expDateErrorMsg = this.translate.instant('error.ineligible.expDate', { EXP_MIN: Constants.EXP_MIN, EXP_MAX: Constants.EXP_MAX })
      } else {
        this.expDateErrorMsg = ''
        this.hideExpDateELErr = true
      }
      this.additionalFormGroup.controls['expDateEL'].setValidators([Validators.required, this.expDateValidator(this.quest, 'expDateEL', this.effDtModelEL, this.quest.additionalDetails.primaryEmployersLiability)])
      this.additionalFormGroup.controls['expDateEL'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    }
  }

  // Adds one year to Effective Date to get the Expiration Date
  setExpDate(effDtModel: DateModel, liabilityDetail: LiabilityDetail): DateModel {
    let expDtModel: DateModel = new DateModel()
    if (liabilityDetail.effDate) {

      liabilityDetail.expDate = moment(liabilityDetail.effDate).add(1, 'year').toDate();

      let expDate = moment(liabilityDetail.expDate)

      // Date picker user DateModel object to display at the front end,so lets populate it
      expDtModel.date = {
        day: expDate.date(),
        month: expDate.month() + 1,
        year: expDate.year()
      }
      expDtModel.formatted = moment(liabilityDetail.expDate).format(this.sharedService.DATE_FORMAT)
    } else {
      liabilityDetail.expDate = null
      expDtModel = null
    }
    return expDtModel

  }

  // Populates Effective Date and Expiration Date
  populateEffAndExpDateAL() {
    if (this.quest.additionalDetails.primaryAutoLiability.effDate) {
      let effDate = moment(this.quest.additionalDetails.primaryAutoLiability.effDate)
      this.effDtModelAL = new DateModel()

      this.effDtModelAL = {
        date: {
          day: effDate.day(),
          month: effDate.month() + 1,
          year: effDate.year()
        },
        formatted: moment(this.quest.additionalDetails.primaryAutoLiability.effDate).format(this.sharedService.DATE_FORMAT)
      }
    } else {
      this.effDtModelAL = new DateModel()
    }
    if (this.quest.additionalDetails.primaryAutoLiability.expDate) {
      let expDate = moment(this.quest.additionalDetails.primaryAutoLiability.expDate)
      this.effDtModelAL = new DateModel()

      this.effDtModelAL = {
        date: {
          day: expDate.day(),
          month: expDate.month() + 1,
          year: expDate.year()
        },
        formatted: moment(this.quest.additionalDetails.primaryAutoLiability.expDate).format(this.sharedService.DATE_FORMAT)
      }
    } else {
      this.expDtModelAL = new DateModel()
    }
    // Force the change detection
    this.cd.detectChanges();
  }


  effDateValidator(quest: Quest, controlName: string, model: DateModel): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {

      return model != null && (moment(this.effDtModelAL.formatted, this.sharedService.DATE_FORMAT).isBefore(moment().startOf('day')) || moment(this.effDtModelAL.formatted, this.sharedService.DATE_FORMAT).isAfter(moment().add(100, 'day'))) ?
        {
          controlName: {
            valid: false
          }
        } : null;
    };
  }

  expDateValidator(quest: Quest, controlName: string, model: DateModel, liabilityDetail: LiabilityDetail): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {

      return model != null && (moment(liabilityDetail.expDate).isBefore(moment(liabilityDetail.expMinDate)) || moment(liabilityDetail.expDate).isAfter(moment(liabilityDetail.expMaxDate)) || moment(liabilityDetail.expDate).isBefore(moment(this.quest.initialEligibility.effDate))) ?
        {
          controlName: {
            valid: false
          }
        } : null;
    };
  }
}
