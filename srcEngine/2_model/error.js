// Define event
controller.defineEvent("criticalError");

util.scoped(function() {

  // Called when a known/catched error will be recognized 
  // by the engine. This function throws the `criticalError`
  // event which allows the client to render error messages
  // (*e.g. for debug mode*).
  //
  // @param {Number} errorId error id
  // @param {Number} errorData error data id
  model.criticalError = function(errorId, errorData) {

    // TODO: grab action stack data
    var stackData = null;

    // Invoke event     
    var evCb = controller.events.criticalError;
    if (evCb) evCb(errorId, errorData, stackData);

    // Log error
    util.error(errorId, errorData, stackData);
  };

});