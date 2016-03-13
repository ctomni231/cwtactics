cwt.client_intialize_workers = function() {
  cwt.game_worker = new Worker(cwt.CONST_GAME_TH_FILE);

  cwt.game_worker.onmessage = function(event) {
    cwt.log_info("[MAIN-THREAD] got event " + event.data);
    var eventdata = JSON.parse(event.data);
    cwt.assert_true(eventdata.event.indexOf("game_event_") === 0, "SecurityError");
    cwt[eventdata.event].apply(cwt, eventdata.args);
  };

  cwt.map_for_each_property(cwt, function(key, value) {
    if (key.indexOf("game_event_") === 0) {
      if (!cwt[key]) {
        cwt[key] = function() {
          cwt.log_info("client seems to ignore the " + key + " event :[");
        };
      }

    } else if (key.indexOf("client_event_") === 0) {
      cwt[key] = function() {
        cwt.game_worker.postMessage(JSON.stringify({
          event: key,
          args: cwt.list_convert_arguments_to_list(arguments)
        }));
      };
    }
  });
};