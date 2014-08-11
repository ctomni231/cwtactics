"use strict";

var network = require("../network");
var model = require("../model");

var actions = require("../actions");

var weather = require("../logic/weather");
var turn = require("../logic/turn");
var fog = require("../logic/fog");

exports.action = {
  invoke: function () {
    turn.next();
    fog.fullRecalculation();

    if (network.isHost()) {

      // Generate new weather
      if (model.weatherLeftDays === 0) {
        var nextWeather = weather.pickRandomWeatherId();
        var nextDuration = weather.pickRandomWeatherTime(nextWeather);

        actions.pushCommand(false, actions.getActionId("changeWeather"), nextWeather, nextDuration);
      }

      // Do AI-Turn
      // TODO: sadasdas
      /*
       if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
       controller.ai_machine.event("tick");
       }
       */
    }
  }
};