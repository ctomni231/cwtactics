"use strict";

var states = require('../statemachine');
var stateData = require('../dataTransfer/states');

exports.action = {
  invoke: function () {
    stateData.fromIngameToOptions = true;
    states.changeState("MENU_OPTIONS");
  }
};