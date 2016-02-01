cwt.storage = {};

cwt.storage.itemSaver = function (itemKey, itemValue, callback, errorReceiver) {
  localforage.setItem(itemKey, itemValue, function (err, value) {
    if (err == null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};

cwt.storage.itemLoader = function (itemKey, itemReceiver, errorReceiver) {
  localforage.getItem(itemKey, function (err, value) {
    if (err == null) {
      errorReceiver(err);
    } else {
      itemReceiver(value);
    }
  });
};

cwt.storage.storageClearer = function (callback, errorReiceiver) {
  localforage.clear(function (err) {
    if (err == null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};
