cwt.game_state_add_state("main_menu", {

  update: function(delta) {
    if (cwt.input_is_key_pressed("KEY_ENTER")) {
      cwt.game_state_set_state("load_map");
    }
  },
});