cwt.Gameflow.addState({
  id: "GAMEROUND_START",

  init: function () {

  },

  enter: function () {
    cwt.Gameflow.inGameRound = true;

    controller.commandStack_resetData();

    // start first turn
    if (model.round_turnOwner === -1) {
      model.events.gameround_start();
      controller.commandStack_localInvokement("nextTurn_invoked");
      if (controller.network_isHost()) model.events.weather_calculateNext();
    }
  },

  update: function (delta, lastInput) {
    cwt.Gameflow.changeState("IDLE");
  },

  render: function (delta) {

  }
});
