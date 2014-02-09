cwt.gameFlow.NONE = {
  start: function () {
    if (DEBUG) util.log("Initializing game state machine");
    return "IDLE";
  }
};