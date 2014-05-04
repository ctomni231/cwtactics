/**
 *
 * @namespace
 */
cwt.Maps = {

  /**
   * @type {Array}
   */
  maps: null,

  updateMapList: function (callback) {
    cwt.Storage.mapStorage.keys(function (keys) {
      cwt.Maps.maps = keys;
      if (callback) {
        callback();
      }
    })
  },

  grabFromLive: function (callback) {
    var stuff = [];

    Object.keys(cwt.mapList).forEach(function (key) {
      stuff.push(function (next) {
        grabRemoteFile({
          path: cwt.MOD_PATH + cwt.mapList[key],
          json: true,

          error: function (msg) {
            throw Error("could not load map");
          },

          success: function (resp) {
            cwt.Storage.mapStorage.set(key, resp, function () {
              next();
            });
          }
        });
      });
    });

    callAsSequence(stuff, function () {
      delete cwt.Maps.grabFromLive;
      callback();
    });
  },

  loadMap: function (path, callback) {
    cwt.Storage.mapStorage.get(path, function (obj) {
      callback(path, obj.value);
    });
  }

};