/*global controller, model, XMLHttpRequest, Base64Helper*/

function audio_resource(path, is_music, preload_it) {
  return {
    path: path,
    is_music: is_music,
    preload: preload_it
  };
}

function collect_audio_resources() {
  var resource_queue;

  resource_queue = [];

  if (controller.features_client.audioMusic) {

    resource_queue.push(audio_resource(model.data_menu.music, true, true));

    cwt.map_for_each_property(model.data_fractionSheets, function (fraction_id, fraction_type) {
      resource_queue.push(audio_resource(fraction_type.music, true, false));
    });

    cwt.map_for_each_property(model.data_coSheets, function (co_id, co_type) {
      resource_queue.push(audio_resource(co_type.music, true, false));
    });
  }

  if (controller.features_client.audioSFX) {

    cwt.map_for_each_property(model.data_sounds, function (key, value) {
      resource_queue.push(audio_resource(value, false, true));
    });

    cwt.map_for_each_property(model.data_tileSheets, function (property_id, property_type) {
      if (property_type.assets && property_type.assets.fireSound) {
        resource_queue.push(audio_resource(property_type.assets.fireSound, false, true));
      }
    });

    cwt.map_for_each_property(model.data_unitSheets, function (unit_id, unit_type) {
      if (unit_type.assets) {

        if (unit_type.assets.fireSound) {
          resource_queue.push(audio_resource(unit_type.assets.fireSound, false, true));
        }

        if (unit_type.assets.pri_att_sound) {
          resource_queue.push(audio_resource(unit_type.assets.pri_att_sound, false, true));
        }
        if (unit_type.assets.sec_att_sound) {
          resource_queue.push(audio_resource(unit_type.assets.sec_att_sound, false, true));
        }
      }
    });
  }
  return resource_queue;
}

function grab_and_load_audio(resource, when_finished_loading, when_failed_to_load) {
  var request;

  request = new XMLHttpRequest();
  request.open("GET", (resource.is_music ? model.data_assets.music : model.data_assets.sounds) + "/" + resource.path, true);
  request.responseType = "arraybuffer";
  request.onload = function () {
    var audioData, stringData;

    if (this.status === 404) {
      when_failed_to_load("could not find " + resource.path);
      return;
    }

    audioData = request.response;
    stringData = Base64Helper.encodeBuffer(audioData);

    cwt.log_info(" ..saving audio file " + resource.path);

    controller.storage_assets.set(resource.path, stringData, function () {
      if (resource.preload) {
        cwt.log_info(" ..preloading audio file " + resource.path);
        controller.audio_loadByArrayBuffer(resource.path, audioData, function () {
          when_finished_loading();
        });

      } else {
        when_finished_loading();
      }
    });
  };

  request.send();
}

function load_audio(resource, when_finished_loading) {
  cwt.log_info(" ..preloading audio file " + resource.path);

  controller.storage_assets.get(resource.path, function (data) {
    controller.audio_loadByArrayBuffer(resource.path, Base64Helper.decodeBuffer(data.value), function () {
      when_finished_loading();
    });
  });
}

cwt.loading_audio_resources = function (when_done, error_receiver) {
  cwt.log_info("loading modification sounds");

  cwt.queue_async_execute_list(collect_audio_resources(), function (resource, when_loaded_audio_file) {

    if (controller.audio_isBuffered(resource.path)) {
      cwt.log_warn("skip audio file " + resource.path + ", because it's already loaded");
      when_loaded_audio_file();
      return;
    }

    cwt.log_info("loading audio " + resource.path);
    controller.storage_assets.get(resource.path, function (obj) {
      if (!obj) {
        grab_and_load_audio(resource, when_loaded_audio_file, error_receiver);
      } else {
        if (resource.preload) {
          load_audio(resource, when_loaded_audio_file);
        } else {
          when_loaded_audio_file();
        }
      }
    });
  }, when_done);
};

cwt.loading_initialize_audio_backend = function (when_done, error_receiver) {
  controller.audio_initialize();
  when_done();
};
