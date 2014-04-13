cwt.Loading.create(function (loaderNext) {
  if (cwt.Loading.hasCachedData) {
    cwt.Audio.grabFromCache(loaderNext);
  } else {
    cwt.Audio.grabFromRemote(loaderNext);
  }
});