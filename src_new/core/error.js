if (!cwt.CONST_DUALCORE_MODE) {
  window.onerror = function(err) {
    cwt.log_error("got system error", err);
    cwt.game_event_error(err);
  };
}

cwt.error_thrower_callback = function(message) {
  return function(err) {
    throw new Error("[" + message + "] " + err);
  };
};