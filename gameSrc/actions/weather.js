"use strict";

var selectRandom = require("../system/functions").selectRandomListElement;
var weather = require("../logic/weather");
var sheets = require("../sheets");
var model = require("../model");
var fog = require("../logic/fog");

// some config objects
var cfgRandomDays = require("../config").getConfig("weatherRandomDays");
var cfgMinDays = require("../config").getConfig("weatherMinDays");

/**
 * Returns a random weather ID in relation to the current action weather.
 */
exports.generateWeatherId = function () {
    var newTp;

    // Search a random weather if the last weather was `null` or the default weather type
    if (model.weather && model.weather === sheets.getDefaultWeather()) {
        newTp = selectRandom(sheets.getIdList(sheets.TYPE_WEATHER), model.weather.ID);

    } else {
        // Take default weather and calculate a random amount of days
        newTp = sheets.getDefaultWeather();
    }

    return newTp.ID;
};

/**
 * Picks a random duration for a given weather type.
 *
 * @param type
 * @return {number}
 */
exports.generateDuration = function (type) {
    return (type === sheets.getDefaultWeather().ID) ? 1 :
        (cfgMinDays.value + parseInt(cfgRandomDays.value * Math.random(), 10));
};

exports.changeWeatherAction = {
    invoke: function (weather, duration) {
        model.weather = weather;
        model.weatherLeftDays = duration;

        fog.fullRecalculation();
    }
};
