/**
 *
 * @namespace
 */
cwt.Maps = {

  maps: [],

  loadMap: function (path, callback) {

    // register map path (as identifier)
    this.maps.push(path);

    cwt.Storage.mapStorage.get(path, function (obj) {

      // load it when the map isn't available in the storage
      if (!obj.value) {
        util.grabRemoteFile({
          path: path,
          json: true,

          error: function (msg) {
            throw Error("could not load map");
          },

          success: function (resp) {
            cwt.Storage.mapStorage.set(path, resp, function () {
              callback();
            });
          }
        });
      }
    });
  }

};