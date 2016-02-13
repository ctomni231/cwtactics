cwt.loading_set_random_background = function (when_done, error_receiver) {
  var el = model.data_menu.bgs[parseInt(model.data_menu.bgs.length * Math.random(), 10)];
  controller.storage_assets.get(model.data_assets.images + "/" + el, function (obj) {
    if (obj) {
      cwt.log_info("set custom background to", el);
      controller.background_registerAsBackground(obj.value);
    }

    when_done();
  });
};
