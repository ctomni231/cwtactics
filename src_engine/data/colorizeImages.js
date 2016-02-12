var forEachType = function (queue, nameList, typeList, handler) {
  nameList.forEach(function (el) {
    if (typeList && !typeList[el].assets.gfx) return;
    queue.pushSynchronJob(function () {
      handler(el);
    });
  });
};

controller.colorizeImages = cwt.oneTimeCallable(function (err, baton) {
  var queue;

  queue = new cwt.Queue();

  queue.pushSynchronJob(function () {
    baton.take(); // TODO remove legacy code protection
  });

  queue.pushSynchronJob(cwt.logCallback("started colorizing images"));

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

  queue.pushSynchronJob(cwt.logCallback("finished colorizing images"));

  queue.pushSynchronJob(function () {
    baton.pass(); // TODO remove legacy code protection
  });

  queue.execute(function () {});
});
