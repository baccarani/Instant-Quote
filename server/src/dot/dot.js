(function () {
	var staticData = require(__path.join(__base, 'dot', 'static-data.js'))

	var rule = require(__path.join(__base, 'dot', 'rule.js'))

	var checkDOTExists = function (dotNumber, callback) {
		var query = "select TOP 1 tc.DOT_NUMBER from TRANS_FMCSA_CENSUS tc where tc.DOT_NUMBER =" + dotNumber

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				callback(null, true)
			} else {
				callback(null, false)
			}
		})
	}







	var checkDOTExists1 = function (dotNumber, callback) {
		var query = "SELECT 1 FROM DOT_IMPORT WHERE DOT_NUMBER =" + dotNumber

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				callback(null, true)
			} else {
				callback(null, false)
			}
		})
	}

	var checkDOTExists2 = function (dotNumber, callback) {
		var query = "SELECT * FROM TRANS_SCORE WHERE DOT_NUMBER =" + dotNumber

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Getting TRANS_SCORE for DOT #: " + dotNumber)
				callback(null, result.recordset[0])
			} else {
				callback(null, false)
			}
		})
	}




	var getDOTData1 = function (dotNumber, callback) {
		var dotExist = true
		__async.series([
			//Yours tasks here
			function (callback) {
				__logger.info("Checking DOT_IMPORT for DOT # " + dotNumber)
				checkDOTExists1(quest.initialEligibility.dot, function (err, res) {
					if (err) {
						return callback(err)
					}
					if (!res) {
						dotExist = false;
					}
					callback()
				})
			},
			function (callback) {
				__logger.info("Checking TRAN_SCORE for DOT # " + dotNumber)

				if (!dotExist) {
					var query = "INSERT INTO DOT_IMPORT (DOT_IMPORT_ID, DOT_NUMBER, INTERCEPT_LC, LOGUNIT_COEF, LOGMILE, LOGMILE_COEF, LOGISORATE, LOGISORATE_COEF, PRIORVIOL_COEF, PRIORINSP_COEF, PRIORCRASH_COEF, POPDENSITY, LOG_AVGGWT, Start_Date, End_Date)\
					SELECT 1, DOT_NUMBER, INTERCEPT_LC, LOGUNIT_COEF, LOGMILE, LOGMILE_COEF, LOGISORATE, LOGISORATE_COEF, PRIORVIOL_COEF, PRIORINSP_COEF, PRIORCRASH_COEF, POPDENSITY, LOG_AVGGWT, GetDate(), DATEADD(day, 90, GetDate())\
					FROM TRANS_SCORE WHERE DOT_NUMBER = " + dotNumber
				}
				callback()
			},
		], function (err) {
			if (err) {
				callback(err, null)
			}

			callback(null, authDetail)
		})

	}











	/**
	 * This function gets the Quest object given the DOT number. This also talks to canadvantage.com to read XML feed.
	 * 
	 * @param {any} dotNumber 
	 * @param {any} callback 
	 */
	var getDOTData = function (dotNumber, callback) {
		var query = "select * from TRANS_FMCSA_CENSUS tc where tc.DOT_NUMBER =" + dotNumber



		__logger.info("Getting data for DOT # " + dotNumber)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for DOT # " + dotNumber)

				var quest = populateDOTObject(result.recordset[0])

				//This series of steps first get the data from the XML feed and populate the quest object only then the initial declination rule will be run.
				__async.series([
					function (callback) {
						__logger.info("Getting XML data for DOT # " + dotNumber)

						__util.getXMLDataFromURL(__config.cabAdvantage.url + dotNumber, function (err, res) {
							if (err)
								return callback(err)

							if (res) {
								//Years in business
								var moment = __util.getDateUtil()
								var now = moment().startOf('day')
								var start = moment(res.RESULTS.CARRIER[0].MCS150[0].status[0].$.dot_active, 'MM/DD/YYYY')
								var duration = moment.duration(now.diff(start)).asYears();
								quest.initialEligibility.yearInBus = Math.round(duration)

								//Safety rating
								var safetyObj = res.RESULTS.CARRIER[0].RATINGS[0].rating[3].safety[0]
								var safetyRating = ''
								if (safetyObj != null && safetyObj != "") {
									safetyRating = safetyObj.$.score
								}
								quest.initialEligibility.safetyRating = (safetyRating != null && safetyRating == '') ? "NR" : safetyRating

								//Passenger indicator
								var passengerObj = res.RESULTS.CARRIER[0].MCS150[0]
								var passengerInd = ''
								if (passengerObj != null && passengerObj != "") {
									passengerInd = passengerObj.passenger[0]
								}
								quest.initialEligibility.passengerInd = passengerInd
								callback()
							}
						})
					},
					function (callback) {
						__logger.info("Populating Fleet entry data for DOT # " + dotNumber)

						populateFleetEntry(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Populating Pricing Indication data for DOT # " + dotNumber)

						populatePricingIndication(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Populating Additional Details data for DOT # " + dotNumber)

						populateAdditionalDetails(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Populating Forms data for DOT # " + dotNumber)

						populateForms(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Populating Subjectivities data for DOT # " + dotNumber)

						populateSubjectivities(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Populating Notes data for DOT # " + dotNumber)

						populateNotes(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					},
					function (callback) {
						__logger.info("Running initial Declination rule for DOT # " + dotNumber)

						rule.runInitialDeclinationRules(quest, function (err, res) {
							if (err)
								return callback(err)
							quest = res
							callback()
						})
					}], function (err) {
						if (err)
							return callback(err)

						__logger.info("Object constructed for DOT # " + dotNumber)

						__logger.info("Final Quest Object for DOT # " + dotNumber + __os.EOL + JSON.stringify(quest))
						callback(err, quest)
					})
			} else {
				__logger.warn("DOT # " + dotNumber + " not found.")
				callback("DOT # " + dotNumber + " not found.")
			}
		})
	}

	/**
	 * This function get T01 Fatality Coef data required to calculate the price
	 * 
	 * @param {any} version_Quest_T01_FatalityCoef 
	 * @param {any} callback 
	 */
	var getQuest_T01_FatalityCoef = function (version_Quest_T01_FatalityCoef, callback) {
		var query = "select * from Quest_T01_FatalityCoef where Version =" + version_Quest_T01_FatalityCoef

		__logger.info("Getting data for Fatality Coef with version " + version_Quest_T01_FatalityCoef)


		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for Fatality Coef with version " + version_Quest_T01_FatalityCoef)
				callback(err, populate_Quest_T01_FatalityCoef(result.recordset[0]))
			} else {
				__logger.error("Data not found for FatalityCoef with version " + version_Quest_T01_FatalityCoef)
				callback("Data not found for FatalityCoef with version " + version_Quest_T01_FatalityCoef)
			}
		})
	}

	/**
	 * This function get T04 ILF data required to calculate the price
	 * 
	 * @param {any} layer_Quest_T04_ILFs 
	 * @param {any} callback 
	 */
	var getQuest_T04_ILFs = function (layer_Quest_T04_ILFs, callback) {
		var query = "select * from Quest_T04_ILFs where Layer =" + layer_Quest_T04_ILFs

		__logger.info("Getting data for T04ILFs with layer " + layer_Quest_T04_ILFs)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for T04ILFS  with layer " + layer_Quest_T04_ILFs)
				callback(err, populate_Quest_T04_ILFs(result.recordset[0]))
			} else {
				__logger.error("Data not found for ILFs with layer " + layer_Quest_T04_ILFs)
				callback("Data not found for ILFs with layer " + layer_Quest_T04_ILFs)
			}
		})
	}

	/**
	 * This function get T05 ELR data required to calculate the price
	 * 
	 * @param {any} layer_Quest_T05_ELR
	 * @param {any} callback 
	 */
	var getQuest_T05_ELR = function (version_Quest_T05_ELR, callback) {
		var query = "select * from Quest_T05_ELR where Version =" + version_Quest_T05_ELR

		__logger.info("Getting data for T05ELR with version " + version_Quest_T05_ELR)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for T05_ELR  with version " + version_Quest_T05_ELR)
				callback(err, populate_Quest_T05_ELR(result.recordset[0]))
			} else {
				__logger.error("Data not found for TargetLR with version " + version_Quest_T05_ELR)
				callback("Data not found for TargetLR with version " + version_Quest_T05_ELR)
			}
		})
	}

	/**
	 * This function get T06 ALAE data required to calculate the price
	 * 
	 * @param {any} layer_Quest_T06_ALAE
	 * @param {any} callback 
	 */
	var getQuest_T06_ALAE = function (version_Quest_T06_ALAE, callback) {
		var query = "select * from Quest_T06_ALAE where version =" + version_Quest_T06_ALAE

		__logger.info("Getting data for T06ALAE with version " + version_Quest_T06_ALAE)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for T06_ALAE  with version " + version_Quest_T06_ALAE)
				callback(err, populate_Quest_T06_ALAE(result.recordset[0]))
			} else {
				__logger.error("Data not found for ALAE with version " + version_Quest_T06_ALAE)
				callback("Data not found for ALAE with version " + version_Quest_T06_ALAE)
			}
		})
	}

	/**
	* This function get T09 ExpMSL data required to calculate the price
	* 
	* @param {any} valLower 
	* @param {any} valUpper 
	* @param {any} callback 
	*/
	/*var getQuest_T09_ExpMSL = function(subjectLC, callback) {
		
		subjectLC = 50000
		
		var query = "select * from Quest_T09_ExpMSL where CSLC_L < " + subjectLC + " and " + subjectLC + " < CSLC_H"

		__logger.info("Getting data for Z + EER + MSL with subjectLC " + subjectLC)


		__sqlutil.query(query, function(err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for Z + EER + MSL with subjectLC " + subjectLC)
				callback(err, populate_Quest_T09_ExpMSL(result.recordset[0]))
			} else {
				__logger.error("Data not found for Z + EER + MSL with subjectLC " + subjectLC)
				callback("Data not found for Z + EER + MSL with subjectLC " + subjectLC)
			}
		})
	}*/

	/**
	* This function get T10 1x1Min data required to calculate the price
	* 
	* @param {any} valLower 
	* @param {any} valUpper 
	* @param {any} callback 
	*/
	var getQuest_T10_1x1Min = function (valLower, valUpper, valLowerWOFloor, callback) {

		//If valLower is greater than or equal to 5 (because of db), we have to reduce by 1.
		valLower = valLower >= 5 ? valLower - 1 : valLower

		/* 
		    valUpper is always valLower + 1 but valUpper max value in the DB is 4. So if it is greater than or equal to 6, we have to subtract 2. 
		    If not, top value will be valLower + 1, which should be less than 5. 
		*/
		valUpper = valUpper >= 6 ? valUpper - 2 : ((valLower < 4) ? valLower + 1 : valLower)

		var query = "SELECT l.[1000000] lowUnit, u.[1000000] upUnit FROM [FMCSA].[dbo].[Quest_T10_1x1Min] l join [FMCSA].[dbo].[Quest_T10_1x1Min] u on l.units = " + valLower + " AND u.units = " + valUpper

		__logger.info("Getting Data for T10_1x1Min with lowerLimit " + valLower + " and upperLimit " + valUpper)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating Data for T10_1x1Min with lowerLimit " + valLower + " and upperLimit " + valUpper)
				callback(err, populate_Quest_T10_1x1Min(valLower, valUpper, valLowerWOFloor, result.recordset[0]))
			} else {
				__logger.error("Data not found for T10_1x1Min with lowerLimit " + valLower + " and upperLimit " + valUpper)
				callback("Data not found for T10_1x1Min with lowerLimit " + valLower + " and upperLimit " + valUpper)
			}
		})
	}

	/**
	 * This function get T11 Fatality Coef data required to calculate the price
	 * 
	 * @param {any} YIB 
	 * @param {any} callback 
	 */
	var getQuest_T11_YIBFactor = function (yib, callback) {
		var query = "select * from Quest_T11_YIBFactor where YIB =" + yib

		__logger.info("Getting data for YIB Factor with years in business " + yib)


		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for YIB Factor with years in business " + yib)
				callback(err, populate_Quest_T11_YIBFactor(result.recordset[0]))
			} else {
				__logger.error("Data not found for YIB Factor with years in business " + yib)
				callback("Data not found for YIB Factor with years in business " + yib)
			}
		})
	}

	/**
	 * This function get T12 ILF GL data required to calculate the price
	 * 
	 * @param {any} layer_Quest_T12_ILFs_GL 
	 * @param {any} callback 
	 */
	var getQuest_T12_ILFs_GL = function (layer_Quest_T12_ILFs_GL, callback) {
		var query = "select * from Quest_T12_ILFs_GL where Layer =" + layer_Quest_T12_ILFs_GL

		__logger.info("Getting data for T12ILFsGL with layer " + layer_Quest_T12_ILFs_GL)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for T12ILFsGL  with layer " + layer_Quest_T12_ILFs_GL)
				callback(err, populate_Quest_T04_ILFs(result.recordset[0]))
			} else {
				__logger.error("Data not found for ILFs with layer " + layer_Quest_T12_ILFs_GL)
				callback("Data not found for ILFs with layer " + layer_Quest_T12_ILFs_GL)
			}
		})
	}

	var getQuest_T13_SLCFactors = function (ylr, callback) {
		var query = "select * from Quest_T13_SLCFactors where YrsOfLossRun =" + ylr

		__logger.info("Getting data for SLC + IBNR Factors with YrsOfLossRun " + ylr)


		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for SLC + IBNR Factors with YrsOfLossRun " + ylr)
				callback(err, populate_Quest_T13_SLCFactors(result.recordset[0]))
			} else {
				__logger.error("Data not found for SLC + IBNR Factors with YrsOfLossRun " + ylr)
				callback("Data not found for SLC + IBNR Factors with YrsOfLossRun " + ylr)
			}
		})
	}

	/**
	 * This function get TRANS_LC_201704 data required to calculate the price
	 * 
	 * @param {any} dotNumber 
	 * @param {any} callback 
	 */
	var getTRANS_LC_201704 = function (dotNumber, callback) {
		var query = "select * from TRANS_SCORE where CENSUS_NUM =" + dotNumber

		__logger.info("Getting data for LC_201704 with DOT # " + dotNumber)

		__sqlutil.query(query, function (err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			if (result && result.recordset && result.recordset.length > 0) {
				__logger.info("Populating data for LC_201704 with DOT # " + dotNumber)
				callback(err, populateTRANS_LC_201704(result.recordset[0]))
			} else {
				__logger.error("Data not found for LC_201704 with DOT # " + dotNumber)
				callback("Data not found for LC_201704 with DOT # " + dotNumber)
			}
		})
	}

	/**
	 * This function is used to populate Quest object from the DB result
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populateDOTObject = function (recordset) {
		var quest = __factory.getObject(__constants.QUEST)

		quest.initialEligibility = populateInitialEligibility(recordset)
		quest.underlyingPolicies = populateUnderlyingPolicies(recordset)
		return quest
	}

	/**
	 * This function is used to populate Initial Eligibility Section of the Quest object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populateInitialEligibility = function (recordset) {
		var initialEligibility = __factory.getObject(__constants.INITIAL_ELIGIBILITY)

		initialEligibility.dot = recordset['DOT_NUMBER']
		initialEligibility.primaryAL = true
		initialEligibility.effDate = null
		initialEligibility.expDate = null
		initialEligibility.applicantInfo = populateApplicantInfo(recordset)
		return initialEligibility
	}

	/**
	 * This function is used to populate Application info inside Initial Eligibility Section of the Quest object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populateApplicantInfo = function (recordset) {
		var applicantInfo = __factory.getObject(__constants.APPLICANT_INFO)
		var state = __factory.getObject(__constants.STATE)

		applicantInfo.applicantName = recordset['INSURED_NAME']
		applicantInfo.mailingStreet = recordset['MAILING_STREET']
		applicantInfo.mailingCity = recordset['MAILING_CITY']
		applicantInfo.mailingZip = recordset['MAILING_ZIP']
		applicantInfo.phyZip = recordset['PHY_ZIP']
		applicantInfo.hasDOTRevoked = recordset['USDOT_REVOKED'] == "X" ? "Y" : "N"

		state.code = recordset['MAILING_STATE']
		applicantInfo.mailingState = state

		applicantInfo.vehicleType = recordset['TOT_TRUCKS'] > recordset['TOT_BUSES'] ? "T" : "B"
		applicantInfo.garbageHaul = recordset['GARBAGE']
		return applicantInfo
	}

	/**
	 * This function is used to populate all the Liability information.
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populateUnderlyingPolicies = function (recordset) {
		var underlyingPolicy = __factory.getObject(__constants.UNDERLYING_POLICIES)
		//Nothing to populate as of now but will be read from DB in future        
		return underlyingPolicy
	}


	var populateAdditionalDetails = function (quest, callback) {

		__async.series([
			function (callback) {
				staticData.getStaticDataByKey(__constants.SCHEDULE_UNDERLYING_AL, function (err, res) {
					if (err)
						return callback(err)
					quest.additionalDetails.primaryAutoLiability.scheduleLimits = res
					callback()
				})
			},
			function (callback) {
				staticData.getStaticDataByKey(__constants.SCHEDULE_UNDERLYING_GL, function (err, res) {
					if (err)
						return callback(err)
					quest.additionalDetails.primaryGeneralLiability.scheduleLimits = res
					callback()
				})

			},
			function (callback) {
				staticData.getStaticDataByKey(__constants.SCHEDULE_UNDERLYING_EL, function (err, res) {
					if (err)
						return callback(err)
					quest.additionalDetails.primaryEmployersLiability.scheduleLimits = res
					callback()
				})

			}
		],
			function (err) {
				if (err)
					return callback(err)
				callback(null, quest)
			})
	}

	var populateForms = function (quest, callback) {

		__async.series([
			function (callback) {
				staticData.getStaticDataByKey(__constants.FORM_SELECTION, function (err, res) {
					if (err)
						return callback(err)
					quest.forms.formList = res
					quest.forms.formList.forEach((form) => {
						switch (quest.initialEligibility.applicantInfo.mailingState.code) {
							case 'FL': {
								if (form.formID === 27 || form.formID === 28) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'LA': {
								if (form.formID === 26 || form.formID === 29) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'NH': {
								if (form.formID === 25 || form.formID === 30) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'VT': {
								if (form.formID === 24 || form.formID === 31) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'WV': {
								if (form.formID === 23 || form.formID === 32) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'AK': {
								if (form.formID === 33) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'CA': {
								if (form.formID === 34) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'ND': {
								if (form.formID === 35) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'VA': {
								if (form.formID === 36 || form.formID === 37) {
									form.truckingInd = 'M'
								}
								break
							}
							case 'TX': {
								if (form.formID === 38) {
									form.truckingInd = 'M'
								}
								break
							}
						}
					});
					callback()
				})
			},
		],
			function (err) {
				if (err)
					return callback(err)
				callback(null, quest)
			})
	}

	var populateSubjectivities = function (quest, callback) {

		__async.series([
			function (callback) {
				staticData.getStaticDataByKey(__constants.SUBJECTIVITIES, function (err, res) {
					if (err)
						return callback(err)
					quest.subjectivities = res
					callback()
				})
			},
		],
			function (err) {
				if (err)
					return callback(err)
				callback(null, quest)
			})
	}

	var populateNotes = function (quest, callback) {

		__async.series([
			function (callback) {
				staticData.getStaticDataByKey(__constants.NOTES, function (err, res) {
					if (err)
						return callback(err)
					quest.notes = res
					callback()
				})
			},
		],
			function (err) {
				if (err)
					return callback(err)
				callback(null, quest)
			})
	}

	/**
	 * This function is used to populate T01 Fatality Coef object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T01_FatalityCoef = function (recordset) {
		//Quest_T01_FatalityCoef
		var quest_T01 = __factory.getObject(__constants.QUEST_T01)

		quest_T01.version1 = recordset['Version']
		quest_T01.intercept = recordset['Intercept']
		quest_T01.logAvgGwt = recordset['LOG_AVGGWT']
		quest_T01.popDensityCntyAdjInsp = recordset['POPDENSITY_COUNTY_ADJ_INSP']
		quest_T01.popDensityCntyAdjInspSqrt = recordset['POPDENSITY_COUNTY_ADJ_INSP_SQRT']
		return quest_T01
	}

	/**
	 * This function is used to populate T04 ILF object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T04_ILFs = function (recordset) {
		//Quest_T04_ILFs
		var quest_T04 = __factory.getObject(__constants.QUEST_T04)

		quest_T04.layer = recordset['Layer']
		quest_T04.ILFs = recordset['ILFs']
		return quest_T04
	}

	/**
	 * This function is used to populate T05 ELR object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T05_ELR = function (recordset) {
		//Quest_T05_ELR
		var quest_T05 = __factory.getObject(__constants.QUEST_T05)

		quest_T05.targetLR = recordset['TargetLR']
		return quest_T05
	}

	/**
	 * This function is used to populate T06 ALAE object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T06_ALAE = function (recordset) {
		//Quest_T06_ALAE
		var quest_T06 = __factory.getObject(__constants.QUEST_T06)

		quest_T06.alaePerc = recordset['ALAEPerc']
		return quest_T06
	}

	/**
	 * This function is used to populate T09 Exp MSL object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	/*var populate_Quest_T09_ExpMSL = function(recordset) {
		//Quest_T09_ExpMSL
		var quest_T09 = __factory.getObject(__constants.QUEST_T09)

		quest_T09.factorZ = recordset['Z']
		quest_T09.factorEER = recordset['EER']
		quest_T09.factorMSL = recordset['MSL']
		return quest_T09
	}*/

	/**
	 * This function is used to populate T10 1x1Min object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T10_1x1Min = function (valLower, valUpper, valLowerWOFloor, recordset) {
		//Quest_T10_1x1Min
		var questT10 = __factory.getObject(__constants.QUEST_T10)

		questT10.oneMLower = recordset['lowUnit']
		questT10.oneMUpper = recordset['upUnit']
		questT10.valLowerWOFloor = valLowerWOFloor
		questT10.valLower = valLower
		questT10.valUpper = valUpper
		return questT10
	}

	/**
	 * This function is used to populate T11 YIB Factor object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T11_YIBFactor = function (recordset) {
		//Quest_T11_YIBFactor
		var quest_T11 = __factory.getObject(__constants.QUEST_T11)

		quest_T11.adjYIB = recordset['Debit']
		return quest_T11
	}

	/**
	 * This function is used to populate T12 ILF GL object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T12_ILFs_GL = function (recordset) {
		//Quest_T04_ILFs
		var quest_T12 = __factory.getObject(__constants.QUEST_T12)

		quest_T12.layer = recordset['Layer']
		quest_T12.ILFs = recordset['ILFs']
		return quest_T12
	}

	/**
	 * This function is used to populate T13 SLC Factor object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populate_Quest_T13_SLCFactors = function (recordset) {
		//Quest_T13_SLCFactors
		var quest_T13 = __factory.getObject(__constants.QUEST_T13)

		quest_T13.factorSLC = recordset['SLC_Factor']
		quest_T13.factorIBNR = recordset['IBNR_Factor']
		return quest_T13
	}

	/**
	 * This function is used to populate Trancs LC 201704 object from DB
	 * 
	 * @param {any} recordset 
	 * @returns 
	 */
	var populateTRANS_LC_201704 = function (recordset) {
		var transLC201704 = __factory.getObject(__constants.TRANS_LC_201704)

		transLC201704.intercept = recordset['INTERCEPT_LC']
		transLC201704.logUnitCoef = recordset['LOGUNIT_COEF']
		transLC201704.logMile = recordset['LOGMILE']
		transLC201704.logMileCoef = recordset['LOGMILE_COEF']
		transLC201704.logISORate = recordset['LOGISORATE']
		transLC201704.logISORateCoef = recordset['LOGISORATE_COEF']
		transLC201704.priorViolCoef = recordset['PRIORVIOL_COEF']
		transLC201704.priorInspCoef = recordset['PRIORINSP_COEF']
		transLC201704.priorCrashCoef = recordset['PRIORCRASH_COEF']
		transLC201704.cargoCoef = recordset['CARGO_COEF']
		transLC201704.popDensity = recordset['POPDENSITY']
		transLC201704.logAvgGwt = recordset['LOG_AVGGWT']
		return transLC201704
	}

	/**
	 * This function is used to populate Fleet Entry
	 * 
	 * @param {any} quest 
	 * @param {any} callback 
	 */
	var populateFleetEntry = function (quest, callback) {
		var fleetEntry = __factory.getObject(__constants.FLEET_ENTRY)

		staticData.getStaticDataByKey(__constants.VEHICLE_INFO_STATIC_DATA, function (err, res) {
			if (err) {
				return callback(err)
			}
			quest.fleetEntry.vehicleInfos = res
			callback(err, quest)
		})
	}

	/**
	 * This function is used to populate Pricing Indication
	 * 
	 * @param {any} quest 
	 * @param {any} callback 
	 */
	var populatePricingIndication = function (quest, callback) {
		var pricingIndication = __factory.getObject(__constants.PRICING_INDICATION)
		//Nothing to populate as of now but will be read from DB in future.Just return empty final pricings.
		staticData.getStaticDataByKey(__constants.EXCESS_LIMIT, function (err, res) {
			if (err)
				return callback(err)

			quest.pricingIndication.pricing = res
			callback(null, quest)
		})
	}

	/**
	 * This function gets the price based on the calculation and the user and DB information
	 * 
	 * @param {any} quest 
	 * @param {any} callback 
	 */
	var generateQuote = function (quest, callback) {
		var pricingCriteria = __factory.getObject(__constants.PRICING_CRITERIA)

		__async.series([
			function (callback) {
				checkDOTExists(quest.initialEligibility.dot, function (err, res) {
					if (err)
						return callback(err)

					if (res) {
						callback()
					} else {
						__logger.error("DOT # " + quest.initialEligibility.dot + " not found.")
						return callback("DOT # " + quest.initialEligibility.dot + " not found.")
					}
				})
			},
			//DB and User Inputs
			function (callback) {
				populatePricingCriteria(quest, pricingCriteria, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria = res
					callback()
				})
			},
			//Premium Calculation
			function (callback) {
				calculatePremium(quest, pricingCriteria, function (err, res) {
					if (err)
						return callback(err)

					quest = res
					callback()
				})
			}

		], function (err) {
			if (err) {
				return callback(err, null)
			}
			callback(err, quest)
		})

	}

	/**
	 * This function populates pricing criteria with the DB and user inputs
	 * 
	 * @param {any} quest 
	 * @param {any} pricingCriteria 
	 * @param {any} callback 
	 */
	var populatePricingCriteria = function (quest, pricingCriteria, callback) {
		__logger.info("Populating Pricing Criteria for DOT # " + quest.initialEligibility.dot)

		var valUpper = null
		var valLower = null
		var valLowerWOFloor = null
		__async.series([
			//Used for calculating unit based calculations based on user input
			function (callback) {
				for (let vehicleInfo of quest.fleetEntry.vehicleInfos) {
					valLower += (vehicleInfo.units != null && vehicleInfo.units != '') ? Number(vehicleInfo.units) * vehicleInfo.factor : 0
				}
				valLowerWOFloor = valLower
				valLower = Math.floor(valLower)
				valUpper = valLower + 1
				callback()
			},
			//TRANS_LC_201704 Data
			function (callback) {
				getTRANS_LC_201704(quest.initialEligibility.dot, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.transLC201704 = res
					callback()
				})
			},
			//Quest T01 Data
			function (callback) {
				getQuest_T01_FatalityCoef(__constants.ONE, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT01 = res
					callback()
				})
			},
			//QUEST_T04 Data
			function (callback) {
				getQuest_T04_ILFs(__constants.TWO_M_LAYER_LAYER, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT04 = res
					callback()
				})
			},
			//Quest T05 Data
			function (callback) {
				getQuest_T05_ELR(__constants.ONE, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT05 = res
					callback()
				})
			},
			//Quest T06 Data
			function (callback) {
				getQuest_T06_ALAE(__constants.ONE, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT06 = res
					callback()
				})
			},
			//QUEST_T09 Data 
			/*function(callback) {
				getQuest_T09_ExpMSL(subjectLC, function(err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT09 = res
					callback()
				})
			},*/
			//Quest T10 Data
			function (callback) {
				getQuest_T10_1x1Min(valLower, valUpper, valLowerWOFloor, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT10 = res

					callback()
				})
			},
			//QUEST_T11 Data            
			function (callback) {
				//if Years in Business is greater than 2 then YIB factor is 1 otherwise get the factor from the table
				if (quest.initialEligibility.yearInBus > __constants.YIB_TABLE_CONSTANT) {
					pricingCriteria.questT11 = __factory.getObject(__constants.QUEST_T11)
					pricingCriteria.questT11.adjYIB = 1
					callback()
				} else {
					getQuest_T11_YIBFactor(quest.initialEligibility.yearInBus, function (err, res) {
						if (err)
							return callback(err)

						pricingCriteria.questT11 = res
						callback()
					})
				}
			},
			//QUEST_T12 Data 
			function (callback) {
				getQuest_T12_ILFs_GL(__constants.TWO_M_LAYER_LAYER, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT12 = res
					callback()
				})
			},
			//QUEST_T13 Data 
			function (callback) {
				getQuest_T13_SLCFactors(quest.underlyingPolicies.primaryAutoLiability.noOfYearsOfLossRuns, function (err, res) {
					if (err)
						return callback(err)

					pricingCriteria.questT13 = res
					callback()
				})
			},
		], function (err) {
			if (err)
				return callback(err, null)

			__logger.info("Pricing Criteria for DOT # " + quest.initialEligibility.dot + " populated successfully")

			__logger.info("Pricing Criteria object for DOT # " + quest.initialEligibility.dot + __os.EOL + JSON.stringify(pricingCriteria))
			callback(err, pricingCriteria)
		})
	}



	/**
	 * This function calculates all variables needed for the final pricing and populates final pricing
	 * 
	 * @param {any} quest 
	 * @param {any} pricingCriteria 
	 * @param {any} callback 
	 */
	var calculatePremium = function (quest, pricingCriteria, callback) {

		__logger.info("Calculating Premium for DOT # " + quest.initialEligibility.dot)

		var oneMLayer = __factory.getObject(__constants.ONE_M_LAYER)
		var twoMLayer = __factory.getObject(__constants.TWO_M_LAYER)
		var ratingFormula = __factory.getObject(__constants.RATING_FORMULA)
		var factorCalculator = __factory.getObject(__constants.FACTOR_CALCULATION)
		var rateCalculator = __factory.getObject(__constants.RATE_CALCULATION)
		var pricingVariables = __factory.getObject(__constants.PRICING_VARIABLES)


		////////////////////////////////////
		//Commercial Auto Rating Worksheet//
		////////////////////////////////////


		/* Primary $1M Premium Rating Formula: */

		//Exposure Summary
		pricingVariables.totalAdj = pricingCriteria.questT10.valLowerWOFloor
		ratingFormula.adjExpo = pricingVariables.totalAdj
		//# Of PU
		pricingVariables.noOfPU = 0
		for (let vehicleInfo of quest.fleetEntry.vehicleInfos) {
			pricingVariables.noOfPU += ((vehicleInfo.units == null || vehicleInfo.units == '') ? 0 : vehicleInfo.units)
		}
		//Log Unit
		pricingVariables.logUnit = Math.log(pricingVariables.noOfPU)
		if (pricingVariables.logUnit >= 5000) {
			pricingVariables.logUnit = 5000;
		} else {
			pricingVariables.logUnit = pricingVariables.logUnit;
		}
		//Base LC
		ratingFormula.baseLC = Math.exp(pricingCriteria.transLC201704.intercept + ((pricingCriteria.transLC201704.logISORate * pricingCriteria.transLC201704.logISORateCoef)))
		//Size Adj
		ratingFormula.sizeAdj = Math.exp(Math.log(pricingVariables.noOfPU) * pricingCriteria.transLC201704.logUnitCoef)
		//Mileage Adj
		ratingFormula.mileageAdj = Math.exp(pricingCriteria.transLC201704.logMile * pricingCriteria.transLC201704.logMileCoef)
		//Viol Factor
		ratingFormula.violFactor = Math.exp(pricingCriteria.transLC201704.priorViolCoef)
		//Insp Factor
		ratingFormula.inspFactor = Math.exp(pricingCriteria.transLC201704.priorInspCoef)
		//Crash Factor
		ratingFormula.crashFactor = Math.exp(pricingCriteria.transLC201704.priorCrashCoef)
		//LCM
		ratingFormula.lcm = 1 / pricingCriteria.questT05.targetLR * pricingCriteria.questT06.alaePerc
		//Expo Adj
		ratingFormula.expoAdj = ratingFormula.adjExpo / pricingVariables.noOfPU
		//YIB Factor
		ratingFormula.YIBAdj = pricingCriteria.questT11.adjYIB
		//Emod
		ratingFormula.eMod = 1 //PLACEHOLDER
		//$1M Premium
		ratingFormula.oneMPremium = pricingVariables.noOfPU * ratingFormula.baseLC * ratingFormula.sizeAdj * ratingFormula.mileageAdj *
			ratingFormula.violFactor * ratingFormula.inspFactor * ratingFormula.crashFactor * ratingFormula.lcm * ratingFormula.expoAdj * ratingFormula.YIBAdj

		/* Emod */

		//ILF Back into 100k
		ratingFormula.simplifiedEmodILF = 0.505
		//Basic Limit Premium
		ratingFormula.basicLimitPremium = ratingFormula.oneMPremium * ratingFormula.simplifiedEmodILF
		//Subject Loss Cost
		ratingFormula.subjectLC = ratingFormula.basicLimitPremium * pricingCriteria.questT13.factorSLC
		//$1M Premium With Emod
		ratingFormula.oneMPremiumEmod = ratingFormula.oneMPremium * ratingFormula.eMod


		/* 1x1 Factor Calculation */

		//Base Fatality %
		factorCalculator.baseFatality = Math.exp(pricingCriteria.questT01.intercept) * 100
		//Cargo Factor
		factorCalculator.cargoFactor = Math.exp(pricingCriteria.transLC201704.cargoCoef)
		//Weight Factor
		factorCalculator.weightFactor = Math.exp(pricingCriteria.transLC201704.logAvgGwt * pricingCriteria.questT01.logAvgGwt)
		//PopDen Factor
		factorCalculator.popDenFactor = Math.exp(pricingCriteria.transLC201704.popDensity * pricingCriteria.questT01.popDensityCntyAdjInsp +
			Math.pow(pricingCriteria.transLC201704.popDensity, 2) * pricingCriteria.questT01.popDensityCntyAdjInspSqrt)
		//Fata/Crash
		factorCalculator.fatalCrash = factorCalculator.baseFatality * factorCalculator.cargoFactor * factorCalculator.weightFactor * factorCalculator.popDenFactor

		/* 1x1P Rate Calculation */

		//Primary 1M Rate - Model Indicated
		rateCalculator.primaryOneMRate_ModelIndicated = ratingFormula.oneMPremium / pricingVariables.noOfPU
		//1x1P Factor - Model Indicated
		rateCalculator.onex1P_Factor_ModelIndicated = (Math.max(0.17, 0.17 * (factorCalculator.fatalCrash / 3.6)))
		//1x1P Rate - Model Indicated
		rateCalculator.onex1P_Rate_ModelIndicated = rateCalculator.primaryOneMRate_ModelIndicated * rateCalculator.onex1P_Factor_ModelIndicated
		//Primary 1M Rate - Primary Charged
		rateCalculator.primaryOneMRate_PrimaryCharged = quest.underlyingPolicies.primaryAutoLiability.premium / pricingVariables.noOfPU
		//1x1P Factor - Primary Charged
		rateCalculator.onex1P_Factor_PrimaryCharged = 0.18 //PLACEHOLDER
		//1x1P Rate - Primary Charged
		rateCalculator.onex1P_Rate_PrimaryCharged = rateCalculator.primaryOneMRate_PrimaryCharged * rateCalculator.onex1P_Factor_PrimaryCharged
		//1x1P Rate - Final Selected
		rateCalculator.onex1P_Rate_FinalSelected = Math.max(rateCalculator.onex1P_Rate_ModelIndicated, rateCalculator.onex1P_Rate_PrimaryCharged)

		/* Primary GL Rating */
		if (quest.initialEligibility.primaryGL == true) {
			//1x1P - GL
			oneMLayer.onex1P_GL = Math.max(150, quest.underlyingPolicies.primaryGeneralLiability.premium * 0.25)
			//1x1x1P - GL
			twoMLayer.onex1x1P_GL = oneMLayer.onex1P_GL * pricingCriteria.questT12.ILFs
		}

		/* Primary EL Rating */
		if (quest.initialEligibility.primaryEL == true) {
			//1x1P - EL
			oneMLayer.onex1P_EL = Math.max(25, pricingVariables.noOfPU * 10)
			//1x1x1P - EL
			twoMLayer.onex1x1P_EL = oneMLayer.onex1P_EL * pricingCriteria.questT12.ILFs
		}

		//Excess Layer Premium Calculation
		oneMLayer.onex1P_WithoutMP = rateCalculator.onex1P_Rate_FinalSelected * pricingVariables.noOfPU
		twoMLayer.onex1x1P_Percent = pricingCriteria.questT04.ILFs
		twoMLayer.onex1x1P_WithoutMP = oneMLayer.onex1P_WithoutMP * twoMLayer.onex1x1P_Percent
		pricingVariables.weightUpper = ratingFormula.adjExpo - Math.ceil(ratingFormula.adjExpo)
		pricingVariables.weightLower = 1 - pricingVariables.weightUpper
		pricingVariables.avgUpLow = (pricingVariables.weightLower * pricingCriteria.questT10.oneMLower) + (pricingVariables.weightUpper * pricingCriteria.questT10.oneMUpper)
		pricingVariables.dataPoint2 = ((Math.min(4, pricingVariables.totalAdj) - pricingCriteria.questT10.valLower) * pricingCriteria.questT10.oneMUpper + (1 - (Math.min(4, pricingVariables.totalAdj) - pricingCriteria.questT10.valLower)) * pricingCriteria.questT10.oneMLower) * pricingCriteria.questT11.adjYIB
		pricingVariables.dataPoint3 = pricingVariables.dataPoint2 * (rateCalculator.onex1P_Rate_FinalSelected / 1350)
		oneMLayer.onex1P_WithMP = Math.max(oneMLayer.onex1P_WithoutMP, pricingVariables.dataPoint2, pricingVariables.dataPoint3) + oneMLayer.onex1P_GL + oneMLayer.onex1P_EL
		twoMLayer.onex1x1P_WithMP = Math.max(oneMLayer.onex1P_WithMP * twoMLayer.onex1x1P_Percent, 1500) + twoMLayer.onex1x1P_GL + twoMLayer.onex1x1P_EL
		oneMLayer.onex1P_Percent = 1 //PLACEHOLDER
		oneMLayer.onex1P_Accumulation = oneMLayer.onex1P_WithMP
		twoMLayer.onex1x1P_Accumulation = oneMLayer.onex1P_Accumulation + twoMLayer.onex1x1P_WithMP

		var moment = __util.getDateUtil()
		var diffDate = moment(quest.initialEligibility.expDate).diff(moment(quest.initialEligibility.effDate), 'days')

		if (diffDate >= 365) {
			pricingVariables.proRata = diffDate / 365
		} else {
			pricingVariables.proRata = (1 - (1 - diffDate / 365) * 0.65)
		}

		pricingVariables.onexPAnnual = oneMLayer.onex1P_Accumulation
		pricingVariables.twoxPAnnual = twoMLayer.onex1x1P_Accumulation
		pricingCriteria.oneMLayer = oneMLayer
		pricingCriteria.twoMLayer = twoMLayer
		pricingCriteria.ratingFormula = ratingFormula
		pricingCriteria.factorCalculator = factorCalculator
		pricingCriteria.pricingVariables = pricingVariables

		//Excess Limit $1,000,000 Risk Premuim
		quest.pricingIndication.pricing[0].riskPremium = Math.ceil((pricingVariables.onexPAnnual * pricingVariables.proRata) / 5) * 5

		//Excess Limit $2,000,000 Risk Premuim
		quest.pricingIndication.pricing[1].riskPremium = Math.ceil((pricingVariables.twoxPAnnual * pricingVariables.proRata) / 5) * 5

		__logger.info("Premium calculated for DOT # " + quest.initialEligibility.dot)
		__logger.info("Final Quest Object for DOT # " + quest.initialEligibility.dot + __os.EOL + JSON.stringify(quest))
		callback(null, quest)
	}

	module.exports = {
		"checkDOTExists": checkDOTExists,
		"getDOTData": getDOTData,
		"generateQuote": generateQuote,
		"getQuest_T01_FatalityCoef": getQuest_T01_FatalityCoef,
		"getQuest_T04_ILFs": getQuest_T04_ILFs,
		"getQuest_T05_ELR": getQuest_T05_ELR,
		"getQuest_T06_ALAE": getQuest_T06_ALAE,
		/*"getQuest_T09_ExpMSL" : getQuest_T09_ExpMSL,*/
		"getQuest_T10_1x1Min": getQuest_T10_1x1Min,
		"getQuest_T11_YIBFactor": getQuest_T11_YIBFactor,
		"getQuest_T12_ILFs_GL": getQuest_T12_ILFs_GL,
		"getQuest_T13_SLCFactors": getQuest_T13_SLCFactors,
		"populateFleetEntry": populateFleetEntry,
		"getTRANS_LC_201704": getTRANS_LC_201704
	}
})();