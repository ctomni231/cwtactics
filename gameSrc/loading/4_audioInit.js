/*
 * Initializes the audio context of the game engine.
 */
cwt.Loading.create(function (next) {
  cwt.Audio.initialize();
  cwt.Audio.loadConfigs(next);
});