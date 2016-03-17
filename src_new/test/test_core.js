var LOG_STYLE = "padding-left: 2px; padding-right: 2px; font-weight: bold; background: black; color:yellow";
var LOG_HEAD = "[TEST-SYSTEM] ";

var last_group = "no group";
var events_stack = {};
var tasks = [];
var task_index = 0;

cwt.test_dev_stack = function() {
  return events_stack;
};

function tests_failed() {
  alert("Failed to complete tests. \n\nFailed at: " + last_group);
}

function tests_succeed() {
  alert("Successfully completed tests without errors.");
}

function cache_event_data(key, args) {
  events_stack[key].push({
    args: cwt.list_convert_arguments_to_list(args)
  });
}

function inject_event_listeners() {
  var orig;

  cwt.map_for_each_property(cwt, function(key, value) {
    if (key === "game_event_error") {
      cwt[key] = tests_failed;

    } else if (key.indexOf("game_event_") === 0 || key.indexOf("client_event_") === 0) {
      events_stack[key] = [];
      cwt[key] = function() {
        cwt.log_styled(LOG_STYLE, LOG_HEAD + "got event " + key + " with data " + JSON.stringify(cwt.list_convert_arguments_to_list(arguments)));
        cache_event_data(key, arguments);
        value.apply(cwt, arguments);
      };
    }
  });
}

cwt.test_wipe_events = function() {
  cwt.map_for_each_property(events_stack, function(key, value) {
    events_stack[key].splice(0);
  });
};

cwt.test_pull_next_command = function() {
  var data, handler;

  if (task_index === tasks.length) {
    tasks = null;
    tests_succeed();
    return;
  }

  data = tasks[task_index];
  task_index += 1;

  cwt.log_styled(LOG_STYLE, LOG_HEAD + data.cmd + JSON.stringify(data.args));

  cwt.require_something(cwt["test_action_" + data.cmd]).apply(cwt, data.args);
};

cwt.test_drop_first_event_when_data_matches = function(event, args) {
  var event_data;

  cwt.assert_true(cwt.type_is_something(events_stack[event]), "UnknownEvent:" + event);

  event_data = events_stack[event][0];
  if (event_data) {
    cwt.assert_array_equals(event_data.args, args);
    events_stack[event].splice(0, 1);
    return true;
  } else {
    return false;
  }
};

cwt.test_setup = function() {
  var text = "";

  text += "game is in automated test mode\n";
  text += "please do not interact with your browser\n";
  text += "all inputs will be simulated by the test system\n";
  text += "the results will be visible in the console after the test completes";

  alert(text);

  cwt.log_styled(LOG_STYLE, LOG_HEAD + "init test system");
  inject_event_listeners();
};

cwt.test_start = function() {
  cwt.log_styled(LOG_STYLE, LOG_HEAD + "starting tests");
  cwt.test_pull_next_command();
};

cwt.test_group = function(group_name) {
  last_group = cwt.require_string(group_name);
  cwt.log_info("start testing group " + group_name);
};

cwt.test_action = function(action) {
  tasks.push({
    cmd: action,
    args: cwt.list_convert_arguments_to_list(arguments).slice(1)
  });
};