function enter_loop() {
  var last_timestamp, timestamp, delta, fps, fpsMin, fpsMax, fpsCount, fpsNum, FPS_UPDATE_INTERVAL;

  FPS_UPDATE_INTERVAL = 100;

  last_timestamp = new Date().getTime();

  fpsTime = 0;
  fpsCount = 0;
  fpsNum = 0;
  fpsMin = 99;
  fpsMax = 0;

  function loop() {

    timestamp = new Date().getTime();
    delta = timestamp - last_timestamp;
    last_timestamp = timestamp;

    if (DEBUG && delta > 0) {
      fpsCount += parseInt(1000 / delta, 10);
      fpsNum += 1;
      fpsTime += delta;
      if (fpsTime >= FPS_UPDATE_INTERVAL) {
        fps = parseInt(fpsCount / fpsNum, 10);

        if (fps < fpsMin) fpsMin = fps;
        if (fps > fpsMax) fpsMax = fps;

        document.getElementById("fpsCounter").innerHTML = "FPS[NOW:" + fps + " MIN:" + fpsMin + " MAX:" + fpsMax + "]";

        fpsTime = 0;
        fpsCount = 0;
        fpsNum = 0;
      }
    }

    cwt.game_state_update_state(delta);
    cwt.game_state_render_state(delta);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

cwt.main = function() {
  cwt.log_info("starting CustomWars Tactics");
  if (cwt.type_is_function(cwt.client_intialize_tester)) {
    cwt.client_intialize_tester();
  }
  cwt.client_intialize_workers();
  cwt.game_state_set_state("start_game");
  enter_loop();
};