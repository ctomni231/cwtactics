controller.registerCommand({

  key:"loadImages",
  localAction: true,

  // ------------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ------------------------------------------------------------------------
  action: function(){
    if( CLIENT_DEBUG ){
      util.logInfo("loading images... place lock");
    }
    controller.lockCommandEvaluation = true;

    // STEP 1 - LOADING THEM

    /** Contains the path to the image base. */
    var IMAGE_PATH = "../../../image/";

    var allLoaded = function( imgArray ){
      for( var i=0,e=imgArray.length; i<e; i++ ){

        // NOT ALL IMAGES ARE LOADED
        if( imgArray[i].complete !== true ) return false;
      }

      // ALL IMAGES ARE LOADED
      return true;
    };

    var loadImages = function( imgArray, cb ){
      var imgObjs = [];
      var types = [];
      var img;

      // CREATE IMAGE INSTANCES
      for( var i=0,e=imgArray.length; i<e; i++ ){
        img = new Image();
        img.src = IMAGE_PATH+imgArray[i][1];
        imgObjs[i] = img;
        types[i] = imgArray[i][0];
      }

      // WAIT FOR LOAD END
      var cbCaller = function(){
        if( allLoaded( imgObjs ) )  cb( types, imgObjs );
        else                        setTimeout( cbCaller, 250 );
      };
      cbCaller();
    };

    // ------------------------------------------------------------------------
    var leftToLoad = 4;

    // LOAD UNITS (1)
    if( CLIENT_DEBUG ){ util.logInfo("loading unit commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.units, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setUnitImageForType(
          images[i], types[i],
          view.IMAGE_CODE_IDLE, view.COLOR_RED
        );
      }
      if( CLIENT_DEBUG ){ util.logInfo("unit commands loaded"); }
      leftToLoad--;
    });

    // LOAD PROPERTIES (2)
    if( CLIENT_DEBUG ){ util.logInfo("loading property commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.properties, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setPropertyImageForType(
          images[i], types[i],
          view.COLOR_RED
        );
      }
      if( CLIENT_DEBUG ){ util.logInfo("property commands loaded"); }
      leftToLoad--;
    });

    // LOAD TILES (3)
    if( CLIENT_DEBUG ){ util.logInfo("loading tile commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.tiles, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setTileImageForType( images[i], types[i] );
      }
      if( CLIENT_DEBUG ){ util.logInfo("tile commands loaded"); }
      leftToLoad--;
    });

    // LOAD OTHER (4)
    if( CLIENT_DEBUG ){ util.logInfo("loading other commands"); }
    loadImages( CWT_MOD_DEFAULT.graphic.misc, function( types, images ){

      for( var i=0,e=types.length; i<e; i++ ){
        view.setInfoImageForType( images[i], types[i] );
      }
      if( CLIENT_DEBUG ){ util.logInfo("other commands loaded"); }
      leftToLoad--;
    });

    // WAIT FOR LOADING
    if( CLIENT_DEBUG ){ util.logInfo("waiting for commands"); }
    var modifyWaiter = function(){
      if( leftToLoad === 0 ){
        if( CLIENT_DEBUG ){
          util.logInfo("all images are loaded.. releasing lock");
        }
        controller.lockCommandEvaluation = false;
      }
      else{
        setTimeout( modifyWaiter, 250 );
      }
    };
    modifyWaiter();
  }
});