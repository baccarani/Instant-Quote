(function() {
	var staticData = require(__path.join(__base, 'dot', 'static-data.js'));

	var cacheKeys = [];

	/**
	 * This function is used to load all the static data into the cache.
	 * 
	 * @param {any} callback 
	 */
	var loadItemsToCache = function(callback) {
		__async.parallel([
			function(callback) {
				staticData.getSafetyRating(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SAFETY_RATING, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SAFETY_RATING)
						__logger.info("Safety Rating added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getVehicleInfo(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.VEHICLE_INFO_STATIC_DATA, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.VEHICLE_INFO_STATIC_DATA)
						__logger.info("Vehicle Types added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getServicesProvCommHauled(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SERVICES_PROV_COMM_HAULED, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SERVICES_PROV_COMM_HAULED)
						__logger.info("Services Provided or Comm Hauled added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getPrimaryLiabilities(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.PRIMARY_LIABILITIES, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.PRIMARY_LIABILITIES)
						__logger.info("Primary Liabilities added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getExcessLimit(function(err, res) {
					if (err)
						return callback(err, null)
					var finalPricingObjs = []
					let finalPricingLabels = res

					let i = 0;
					for (finalPricingLabel of finalPricingLabels) {
						var finalPricingObj = __factory.getObject(__constants.FINAL_PRICING)
						finalPricingObj.excessLimit = finalPricingLabel
						finalPricingObj.value = i
						finalPricingObjs.push(finalPricingObj)
						i++ }

					__util.storeInCache(__constants.EXCESS_LIMIT, finalPricingObjs, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.EXCESS_LIMIT)
						__logger.info("Excess Limit added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getZipDeclination(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.ZIP_DECLINATION, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.ZIP_DECLINATION)
						__logger.info("Zip Declination added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getZipCountyMap(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.ZIP_COUNTY_MAP, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.ZIP_COUNTY_MAP)
						__logger.info("Zip County Map added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getCountyDeclination(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.COUNTY_DECLINATION, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.COUNTY_DECLINATION)
						__logger.info("County Declination added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getScheduleUnderlyingAL(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SCHEDULE_UNDERLYING_AL, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SCHEDULE_UNDERLYING_AL)
						__logger.info("Scheduled Underlying Automobile Liability added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getScheduleUnderlyingGL(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SCHEDULE_UNDERLYING_GL, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SCHEDULE_UNDERLYING_GL)
						__logger.info("Scheduled Underlying General Liability added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getScheduleUnderlyingEL(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SCHEDULE_UNDERLYING_EL, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SCHEDULE_UNDERLYING_EL)
						__logger.info("Scheduled Underlying Employer Liability added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getTruckingForms(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.FORM_SELECTION, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.FORM_SELECTION)
						__logger.info("Form Selection added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getSubjectivities(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.SUBJECTIVITIES, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.SUBJECTIVITIES)
						__logger.info("Subjectivities added to Cache. Count :" + res.length)
						callback()
					})
				});
			},
			function(callback) {
				staticData.getNotes(function(err, res) {
					if (err)
						return callback(err, null)
					__util.storeInCache(__constants.NOTES, res, function(err) {
						if (err) {
							return callback(err, 0)
						}
						cacheKeys.push(__constants.NOTES)
						__logger.info("Notes added to Cache. Count :" + res.length)
						callback()
					})
				});
			}
		], function(err) {
			if (err) {
				__logger.error(err)
				return callback(err)
			}
			callback(err, true)
		})
	}

	/**
	 * This function returns a list of keys available in the cache
	 * 
	 * @returns 
	 */
	var getCacheKeys = function() {
		return cacheKeys
	}

	module.exports = {
		'loadItemsToCache' : loadItemsToCache,
		'getCacheKeys' : getCacheKeys
	}

})();