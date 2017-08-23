(function() {
	/**
	 * 
	 * This function is used to get static data information about Safety rating. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getSafetyRating = function(callback) {
		var safetyRatings = [ __constants.SATISFACTORY, __constants.CONDITIONAL, __constants.UNSATISFACTORY, __constants.NOT_RATED ]
		callback(null, safetyRatings)
	}

	/**
	 * 
	 * This function is used to get static data information about Services Provided or Comm Hauled. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getServicesProvCommHauled = function(callback) {
		var srcProdCommHauled = [ __constants.PASSENGER_TRANSIT, __constants.WATER_HAULING, __constants.HYDRAULIC_FRACTURING, __constants.LOGGING, __constants.HIRED_NON_OWNED_AUTO, __constants.FRIEGHT_FORWARDING, __constants.CRANE_SERVICE, __constants.EQUIPMENT_RENTAL, __constants.EXPLOSIVES, __constants.MEDICAL_TRANSPORT, __constants.BROKERATE_AUTHORITY, __constants.TOWING, __constants.COAL_COKE ]
		callback(null, srcProdCommHauled)
	}

	/**
	 * 
	 * This function is used to get static data information about Services Provided or Comm Hauled. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getScheduleUnderlyingAL = function(callback) {
		var scheduleUnderlyingAL = [ __constants.COMB_INJ ]

		var scheduleUnderlyingALList = []

		for (label of scheduleUnderlyingAL) {
			var scheduleUnderlyingALObj = __factory.getObject(__constants.SCHEDULE_UNDERLYING_LIMIT)
			scheduleUnderlyingALObj.limitLabel = label;
			scheduleUnderlyingALList.push(scheduleUnderlyingALObj) }
		callback(null, scheduleUnderlyingALList)
	}

	/**
	 * 
	 * This function is used to get static data information about Services Provided or Comm Hauled. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getScheduleUnderlyingGL = function(callback) {
		var scheduleUnderlyingGL = [ __constants.EACH_OCC, __constants.GEN_AGG, __constants.PROD_COMPLETE, __constants.PERSONAL_LIMIT ]

		var scheduleUnderlyingGLList = []

		for (label of scheduleUnderlyingGL) {
			var scheduleUnderlyingGLObj = __factory.getObject(__constants.SCHEDULE_UNDERLYING_LIMIT)
			scheduleUnderlyingGLObj.limitLabel = label;
			if (label == __constants.GEN_AGG) {
				scheduleUnderlyingGLObj.limit = __constants.AD_LIMIT_TWO_MILLION
			}
			if (label == __constants.PROD_COMPLETE) {
				scheduleUnderlyingGLObj.limit = __constants.AD_LIMIT_TWO_MILLION
			}
			if (label == __constants.PERSONAL_LIMIT) {
				scheduleUnderlyingGLObj.limit = __constants.AD_LIMIT_ONE_MILLION
			}
			scheduleUnderlyingGLList.push(scheduleUnderlyingGLObj) }
		callback(null, scheduleUnderlyingGLList)
	}

	/**
	 * 
	 * This function is used to get static data information about Services Provided or Comm Hauled. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getScheduleUnderlyingEL = function(callback) {
		var scheduleUnderlyingEL = [ __constants.BOD_ACCIDENT, __constants.BOD_INJ_DIS, __constants.BOD_INJ_EMP ]

		var scheduleUnderlyingELList = []

		for (label of scheduleUnderlyingEL) {
			var scheduleUnderlyingELObj = __factory.getObject(__constants.SCHEDULE_UNDERLYING_LIMIT)
			scheduleUnderlyingELObj.limitLabel = label;
			if (label == __constants.BOD_INJ_DIS) {
				scheduleUnderlyingELObj.limit = __constants.AD_LIMIT_ONE_MILLION
			}
			if (label == __constants.BOD_INJ_EMP) {
				scheduleUnderlyingELObj.limit = __constants.AD_LIMIT_ONE_MILLION
			}
			scheduleUnderlyingELList.push(scheduleUnderlyingELObj) }
		callback(null, scheduleUnderlyingELList)
	}


	/**
	 * 
	 * This function is used to get static data information about Primary Liability. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getPrimaryLiabilities = function(callback) {
		var primLiabilities = [ __constants.PRIMARY_AL, __constants.PRIMARY_GL, __constants.PRIMARY_EL ]
		callback(null, primLiabilities)
	}

	/**
	 * 
	 * This function is used to get static data information about Excess Limit. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getExcessLimit = function(callback) {
		var excessLimit = [ __constants.ONE_MILLION, __constants.TWO_MILLION ]
		callback(null, excessLimit)
	}

	/**
	 * 
	 * This function is used to get static data information from JSON file about Zip code to decline DOT. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getZipDeclination = function(callback) {
		var zipDeclinationJSON = require(__path.join(__base, 'json', 'ZipDeclination.json'))
		callback(null, zipDeclinationJSON)
	}

	/**
	 * 
	 * This function is used to get static data information from JSON file about Zip code and County Info to decline DOT. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getZipCountyMap = function(callback) {
		var zipCountyMapJSON = require(__path.join(__base, 'json', 'ZipCountyMap.json'))
		callback(null, zipCountyMapJSON)
	}

	/**
	 * 
	 * This function is used to get static data information from JSON file about County info to decline DOT. This should later get the data from the database.
	 * 
	 * @param {any} callback 
	 */
	var getCountyDeclination = function(callback) {
		var countyDeclinationJSON = require(__path.join(__base, 'json', 'CountyDeclination.json'))
		callback(null, countyDeclinationJSON)
	}

	var getVehicleInfo = function(callback) {
		var query = "select Vtype,ExpoAdj from Quest_T02_ExpoAdj"

		__sqlutil.query(query, function(err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			callback(err, populateVehicleInfo(result.recordset))
		})
	}

	var populateVehicleInfo = function(recordset) {
		var vehicleInfos = []

		for (let vehicleInfo of recordset) {
			let vehicleInfoObj = __factory.getObject(__constants.VEHICLE_INFO)
			vehicleInfoObj.vehicleType = vehicleInfo["Vtype"]
			vehicleInfoObj.factor = vehicleInfo["ExpoAdj"]
			vehicleInfos.push(vehicleInfoObj) }

		return vehicleInfos
	}

	var getTruckingForms = function(callback) {
		var query = "select * from STD_FORM_LKUP f left join STD_FORM_INPUT_LKUP fi on f.Form_ID=fi.Form_ID where Trucking_Ind != 'N'"

		__sqlutil.query(query, function(err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			callback(err, populateTruckingForms(result.recordset))
		})
	}

	var populateTruckingForms = function(recordset) {
		var truckingForms = []
		var prevFormId = 0
		let truckFormsObj = null

		for (let truckingForm of recordset) {
			if (prevFormId == 0) {
				truckFormsObj = __factory.getObject(__constants.FORM_SELECTION)
			}
			if (prevFormId == truckingForm["Form_ID"][0]) {
				if (truckingForm["Input_Description"] != null && truckingForm["Input_Description"] !== '') {
					let truckFormsInputObj = __factory.getObject(__constants.FORM_INPUT)
					truckFormsInputObj.inputDesc = truckingForm["Input_Description"]
					truckFormsInputObj.inputData = truckingForm["Input_DataType"]
					truckFormsInputObj.fillInContent = truckingForm["Fill_In_Content"]
					truckFormsObj.inputs.push(truckFormsInputObj)
					prevFormId = truckingForm["Form_ID"][0]
				}
				continue
			} else {
				truckFormsObj = __factory.getObject(__constants.FORM_SELECTION)
			}
			truckFormsObj.formID = truckingForm["Form_ID"][0]
			truckFormsObj.formNumber = truckingForm["Form_Number"]
			truckFormsObj.formName = truckingForm["Form_Name"]
			truckFormsObj.truckingInd = truckingForm["Trucking_Ind"]
			if (truckingForm["Input_Description"] != null && truckingForm["Input_Description"] !== '') {
				let truckFormsInputObj = __factory.getObject(__constants.FORM_INPUT)
				truckFormsInputObj.inputDesc = truckingForm["Input_Description"]
				truckFormsInputObj.inputData = truckingForm["Input_Data"]
				truckFormsInputObj.fillInContent = truckingForm["Fill_In_Content"]
				truckFormsObj.inputs.push(truckFormsInputObj)
				prevFormId = truckingForm["Form_ID"][0]
			}
			truckingForms.push(truckFormsObj) }
		return truckingForms
	}

	var getSubjectivities = function(callback) {
		var query = "select * from STD_SUBJECTIVITY_LKUP"

		__sqlutil.query(query, function(err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			callback(err, populateSubjectivities(result.recordset))
		})
	}

	var populateSubjectivities = function(recordset) {
		var subjectivities = []

		for (let truckSubjectivities of recordset) {
			let truckSubjectivitiesObj = __factory.getObject(__constants.SUBJECTIVITY_INFO)
			truckSubjectivitiesObj.subjNum = truckSubjectivities["Subj_Num"]
			truckSubjectivitiesObj.subjText = truckSubjectivities["Subj_Text"]
			subjectivities.push(truckSubjectivitiesObj) }

		return subjectivities
	}

	var getNotes = function(callback) {
		var query = "select * from STD_NOTE_LKUP"

		__sqlutil.query(query, function(err, result) {
			if (err) {
				__logger.error(err)
				return callback(__constants.SYSTEM_ERROR)
			}

			callback(err, populateNotes(result.recordset))
		})
	}

	var populateNotes = function(recordset) {
		var notes = []

		for (let truckNotes of recordset) {
			let truckNotesObj = __factory.getObject(__constants.NOTE_INFO)
			truckNotesObj.noteNum = truckNotes["Note_Num"]
			truckNotesObj.noteText = truckNotes["Note_Text"]
			notes.push(truckNotesObj) }

		return notes
	}

	//All Static Data
	/**
	 * 
	 * This function is used to get all the static data and set them as a properties in Master static data object called "StaticData"
	 * 
	 * This function first checks if the data is available in the cache and if not then it will get each Static data from the database and put them into the cache and then populate the master StaticData
	 * object and return it via callback
	 * 
	 * @param {any} callback 
	 */
	var getAllStaticData = function(callback) {
		var cacheKeys = __cache_loader.getCacheKeys()
		if (cacheKeys == null || cacheKeys.length == 0) {
			//Cache is empty for some reason, load static items again
			__cache_loader.loadItemsToCache(function(err, res) {
				if (err)
					return callback(err)
			})
		}
		var staticDataObj = __factory.getObject(__constants.STATIC_DATA)

		__async.eachSeries(cacheKeys, function(cacheKey, callback) {
			__util.getFromCache(cacheKey, function(err, result) {
				if (err)
					return callback(err)
				switch (cacheKey) {
				case __constants.SAFETY_RATING: {

					if (result == null) {
						__async.series([
							function(callback) {
								getSafetyRating(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SAFETY_RATING, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.safetyRating = result

					break;
				}
				case __constants.VEHICLE_INFO_STATIC_DATA: {

					if (result == null) {
						__async.series([
							function(callback) {
								getVehicleInfo(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.VEHICLE_INFO_STATIC_DATA, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.vehicleInfos = result
					break;
				}
				case __constants.SERVICES_PROV_COMM_HAULED: {

					if (result == null) {
						__async.series([
							function(callback) {
								getServicesProvCommHauled(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SERVICES_PROV_COMM_HAULED, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.srvcProvCommHaul = result
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_AL: {

					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingAL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_AL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.scheduleUnderlyingAL = result
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_GL: {

					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingGL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_GL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.scheduleUnderlyingGL = result
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_EL: {

					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingEL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_EL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.scheduleUnderlyingEL = result
					break;
				}
				case __constants.PRIMARY_LIABILITIES: {

					if (result == null) {
						__async.series([
							function(callback) {
								getPrimaryLiabilities(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.PRIMARY_LIABILITIES, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.primaryLiabilities = result
					break;
				}
				case __constants.EXCESS_LIMIT: {

					if (result == null) {
						__async.series([
							function(callback) {
								getExcessLimit(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.EXCESS_LIMIT, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.excessLimits = result
					break;
				}
				case __constants.FORM_SELECTION: {

					if (result == null) {
						__async.series([
							function(callback) {
								getTruckingForms(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.FORM_SELECTION, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.formList = result
					break;
				}
				case __constants.SUBJECTIVITIES: {

					if (result == null) {
						__async.series([
							function(callback) {
								getSubjectivities(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SUBJECTIVITIES, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.subjectivities = result
					break;
				}
				case __constants.NOTES: {

					if (result == null) {
						__async.series([
							function(callback) {
								getNotes(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.NOTES, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					staticDataObj.notes = result
					break;
				}
				}
				callback()
			})
		}, function(err) {
			if (err)
				callback(err)
			callback(err, staticDataObj)
		})
	}

	/**
	 * 
	 * This function is used to get static data for the given key 
	 * 
	 * This function first checks if the data is available in the cache and if not then it will get it from the database and put it into the cache and then return it via callback
	 * 
	 * @param {any} key 
	 * @param {any} callback 
	 */
	var getStaticDataByKey = function(key, callback) {
		__util.getFromCache(key, function(err, result) {
			if (err)
				return callback(err)

			if (result == null) {
				switch (key) {
				case __constants.SAFETY_RATING: {
					__async.series([
						function(callback) {
							getSafetyRating(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.SAFETY_RATING, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.VEHICLE_INFO_STATIC_DATA: {
					__async.series([
						function(callback) {
							getVehicleInfo(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.VEHICLE_INFO_STATIC_DATA, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.SERVICES_PROV_COMM_HAULED: {
					if (result == null) {
						__async.series([
							function(callback) {
								getServicesProvCommHauled(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SERVICES_PROV_COMM_HAULED, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_AL: {
					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingAL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_AL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_GL: {
					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingGL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_GL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					break;
				}
				case __constants.SCHEDULE_UNDERLYING_EL: {
					if (result == null) {
						__async.series([
							function(callback) {
								getScheduleUnderlyingEL(function(err, res) {
									if (err)
										return callback(err)
									result = res
									callback()
								})
							},
							function(callback) {
								__util.storeInCache(__constants.SCHEDULE_UNDERLYING_EL, result, function(err) {
									if (err) {
										return callback(err)
									}
									callback()
								})
							}
						], function(err) {
							if (err)
								return callback(err)
							callback()
						})
					}
					break;
				}
				case __constants.PRIMARY_LIABILITIES: {
					__async.series([
						function(callback) {
							getPrimaryLiabilities(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.PRIMARY_LIABILITIES, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.EXCESS_LIMIT: {
					__async.series([
						function(callback) {
							getExcessLimit(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.EXCESS_LIMIT, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.FORM_SELECTION: {
					__async.series([
						function(callback) {
							getTruckingForms(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.FORM_SELECTION, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.SUBJECTIVITIES: {
					__async.series([
						function(callback) {
							getSubjectivities(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.SUBJECTIVITIES, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				case __constants.NOTES: {
					__async.series([
						function(callback) {
							getNotes(function(err, res) {
								if (err)
									return callback(err)
								result = res
								callback()
							})
						},
						function(callback) {
							__util.storeInCache(__constants.NOTES, result, function(err) {
								if (err) {
									return callback(err)
								}
								callback()
							})
						}
					], function(err) {
						if (err)
							return callback(err)
						callback()
					})
					break;
				}
				}
			}
			return callback(null, result)
		})
	}


	module.exports = {
		"getSafetyRating" : getSafetyRating,
		"getServicesProvCommHauled" : getServicesProvCommHauled,
		"getPrimaryLiabilities" : getPrimaryLiabilities,
		"getExcessLimit" : getExcessLimit,
		"getZipDeclination" : getZipDeclination,
		"getZipCountyMap" : getZipCountyMap,
		"getCountyDeclination" : getCountyDeclination,
		"getAllStaticData" : getAllStaticData,
		"getStaticDataByKey" : getStaticDataByKey,
		"getVehicleInfo" : getVehicleInfo,
		"getScheduleUnderlyingAL" : getScheduleUnderlyingAL,
		"getScheduleUnderlyingGL" : getScheduleUnderlyingGL,
		"getScheduleUnderlyingEL" : getScheduleUnderlyingEL,
		"getTruckingForms" : getTruckingForms,
		"getSubjectivities" : getSubjectivities,
		"getNotes" : getNotes
	}
})()