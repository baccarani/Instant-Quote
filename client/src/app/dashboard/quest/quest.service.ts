import {Injectable, Component} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {SharedService, Quest} from '../../shared/index';

@Injectable()
export class QuestService {

  private serverUrl = 'http://' + environment.nodejs_server + ':' + environment.nodejs_port;

  constructor(private http: Http, private sharedService: SharedService) {}

  generateQuote(quest: Quest): Observable<any> {
    // Stringify payload
    const bodyString = JSON.stringify(quest);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({'headers': headers});
    return this.http.post(this.serverUrl + '/generateQuote', bodyString, options)
      .map(this.sharedService.extractData)
      .catch(this.sharedService.handleError);
  }


  populateQuest(data: any, quest: Quest): Quest {
    this.populateInitialEligibility(data, quest)
    this.populateFleetEntry(data, quest)
    this.populateAutoLiability(data, quest)
    this.populateGeneralLiability(data, quest)
    this.populateEmployersLiability(data, quest)
    return quest
  }

  private populateInitialEligibility(data: any, quest: Quest): Quest {
    quest.initialEligibility.dot = data.initialEligibility.dot
    quest.initialEligibility.effDate = data.initialEligibility.effDate
    quest.initialEligibility.expDate = data.initialEligibility.expDate
    quest.initialEligibility.yearInBus = data.initialEligibility.yearInBus
    quest.initialEligibility.safetyRating = data.initialEligibility.safetyRating
    quest.initialEligibility.primaryAL = data.initialEligibility.primaryAL
    quest.initialEligibility.primaryGL = data.initialEligibility.primaryGL
    quest.initialEligibility.primaryEL = data.initialEligibility.primaryEL
    quest.initialEligibility.isDrivingExperience = data.initialEligibility.isDrivingExperience
    quest.initialEligibility.truckersOnly = data.initialEligibility.truckersOnly
    quest.initialEligibility.isUnschdVehicle = data.initialEligibility.isUnschdVehicle
    quest.initialEligibility.isSrvcProvdOrCommodHauled = data.initialEligibility.isSrvcProvdOrCommodHauled
    quest.initialEligibility.isCglClass = data.initialEligibility.isCglClass
    quest.initialEligibility.noOfYearsDisclaimer = data.initialEligibility.noOfYearsDisclaimer

    this.populateApplicantInfo(data, quest)
    return quest
  }

  private populateApplicantInfo(data: any, quest: Quest): Quest {
    quest.initialEligibility.applicantInfo.applicantName = data.initialEligibility.applicantInfo.applicantName;
    quest.initialEligibility.applicantInfo.mailingStreet = data.initialEligibility.applicantInfo.mailingStreet;
    quest.initialEligibility.applicantInfo.mailingZip = data.initialEligibility.applicantInfo.mailingZip;
    quest.initialEligibility.applicantInfo.mailingCity = data.initialEligibility.applicantInfo.mailingCity;
    quest.initialEligibility.applicantInfo.hasDOTRevoked = data.initialEligibility.applicantInfo.hasDOTRevoked;
    quest.initialEligibility.applicantInfo.mailingState = data.initialEligibility.applicantInfo.mailingState;
    quest.initialEligibility.applicantInfo.vehicleType = data.initialEligibility.applicantInfo.vehicleType;
    quest.initialEligibility.applicantInfo.garbageHaul = data.initialEligibility.applicantInfo.garbageHaul;
    quest.initialEligibility.applicantInfo.dba = data.initialEligibility.applicantInfo.dba;
    quest.initialEligibility.applicantInfo.info = quest.initialEligibility.applicantInfo.applicantName + ', ' + quest.initialEligibility.applicantInfo.mailingCity + ', ' + quest.initialEligibility.applicantInfo.mailingState.code;
    quest.initialEligibility.applicantInfo.location = quest.initialEligibility.applicantInfo.mailingStreet + ', ' + quest.initialEligibility.applicantInfo.mailingCity + ', ' + quest.initialEligibility.applicantInfo.mailingState.code + ' ' + quest.initialEligibility.applicantInfo.mailingZip;
    return quest
  }

  private populateFleetEntry(data: any, quest: Quest): Quest {
    quest.fleetEntry.vehicleInfos = data.fleetEntry.vehicleInfos
    quest.fleetEntry.numOfUnit = data.fleetEntry.numOfUnit
    return quest
  }

  private populateAutoLiability(data: any, quest: Quest): Quest {
    quest.underlyingPolicies.primaryAutoLiability.limit = data.underlyingPolicies.primaryAutoLiability.limit ? data.underlyingPolicies.primaryAutoLiability.limit : 1000000;
    quest.underlyingPolicies.primaryAutoLiability.premium = data.underlyingPolicies.primaryAutoLiability.premium;
    quest.underlyingPolicies.primaryAutoLiability.noOfYearsOfLossRuns = data.underlyingPolicies.primaryAutoLiability.noOfYearsOfLossRuns;
    quest.underlyingPolicies.primaryAutoLiability.noOfClaims = data.underlyingPolicies.primaryAutoLiability.noOfClaims
    quest.underlyingPolicies.primaryAutoLiability.totalIncurredLosses = data.underlyingPolicies.primaryAutoLiability.totalIncurredLosses;
    quest.underlyingPolicies.primaryAutoLiability.largeLosses = data.underlyingPolicies.primaryAutoLiability.largeLosses;
    return quest
  }

  private populateGeneralLiability(data: any, quest: Quest): Quest {
    quest.underlyingPolicies.primaryGeneralLiability.limit = data.underlyingPolicies.primaryGeneralLiability.limit ? data.underlyingPolicies.primaryGeneralLiability.limit : 1000000;
    quest.underlyingPolicies.primaryGeneralLiability.premium = data.underlyingPolicies.primaryGeneralLiability.premium;
    quest.underlyingPolicies.primaryGeneralLiability.noOfYearsOfLossRuns = data.underlyingPolicies.primaryGeneralLiability.noOfYearsOfLossRuns;
    quest.underlyingPolicies.primaryGeneralLiability.noOfClaims = data.underlyingPolicies.primaryGeneralLiability.noOfClaims
    quest.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses = data.underlyingPolicies.primaryGeneralLiability.totalIncurredLosses;
    quest.underlyingPolicies.primaryGeneralLiability.largeLosses = data.underlyingPolicies.primaryGeneralLiability.largeLosses;
    return quest
  }

  private populateEmployersLiability(data: any, quest: Quest): Quest {
    quest.underlyingPolicies.primaryEmployersLiability.premium = data.underlyingPolicies.primaryGeneralLiability.premium;
    return quest
  }

}

