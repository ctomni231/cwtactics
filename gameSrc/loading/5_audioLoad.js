require('../loading').addHandler(function (loaderNext) {
  if (cwt.DEBUG) {
    console.log("loading audio data");
  }

  if (cwt.Loading.hasCachedData) {
    cwt.Audio.grabFromCache(loaderNext);
  } else {
    cwt.Audio.grabFromRemote(loaderNext);
  }
});