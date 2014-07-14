/*
// Initializes the audio context of the game engine.
//
cwt.Loading.create(function (next) {
  if (cwt.DEBUG) {
    console.log("initializing audio system");
  }

  cwt.Audio.initialize();

  if (cwt.Loading.hasCachedData) {
    cwt.Audio.loadConfigs(next);
  } else {
    next();
  }
});