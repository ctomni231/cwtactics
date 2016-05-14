var localForageAPI = {

  getItem: function(key, cbDone, cbFail) {
    localforage.getItem(key, function(err, value) {
      if (err !== null) {
        cbFail(err);
      } else {
        cbDone(value);
      }
    });
  },

  setItem: function(key, value, cbDone, cbFail) {
    localforage.setItem(key, value, function(err, value) {
      if (err !== null) {
        cbFail(err);
      } else {
        cbDone();
      }
    });
  },

  removeItem: function(key, cbDone, cbFail) {
    localforage.removeItem(key, function(err) {
      if (err !== null) {
        cbFail(err);
      } else {
        cbDone();
      }
    });
  },

  clear: function(cbDone, cbFail) {
    localforage.clear(function(err) {
      if (err !== null) {
        cbFail(err);
      } else {
        cbDone();
      }
    });
  }
};

cwt.producePersistentStorage = function() {
  return Object.create(localForageAPI);
};