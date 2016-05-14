cwt.loading_wipe_storage = function (when_done, error_receiver) {
  controller.storage_general.get("cwt_resetData", function (obj) {
    var wipeOut = (obj && obj.value === true);
    if (!wipeOut) wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";

    if (wipeOut) {
      cwt.log_info("wipe out cached data");

      // NUKE STORAGE
      controller.storage_general.clear(function () {
        controller.storage_assets.clear(function () {
          controller.storage_maps.clear(function () {
            when_done();
          });
        });
      });
    } else {
      when_done();
    }
  });
};

cwt.loading_init_storage = function (when_done, error_receiver) {

  var storage_type = (Browser.mobile) ? 'webkit-sqlite' : 'indexed-db';

  function db_creator(name, size, where_to_store) {
    return function (when_done) {
      controller.storage_create(
        name,
        size,
        storage_type,
        function (storage) {
          controller[where_to_store] = storage;
          when_done();
        }
      );
    };
  }

  var jobs = [];

  jobs.push(db_creator(controller.storage_NAMES.maps, controller.storage_SIZES.maps, "storage_maps"));
  jobs.push(db_creator(controller.storage_NAMES.assets, controller.storage_SIZES.assets, "storage_assets"));
  jobs.push(db_creator(controller.storage_NAMES.general, controller.storage_SIZES.general, "storage_general"));

  cwt.queue_async_execute_joblist(jobs, when_done);
};
