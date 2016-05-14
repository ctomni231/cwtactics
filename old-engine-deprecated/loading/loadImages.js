/*global controller, model, view, Base64Helper, Image*/

var MODE_UNIT = "U";
var MODE_TILE = "T";
var MODE_PROP = "P";
var MODE_MISC = "M";

function build_image_resource(key, path, mode) {
  return {
    key: cwt.require_non_null(key),
    path: model.data_assets.images + "/" + cwt.require_non_null(path),
    mode: cwt.require_non_null(mode)
  };
}

function push_dynamic_resources(resources, assets, name) {
  if (assets[name]) {
    resources.push(build_image_resource(assets[name][0], assets[name][0], MODE_MISC));
  }
}

function push_resources_for_multiple_animation_steps(resources, assets, animation_name, steps) {
  push_dynamic_resources(resources, assets, animation_name);
  for (var i = 0; i < steps; i += 1) {
    push_dynamic_resources(resources, assets, animation_name + i);
  }
}

function get_image_resources() {
  var resources;

  resources = [];

  cwt.map_for_each_property(model.data_unitSheets, function (id, type) {
    if (type.assets.gfx) {
      resources.push(build_image_resource(id, type.assets.gfx, MODE_UNIT));
    }
  });

  cwt.map_for_each_property(model.data_tileSheets, function (id, type) {
    if (model.data_tileTypes.indexOf(id) > -1) {

      if (type.assets.gfxOverlay) {
        view.overlayImages[id] = true;
      }

      if (type.assets.animated === 1 || type.assets.animated === 2) {
        view.animatedTiles[id] = true;
      }

      resources.push(build_image_resource(id, type.assets.gfx, MODE_TILE));

      if (type.assets.gfx_variants) {
        type.assets.gfx_variants[1].forEach(function (sel) {
          resources.push(build_image_resource(sel[0], sel[0], MODE_TILE));
        });
      }
    }
  });

  cwt.map_for_each_property(model.data_tileSheets, function (id, type) {
    if (model.data_tileTypes.indexOf(id) === -1) {
      if (type.assets.gfx) {
        resources.push(build_image_resource(id, type.assets.gfx, MODE_PROP));
        push_resources_for_multiple_animation_steps(resources, type.assets, "fireAnimation", 4);
        push_resources_for_multiple_animation_steps(resources, type.assets, "chargeAnimation", 4);
        push_resources_for_multiple_animation_steps(resources, type.assets, "streamAnimation", 4);
      }
    }
  });

  cwt.list_forEach(model.data_menu.bgs, function (background) {
    resources.push(build_image_resource(background, background, MODE_MISC));
  });

  cwt.list_forEach(model.data_graphics.misc, function (graphic) {
    resources.push(build_image_resource(graphic[0], graphic[1], MODE_MISC));
  });

  return resources;
}

function load_image_into_game_model(resource, image) {
  switch (resource.mode) {

    case "U":
      view.setUnitImageForType(image, resource.key, view.IMAGE_CODE_IDLE, view.COLOR_RED);
      break;
    case "P":
      view.setPropertyImageForType(image, resource.key, view.COLOR_RED);
      break;
    case "T":
      view.setTileImageForType(image, resource.key);
      break;
    case "M":
      view.setInfoImageForType(image, resource.key);
      break;

    default:
      break;
  }
}

function grab_and_load_image_resource(resource, when_finished_loading, when_failed_loading) {
  var img = new Image();
  img.onerror = when_failed_loading;
  img.onload = function () {
    controller.storage_assets.set(resource.path, Base64Helper.canvasToBase64(img), function () {
      load_image_into_game_model(resource, img);
      when_finished_loading();
    });
  };
  img.src = resource.path;
}

function load_image_resource(resource, image_content, when_finished_loading, when_failed_loading) {
  var img = new Image();
  img.onerror = when_failed_loading;
  img.onload = function () {
    load_image_into_game_model(resource, img);
    when_finished_loading();
  };
  img.src = "data:image/png;base64," + image_content;
}

cwt.loading_image_resources = function (when_done, error_receiver) {
  cwt.log_info("going to load all game images");

  cwt.queue_async_execute_list(get_image_resources(), function (resource, when_resource_is_loaded) {
    controller.storage_assets.get(resource.path, function (obj) {
      if (obj) {
        cwt.log_info("load image " + resource.path + " from game cache");
        load_image_resource(resource, obj.value, when_resource_is_loaded, error_receiver);
      } else {
        cwt.log_info("load image " + resource.path + " from remote location");
        grab_and_load_image_resource(resource, when_resource_is_loaded, error_receiver);
      }
    });
  }, when_done);
};
