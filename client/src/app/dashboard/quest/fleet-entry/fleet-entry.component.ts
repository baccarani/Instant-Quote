import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { VehicleInfo, SharedService, FleetEntry, Quest, Constants } from '../../../shared/index';

@Component({
  selector: 'app-fleet-entry',
  templateUrl: './fleet-entry.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class FleetEntryComponent implements OnInit {

  /************** Inputs the Form Group and Quest **************/
  @Input('fleetFormGroup')
  public fleetFormGroup: FormGroup;

  quest: Quest;
  /*********** End of Inputs the Form Group and Quest ***********/

  /************** Error messages and their flags ******************/
  hideFleetEntryErr = true;
  fleetUnitErrMsg = '';
  /************** End of Error messages and their flags ***********/


  constructor(private translate: TranslateService, private sharedService: SharedService, private fleetEntryBuilder: FormBuilder, private modal: Modal, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest
    })
    this.createVehicleInfo()

    // Custom Validators
    this.createVehicleInfosValidator()
  }

  ngAfterContentChecked() {
    // Run change detection if the local quest object is updated by HTTP or by other components
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    // Run change detection if the local quest object is updated by HTTP or by other components
    this.cd.detectChanges()
  }

  isFormValid(): boolean {
    return !(this.hideFleetEntryErr)
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

  // Gets the Vehicle Info data and pushes the array into the FormGroup
  createVehicleInfo() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.fleetEntry.vehicleInfos = data['vehicleInfos']
          const control = <FormArray>this.fleetFormGroup.controls['vehicleInfos'];

          // reset the form control before create new controls
          control.controls = []

          for (let vehicleInfo of this.quest.fleetEntry.vehicleInfos) {
            control.push(this.fleetEntryBuilder.group({
              vehicleType: [vehicleInfo.vehicleType, Validators.required],
              units: [''],
              factor: [vehicleInfo.factor]
            }))
          }
          this.subscribeVehicleInfos()
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Gets the Vehicle Info data with the given data
  createVehicleInfoFromGivenData(vehicleInfos: VehicleInfo[]) {
    this.quest.fleetEntry.vehicleInfos = vehicleInfos
    const control = <FormArray>this.fleetFormGroup.controls['vehicleInfos'];

    // remove existing controls
    control.controls = []

    for (let vehicleInfo of this.quest.fleetEntry.vehicleInfos) {
      control.push(this.fleetEntryBuilder.group({
        vehicleType: [vehicleInfo.vehicleType, Validators.required],
        units: [vehicleInfo.units],
        factor: [vehicleInfo.factor]
      }))
    }
    this.subscribeVehicleInfos()

  }

  // Handles # of Power Units based on changes of the elements in the array
  subscribeVehicleInfos() {
    this.fleetFormGroup.controls['vehicleInfos'].valueChanges.subscribe((value) => {
      this.calcNoOfPU(value)
    })
  }

  // Adds Units Together
  calcNoOfPU(vehicleInfos: VehicleInfo[]) {
    // assign the new changed vehicleInfo to the class level so that other components can get it
    this.quest.fleetEntry.vehicleInfos = vehicleInfos

    this.hideFleetEntryErr = this.getNoOfUnits(vehicleInfos) <= Constants.NO_OF_UNITS_ALLOWED


    this.fleetUnitErrMsg = this.hideFleetEntryErr ? '' : this.translate.instant('error.ineligible.fleetEntry', { MAX_UNIT: Constants.NO_OF_UNITS_ALLOWED })
  }

  getNoOfUnits(vehicleInfos: VehicleInfo[]): number {
    this.quest.fleetEntry.numOfUnit = vehicleInfos.reduce(function (sum, vehicleInfo) {
      // Reduce function returning units as String, so convert it to Number before add.
      return sum + (vehicleInfo.units != null ? Number(vehicleInfo.units) : 0)
    }, 0)

    return this.quest.fleetEntry.numOfUnit
  }

  // Vehicle Infos Validations
  createVehicleInfosValidator() {
    this.fleetFormGroup.controls['vehicleInfos'].setValidators([this.vehicleInfoValidator()])
  }

  vehicleInfoValidator(): ValidatorFn {
    return (c: FormControl): { [key: string]: any } => {
      let vehicleInfos: VehicleInfo[] = c.value
      let total = this.getNoOfUnits(vehicleInfos)
      return (total > 0 && total <= Constants.NO_OF_UNITS_ALLOWED) ? null : {
        vehilceInfos: {
          valid: false
        }
      }
    };
  }
}


