var TOOLTIP_TIMEOUT = 5000;

var tips;
var tip_active;
var tip_timer;

function hasTips() {
  return !!tips && tips.length > 0;
}

function selectRandomTip() {
  tip_active = tips[parseInt(Math.random() * tips.length, 10)];
  cwt.log_info("changed tooltip [" + tip_active + "]");
}

function load_object_types() {
  var load_jobs;

  function loading_done() {
    cwt.log_info("completed loading data");
  }

  function loading_failed(err) {
    cwt.log_error("failed to load data", err);
  }

  function load_objects_json(job_list, file_name, type) {
    load_jobs.push(function(when_done) {
      cwt.request_get_json("../src_gamedata/" + file_name + ".json", function(data) {
        cwt.list_for_each(data, function(el) {
          cwt.client_event_register_object_type(type, el);
        });
        when_done();
      }, cwt.error_thrower_callback("DataLoader(" + type + ")"));
    });
  }

  load_jobs = [];

  load_objects_json(load_jobs, "tiles", "tile");
  load_objects_json(load_jobs, "units", "unit");
  load_objects_json(load_jobs, "movetypes", "movetype");
  load_objects_json(load_jobs, "weathers", "weather");

  cwt.jobs_execute(load_jobs, loading_done, loading_failed);
}

cwt.game_state_add_state("loading_state", {

  on_enter: function() {
    cwt.request_get_json("../src_gamedata/tips.json", function(data) {
      tips = cwt.require_something(data);
      // this leads into a selection of a new timeout
      tip_timer = TOOLTIP_TIMEOUT;

    }, function(err) {
      cwt.log_error("error", err);
    });

    load_object_types();

    tip_timer = 0;
    tip_active = "";
  },

  update: function(delta) {
    if (hasTips()) {
      tip_timer += delta;
      if (tip_timer > TOOLTIP_TIMEOUT) {
        tip_timer = 0;
        selectRandomTip();
      }
    }

    if (cwt.input_is_key_pressed("KEY_ENTER")) {
      cwt.game_state_set_state("main_menu");
    }
  },

  render: function(delta) {

  }
});