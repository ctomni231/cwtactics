cwt.Loading.create(function (next) {
  if (cwt.DEBUG) {
    console.log("loading maps");
  }

  if (!cwt.Loading.hasCachedData) {
    cwt.Maps.grabFromLive(next);
  } else {
    next();
  }
});