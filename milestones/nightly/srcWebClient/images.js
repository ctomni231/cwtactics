cwt.defineLayer( CWT_LAYER_CLIENT,
  function( client, userAction, data, util, persistence){

    var STATE_IDLE = 0;
    var STATE_LOAD = 1;
    var STATE_FINISHED = 2;

    var status = STATE_IDLE;
    var registeredImages = [];

    var loadingImages = [];

    client.IMAGE_PATH = "img/";

    client.isImageDataReady = function(){
      if( status === STATE_FINISHED ) return true;
      return false;
    };

    client.checkImageLoadingStatus = function(){

      // CHECK THEM
      for( var i=0,e=loadingImages.length; i<e; i+=4 ){

        // NOT ALL IMAGES ARE LOADED BREAK
        if( loadingImages[i].complete !== true ){
          return false;
        }
      }

      if( util.DEBUG ){
        util.logInfo("images loaded, adding them to client layer");
      }

      // ALL IMAGES ARE LOADED, ADD THEM TO IMAGE DATA BASE
      for( var i=0,e=loadingImages.length; i<e; i+=4 ){

        var type = loadingImages[i+1];
        var code = loadingImages[i+2];
        var color = loadingImages[i+3];
        switch( code ){

          case client.IMAGE_CODE_IDLE :
            client.CodeIdleImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_STATELESS :
            client.CodeStatelessImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_IDLE_INVERTED :
            client.CodeIdleInvertedImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_LEFT :
            client.CodeLeftImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_RIGHT :
            client.CodeRightImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_DOWN :
            client.CodeDownImages[color][type] = loadingImages[i];
            break;

          case client.IMAGE_CODE_UP :
            client.CodeUpImages[color][type] = loadingImages[i];
            break;

          default: util.logError("unknown image state code ",code );
        }
      }

      loadingImages.splice(0);
      loadingImages = null;

      if( util.DEBUG ) util.logInfo("images successfully loaded");
      
      return true;
    };

    client.startLoading = function(){
      if( status !== STATE_IDLE ){
        util.logError(
          "image stack isn't in IDLE mode anymore",
          "(maybe images are loaded already)"
        );
        return;
      }

      function imageToLoader( type, code, color ){
        var img = new Image();
        img.src = client.IMAGE_PATH+color+"_"+code+"_"+type+".png";
        loadingImages.push( img, type, code, color );
      }

      function propertyImageToLoader( type, color ){
        var img = new Image();
        img.src = client.IMAGE_PATH+"PROP_"+color+"_"+type+".png";
        loadingImages.push( img, type, client.IMAGE_CODE_STATELESS, color );
      }

      function tileImageToLoader( type ){
        var img = new Image();
        img.src = client.IMAGE_PATH+type+".png";
        loadingImages.push( img, type, client.IMAGE_CODE_STATELESS,
                                                  client.COLOR_NONE );
      }

      function unitTypeToLoader( type, color ){
        imageToLoader(type, client.IMAGE_CODE_IDLE, color );
        imageToLoader(type, client.IMAGE_CODE_IDLE_INVERTED, color );
        imageToLoader(type, client.IMAGE_CODE_LEFT, color );
        imageToLoader(type, client.IMAGE_CODE_RIGHT, color );
        imageToLoader(type, client.IMAGE_CODE_UP, color );
        imageToLoader(type, client.IMAGE_CODE_DOWN, color );
      }

      var units = data.getListOfUnitTypes();
      for( var i=0,e=units.length; i<e; i++ ){

        var type = units[i];
        unitTypeToLoader( type, client.COLOR_RED );
        unitTypeToLoader( type, client.COLOR_GREEN );
        unitTypeToLoader( type, client.COLOR_BLUE );
        unitTypeToLoader( type, client.COLOR_BLACK_MASK );

        if( util.DEBUG ){
          util.logInfo("loading images for",type);
        }
      }

      var props = data.getListOfPropertyTypes();
      for( var i=0,e=props.length; i<e; i++ ){

        var type = props[i];
        propertyImageToLoader( type, client.COLOR_RED );
        propertyImageToLoader( type, client.COLOR_GREEN );
        propertyImageToLoader( type, client.COLOR_BLUE );
        propertyImageToLoader( type, client.COLOR_NEUTRAL );

        if( util.DEBUG ){
          util.logInfo("loading images for",type);
        }
      }

      var tiles = data.getListOfTileTypes();
      for( var i=0,e=tiles.length; i<e; i++ ){
        tileImageToLoader( tiles[i] );
        if( util.DEBUG ){
          util.logInfo("loading image for",tiles[i]);
        }
      }

      tileImageToLoader( "HP_1" );
      tileImageToLoader( "HP_2" );
      tileImageToLoader( "HP_3" );
      tileImageToLoader( "HP_4" );
      tileImageToLoader( "HP_5" );
      tileImageToLoader( "HP_6" );
      tileImageToLoader( "HP_7" );
      tileImageToLoader( "HP_8" );
      tileImageToLoader( "HP_9" );

      tileImageToLoader( "MOVE_FOC" );
      tileImageToLoader( "ATK_FOC" );

      tileImageToLoader( "ARROW_T_N" );
      tileImageToLoader( "ARROW_T_E" );
      tileImageToLoader( "ARROW_T_S" );
      tileImageToLoader( "ARROW_T_W" );
      tileImageToLoader( "ARROW_L_NS" );
      tileImageToLoader( "ARROW_L_EW" );
      tileImageToLoader( "ARROW_E_ES" );
      tileImageToLoader( "ARROW_E_SW" );
      tileImageToLoader( "ARROW_E_WN" );
      tileImageToLoader( "ARROW_E_NE" );

      status = STATE_LOAD;
    };

    client.CodeStatelessImages = {
      RED:{}, BLUE:{}, GREEN:{}, GRAY:{}, NONE:{}
    }

    client.CodeIdleImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    client.CodeIdleInvertedImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    client.CodeRightImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    client.CodeLeftImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    client.CodeUpImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    client.CodeDownImages = {
      RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
    };

    /** @constant */
    client.IMAGE_CODE_IDLE          = "IDLE";

    /** @constant */
    client.IMAGE_CODE_IDLE_INVERTED = "IDLE_R";

    /** @constant */
    client.IMAGE_CODE_RIGHT         = "RIGHT";

    /** @constant */
    client.IMAGE_CODE_LEFT          = "LEFT";

    /** @constant */
    client.IMAGE_CODE_UP            = "UP";

    /** @constant */
    client.IMAGE_CODE_DOWN          = "DOWN";

    /** @constant */
    client.IMAGE_CODE_STATELESS     = "STATELESS";

    /** @constant */
    client.COLOR_RED          = "RED";

    /** @constant */
    client.COLOR_GREEN        = "GREEN";

    /** @constant */
    client.COLOR_BLUE         = "BLUE";

    /** @constant */
    client.COLOR_BLACK_MASK   = "BLACK_MASK";

    /** @constant */
    client.COLOR_NEUTRAL      = "GRAY";

    /** @constant */
    client.COLOR_NONE         = "NONE";

    /**
     * Returns the html image object for the given unit type in the
     * given color shema and state.
     *
     * @param type
     * @param code
     * @param color
     */
    client.getUnitImageForType = function( type, code, color ){

      switch( code ){
        case client.IMAGE_CODE_IDLE :
          return client.CodeIdleImages[color][type];

        case client.IMAGE_CODE_IDLE_INVERTED :
          return client.CodeIdleInvertedImages[color][type];

        case client.IMAGE_CODE_LEFT :
          return client.CodeLeftImages[color][type];

        case client.IMAGE_CODE_RIGHT :
          return client.CodeRightImages[color][type];

        case client.IMAGE_CODE_DOWN :
          return client.CodeDownImages[color][type];

        case client.IMAGE_CODE_UP :
          return client.CodeUpImages[color][type];

        case client.IMAGE_CODE_STATELESS :
          return client.CodeStatelessImages[color][type];

        default: util.logError("unknown image state code ",code );
      }
    };

    /**
     * Returns the html image object for the given property type in the
     * given color shema.
     *
     * @param type
     * @param color
     */
    client.getPropertyImageForType = function( type, color ){
      return client.getUnitImageForType( type,
        client.IMAGE_CODE_STATELESS, color );
    };

    /**
     * Returns the html image object for the given property type in the
     * given color shema.
     *
     * @param type
     * @param color
     */
    client.getTileImageForType = function( type ){
      return client.getUnitImageForType( type,
        client.IMAGE_CODE_STATELESS, client.COLOR_NONE );
    };
  });