import {Component, OnInit, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {SharedService, Quest, SubjectivityInfo, NoteInfo} from '../../../shared/index';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-subjectivities-terms',
  templateUrl: './subjectivities-terms.component.html',
  styleUrls: ['./../quest.component.css'],
})

export class SubjectivitiesTermsComponent implements OnInit {

  /************** Inputs the Form Group and Quest **************/
  @Input('subjectivitiesFormGroup')
  public subjectivitiesFormGroup: FormGroup;

  quest: Quest;
  /*********** End of Inputs the Form Group and Quest ***********/

  constructor(private translate: TranslateService, private sharedService: SharedService, private subjectivitiesFormBuilder: FormBuilder, private modal: Modal) {
  }

  ngOnInit() {
    this.sharedService.sharedQuestObservable.subscribe((quest) => {
      this.quest = quest
    })
    this.createSubjectivitiesInfo()
    this.createNotes()
  }

  publishUpdatedQuest() {
    this.sharedService.updateQuestObject(this.quest)
  }

  // Gets the Subjectivity Info data and pushes the array into the FormGroup
  createNotes() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.notes.noteInfos = data['notes']
          const control = <FormArray>this.subjectivitiesFormGroup.controls['notes'];

          // reset the form control before create new controls
          control.controls = []

          for (let noteInfo of this.quest.notes.noteInfos) {
            control.push(this.subjectivitiesFormBuilder.group({
              'noteNum': [noteInfo.noteNum],
              'noteText': [noteInfo.noteText]
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  createNotesFromGivenData(notes: NoteInfo[]) {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.notes.noteInfos = data['notes']
          const control = <FormArray>this.subjectivitiesFormGroup.controls['notes'];

          // reset the form control before create new controls
          control.controls = []

          for (let noteInfo of this.quest.notes.noteInfos) {
            control.push(this.subjectivitiesFormBuilder.group({
              'noteNum': [noteInfo.noteNum],
              'noteText': [noteInfo.noteText]
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Gets the Subjectivity Info data and pushes the array into the FormGroup
  createSubjectivitiesInfo() {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.subjectivity.subjectivities = data['subjectivities']
          const control = <FormArray>this.subjectivitiesFormGroup.controls['subjectivities'];

          // reset the form control before create new controls
          control.controls = []

          for (let subjectivityInfo of this.quest.subjectivity.subjectivities) {
            control.push(this.subjectivitiesFormBuilder.group({
              'subjNum': [subjectivityInfo.subjNum],
              'subjText': [subjectivityInfo.subjText]
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  createSubjectivitiesFromGivenData(subjectivities: SubjectivityInfo[]) {
    this.sharedService.getStaticData().subscribe(
      (data) => {
        if (data['error']) {
          this.sharedService.onErrorPopUp(this.modal, data['error'], this.sharedService.APP_ERROR_MESSAGE)
        } else {
          this.quest.subjectivity.subjectivities = data['subjectivities']
          const control = <FormArray>this.subjectivitiesFormGroup.controls['subjectivities'];

          // reset the form control before create new controls
          control.controls = []

          for (let subjectivityInfo of this.quest.subjectivity.subjectivities) {
            control.push(this.subjectivitiesFormBuilder.group({
              'subjNum': [subjectivityInfo.subjNum],
              'subjText': [subjectivityInfo.subjText]
            }))
          }
        }
      },
      (error) => {
        this.sharedService.onErrorPopUp(this.modal, error, this.sharedService.APP_ERROR_MESSAGE)
      });
  }

  // Handles # of Power Units based on changes of the elements in the array
  subscribeSubjectivities() {
    this.subjectivitiesFormGroup.controls['subjectivities'].valueChanges.subscribe((value) => {
      // Nothing to do here as of now.
    })
  }
}



