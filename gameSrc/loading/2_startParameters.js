cwt.Loading.create(function (nextLoadingStep) {
  callAsSequence([

    // wipe out storage
    function (next) {
      cwt.Storage.generalStorage.get(cwt.Options.PARAM_WIPEOUT, function (obj) {
        var wipeOut = (obj && obj.value === true);
        if (!wipeOut) {
          wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";
        }

        if (wipeOut) {
          if (this.DEBUG) {
            cwt.log("wipe out cached data");
          }

          cwt.Storage.wipeOutAll(function () {
            next();
          });
        } else {
          next();
        }
      });
    },

    // force touch
    function (next) {
      controller.storage_general.get(cwt.Options.PARAM_FORCE_TOUCH,function( obj ){
        var  doIt = (obj && obj.value === true);
        if( !doIt ) doIt = getQueryParams(document.location.search).cwt_forceTouch === "1";

        if(  doIt ){

          // enable touch and disable mouse ( cannot work together )
          cwt.ClientFeatures.mouse = false;
          cwt.ClientFeatures.touch = true;

          // mark forceTouch in the options
          cwt.Options.forceTouch = true;
        }

        next();
      });
    }

  ], function () {
    nextLoadingStep();
  });
});