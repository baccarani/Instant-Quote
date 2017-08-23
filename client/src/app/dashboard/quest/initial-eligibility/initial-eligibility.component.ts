import { Component, OnInit, Input, EventEmitter, Output, ViewContainerRef, ChangeDetectorRef, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { SharedService, InitialEligibility, UnderlyingPolicies, LiabilityInfo, Quest, DateModel, Constants } from '../../../shared/index';
import { QuestService } from '../index';
import { TranslateService } from '@ngx-translate/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
import { InitialEligibilityService } from './index'

@Component({
  selector: 'app-initial-eligibility',
  templateUrl: './initial-eligibility.component.html',
  styleUrls: ['./../quest.component.css']
})

export class InitialEligibilityComponent implements OnInit, AfterContentChecked, AfterViewChecked {

  /************** Inputs the Form Group and Quest **************/
  @Input('ieFormGroup')
  public ieFormGroup: FormGroup;

  quest: Quest;
  /************** End of Inputs the Form Group and Quest **************/

  /************** Flag to show/hide other fields **************/
  hideCGLTrucker = true;
  hideYIB = true;
  hideIsDrivingExperience = true;
  hideSafteyRating = true;
  hideApplicantInfo = true;
  hideLoader = true;
  /*********** End of Flag to show/hide other fields **********/

  /*************** Static field value *************************/
  saferSysURL: string = null;
  smallFleetSolnURL: string = null;
  initialEligibilityStyleURL: string = null;
  servicesCommHaulList: string[] = []
  srvsPrdCommHauledValues: string[][] = [];
  /*************** End of Static field value ******************/

  /************** Error messages and their flags **************/
  hideEffDateErr = true;
  hideSafetyRatingErr = true;
  hidePassengerIndErr = true;
  hideAutoLiabErr = true;
  hideTruckersOnlyErr = true;
  hideUnschdVehErr = true;
  hideSrvcProdCommHauErr = true;
  hideisDrivingExperienceErr = true;
  hideExpDateErr = true;
  effDateErrorMsg = '';
  expDateErrorMsg = '';
  /************** End of Error messages and their flags *******/

  datePlaceholder = this.sharedService.DATE_FORMAT

  private effDtModel: DateModel = null

  private expDtModel: DateModel = null

  private myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.sharedService.DATE_FORMAT.toLocaleLowerCase(),
  };


  constructor(private dotFormBuilder: FormBuilder,
    private questService: QuestService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private modal: Modal,
    private cd: ChangeDetectorRef,
    private initElgService: InitialEligibilityService) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
    console.log(this.quest)
      this.quest = quest
    })
    
    // Load the static values for the component.
    this.loadStaticFieldValue()

    // custom validator for Safety Rating
    this.createSafteyRatingValidator()

    // Subscribe all the form controls
    this.subscribeFormControls()
  }

  ngAfterContentChecked() {
    // Run change detection if the local quest object is updated by HTTP or by other components
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    // Run change detection if the local quest object is updated by HTTP or by other components
    this.cd.detectChanges()
  }

  // Loads Static URL values
  loadStaticFieldValue() {
    this.translate.get('common.saferSysURL').subscribe((data) => {
      this.saferSysURL = data
    })

    this.translate.get('common.smallFleetSolnURL').subscribe((data) => {
      this.smallFleetSolnURL = data
    })
  }

  isFormValid(): boolean {
    return (!this.ieFormGroup.controls['dot'].valid && this.ieFormGroup.controls['dot'].dirty
      || !(this.hideSafetyRatingErr && this.hideAutoLiabErr && this.hidePassengerIndErr
        && this.hideTruckersOnlyErr && this.hideUnschdVehErr && this.hideSrvcProdCommHauErr
        && this.hideisDrivingExperienceErr && this.hideExpDateErr && this.hideEffDateErr))
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

  subscribeFormControls() {
    this.prepareValueList()

    this.subscribeDOT()
    this.subscribeApplicantInfo()
    this.subscribeEffDate()
    this.subscribeExpDate()
    this.subscribePrimaryAL()
    this.subscribePrimaryGL()
    this.subscribePrimaryEL()
    this.subscribeUnscheduledVehicle()
    this.subscribeSrvcProvCommHauled()
    this.subscribeSafetyRating()
    this.subscribePassengerInd()
    this.subscribeTruckersOnly()
    this.subscribeYearsInBus()
    this.subscribeDrivingExperience()
  }

  // Gets List of Service Provided and Commodities Hauled
  prepareValueList() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.servicesCommHaulList = data['srvcProvCommHaul']
          for (let i = 0; i < this.servicesCommHaulList.length; i = i + 3) {
            let element: string = this.servicesCommHaulList[i];
            let row: string[] = [];
            while (row.length < 3) {
              let value: string = this.servicesCommHaulList[i + row.length];
              if (!value) {
                break;
              }
              row.push(value);
            }
            this.srvsPrdCommHauledValues.push(row);
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }


  // Handles DOT to clear applicant info
  subscribeDOT() {
    this.ieFormGroup.controls['dot'].valueChanges.subscribe((value) => {
      if (value || value === '') {
        this.quest.initialEligibility.applicantInfo.info = null
      }
    })
  }

  // Handle Applicant Info Section here
  subscribeApplicantInfo() {
    this.ieFormGroup.controls['info'].valueChanges.subscribe((value) => {
      if (value != null && value) {
        this.hideApplicantInfo = false
      } else {
        this.hideApplicantInfo = true
      }

    })
  }

  // Handle Effective Date
  subscribeEffDate() {
    this.ieFormGroup.controls['effDate'].valueChanges.subscribe((value) => {
      if (value && value['formatted']) {
        if (this.validateEffectiveDate()) {
          this.hideEffDateErr = false
          this.effDateErrorMsg = this.translate.instant('error.ineligible.effDate', { EFF_MAX: Constants.EFF_MAX })
        } else {
          this.effDateErrorMsg = ''
          this.hideEffDateErr = true
          this.quest.initialEligibility.effDate = moment(this.effDtModel.formatted, this.sharedService.DATE_FORMAT).toDate()
          this.setExpDate()
          this.setNoOfYearsDisclaimer()
        }
      } else {
        this.hideEffDateErr = true
        this.effDtModel = null
        this.expDtModel = null
        this.quest.initialEligibility.noOfYearsDisclaimer = null
      }
      this.ieFormGroup.controls['effDate'].setValidators([Validators.required, this.efftDateValidator(this.quest)])
      this.ieFormGroup.controls['effDate'].updateValueAndValidity({ onlySelf: false, emitEvent: false })

    })
  }

  validateEffectiveDate(): boolean {
    return this.effDtModel != null
      && (moment(this.effDtModel.formatted, this.sharedService.DATE_FORMAT).isBefore(moment().startOf('day'))
        || moment(this.effDtModel.formatted, this.sharedService.DATE_FORMAT).isAfter(moment().add(Constants.EFF_MAX, 'day')))
  }

  // Effective Date is Valid if Between now-100 days
  efftDateValidator(quest: Quest): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      return this.validateEffectiveDate() ?
        {
          'effDate': {
            valid: false
          }
        } : null;
    };
  }

  // Sets the Disclaimer date in Underlying Policy
  setNoOfYearsDisclaimer() {
    if (this.quest.initialEligibility.effDate) {
      let curEffDt: moment.Moment = moment(this.quest.initialEligibility.effDate);
      this.quest.initialEligibility.noOfYearsDisclaimer = curEffDt.subtract(Constants.NO_YEARS_DISCLAIMER, 'days').format(this.sharedService.DATE_FORMAT);
    } else {
      this.quest.initialEligibility.noOfYearsDisclaimer = null
    }
  }

  // Handle Expiration Date
  subscribeExpDate() {
    this.ieFormGroup.controls['expDate'].valueChanges.subscribe((value) => {
      if (value && value['formatted']) {
        this.quest.initialEligibility.expDate = moment(this.expDtModel.formatted, this.sharedService.DATE_FORMAT).toDate()

        if (this.validateExpDate()) {
          this.hideExpDateErr = true
        } else {
          this.hideExpDateErr = false
          this.expDateErrorMsg = this.translate.instant('error.ineligible.expDate', { EXP_MIN: Constants.EXP_MIN, EXP_MAX: Constants.EXP_MAX })
        }
      } else {
        this.expDateErrorMsg = ''
        this.hideExpDateErr = true
        this.expDtModel = null
      }
      this.ieFormGroup.controls['expDate'].setValidators([Validators.required, this.expDateValidator('expDate', this.quest)])
      this.ieFormGroup.controls['expDate'].updateValueAndValidity({ onlySelf: false, emitEvent: false })

    })
  }

  // Adds one year to Effective Date to get the Expiration Date
  setExpDate() {
    if (this.quest.initialEligibility.effDate) {
      this.quest.initialEligibility.expDate = moment(this.quest.initialEligibility.effDate).add(Constants.NO_YEARS_ADD_EXP_DATE, 'year').toDate();

      let expDate: moment.Moment = moment(this.quest.initialEligibility.expDate)

      this.expDtModel = new DateModel()

      // Date picker user DateModel object to display at the front end,so lets populate it
      this.expDtModel.date = {
        day: expDate.date(),
        month: expDate.month() + 1,
        year: expDate.year()
      }
      this.expDtModel.formatted = moment(this.quest.initialEligibility.expDate).format(this.sharedService.DATE_FORMAT)
    } else {
      this.quest.initialEligibility.expDate = null
      this.expDtModel = null
    }
  }

  validateExpDate(): boolean {
    return this.expDtModel != null
      && (moment(this.quest.initialEligibility.expDate).isBetween(moment(this.quest.initialEligibility.effDate).add(Constants.EXP_MIN, 'days'),
        moment(this.quest.initialEligibility.effDate).add(Constants.EXP_MAX, 'days')))
  }

  // Expiration Date is Valid if Between 28-456 days after the Effective Date
  expDateValidator(controlName: string, quest: Quest): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      return this.expDtModel != null
        && !this.validateExpDate() ?
        {
          controlName: {
            valid: false
          }
        } : null;
    };
  }

  // This should be called whenever a data is retrieved from the server.
  populateEffAndExpDate() {
    if (this.quest.initialEligibility.effDate != null) {
      let effDate: moment.Moment = moment(this.quest.initialEligibility.effDate)
      this.effDtModel = new DateModel()

      this.effDtModel = {
        date: {
          day: effDate.day(),
          month: effDate.month() + 1,
          year: effDate.year()
        },
        formatted: moment(this.quest.initialEligibility.effDate).format(this.sharedService.DATE_FORMAT)
      }
    } else {
      this.effDtModel = null
    }

    if (this.quest.initialEligibility.expDate != null) {
      let expDate: moment.Moment = moment(this.quest.initialEligibility.expDate)
      this.effDtModel = new DateModel()

      this.effDtModel = {
        date: {
          day: expDate.day(),
          month: expDate.month() + 1,
          year: expDate.year()
        },
        formatted: moment(this.quest.initialEligibility.expDate).format(this.sharedService.DATE_FORMAT)
      }
    } else {
      this.expDtModel = null
    }
  }

  // Handle Primary AL here
  subscribePrimaryAL() {
    this.ieFormGroup.controls['primaryAL'].valueChanges.subscribe((value) => {
      // Reset this to initial value so that we can display fresh on the Underlying Policies section
      // this.quest.underlyingPolicies.primaryAutoLiability = new LiabilityInfo();
      if (value == null || !value) {
        this.hideAutoLiabErr = false
        this.quest.initialEligibility.primaryAL = false
      } else {
        this.hideAutoLiabErr = true
        this.quest.initialEligibility.primaryAL = true
      }

    })
  }

  // Handle Primary GL here
  subscribePrimaryGL() {
    this.ieFormGroup.controls['primaryGL'].valueChanges.subscribe((value) => {
      // Reset this to initial value so that we can display fresh on the Underlying Policies section
      // this.quest.underlyingPolicies.primaryGeneralLiability = new LiabilityInfo();
      if (value != null && value) {
        this.hideCGLTrucker = false
        // Validation is required only if primary GL is selected
        this.ieFormGroup.controls['truckersOnly'].setValidators([Validators.required, Validators.pattern('Y')])
      } else {
        this.hideCGLTrucker = true
        // reset truckers only related field every time user uncheck
        this.hideTruckersOnlyErr = true
        this.quest.initialEligibility.truckersOnly = null
        this.ieFormGroup.controls['truckersOnly'].clearValidators()
      }
      this.ieFormGroup.controls['truckersOnly'].updateValueAndValidity({ onlySelf: false, emitEvent: false })

    })
  }

  // Handle Primary EL here
  subscribePrimaryEL() {
    this.ieFormGroup.controls['primaryEL'].valueChanges.subscribe((value) => {
      // this.quest.underlyingPolicies.primaryEmployersLiability = new LiabilityInfo();

    })
  }

  // Handle Unscheduled Vehicle here
  subscribeUnscheduledVehicle() {
    this.ieFormGroup.controls['isUnschdVehicle'].valueChanges.subscribe((value) => {
      if (value != null && value === 'Y') {
        this.hideUnschdVehErr = false
      } else {
        this.hideUnschdVehErr = true
      }

    })
  }

  // Handle Unscheduled Vehicles here
  subscribeSrvcProvCommHauled() {
    this.ieFormGroup.controls['isSrvcProvdOrCommodHauled'].valueChanges.subscribe((value) => {
      if (value != null && value === 'Y') {
        this.hideSrvcProdCommHauErr = false
      } else {
        this.hideSrvcProdCommHauErr = true
      }

    })
  }

  // Handle SafetyRating here
  subscribeSafetyRating() {
    this.ieFormGroup.controls['safetyRating'].valueChanges.subscribe((value) => {
      if (value != null && value !== 'S' && value !== 'C' && value !== 'NR') {
        this.hideSafetyRatingErr = false
        this.hideSafteyRating = false
      } else {
        this.hideSafetyRatingErr = true
        this.hideSafteyRating = true
      }

    })
  }

  // Handle PassengerInd here
  subscribePassengerInd() {
    this.ieFormGroup.controls['safetyRating'].valueChanges.subscribe((value) => {
      if (this.quest.initialEligibility.passengerInd === 'Y') {
        this.hidePassengerIndErr = false
      } else if (this.quest.initialEligibility.passengerInd === 'N') {
        this.hidePassengerIndErr = true
      }
    })
  }

  // Safety Rating Validations
  createSafteyRatingValidator() {
    this.ieFormGroup.controls['safetyRating'].setValidators([Validators.required, this.safetyRatingValidator])
  }

  // Safety Rating is Valid if Unsatisfactory is not chosen
  safetyRatingValidator(c: FormControl) {
    return (c.value !== 'U') ? null : {
      safetyRating: {
        valid: false
      }
    }
  }

  // Handle Truckers only here
  subscribeTruckersOnly() {
    this.ieFormGroup.controls['truckersOnly'].valueChanges.subscribe((value) => {
      if (value != null && value === 'N') {
        this.hideTruckersOnlyErr = false
      } else {
        this.hideTruckersOnlyErr = true
      }

    })
  }

  // Handle Years In Business check here
  subscribeYearsInBus() {
    this.ieFormGroup.controls['yearInBus'].valueChanges.subscribe((value) => {
      if (this.hideYIB) {
        if (value != null && value < Constants.MIN_NO_YEARS_IN_BUS) {
          this.hideYIB = false
          this.hideIsDrivingExperience = false
          this.ieFormGroup.controls['isDrivingExperience'].setValidators([Validators.required, Validators.pattern('Y')])
        } else {
          this.hideYIB = true
          this.hideIsDrivingExperience = true
          this.quest.initialEligibility.isDrivingExperience = null
          this.ieFormGroup.controls['isDrivingExperience'].clearValidators()
        }
      }

      if (value != null && value > Constants.MIN_NO_YEARS_IN_BUS) {
        this.quest.initialEligibility.isDrivingExperience = null
        this.ieFormGroup.controls['isDrivingExperience'].clearValidators()
        this.hideIsDrivingExperience = true
      } else if (value != null) {
        this.hideIsDrivingExperience = false
        this.ieFormGroup.controls['isDrivingExperience'].setValidators([Validators.required, Validators.pattern('Y')])
      }
      this.ieFormGroup.controls['isDrivingExperience'].updateValueAndValidity({ onlySelf: false, emitEvent: false })
    })
  }

  // Handle Driving Experience check here
  subscribeDrivingExperience() {
    this.ieFormGroup.controls['isDrivingExperience'].valueChanges.subscribe((value) => {
      if (value != null && value === 'N') {
        this.hideisDrivingExperienceErr = false
      } else {
        this.hideisDrivingExperienceErr = true
      }

    })
  }

  // Gets Applicant Info and Saftey Rating and Passenger Indicator
  searchDOT() {
    this.hideYIB = true
    this.hideIsDrivingExperience = true
    if (this.quest.initialEligibility.dot != null) {
      this.hideLoader = false;
      let dotNumber = this.quest.initialEligibility.dot
      this.initElgService.getDOTData(dotNumber, this.quest.user).subscribe(
        (data) => {
          this.hideLoader = true;
          if (data['error']) {
            this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
          } else {
            this.quest = data
            // this.questService.populateQuest(data, this.quest)
            this.populateEffAndExpDate()
            this.subscribePassengerInd()

            this.quest.initialEligibility.applicantInfo.info = this.quest.initialEligibility.applicantInfo.applicantName + ', ' + this.quest.initialEligibility.applicantInfo.mailingCity + ', ' + this.quest.initialEligibility.applicantInfo.mailingState.code;
            this.quest.initialEligibility.applicantInfo.location = this.quest.initialEligibility.applicantInfo.mailingStreet + ', ' + this.quest.initialEligibility.applicantInfo.mailingCity + ', ' + this.quest.initialEligibility.applicantInfo.mailingState.code + ' ' + this.quest.initialEligibility.applicantInfo.mailingZip;
            this.sharedService.updateQuestObject(this.quest)
          }
        },
        (error) => {
          this.hideLoader = true;
          this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
        });
    } else {
      this.hideLoader = true;
    }
  }
}
