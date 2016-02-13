/*global controller, document, model*/

controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.section = "cwt_load_screen";

controller.screenStateMachine.structure.LOAD.enterState = function () {
  var jobs, audio_enabled_environment, handle_error, update_gui, load, element_loading_text, element_loading_percentage;

  cwt.log_info("### game startup ###");

  element_loading_text = cwt.require_non_null(document.getElementById("loading_text"));
  element_loading_percentage = cwt.require_non_null(document.getElementById("loading_bar"));

  handle_error = function (error) {
    cwt.log_error("game startup failure [" + error + "]", error);
    window.onerror(error);
  };

  update_gui = function (text, done_percentage) {
    return function (when_done) {
      element_loading_text.innerHTML = cwt.require_string(model.data_localized(text));
      element_loading_percentage.className = "loadBar_" + done_percentage;
      when_done();
    };
  };

  load = function (handler) {
    return function (when_done) {
      try {
        handler(when_done, handle_error);
      } catch (error) {
        handle_error(error);
      }
    };
  };

  audio_enabled_environment = function () {
    if (controller.features_client.audioSFX || controller.features_client.audioMusic) {
      return true;
    }
    return false;
  };

  jobs = [];

  jobs.push(update_gui("loading.prepare_environment", 0));
  jobs.push(load(cwt.loading_prepare_environment_abilities));

  jobs.push(update_gui("loading.check_environment", 5));
  jobs.push(load(cwt.loading_check_environment));

  jobs.push(update_gui("loading.init_storage", 10));
  jobs.push(load(cwt.loading_init_storage));

  jobs.push(update_gui("loading.checkup_startup_parameters", 15));
  jobs.push(load(cwt.loading_wipe_storage));
  jobs.push(load(cwt.loading_check_forcetouch_mode));

  jobs.push(update_gui("loading.loadModData", 20));
  jobs.push(load(cwt.loading_modification));

  jobs.push(update_gui("loading.loadMaps", 30));
  jobs.push(load(cwt.loading_maps));

  jobs.push(update_gui("loading.loadImages", 40));
  jobs.push(load(cwt.loading_image_resources));

  jobs.push(update_gui("loading.setBackground", 50));
  jobs.push(load(cwt.loading_set_random_background));

  jobs.push(update_gui("loading.cropImages", 60));
  jobs.push(load(cwt.loading_crop_images));

  jobs.push(update_gui("loading.colorizeImages", 65));
  jobs.push(load(cwt.loading_colorize_images));

  jobs.push(update_gui("loading.loadSounds", 70));
  jobs.push(function (when_done, error_receiver) {
    if (!audio_enabled_environment()) {
      when_done();
      return;
    }
    load(cwt.loading_initialize_audio_backend)(when_done, error_receiver);
  });
  jobs.push(function (when_done, error_receiver) {
    if (!audio_enabled_environment()) {
      when_done();
      return;
    }
    load(cwt.loading_audio_resources)(when_done, error_receiver);
  });

  jobs.push(update_gui("loading.prepareInput", 90));
  jobs.push(load(cwt.loading_initialize_input_backends));

  jobs.push(update_gui("loading.prepareLanguage", 93));
  jobs.push(load(cwt.loading_prepare_input_mapping));

  jobs.push(update_gui("loading.prepareLanguage", 96));
  jobs.push(load(cwt.loading_localize_frontend));

  jobs.push(update_gui("loading.done", 100));

  cwt.queue_async_execute_joblist(jobs, function () {
    controller.screenStateMachine.event("complete");
  });
};

controller.screenStateMachine.structure.LOAD.complete = function () {
  return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;
