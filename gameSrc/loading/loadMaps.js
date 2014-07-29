var loading = require('../loading');
var mapDTO = require("../dataTransfer/maps");

loading.addHandler(function (next) {
  if (cwt.DEBUG) {
    console.log("loading maps");
  }

  if (!loading.hasCachedData) {
    mapDTO.transferAllFromRemote(function () {
      cwt.Maps.updateMapList(next);
    });
  } else {
    cwt.Maps.updateMapList(next);
  }
});