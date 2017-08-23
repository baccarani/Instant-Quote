import {Component, OnInit, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {SharedService, Quest} from '../../../shared/index';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-form-selection',
  templateUrl: './form-selection.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class FormSelectionComponent implements OnInit {
  /************** Inputs the Form Group and Quest **************/
  @Input('formsFormGroup')
  public formsFormGroup: FormGroup;

  quest: Quest;
  /*********** End of Inputs the Form Group and Quest ***********/


  constructor(private translate: TranslateService, private sharedService: SharedService, private formFormBuilder: FormBuilder, private modal: Modal) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest
      this.populateFormSelectionDetailsFromGivenData()
    })
    this.createFormSelection()
    this.populateFormSelectionDetails()
  }

  publishUpdatedQuest() {
    this.sharedService.updateQuestObject(this.quest)
  }

  // Gets the Forms Info data and pushes the array into the FormGroup
  createFormSelection() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.forms.formList = data['formList']
          this.populateFormSelectionDetails()
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  populateFormSelectionDetailsFromGivenData() {
    const control = <FormArray>this.formsFormGroup.controls['forms'];

    // reset the form control before create new controls
    control.controls = []
    let i = 0
    let shouldDisable = false
    for (let truckingForm of this.quest.forms.formList) {
      //      if (truckingForm.truckingInd === 'M' || truckingForm.truckingInd === 'D') {
      //        this.quest.forms.formList[i].isSelected = true
      //      } else {
      //        this.quest.forms.formList[i].isSelected = false
      //      }

      // if only Primary AL is selected, formID: 20 is required to be selected
      // if Primary GL or EL selected, formID: 20 and 39 required to be selected
      if (this.quest.initialEligibility.primaryAL === true && this.quest.initialEligibility.primaryGL !== true && this.quest.initialEligibility.primaryEL !== true) {
        if (this.quest.forms.formList[i].formID === 20) {
          this.quest.forms.formList[i].truckingInd = 'M'
        }
      } else {
        if (this.quest.forms.formList[i].formID === 20 || this.quest.forms.formList[i].formID === 39) {
          this.quest.forms.formList[i].truckingInd = 'M'
        }
      }

      if (truckingForm.truckingInd === 'M') {
        this.quest.forms.formList[i].isSelected = true
        shouldDisable = true
      } else {
        shouldDisable = false
      }

      if (truckingForm.truckingInd === 'D' && this.quest.forms.formList[i].isSelected == null) {
        this.quest.forms.formList[i].isSelected = true
      }

      if (this.quest.forms.formList[i].isSelected == null) {
        this.quest.forms.formList[i].isSelected = false
      }

      let localFormGroup: FormGroup = this.formFormBuilder.group({
        formID: [truckingForm.formID],
        formNumber: [truckingForm.formNumber],
        formName: [truckingForm.formName],
        truckingInd: [truckingForm.truckingInd],
        isSelected: [truckingForm.isSelected],
        formInput: this.formFormBuilder.array([
        ])
      })
      if (shouldDisable) {
        localFormGroup.disable()
      }
      control.push(localFormGroup)
      let formGroup: FormGroup = <FormGroup>control.controls[i]
      const controlInput = <FormArray>formGroup.controls['formInput'];

      for (let truckingFormInput of truckingForm.inputs) {
        controlInput.push(this.formFormBuilder.group({
          inputDesc: [truckingFormInput.inputDesc],
          inputData: [truckingFormInput.inputData],
          fillInContent: [truckingFormInput.fillInContent]
        }))
      }
      i++
    }
    this.prepareFillInDetails()
  }

  populateFormSelectionDetails() {
    const control = <FormArray>this.formsFormGroup.controls['forms'];

    // reset the form control before create new controls
    control.controls = []
    let i = 0
    let shouldDisable = false
    for (let truckingForm of this.quest.forms.formList) {
      if (truckingForm.truckingInd === 'M' || truckingForm.truckingInd === 'D') {
        this.quest.forms.formList[i].isSelected = true
      } else {
        this.quest.forms.formList[i].isSelected = false
      }

      if (truckingForm.truckingInd === 'M') {
        shouldDisable = true
      } else {
        shouldDisable = false
      }

      let localFormGroup: FormGroup = this.formFormBuilder.group({
        formID: [truckingForm.formID],
        formNumber: [truckingForm.formNumber],
        formName: [truckingForm.formName],
        truckingInd: [truckingForm.truckingInd],
        isSelected: [truckingForm.isSelected],
        formInput: this.formFormBuilder.array([
        ])
      })
      if (shouldDisable) {
        localFormGroup.disable()
      }
      control.push(localFormGroup)
      let formGroup: FormGroup = <FormGroup>control.controls[i]
      const controlInput = <FormArray>formGroup.controls['formInput'];

      for (let truckingFormInput of truckingForm.inputs) {
        controlInput.push(this.formFormBuilder.group({
          inputDesc: [truckingFormInput.inputDesc],
          inputData: [truckingFormInput.inputData],
          fillInContent: [truckingFormInput.fillInContent]
        }))
      }
      i++
    }

    this.prepareFillInDetails()
  }

  prepareFillInDetails() {
    for (let truckingForm of this.quest.forms.formList) {
      if (truckingForm.inputs != null && truckingForm.inputs.length > 0) {
        for (let input of truckingForm.inputs) {
          input.fillInContent = input.inputDesc + ' - ' + input.inputData
        }
      }
    }
  }

}



