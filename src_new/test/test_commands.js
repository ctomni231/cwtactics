var IDLE_TIMEOUT = 100;

cwt.test_action_wait_for_event = function(event, max_time, data) {
  var waited;

  waited = 0;
  max_time *= 1000;

  function wait() {
    waited += IDLE_TIMEOUT;
    if (waited <= max_time) {
      setTimeout((cwt.test_drop_first_event_when_data_matches(event, data) ? cwt.test_pull_next_command : wait), IDLE_TIMEOUT);

    } else {
      throw new Error("ActionFailed: wait_for_event" + JSON.stringify(data) + " - waited " + max_time + "ms");
    }
  }

  setTimeout(wait, IDLE_TIMEOUT);
};

cwt.test_action_raise_input = function(key, time) {
  time = time || 50;
  cwt.input_press_key(key);
  setTimeout(function() {
    cwt.input_release_key(key);
    setTimeout(cwt.test_pull_next_command, IDLE_TIMEOUT);
  }, time);
};

cwt.test_action_wipe_events = function() {
  cwt.test_wipe_events();
  setTimeout(cwt.test_pull_next_command, 1000);
};

cwt.test_action_sleep = function(time) {
  setTimeout(cwt.test_pull_next_command, time);
};

cwt.test_action_game_command = function() {
  cwt.client_event_push_command({
    key: arguments[0],
    p1: arguments[1],
    p2: arguments[2],
    p3: arguments[3],
    p4: arguments[4],
    p5: arguments[5]
  });
  setTimeout(cwt.test_pull_next_command, 1000);
};