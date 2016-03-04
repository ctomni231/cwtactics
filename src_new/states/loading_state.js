cwt.game_state_add_state("loading_state", {

  on_enter: function() {
    cwt.log_info("mocking load and moving into the main menu after some time");
    setTimeout(function() {
      cwt.game_state_set_state("main_menu");
    }, 3000 + parseInt(3000 * Math.random(), 10));
  }
});