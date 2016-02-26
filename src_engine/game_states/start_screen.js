function map_input_actions() {
  cwt.log_info("register input key to action mappings");

  cwt.input_map_key_to_action("KEY_DOWN", "DOWN");
  cwt.input_map_key_to_action("KEY_UP", "UP");
  cwt.input_map_key_to_action("KEY_LEFT", "LEFT");
  cwt.input_map_key_to_action("KEY_RIGHT", "RIGHT");
  cwt.input_map_key_to_action("KEY_ENTER", "ACTION");
  cwt.input_map_key_to_action("KEY_CTRL", "CANCEL");
}

cwt.gamestate_add_state("start_screen", {

  on_enter: function() {
    map_input_actions();
  },

  update: function(delta) {
    if (cwt.input_is_action_pressed("ACTION")) {
      // cwt.gamestate_set_state("main_menu");
      // TODO protect legacy code here and move into the old state machine
    }
  },

  render: function(delta) {

  }
});