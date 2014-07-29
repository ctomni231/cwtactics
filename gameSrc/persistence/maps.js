var mapNames_ = null;

//
//
exports.grabRemoteMapList = function(callback) {
  var stuff = [];

  Object.keys(cwt.mapList).forEach(function(key) {
    stuff.push(function(next) {
      grabRemoteFile({
        path: cwt.MOD_PATH + cwt.Persistence.mapNames_[key],
        json: true,

        error: function(msg) {
          throw Error("could not load map");
        },

        success: function(resp) {
          cwt.Persistence.storage.set(key, resp, function() {
            next();
          });
        }
      });
    });
  });

  callAsSequence(stuff, function() {
    cwt.Persistence.grabMapsFromLive = null;
    callback();
  });
};

//
//
exports.load = function(path, callback) {
  cwt.Persistence.storage.get(path, function(obj) {
    callback(path, obj.value);
  });
};