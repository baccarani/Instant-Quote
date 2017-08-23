(function () {
	/**
	 * This is a factory method that returns an object based on the key
	 * 
	 * @param {any} type 
	 * @returns 
	 */
	var getObject = function (type) {
		var obj;

		if (type === __constants.QUEST) {
			obj = new Quest();
		} else if (type === __constants.AUTH) {
			obj = new Auth();
		} else if (type === __constants.USER) {
			obj = new User();
		} else if (type === __constants.STATE) {
			obj = new State();
		} else if (type === __constants.ZIP_TABLE) {
			obj = new ZipTable();
		} else if (type === __constants.APPLICANT_INFO) {
			obj = new ApplicantInfo();
		} else if (type === __constants.INITIAL_ELIGIBILITY) {
			obj = new InitialEligibility();
		} else if (type === __constants.VEHICLE_INFO) {
			obj = new VehicleInfo();
		} else if (type === __constants.FLEET_ENTRY) {
			obj = new FleetEntry();
		} else if (type === __constants.LARGE_LOSS) {
			obj = new LargeLoss();
		} else if (type === __constants.LIABILITY_INFO) {
			obj = new LiabilityInfo();
		} else if (type === __constants.UNDERLYING_POLICIES) {
			obj = new UnderlyingPolicy();
		} else if (type === __constants.FINAL_PRICING) {
			obj = new FinalPricing();
		} else if (type === __constants.PRICING_INDICATION) {
			obj = new PricingIndication();
		} else if (type === __constants.PRICING_CRITERIA) {
			obj = new PricingCriteria();
		} else if (type === __constants.STATIC_DATA) {
			obj = new StaticData();
		} else if (type === __constants.TRANS_LC_201704) {
			obj = new TransLC201704();
		} else if (type === __constants.QUEST_T01) {
			obj = new QuestT01();
		} else if (type === __constants.QUEST_T04) {
			obj = new QuestT04();
		} else if (type === __constants.QUEST_T05) {
			obj = new QuestT05();
		} else if (type === __constants.QUEST_T06) {
			obj = new QuestT06();
		} else if (type === __constants.QUEST_T09) {
			obj = new QuestT09();
		} else if (type === __constants.QUEST_T10) {
			obj = new QuestT10();
		} else if (type === __constants.QUEST_T11) {
			obj = new QuestT11();
		} else if (type === __constants.QUEST_T12) {
			obj = new QuestT12();
		} else if (type === __constants.QUEST_T13) {
			obj = new QuestT13();
		} else if (type === __constants.ONE_M_LAYER) {
			obj = new OneMLayer();
		} else if (type === __constants.TWO_M_LAYER) {
			obj = new TwoMLayer();
		} else if (type === __constants.RATING_FORMULA) {
			obj = new RatingFormula();
		} else if (type === __constants.FACTOR_CALCULATION) {
			obj = new FactorCalculator();
		} else if (type === __constants.RATE_CALCULATION) {
			obj = new RateCalculator();
		} else if (type === __constants.PRICING_VARIABLES) {
			obj = new PricingVariables();
		} else if (type === __constants.ADDITIONAL_DETAILS) {
			obj = new AdditionalDetails();
		} else if (type === __constants.LIABILITY_DETAILS) {
			obj = new LiabilityDetail();
		} else if (type === __constants.SCHEDULE_UNDERLYING_LIMIT) {
			obj = new ScheduleUnderlyingLimit();
		} else if (type === __constants.FORM_SELECTION) {
			obj = new FormDetail();
		} else if (type === __constants.FORMS) {
			obj = new Forms();
		} else if (type === __constants.FORM_INPUT) {
			obj = new FormInput();
		} else if (type === __constants.PREMIUM) {
			obj = new Premium();
		} else if (type === __constants.ADDITIONAL_TERMS) {
			obj = new AdditionalTerms();
		} else if (type === __constants.ADDITIONAL_CHARGES) {
			obj = new AdditionalCharges();
		} else if (type === __constants.SUBJECTIVITY) {
			obj = new Subjectivity();
		} else if (type === __constants.SUBJECTIVITY_INFO) {
			obj = new SubjectivitiyInfo();
		} else if (type === __constants.NOTES) {
			obj = new Notes();
		} else if (type === __constants.NOTE_INFO) {
			obj = new NoteInfo();
		}
		return obj;
	}
	/*********************************************************************************** Object definitions **************************************************************************************************/

	/**
	 * This is template for Quest object
	 * 
	 */
	var Quest = function () {
		this.auth = getObject(__constants.AUTH)
		this.zipTable = getObject(__constants.ZIP_TABLE)
		this.initialEligibility = getObject(__constants.INITIAL_ELIGIBILITY)
		this.fleetEntry = getObject(__constants.FLEET_ENTRY)
		this.underlyingPolicies = getObject(__constants.UNDERLYING_POLICIES)
		this.pricingIndication = getObject(__constants.PRICING_INDICATION)
		this.additionalDetails = getObject(__constants.ADDITIONAL_DETAILS)
		this.forms = getObject(__constants.FORMS)
		this.subjectivity = getObject(__constants.SUBJECTIVITY)
		this.notes = getObject(__constants.NOTES)
		this.declined = null
		this.declinedMsg = null
	}

	var Auth = function () {


		this.user = getObject(__constants.USER)
		this.isLoggedIn = null
	}


	/**
	 * This is template for User object
	 * 
	 */
	var User = function () {

		this.userID = null
		this.userType = null
		this.username = null
		this.password = null
		this.name = null
		this.email = null
		this.producerCode = null
	}

	/**
	 * This is template for State object
	 * 
	 */
	var State = function () {
		this.id = null;
		this.code = null;
		this.name = null;
	}

	/**
	 * This is template for InitialEligibility object
	 * 
	 */
	var InitialEligibility = function () {
		this.dot = null
		this.effDate = null
		this.expDate = null
		this.yearInBus = null
		this.safetyRating = null
		this.passengerInd = null
		this.primaryAL = null
		this.primaryGL = null
		this.primaryEL = null
		this.isDrivingExperience = null
		this.isUnschdVehicle = null
		this.isSrvcProvdOrCommodHauled = null
		this.isCglClass = null

		this.applicantInfo = getObject(__constants.APPLICANT_INFO)
	}

	/**
	 * This is template for ApplicantInfo object
	 * 
	 */
	var ApplicantInfo = function () {
		this.dba = null
		this.applicantName = null
		this.mailingStreet = null
		this.mailingCity = null
		this.mailingZip = null
		this.phyZip = null
		this.hasDOTRevoked = null
		this.mailingState = getObject(__constants.STATE)
		this.vehicleType = null
		this.garbageHaul = null //added by baccarani
	}

	var ZipTable = function () {
		this.predomState = null
		this.predomCounty = null
		this.predomFIPS = null
		this.predomTerrCode = null
		this.predomCity = null
		this.ineligibleZip = null
		this.ineligibleGarbageHauler = null
	}

	/**
	 * This is template for VehicleInfo object
	 * 
	 */
	var VehicleInfo = function () {
		this.vehicleType = null
		this.units = null
		this.factor = null
	}

	/**
	 * This is template for FleetEntry object
	 * 
	 */
	var FleetEntry = function () {
		this.vehicleInfos = [] //List of VehicleInfo
	}

	/**
	 * This is template for LargeLoss object
	 * 
	 */

	var IncurredLoss = function () {
		this.incurred = null
	}


	/**
	 * This is template for LiabilityInfo object
	 * 
	 */
	var LiabilityInfo = function () {
		this.limit = null
		this.premium = null
		this.noOfYearsOfLossRuns = null
		this.noOfClaims = null
		this.totalIncurredLosses = null
		this.largeLosses = null

		this.incurredLosses = [] //List of IncurredLoss
	}

	/**
	 * This is template for UnderlyingPolicy object
	 * 
	 */
	var UnderlyingPolicy = function () {
		this.primaryAutoLiability = getObject(__constants.LIABILITY_INFO)
		this.primaryGeneralLiability = getObject(__constants.LIABILITY_INFO)
		this.primaryEmployersLiability = getObject(__constants.LIABILITY_INFO)
	}


	/**
	 * This is template for FinalPricing object
	 * 
	 */
	var FinalPricing = function () {
		this.excessLimit = null
		this.riskPremium = null
		this.value = null
	}

	/**
	 * This is template for PricingIndication object
	 * 
	 */
	var PricingIndication = function () {
		this.pricing = [] //List of FinalPricing
		this.premium = getObject(__constants.PREMIUM)
		this.additionalTerms = getObject(__constants.ADDITIONAL_TERMS)
		this.additionalCharges = getObject(__constants.ADDITIONAL_CHARGES)
		this.selectedPremium = null

	}

	var Premium = function () {
		this.riskPremium = null;
		this.riskPercent = null;
		this.triaPremium = null;
		this.triaPercent = null;
		this.insurerProcessingFee = null;
		this.totalInsrPrmFees = null;
	}

	var AdditionalCharges = function () {
		this.brokerPolicyFee = null;
		this.surplusLinesTaxesFees = null;
		this.totalPremiumTaxesFees = null;
	}

	var AdditionalTerms = function () {
		this.premiumBasis = 'Flat (Annual)';
		this.minEarnedAtInception = null;
		this.commission = null;
	}

	/**
	 * This is template for Forms object
	 * 
	 */
	var Forms = function () {
		this.formList = []
	}

	/**
	 * This is template for FormDetail object
	 * 
	 */
	var FormDetail = function () {
		this.formID = null;
		this.formNumber = null;
		this.formName = null;
		this.truckingInd = null;
		this.isSelected = null
		this.inputs = []
	}

	/**
	 * This is template for FormInput object
	 * 
	 */
	var FormInput = function () {
		inputDesc = null;
		inputData = null;
		fillInContent = null;
	}

	/**
	 * This is template for AdditionalDetails object
	 * 
	 */
	var AdditionalDetails = function () {
		this.primaryAutoLiability = getObject(__constants.LIABILITY_DETAILS)
		this.primaryGeneralLiability = getObject(__constants.LIABILITY_DETAILS)
		this.primaryEmployersLiability = getObject(__constants.LIABILITY_DETAILS)
	}

	/**
	 * This is template for LiabilityDetail object
	 * 
	 */
	var LiabilityDetail = function () {
		this.insuranceCompany = null;
		this.policyNumber = null;
		this.effDate = null;
		this.expDate = null;
		this.coverage = null;
		this.defenseCosts = null;

		this.scheduleLimits = [];
	}

	/**
	 * This is template for ScheduleUnderlyingLimit object
	 * 
	 */
	var ScheduleUnderlyingLimit = function () {
		this.limit = null;
		this.limitLabel = null;
	}

	/**
	 * This is template for SubjectivityInfo object
	 * 
	 */
	var SubjectivitiyInfo = function () {
		this.subjNum = null;
		this.subjText = null;
	}


	/**
	 * This is template for Subjectivity object
	 * 
	 */
	var Subjectivity = function () {
		this.subjectivities = []
	}

	/**
	 * This is template for NoteInfo object
	 * 
	 */
	var NoteInfo = function () {
		this.noteNum = null;
		this.noteText = null;
	}

	/**
	 * This is template for Notes object
	 * 
	 */
	var Notes = function () {
		this.notes = []
	}


	/**
	 * This is template for StaticData object
	 * 
	 */
	var StaticData = function () {
		this.safetyRating = []
		this.vehicleInfos = []
		this.srvcProvCommHaul = [];
		this.primaryLiabilities = [];
		this.excessLimits = [];
		this.formList = [];
		this.subjectivities = [];
		this.notes = [];
		this.scheduleUnderlyingAL = null
		this.scheduleUnderlyingGL = null
		this.scheduleUnderlyingEL = null
	}

	/**
	 * This is template for PricingCriteria object
	 * 
	 */
	var PricingCriteria = function () {
		this.transLC201704 = getObject(__constants.TRANS_LC_201704)
		this.questT01 = getObject(__constants.QUEST_T01)
		this.questT04 = getObject(__constants.QUEST_T04)
		this.questT05 = getObject(__constants.QUEST_T05)
		this.questT06 = getObject(__constants.QUEST_T06)
		this.questT09 = getObject(__constants.QUEST_T09)
		this.questT10 = getObject(__constants.QUEST_T10)
		this.questT11 = getObject(__constants.QUEST_T11)
		this.questT12 = getObject(__constants.QUEST_T12)
		this.questT13 = getObject(__constants.QUEST_T13)
		this.oneMLayer = getObject(__constants.ONE_M_LAYER)
		this.twoMLayer = getObject(__constants.TWO_M_LAYER)
		this.ratingFormula = getObject(__constants.RATING_FORMULA)
		this.factorCalculator = getObject(__constants.FACTOR_CALCULATION)
		this.rateCalculator = getObject(__constants.RATE_CALCULATION)
		this.pricingVariables = getObject(__constants.PRICING_VARIABLES)
	}

	/**
	 * This is template for TransLC201704 object
	 * 
	 */
	var TransLC201704 = function () {
		this.intercept = null
		this.logUnitCoef = null
		this.logMile = null
		this.logMileCoef = null
		this.logISORate = null
		this.logISORateCoef = null
		this.priorViolCoef = null
		this.priorInspCoef = null
		this.priorCrashCoef = null
		this.cargoCoef = null
		this.popDensity = null
		this.logAvgGwt = null
	}

	/**
	 * This is template for QuestT01 object
	 * 
	 */
	var QuestT01 = function () {
		this.version1 = null
		this.intercept = null
		this.logAvgGwt = null
		this.popDensityCntyAdjInsp = null
		this.popDensityCntyAdjInspSqrt = null
	}

	/**
	 * This is template for QuestT04 object
	 * 
	 */
	var QuestT04 = function () {
		this.layer = null
		this.ILFs = null
	}

	/**
	 * This is template for QuestT05 object
	 * 
	 */
	var QuestT05 = function () {
		this.version_T05 = null
		this.targetLR = null
	}

	/**
	 * This is template for QuestT06 object
	 * 
	 */
	var QuestT06 = function () {
		this.version_T06 = null
		this.alaePerc = null
	}

	/**
	 * This is template for QuestT09 object
	 * 
	 */
	var QuestT09 = function () {
		this.factorZ = null;
		this.factorEER = null;
		this.factorMSL = null;
	}

	/**
	 * This is template for QuestT10 object
	 * 
	 */
	var QuestT10 = function () {
		this.oneMLower = null;
		this.oneMUpper = null;
		this.valLower = null;
		this.valUpper = null;
		this.valLowerWOFloor = null;
	}

	/**
	 * This is template for QuestT11 object
	 * 
	 */
	var QuestT11 = function () {
		this.adjYIB = null;
	}

	/**
	 * This is template for QuestT12 object
	 * 
	 */
	var QuestT12 = function () {
		this.layer = null
		this.ILFs = null
	}

	/**
	 * This is template for QuestT13 object
	 * 
	 */
	var QuestT13 = function () {
		this.factorSLC = null;
		this.factorIBNR = null;
	}

	/**
	 * This is template for Rating Formula object
	 * 
	 */
	var RatingFormula = function () {
		this.baseLC = null;
		this.sizeAdj = null;
		this.mileageAdj = null;
		this.violFactor = null;
		this.inspFactor = null;
		this.crashFactor = null;
		this.lcm = null;
		this.expoAdj = null;
		this.YIBAdj = null;
		this.simplifiedEmodILF = null;
		this.basicLimitPremium = null;
		this.subjectLC = null;
		this.eMod = null;
		this.oneMPremium = null;
		this.oneMPremiumEmod = null;
		this.oneMRate = null;
		this.adjExpo = null;
	}

	/**
	 * This is template for Factor Calculation object
	 * 
	 */
	var FactorCalculator = function () {
		this.baseFatality = null
		this.cargoFactor = null;
		this.weightFactor = null;
		this.popDenFactor = null;
		this.fatalCrash = null;
		this.primaryOneMRate = null;
		this.factor1x1P = null;
		this.rate1x1P = null;
	}

	/**
	 * This is template for Rate Calculation object
	 * 
	 */
	var RateCalculator = function () {
		this.primaryOneMRate_ModelIndicated = null
		this.onex1P_Factor_ModelIndicated = null;
		this.onex1P_Rate_ModelIndicated = null;
		this.primaryOneMRate_PrimaryCharged = null
		this.onex1P_Factor_PrimaryCharged = null;
		this.onex1P_Rate_PrimaryCharged = null;
		this.onex1P_Rate_FinalSelected = null;
	}

	/**
	 * This is template for One Million Layer object
	 * 
	 */
	var OneMLayer = function () {
		this.onex1P_Percent = null
		this.onex1P_WithoutMP = null
		this.onex1P_WithMP = null
		this.onex1P_Accumulation = null
		this.onex1P_GL = null
		this.onex1P_EL = null
	}

	/**
	 * This is template for Two Million Layer object
	 * 
	 */
	var TwoMLayer = function () {
		this.onex1x1P_Percent = null
		this.onex1x1P_WithoutMP = null
		this.onex1x1P_WithMP = null
		this.onex1x1P_Accumulation = null
		this.onex1x1P_GL = null
		this.onex1x1P_EL = null
	}

	/**
	 * This is template for Pricing Variables object
	 * 
	 */
	var PricingVariables = function () {
		this.noOfPU = null
		this.logUnit = null
		this.totalAdj = null;
		this.targetLR = null
		this.alaePerc = null;
		this.weightLower = null;
		this.weightUpper = null;
		this.avgUpLow = null;
		this.dataPoint2 = null;
		this.dataPoint3 = null;
		this.proRata = null;
		this.onexPAnnual = null;
		this.twoxPAnnual = null;
	}

	module.exports = {
		'getObject': getObject,
	}
})();