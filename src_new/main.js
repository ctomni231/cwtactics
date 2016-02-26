function enter_loop() {
  var last_timestamp, timestamp, delta;

  last_timestamp = new Date().getTime();

  function loop() {

    timestamp = new Date().getTime();
    delta = timestamp - last_timestamp;
    last_timestamp = timestamp;

    cwt.game_state_update_state(delta);
    cwt.game_state_render_state(delta);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

cwt.main = function() {
  cwt.log_info("starting CustomWars Tactics");
  cwt.game_state_set_state("start_game");
  enter_loop();
};