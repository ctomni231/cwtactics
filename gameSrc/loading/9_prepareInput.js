/*
 * Loads the user defined key configuration (or the default one if not exists) into the input system.
 */
cwt.Loading.create(function (next) {
  cwt.Input.loadKeyMapping(next);
});