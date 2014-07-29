var stm = require("./statemachine");

exports.raiseError = function (message,where) {

  // set state
  stm.changeState("ERROR_SCREEN");

  // set meta data
  var state = stm.activeState;
  state.data.message = message;
  state.data.where = where;
};