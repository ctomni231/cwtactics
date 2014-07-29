"use strict";

var turn = require("../logic/turn");
var fog = require("../logic/fog");
var weather = require("../logic/weather");
var network = require("../network");
var model = require("../model");

require('../actions').mapAction({
  key: "nextTurn",

  toDataBlock: function (data, dataBlock) {
  },

  parseDataBlock: function (dataBlock) {
    this.invoke();
  },

  invoke: function () {
    turn.next();
    fog.fullRecalculation();

    if (network.isHost()) {

      // Generate new weather
      if (model.weatherLeftDays === 0) {
        weather.calculateNextWeather();
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
})