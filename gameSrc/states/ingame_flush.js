exports.state = {
  id: "INGAME_FLUSH_ACTION",

  enter: function () {
    var gameData = this.globalData;
    var trapped = gameData.buildFromData();
    var next = null;

    if (!trapped && gameData.action.object.multiStepAction) {
      gameData.multiStepActive = true;

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

    require("../statemachine").changeState(next);
  }
};