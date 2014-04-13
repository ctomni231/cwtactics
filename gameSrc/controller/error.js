cwt.Error = function (message,where) {

  // set state
  cwt.Gameflow.setState("ERROR_SCREEN",false);

  // set meta data
  var state = cwt.Gameflow.activeState;
  state.message = message;
  state.where = where;
};