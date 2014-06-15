"use strict";

cwt.Loading.create(function (next) {
  if (cwt.DEBUG) {
    console.log("checking system");
  }

  // ask question when system is not supported
  if (cwt.ClientFeatures.supported || confirm("Your system isn't supported by CW:T. Try to run it?") ) {
    next();
  }
});
cwt.Loading.create(function (next) {
  if (cwt.DEBUG) {
    console.log("initialize storage system");
  }

  cwt.Storage.initialize(next);
});
cwt.Loading.create(function (nextLoadingStep) {
  if (cwt.DEBUG) {
    console.log("checking options");
  }

  callAsSequence([

    // wipe out storage
    function (next) {
      cwt.Storage.generalStorage.get(cwt.Options.PARAM_WIPEOUT, function (obj) {
        var wipeOut = (obj && obj.value === true);
        if (!wipeOut) {
          wipeOut = getQueryParams(document.location.search).cwt_resetData === "1";
        }

        if (wipeOut) {
          if (cwt.DEBUG) {
            console.log("wipe out cached data");
          }

          cwt.Storage.wipeOutAll(function () {
            next();
          });
        } else {
          next();
        }
      });
    },

    cwt.Options.loadOptions,

    // force touch (start parameter can overwrite saved options)
    function (next) {
      cwt.Storage.generalStorage.get(cwt.Options.PARAM_FORCE_TOUCH,function( obj ){
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
cwt.Loading.create(function (nextLoadingStep) {
  if (cwt.DEBUG) {
    console.log("initializing input system");
  }

  cwt.Input.initialize();
  cwt.Input.loadKeyMapping(nextLoadingStep);
});
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
cwt.Loading.create(function (loaderNext) {
  if (cwt.DEBUG) {
    console.log("loading audio data");
  }

  if (cwt.Loading.hasCachedData) {
    cwt.Audio.grabFromCache(loaderNext);
  } else {
    cwt.Audio.grabFromRemote(loaderNext);
  }
});
cwt.Loading.create(function (loaderNext) {
   if (cwt.DEBUG) {
     console.log("loading image data");
   }

   if (cwt.Loading.hasCachedData) {
     cwt.Image.grabFromCache(loaderNext);
   } else {
     cwt.Image.grabFromRemote(function () {
       cwt.Image.persistImages(loaderNext);
     });
   }
});
cwt.Loading.create(function (next) {
  function doOnOrientationChange() {
    switch (window.orientation) {
      case -90:
      case 90:
        console.log('landscape');
        break;

      default:
        console.log('portrait');
        break;
    }
  }

  window.addEventListener('orientationchange', doOnOrientationChange);

  // Initial execution if needed
  doOnOrientationChange();

  next();
});
cwt.Loading.create(function (next) {
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