(function() {
	var constants = {
		//Factory class constants
		QUEST : "QUEST",
		AUTH : "AUTH",
		USER : "USER",
		STATE : "STATE",
		ZIP_TABLE : "ZIP_TABLE",
		APPLICANT_INFO : "APPLICANT_INFO",
		INITIAL_ELIGIBILITY : "INITIAL_ELIGIBILITY",
		VEHICLE_INFO : "VEHICLE_INFO",
		FLEET_ENTRY : "FLEET_ENTRY",
		LARGE_LOSS : "LARGE_LOSS",
		LIABILITY_INFO : "LIABILITY_INFO",
		UNDERLYING_POLICIES : "UNDERLYING_POLICIES",
		FINAL_PRICING : "FINAL_PRICING",
		PRICING_INDICATION : "PRICING_INDICATION",
		ADDITIONAL_DETAILS : "ADDITIONAL_DETAILS",
		LIABILITY_DETAILS : "LIABILITY_DETAILS",
		SCHEDULE_UNDERLYING_LIMIT : "SCHEDULE_UNDERLYING_LIMIT",
		PRICING_CRITERIA : "PRICING_CRITERIA",
		STATIC_DATA : "STATIC_DATA",
		TRANS_LC_201704 : "TRANS_LC_201704",
		QUEST_T01 : "QUEST_T01",
		QUEST_T04 : "QUEST_T04",
		QUEST_T05 : "QUEST_T05",
		QUEST_T06 : "QUEST_T06",
		QUEST_T09 : "QUEST_T09",
		QUEST_T10 : "QUEST_T10",
		QUEST_T11 : "QUEST_T11",
		QUEST_T12 : "QUEST_T12",
		QUEST_T13 : "QUEST_T13",
		ONE_M_LAYER : "ONE_M_LAYER",
		TWO_M_LAYER : "TWO_M_LAYER",
		RATING_FORMULA : "RATING_FORMULA",
		FACTOR_CALCULATION : "FACTOR_CALCULATION",
		RATE_CALCULATION : "RATE_CALCULATION",
		PRICING_VARIABLES : "PRICING_VARIABLES",
		FORMS : "FORMS",
		FORM_SELECTION : "FORM_SELECTION",
		FORM_INPUT : "FORM_INPUT",
		PREMIUM : "PREMIUM",
		ADDITIONAL_TERMS : "ADDITIONAL_TERMS",
		ADDITIONAL_CHARGES : "ADDITIONAL_CHARGES",
		SUBJECTIVITY : "SUBJECTIVITY",
		SUBJECTIVITY_INFO : "SUBJECTIVITY_INFO",
		NOTES : "NOTES",
		NOTE_INFO : "NOTE_INFO",


		//CACHE key for static data
		SAFETY_RATING : "SAFETY_RATING",
		VEHICLE_INFO_STATIC_DATA : "VEHICLE_INFO_STATIC_DATA",
		SERVICES_PROV_COMM_HAULED : "SERVICES_PROV_COMM_HAULED",
		PRIMARY_LIABILITIES : "PRIMARY_LIABILITIES",
		EXCESS_LIMIT : "EXCESS_LIMIT",
		SCHEDULE_UNDERLYING_AL : "SCHEDULE_UNDERLYING_AL",
		SCHEDULE_UNDERLYING_GL : "SCHEDULE_UNDERLYING_GL",
		SCHEDULE_UNDERLYING_EL : "SCHEDULE_UNDERLYING_EL",


		//Key for JSON data
		ZIP_DECLINATION : "ZIP_DECLINATION",
		ZIP_COUNTY_MAP : "ZIP_COUNTY_MAP",
		COUNTY_DECLINATION : "COUNTY_DECLINATION",

		//Subjectivities
		SUBJECTIVITIES : "SUBJECTIVITIES",

		//Safety Rating
		SATISFACTORY : "Satisfactory",
		CONDITIONAL : "Conditional",
		UNSATISFACTORY : "Unsatisfactory",
		NOT_RATED : "Not Rated",

		//Vehilce types
		PRIVATE_PASSENGER : "Private Passenger",
		LIGHT_TRUCKS : "Light Trucks",
		MEDIUM_TRUCKS : "Medium Trucks",
		HEAVY_TRUCKS : "Heavy Trucks",
		EXTRA_HEAVY_TRUCKS : "Extra Heavy Trucks",
		HEAVY_TRUCKS_TRACTORS : "Heavy Trucks/Tractors",
		EXTRA_HEAVY_TRUCKS_TRACTORS : "Extra Heavy Trucks/Tractors",

		//Services Provided or Comm Hauled
		PASSENGER_TRANSIT : "Passenger Transit",
		WATER_HAULING : "Water Hauling",
		HYDRAULIC_FRACTURING : "Hydraulic Fracturing ",
		LOGGING : "Logging",
		HIRED_NON_OWNED_AUTO : "Hired & Non-Owned Auto Only",
		FRIEGHT_FORWARDING : "Freight Forwarding",
		CRANE_SERVICE : "Crane Services",
		EQUIPMENT_RENTAL : "Equipment Rental",
		EXPLOSIVES : "Explosives",
		MEDICAL_TRANSPORT : "Medical Transport",
		BROKERATE_AUTHORITY : "Brokerage Authority Only",
		TOWING : "Towing",
		COAL_COKE : "Coal / Coke",

		//Schedule of Underlying GL Labels 
		EACH_OCC : "Each Occurrence Limit",
		GEN_AGG : "General Aggregate Limit",
		PROD_COMPLETE : "Product/Completed Operations Aggregate Limit",
		PERSONAL_LIMIT : "Personal and Advertising Injury Limit",

		//Schedule of Underlying AL Labels 
		COMB_INJ : "Combined Bodily Injury & Property Damage Single Limit - Each Accident",

		//Schedule of Underlying EL Labels 
		BOD_ACCIDENT : "Bodily Injury by Accident – Each Accident",
		BOD_INJ_DIS : "Bodily Injury by Disease – Policy Limit",
		BOD_INJ_EMP : "Bodily Injury by Disease – Each Employee",

		//Primary liabilities
		PRIMARY_AL : "Primary AL",
		PRIMARY_GL : "Primary GL",
		PRIMARY_EL : "Primary EL",

		//Excess Limit
		ONE_MILLION : "$1,000,000",
		TWO_MILLION : "$2,000,000",

		//Additional Details
		AD_LIMIT_ONE_MILLION : "1000000",
		AD_LIMIT_TWO_MILLION : "2000000",

		//Placeholder Variables for Calculation
		ALAE_PERCENT_VALUE : 1.02,
		TARGET_LR_VALUE : 0.6,
		TWO_M_LAYER_LAYER : "'1x1x1P'",

		ONE : 1,
		YIB_TABLE_CONSTANT : 2,


		STATIC_DATA_LOAD_ERROR : "Problem getting static data. Please contact IT support.",
		SYSTEM_ERROR : "System Error. Please contact IT support."
	}

	var getConstants = function() {
		return constants;
	}

	module.exports = {
		"getConstants" : getConstants
	}
})()