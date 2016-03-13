cwt.game_state_add_state("start_game", {

  on_enter: function() {
    cwt.log_info("starting game");

    cwt.client_event_initialize_model();

    cwt.game_state_set_state("loading_state");
  },

  render: function(delta) {
    // TODO render the loading status here
  }
});