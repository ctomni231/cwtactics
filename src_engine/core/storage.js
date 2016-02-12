/*global cwt,localforage*/

cwt.storage = {};

cwt.storage.itemSaver = function (itemKey, itemValue, callback, errorReceiver) {
  localforage.setItem(itemKey, itemValue, function (err, value) {
    if (err === null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};

cwt.storage.itemLoader = function (itemKey, itemReceiver, errorReceiver) {
  localforage.getItem(itemKey, function (err, value) {
    if (err === null) {
      errorReceiver(err);
    } else {
      itemReceiver(value);
    }
  });
};

cwt.storage.itemKeys = function (valuesReceiver, errorReceiver) {
  localforage.keys(function (error, keys) {
    if (error === null) {
      errorReceiver(error);
    } else {
      valuesReceiver(keys);
    }
  });
};

cwt.storage.storageClearer = function (callback, errorReceiver) {
  localforage.clear(function (err) {
    if (err === null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};
