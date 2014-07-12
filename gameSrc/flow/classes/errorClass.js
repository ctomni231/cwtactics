cwt.Error = function (message,where) {

  // set state
  cwt.Gameflow.changeState("ERROR_SCREEN");

  // set meta data
  var state = cwt.Gameflow.activeState;
  state.data.message = message;
  state.data.where = where;
};