// this will delegate event-calls from the controller coming through the worker to the game
self.addEventListener('message', function(event) {
  cwt._MSGH_GAME_(event.data);
}, false);

// this will delegate event-calls from the game through the worker
cwt._MSGH_CONTROLLER_ = function() {
  postMessage.apply(cwt._WRK_GAME_, arguments);
};