var addJob = function (queue, nameList, handler, filter) {
  cwt.list_filtered_for_each(nameList, function (el) {
    queue.pushSynchronJob(function () {
      handler(el);
    });
  }, filter);
};

controller.cutImages = cwt.oneTimeCallable(function (err, baton) {
  var queue;

  queue = new cwt.Queue();

  queue.pushSynchronJob(function () {
    baton.take(); // TODO remove this legacy thing
  });

  queue.pushSynchronJob(cwt.logCallback("start cropping images"));

  addJob(queue, model.data_unitTypes, view.imageProcessor_cropUnitSprite, function (unitTypeId) {
    return !!model.data_unitSheets[unitTypeId].assets.gfx;
  });

  addJob(queue, model.data_graphics.misc, view.imageProcessor_cropMiscSprite, null);

  queue.pushSynchronJob(cwt.logCallback("finished cropping images"));

  queue.pushSynchronJob(function () {
    baton.pass(); // TODO remove this legacy thing
  });

  queue.execute(function () {});

});
