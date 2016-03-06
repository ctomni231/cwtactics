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

cwt.game_state_add_state("loading_state", {

  on_enter: function() {
    cwt.log_info("mocking load and moving into the main menu after some time");

    cwt.request_get_json("../src_gamedata/tips.json", function(data) {
      tips = cwt.require_something(data);
      // this leads into a selection of a new timeout
      tip_timer = TOOLTIP_TIMEOUT;

    }, function(err) {
      cwt.log_error("error", err);
    });

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