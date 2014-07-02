cwt.Gameflow.addState({
  id: "INGAME_FLUSH_ACTION",

  init: function () {
    var gameData = this.globalData;

    /**
     *
     * @memberOf cwt.Gameflow.globalData
     * @type {boolean}
     */
    gameData.multiStepActive = false;

    /**
     * Builds several commands from collected action data.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.buildFromData = function () {
      var targetDto = gameData.target;
      var sourceDto = gameData.source;
      var actionDto = gameData.action;
      var moveDto = gameData.movePath;
      var actionObject = actionDto.object;

      var trapped = false;
      if (moveDto.data[0] !== -1) {
        trapped = model.move_trapCheck(moveDto.data, sourceDto, targetDto);
        model.events.move_flushMoveData(moveDto.data, sourceDto);
      }

      if (!trapped) actionObject.invoke(scope);
      else controller.commandStack_sharedInvokement(
        "trapwait_invoked",
        sourceDto.unitId
      );

      // all unit actions invokes automatically waiting
      if (trapped || actionObject.unitAction && !actionObject.noAutoWait) {
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          sourceDto.unitId
        );
      }

      return trapped;
    }
  },

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

    cwt.Gameflow.changeState(next);
  }
});