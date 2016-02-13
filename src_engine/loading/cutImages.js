var addJob = function (queue, nameList, handler, filter) {
  cwt.list_filtered_for_each(nameList, function (el) {
    queue.pushSynchronJob(function () {
      handler(el);
    });
  }, filter);
};

cwt.loading_crop_images = function (when_done, error_receiver) {
  var queue;

  queue = new cwt.Queue();

  queue.pushSynchronJob(function () {
    cwt.log_info("started cropping images");
  });

  addJob(queue, model.data_unitTypes, view.imageProcessor_cropUnitSprite, function (unitTypeId) {
    return !!model.data_unitSheets[unitTypeId].assets.gfx;
  });

  addJob(queue, model.data_graphics.misc, view.imageProcessor_cropMiscSprite, null);

  queue.pushSynchronJob(function () {
    cwt.log_info("finished cropping images");
  });

  queue.execute(when_done);
};

cwt.make_only_callable_once(cwt.loading_crop_images);
