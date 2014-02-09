/**
 * @namespace
 */
cwt.Update = {

  /**
   * Is `true` when a game round is active else `false`
   */
  inGameRound: false,

  /**
   * Updates the current state of the game engine.
   */
  tickFrame: function (delta) {
    assert(controller.update_inGameRound);

    cwt.Gameround.gameTimeElapsed += delta;
    cwt.Gameround.turnTimeElapsed += delta;

    // check turn time
    if (cwt.Gameround.turnTimeLimit > 0 &&
      cwt.Gameround.turnTimeElapsed >= cwt.Gameround.turnTimeLimit) {
      controller.commandStack_sharedInvokement("nextTurn_invoked");
    }

    // check game time
    if (cwt.Gameround.gameTimeLimit > 0 &&
      cwt.Gameround.gameTimeElapsed >= cwt.Gameround.gameTimeLimit) {
      controller.update_endGameRound();
    }

    if (!controller.commandStack_hasData()) {
      if (controller.ai_active) controller.ai_machine.event("tick");
    } else controller.commandStack_invokeNext();
  },

  /**
   * Does some preparations for the active game round.
   */
  prepareGameRound: function () {
    controller.commandStack_resetData();
  },

  /**
   * Starts a new game round.
   */
  startGameRound: function () {
    assert(!controller.update_inGameRound);

    // initializer controllers
    controller.update_inGameRound = true;

    // start first turn
    if (model.round_turnOwner === -1) {
      model.events.gameround_start();
      controller.commandStack_localInvokement("nextTurn_invoked");
      if (controller.network_isHost()) model.events.weather_calculateNext();
    }
  },

  /**
   * Ends the active game round.
   */
  endGameRound: function () {
    assert(controller.update_inGameRound);

    controller.update_inGameRound = false;
  }

};