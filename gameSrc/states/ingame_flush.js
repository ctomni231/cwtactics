"use strict";

var stateData = require("../states");

exports.state = {
  id: "INGAME_FLUSH_ACTION",

  enter: function () {
    var trapped = stateData.buildFromData();
    var next = null;

    if (!trapped && stateData.action.object.multiStepAction) {
      stateData.multiStepActive = true;

      /*
       if( !controller.stateMachine.data.breakMultiStep ){
       controller.stateMachine.event("nextStep");
       } else {
       controller.stateMachine.event("nextStepBreak");
       }
      */

      next = "INGAME_MULTISTEP_IDLE";
    } else {
      next = "INGAME_IDLE";
    }

    this.changeState(next);
  }
};