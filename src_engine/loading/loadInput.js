cwt.loading_initialize_input_backends = function (when_done, error_receiver) {
  cwt.log_info("loading input devices");

  var canvas = cwt.require_non_null(document.getElementById("cwt_canvas"));
  var menuEl = cwt.require_non_null(document.getElementById("cwt_menu"));

  if (controller.features_client.keyboard) {
    controller.setupKeyboardControls(canvas, menuEl);
  }

  if (controller.features_client.gamePad) {
    controller.setupGamePadControls(canvas, menuEl);
  }

  if (controller.features_client.mouse) {
    controller.setupMouseControls(canvas, menuEl);
  }

  if (controller.features_client.touch) {
    controller.setupTouchControls(canvas, menuEl);
  }

  when_done();
};

// there are probably side effects when we initialize
// input backends twice... so we forbid that here
cwt.make_only_callable_once(cwt.loading_initialize_input_backends);

cwt.loading_prepare_input_mapping = function (when_done, error_receiver) {
  controller.loadKeyMapping(function () {
    when_done();
  });
};
