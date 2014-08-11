"use strict";

var stateMachine = require("../statemachine");

exports.loader = function (nextLoadingStep) {
  stateMachine.addStates();
  nextLoadingStep();
};