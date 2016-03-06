var IDLE_TIMEOUT = 100;
var LOG_STYLE = "padding-left: 2px; padding-right: 2px; font-weight: bold; background: black; color:yellow";
var LOG_HEAD = "[TEST-SYSTEM] ";

var call_map = {};
var tasks = [];

function add_event(key, args) {
  call_map[key].push({
    args: cwt.list_convert_arguments_to_list(args)
  });
}

function setup() {
  cwt.map_for_each_property(cwt, function(key, value) {
    if (key.indexOf("game_event_") === 0) {
      call_map[key] = [];
      var orig = cwt[key];
      cwt[key] = function() {
        cwt.log_styled(LOG_STYLE, LOG_HEAD + "game_event: " + key + JSON.stringify(cwt.list_convert_arguments_to_list(arguments)));
        add_event(key, arguments);
        orig.apply(cwt, arguments);
      };
    }
  });
}

function a_wait(event, max_time, data) {
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "waiting for " + event + " with data " + JSON.stringify(data));
  var old_count = call_map[event].length;
  var waited = 0;
  max_time *= 1000;

  function wait() {
    waited += IDLE_TIMEOUT;

    if (waited > max_time) {
      cwt.log_styled(LOG_STYLE, LOG_HEAD + "- error - waited for " + event + " with data " + JSON.stringify(data) + ", but not happend after " + max_time / 1000 + " seconds");
      return;
    }

    var event_data = call_map[event][0];
    if (event_data) {
      cwt.assert_array_equals(event_data.args, data);
      cwt.log_styled(LOG_STYLE, LOG_HEAD + "got event " + event + " with expected data");
      call_map[event].splice(0, 1);
      setTimeout(pull_next_command, IDLE_TIMEOUT);
    } else {
      setTimeout(wait, IDLE_TIMEOUT);
    }
  }
  setTimeout(wait, IDLE_TIMEOUT);
}

function a_key_press(key, time) {
  cwt.input_press_key(key);
  setTimeout(function() {
    cwt.input_release_key(key);
    setTimeout(pull_next_command, IDLE_TIMEOUT);
  }, time);
}

function a_wipe() {
  cwt.map_for_each_property(call_map, function(key, value) {
    call_map[key].splice(0);
  });
  setTimeout(pull_next_command, IDLE_TIMEOUT);
}

function a_wait_time(time) {
  setTimeout(pull_next_command, time);
}

function pull_next_command() {
  var data, handler;

  data = tasks[0];
  if (!data) {
    finished_tests();
    return;
  }
  tasks.splice(0, 1);

  switch (data.cmd) {
    case "wait":
      handler = a_wait;
      break;

    case "wipe":
      handler = a_wipe;
      break;

    case "key_press":
      handler = a_key_press;
      break;

    case "wait_time":
      handler = a_wait_time;
      break;
  }

  cwt.require_something(handler);

  handler.apply(cwt, data.args);
}

function finished_tests() {
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "finished tests without errors");
}

cwt.test_setup = function() {
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "game is in automated end to end test mode");
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "please do not interact with your browser");
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "all inputs will be simulated by the test system");
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "the results will be visible in the console after the test completes");

  cwt.log_styled(LOG_STYLE, LOG_HEAD + "init test system");
  setup();
};

cwt.test_wait_for = function(event, max_time, data) {
  tasks.push({
    cmd: "wait",
    args: arguments
  });
};

cwt.test_wipe_tracked_events = function() {
  tasks.push({
    cmd: "wipe",
    args: []
  });
};

cwt.test_wait = function(time) {
  tasks.push({
    cmd: "wait_time",
    args: [time]
  });
};

cwt.test_press_key = function(key, time) {
  tasks.push({
    cmd: "key_press",
    args: [key, time || 250]
  });
};

cwt.test_start = function() {
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "starting tests");
  pull_next_command();
};