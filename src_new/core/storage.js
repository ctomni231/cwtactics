cwt.storage_save = function(key, item, when_done, error_receiver) {
  localforage.setItem(key, item, function(err, value) {
    if (err !== null) {
      error_receiver(err);
    } else {
      when_done();
    }
  });
};

cwt.storage_load = function(key, item_receiver, error_receiver) {
  localforage.getItem(key, function(err, value) {
    if (err !== null) {
      error_receiver(err);
    } else {
      item_receiver(value);
    }
  });
};

cwt.storage_remove_item = function(key, when_done, error_receiver) {
  localforage.removeItem(key, function(err) {
    if (err !== null) {
      error_receiver(err);
    } else {
      when_done();
    }
  });
};

cwt.storage_remove_all = function(when_done, error_receiver) {
  localforage.clear(function(err) {
    if (err !== null) {
      error_receiver(err);
    } else {
      when_done();
    }
  });
};

cwt.storage_for_each_key = function(keys_receiver, error_receiver) {
  localforage.keys(function(error, keys) {
    if (error !== null) {
      error_receiver(error);
    } else {
      keys_receiver(keys);
    }
  });
};