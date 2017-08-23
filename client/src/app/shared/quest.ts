
import { User } from '../login/user';

export class Constants {

  // Initial Eligibility
  static readonly MIN_NO_YEARS_IN_BUS = 3;
  static readonly EXP_MIN = 28;
  static readonly EXP_MAX = 455;
  static readonly EFF_MAX = 90;
  static readonly NO_YEARS_DISCLAIMER = 90;
  static readonly = 1;
  static readonly NO_YEARS_ADD_EXP_DATE = 1;

  // Fleet Entry
  static readonly NO_OF_UNITS_ALLOWED = 5;

  // Underlying Policies
  static readonly LIMIT_LOWER_EL = 500000;
  static readonly LIMIT_LOWER_AL = 1000000;
  static readonly LIMIT_LOWER_GL = 1000000;

  static readonly LIMIT_UPPER_AL = 2000000;
  static readonly LIMIT_UPPER_GL = 2000000;

  static readonly TOTAL_INCURRED_LOSS_LOWER_AL = 50000;
  static readonly TOTAL_INCURRED_LOSS_LOWER_GL = 100000;

  static readonly TOTAL_INCURRED_LOSS_UPPER_AL = 500000;
  static readonly TOTAL_INCURRED_LOSS_UPPER_GL = 500000;

  static readonly NUM_CLAIMS_50K_UPPER_AL = 2;
  static readonly NUM_CLAIMS_50K_UPPER_GL = 1;

  static readonly AVG_SEVERITY_AL = 50000;
  static readonly AVG_SEVERITY_GL = 50000;

  static readonly MIN_CLAIM_AL_AVG_SEVERITY = 1;
  static readonly MIN_CLAIM_GL_AVG_SEVERITY = 1;

  static readonly CLAIMS_FREQUENCY_AL = 0.3;
  static readonly CLAIMS_FREQUENCY_GL = 0.3;

  static readonly MAX_YEARS_LOSS_RUN_AL = 5;
  static readonly MAX_YEARS_LOSS_RUN_GL = 5;

  static readonly MIN_YEARS_LOSS_RUN_AL = 3;
  static readonly MIN_YEARS_LOSS_RUN_GL = 3;

  static readonly LIMIT_LOWER_EL_STR = '$500,000';
  static readonly LIMIT_LOWER_AL_STR = '$1,000,000';
  static readonly LIMIT_LOWER_GL_STR = '$1,000,000';

  static readonly LIMIT_UPPER_AL_STR = '$2,000,000';
  static readonly LIMIT_UPPER_GL_STR = '$2,000,000';

  static readonly TOTAL_INCURRED_LOSS_UPPER_AL_STR = '$500,000';
  static readonly TOTAL_INCURRED_LOSS_UPPER_GL_STR = '$500,000';


  // Pricing Indication
  static readonly RISK_PREMIUM_1MIL_MIN = 2000;
  static readonly RISK_PREMIUM_2MIL_MIN = 3500;
  static readonly RISK_PERCENT_MIN = 90;
  static readonly TRIA_PERCENT = 5;
  static readonly INSURED_PROCESSING_FEE = 150;
  static readonly MIN_EARNED_AT_INCEPTION = 25;
  static readonly COMMISSION = 20;
  static readonly PREMIUM_BASIS = 'Flat (Annual)';
}

/**
 *This is template for State object
 *
 */
export class State {
  id = '';
  code = '';
  name = '';
}

/**
 *This is template for ApplicantInfo object
 *
 */
export class ApplicantInfo {
  location = ''
  info = '';
  dba = '';
  applicantName = '';
  mailingStreet = '';
  mailingZip: number = null;
  phyZip: number = null;
  mailingCity = ''
  hasDOTRevoked: boolean;
  mailingState: State = new State();
  vehicleType = '';
  garbageHaul = '';
}



/**
 *This is template for InitialEligibility object
 *
 */
export class InitialEligibility {
  dot: number = null;
  effDate: Date = null;
  expDate: Date = null;
  yearInBus: number = null;
  safetyRating: string = null;
  passengerInd: string = null;
  primaryAL = true
  primaryGL: boolean
  primaryEL: boolean
  isDrivingExperience = '';
  truckersOnly = '';
  isUnschdVehicle: boolean;
  isSrvcProvdOrCommodHauled: boolean;
  isCglClass: boolean;
  noOfYearsDisclaimer = '';

  applicantInfo: ApplicantInfo = new ApplicantInfo();
}

/**
 *This is template for VehicleInfo object
 *
 */
export class VehicleInfo {
  vehicleType = '';
  units: number = null;
  factor = 0;
}

/**
 *This is template for FleetEntry object
 *
 */
export class FleetEntry {
  vehicleInfos: VehicleInfo[] = [];
  numOfUnit = 0;
}

/**
 *This is template for IncurredLoss object
 *
 */

export class IncurredLoss {
  incurred: number = null;
}


/**
 *This is template for LiabilityInfo object
 *
 */
export class LiabilityInfo {
  limit: number = null;
  premium: number = null;
  noOfYearsOfLossRuns: number = null;
  noOfClaims: number = null;
  totalIncurredLosses: number = null;
  largeLosses: number = null;
  incurredLosses: IncurredLoss[] = []
}

/**
 *This is template for UnderlyingPolicy object
 *
 */
export class UnderlyingPolicies {
  primaryAutoLiability: LiabilityInfo = new LiabilityInfo();
  primaryGeneralLiability: LiabilityInfo = new LiabilityInfo();
  primaryEmployersLiability: LiabilityInfo = new LiabilityInfo();
}

/**
 *This is template for FinalPricing object
 *
 */
export class FinalPricing {
  excessLimit: string = null;
  riskPremium: number = null;
  value: number = null;
}

/**
 *This is template for Premium object
 *
 */
export class Premium {
  riskPremium: number = null;
  riskPercent: number = null;
  triaPremium: number = null;
  triaPercent: number = null;
  insurerProcessingFee: number = null;
  totalInsrPrmFees: number = null;
}

/**
 *This is template for AdditionalTerms object
 *
 */
export class AdditionalTerms {
  minEarnedAtInception: number = null;
  commission: number = null;
  premiumBasis: string = null;
}


/**
 *This is template for AdditionalCharges object
 *
 */
export class AdditionalCharges {
  brokerPolicyFee: number = null;
  surplusLinesTaxesFees: number = null;
  totalPremiumTaxesFees: number = null;
}


/**
 *This is template for PricingIndication object
 *
 */
export class PricingIndication {
  pricing: FinalPricing[] = [new FinalPricing(), new FinalPricing()]
  premium: Premium = new Premium();
  additionalTerms: AdditionalTerms = new AdditionalTerms();
  additionalCharges: AdditionalCharges = new AdditionalCharges();
  selectedPremium: number = null
  showPopup = false;
}

/**
 *This is template for LiabilityDetail object
 *
 */
export class LiabilityDetail {
  insuranceCompany = '';
  policyNumber = '';
  effDate: Date = null;
  expDate: Date = null;
  coverage = '';
  defenseCosts = '';

  scheduleLimits: ScheduleUnderlyingLimit[] = [];

  expMinDate: Date = null;
  expMaxDate: Date = null;
  diffDate: number = null;
}

/**
 *This is template for AdditionalDetails object
 *
 */
export class AdditionalDetails {
  primaryAutoLiability: LiabilityDetail = new LiabilityDetail();
  primaryGeneralLiability: LiabilityDetail = new LiabilityDetail();
  primaryEmployersLiability: LiabilityDetail = new LiabilityDetail();
}

/**
 *This is template for ScheduleUnderlyingLimit object
 *
 */
export class ScheduleUnderlyingLimit {
  limit: number = null;
  limitLabel = '';
}

export class Forms {
  formList: FormSelection[] = [];
}

/**
 *This is template for FormInput object
 *
 */
export class FormInput {
  inputDesc: string = null;
  inputData: string = null;
  fillInContent: string = null;
}

/**
 *This is template for Subjectivity object
 *
 */
export class Subjectivity {
  subjectivities: SubjectivityInfo[] = []
}

export class SubjectivityInfo {
  subjNum: string = null;
  subjText: string = null;
}

/**
 *This is template for NoteInfo object
 *
 */
export class NoteInfo {
  noteNum: string = null;
  noteText: string = null;
}

/**
 *This is template for Notes object
 *
 */
export class Notes {
  noteInfos: NoteInfo[] = []
}

/**
 *This is template for FormSelection object
 *
 */
export class FormSelection {
  formID: number = null;
  formNumber: string = null;
  formName: string = null;
  truckingInd: string = null;
  inputs: FormInput[] = []
  isSelected = false
}

/**
 *Used for Date picker
 *
 *@export
 *@class DateModel
 */
export class DateModel {
  date: {
    year: number,
    month: number,
    day: number
  }
  formatted: string = null
}


export class Producer {
  producerCode: number
}


/**
 *This is template for Quest object
 *
 */
export class Quest {
  initialEligibility: InitialEligibility = new InitialEligibility();
  fleetEntry: FleetEntry = new FleetEntry();
  underlyingPolicies: UnderlyingPolicies = new UnderlyingPolicies();
  pricingIndication: PricingIndication = new PricingIndication();
  forms: Forms = new Forms();
  subjectivity: Subjectivity = new Subjectivity();
  notes: Notes = new Notes();
  additionalDetails: AdditionalDetails = new AdditionalDetails();
  declined: boolean;
  declinedMsg = '';
  user: User = null
}


