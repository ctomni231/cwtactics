/*global controller, model, util*/

cwt.loading_maps = function (when_done, error_receiver) {
  cwt.queue_async_execute_list(model.data_maps, function (map, when_loaded) {
    controller.storage_maps.exists(map, function (exits) {
      if (exits) {
        when_loaded();
        return;
      }

      cwt.log_info("going to cache map " + map);

      util.grabRemoteFile({
        path: model.data_assets.maps + "/" + map,
        json: true,

        error: function (msg) {
          error_receiver(msg);
        },

        success: function (resp) {
          controller.storage_maps.set(map, resp, function () {
            cwt.log_info("cached map " + map);
            when_loaded();
          });
        }
      });
    });
  }, when_done);
};

cwt.make_only_callable_once(cwt.loading_maps);
