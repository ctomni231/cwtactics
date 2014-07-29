require('../loading').addHandler(function (next) {
  if (cwt.DEBUG) {
    console.log("loading maps");
  }

  if (!cwt.Loading.hasCachedData) {
    cwt.Maps.grabFromLive(function () {
      cwt.Maps.updateMapList(next);
    });
  } else {
    cwt.Maps.updateMapList(next);
  }
});