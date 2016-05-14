var forEachType = function (queue, nameList, typeList, handler) {
  nameList.forEach(function (el) {
    if (typeList && !typeList[el].assets.gfx) return;
    queue.pushSynchronJob(function () {
      handler(el);
    });
  });
};

cwt.loading_colorize_images = function (when_done, error_receiver) {
  var queue;

  queue = new cwt.Queue();

  queue.pushSynchronJob(function () {
    cwt.log_info("started colorizing images");
  });

  forEachType(queue, model.data_unitTypes, model.data_unitSheets, view.imageProcessor_colorizeUnit);
  forEachType(queue, model.data_propertyTypes, model.data_tileSheets, view.imageProcessor_colorizeProperty);
  forEachType(queue, model.data_tileTypes, null, view.imageProcessor_colorizeTile);

  model.data_tileTypes.forEach(function (el) {
    var obj = model.data_tileSheets[el];
    if (obj.assets.gfx_variants) {
      obj.assets.gfx_variants[1].forEach(function (sel) {
        queue.pushSynchronJob(function () {
          view.imageProcessor_colorizeTile(sel[0]);
        });
      });
    }
  });

  queue.pushSynchronJob(function () {
    cwt.log_info("finished colorizing images");
  });

  queue.execute(when_done);
};

cwt.make_only_callable_once(cwt.loading_colorize_images);
