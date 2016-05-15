// this will delegate event-calls from the game coming through the worker to the controller
cwt._WRK_GAME_.addEventListener('message', function(event) {
  cwt._MSGH_CONTROLLER_(event.data);
}, false);

// this will delegate event-calls from the controller through the worker
cwt._MSGH_GAME_ = function() {
  cwt._WRK_GAME_.postMessage.apply(cwt._WRK_GAME_, arguments);
};