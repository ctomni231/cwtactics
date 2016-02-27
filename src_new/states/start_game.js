cwt.game_state_add_state("start_game", {

  on_enter: function() {
    cwt.log_info("starting game");

    cwt.map_initialize();
    cwt.players_initialize();
    cwt.units_initialize();
    cwt.game_event_inject_logging_aspect();

    // TODO load the stuff here :P
  },

  update: function(delta) {
    if (cwt.input_is_key_pressed("KEY_ENTER")) {
      cwt.game_state_set_state("load_map");
    }
  },

  render: function(delta) {
    // TODO render the loading status here
  }
});