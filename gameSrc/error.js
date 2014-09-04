var stateMachine = require("./statemachine");
var errorState = require("./states/error")

exports.raiseError = function (message,where) {

  // set state
  stateMachine.changeState("ERROR_SCREEN");

  // set meta data
  errorState.setErrorData(message, where)
};