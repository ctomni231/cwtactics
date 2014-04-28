cwt.Loading.create(function (nextLoadingStep) {
  if (cwt.DEBUG) {
    console.log("initializing input system");
  }

  cwt.Input.initialize();
  cwt.Input.loadKeyMapping(nextLoadingStep);
});