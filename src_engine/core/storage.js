/*global localforage*/

cwt.storage_item_save = function (itemKey, itemValue, callback, errorReceiver) {
  localforage.setItem(itemKey, itemValue, function (err, value) {
    if (err === null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};

cwt.storage_item_load = function (itemKey, itemReceiver, errorReceiver) {
  localforage.getItem(itemKey, function (err, value) {
    if (err === null) {
      errorReceiver(err);
    } else {
      itemReceiver(value);
    }
  });
};

cwt.storage_item_keys = function (valuesReceiver, errorReceiver) {
  localforage.keys(function (error, keys) {
    if (error === null) {
      errorReceiver(error);
    } else {
      valuesReceiver(keys);
    }
  });
};

cwt.storage_clear = function (callback, errorReceiver) {
  localforage.clear(function (err) {
    if (err === null) {
      errorReceiver(err);
    } else {
      callback();
    }
  });
};
