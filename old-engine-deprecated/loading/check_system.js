controller.features_client = {
  audioSFX: false,
  audioMusic: false,
  gamePad: false,
  keyboard: false,
  mouse: false,
  touch: false,
  supported: false,
  scaledImg: false
};

cwt.loading_prepare_environment_abilities = function (when_done, error_receiver) {
  if (Browser.mobile) {

    if (Browser.ios) {
      if (Browser.version >= 5) controller.features_client.supported = true;
      if (Browser.version >= 6) controller.features_client.audioSFX = true;
    } else if (Browser.android) {
      controller.features_client.supported = true;
    }

    controller.features_client.touch = true;
  } else {

    if (Browser.chrome || Browser.safari) {
      controller.features_client.supported = true;
      controller.features_client.audioSFX = true;
      controller.features_client.audioMusic = true;
    }

    if (Browser.chrome) controller.features_client.gamePad = true;

    controller.features_client.mouse = true;
    controller.features_client.keyboard = true;
  }

  when_done();
};

cwt.loading_check_environment = function (when_done, error_receiver) {
  if (!controller.features_client.supported) {
    if (confirm("Your system isn't supported by CW:T. Try to run it?")) {
      when_done();
    } else {
      error_receiver("System is not supported");
    }
  } else {
    when_done();
  }
};
