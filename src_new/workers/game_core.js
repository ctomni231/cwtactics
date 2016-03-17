onmessage = function(event) {
  cwt.log_info("[GAME-WORKER-THREAD] got event " + event.data);
  var eventdata = JSON.parse(event.data);
  cwt.assert_true(eventdata.event.indexOf("client_event_") === 0, "SecurityError");
  cwt[eventdata.event].apply(cwt, eventdata.args);
};

cwt.map_for_each_property(cwt, function(key, value) {
  if (key.indexOf("game_event_") === 0) {
    cwt[key] = function() {
      postMessage(JSON.stringify({
        event: key,
        args: cwt.list_convert_arguments_to_list(arguments)
      }));
    };

  } else if (key.indexOf("client_event_") === 0) {
    if (!cwt[key]) {
      cwt[key] = function() {
        cwt.log_info("game core seems to ignore the " + key + " event :[");
      };
    }
  }
});