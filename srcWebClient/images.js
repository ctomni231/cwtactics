/** @constant */
images.IMAGE_CODE_IDLE          = "IDLE";

/** @constant */
images.IMAGE_CODE_IDLE_INVERTED = "IDLE_R";

/** @constant */
images.IMAGE_CODE_RIGHT         = "RIGHT";

/** @constant */
images.IMAGE_CODE_LEFT          = "LEFT";

/** @constant */
images.IMAGE_CODE_UP            = "UP";

/** @constant */
images.IMAGE_CODE_DOWN          = "DOWN";

/** @constant */
images.IMAGE_CODE_STATELESS     = "STATELESS";

/** @constant */
images.COLOR_RED                = "RED";

/** @constant */
images.COLOR_GREEN              = "GREEN";

/** @constant */
images.COLOR_BLUE               = "BLUE";

/** @constant */
images.COLOR_BLACK_MASK         = "BLACK_MASK";

/** @constant */
images.COLOR_NEUTRAL            = "GRAY";

/** @constant */
images.COLOR_NONE               = "NONE";

/**
 * Contains the path to the image base.
 */
images.IMAGE_PATH = "img/";

/**
 * Contains all stateless images.
 */
images.CodeStatelessImages = {
  RED:{}, BLUE:{}, GREEN:{}, GRAY:{}, NONE:{}
}

/**
 * Contains all idle images.
 */
images.CodeIdleImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Contains all inverted idle images.
 */
images.CodeIdleInvertedImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Contains all left looking (right) images.
 */
images.CodeRightImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Contains all left looking (moving) images.
 */
images.CodeLeftImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Contains all left looking (up) images.
 */
images.CodeUpImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Contains all left looking (down) images.
 */
images.CodeDownImages = {
  RED:{}, BLUE:{}, GREEN:{}, BLACK_MASK:{}
};

/**
 * Returns the html image object for the given unit type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
images.getUnitImageForType = function( type, code, color ){

  switch( code ){

    case images.IMAGE_CODE_IDLE :
      return images.CodeIdleImages[color][type];

    case images.IMAGE_CODE_IDLE_INVERTED :
      return images.CodeIdleInvertedImages[color][type];

    case images.IMAGE_CODE_LEFT :
      return images.CodeLeftImages[color][type];

    case images.IMAGE_CODE_RIGHT :
      return images.CodeRightImages[color][type];

    case images.IMAGE_CODE_DOWN :
      return images.CodeDownImages[color][type];

    case images.IMAGE_CODE_UP :
      return images.CodeUpImages[color][type];

    case images.IMAGE_CODE_STATELESS :
      return images.CodeStatelessImages[color][type];

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
images.getPropertyImageForType = function( type, color ){
  return images.getUnitImageForType( type, images.IMAGE_CODE_STATELESS, color );
};

/**
 * Returns the html image object for the given property type in the
 * given color shema.
 *
 * @param type
 * @param color
 */
images.getTileImageForType = function( type ){
  return images.getUnitImageForType( type,
    images.IMAGE_CODE_STATELESS, images.COLOR_NONE );
};

/**
 * Loads all images on client initialization.
 */
signal.connect( signal.EVENT_CLIENT_INIT, function(){
  var _loadingImages = [];

  function imageToLoader( type, code, color ){
    if( util.DEBUG ){
      util.logInfo("loading images for",type,"code",code,"color",color);
    }

    var img = new Image();
    img.src = images.IMAGE_PATH+color+"_"+code+"_"+type+".png";
    _loadingImages.push( img, type, code, color );
  }

  function propertyImageToLoader( type, color ){
    if( util.DEBUG ){
      util.logInfo("loading images for",type,"color",color);
    }

    var img = new Image();
    img.src = images.IMAGE_PATH+"PROP_"+color+"_"+type+".png";
    _loadingImages.push( img, type, images.IMAGE_CODE_STATELESS, color );
  }

  function tileImageToLoader( type ){
    if( util.DEBUG ){
      util.logInfo("loading images for",type);
    }

    var img = new Image();
    img.src = images.IMAGE_PATH+type+".png";
    _loadingImages.push( img, type, images.IMAGE_CODE_STATELESS,
           images.COLOR_NONE );
  }

  function unitTypeToLoader( type, color ){
    imageToLoader(type, images.IMAGE_CODE_IDLE, color );
    imageToLoader(type, images.IMAGE_CODE_IDLE_INVERTED, color );
    imageToLoader(type, images.IMAGE_CODE_LEFT, color );
    imageToLoader(type, images.IMAGE_CODE_RIGHT, color );
    imageToLoader(type, images.IMAGE_CODE_UP, color );
    imageToLoader(type, images.IMAGE_CODE_DOWN, color );
  }

  var units = game.getListOfUnitTypes();
  for( var i=0,e=units.length; i<e; i++ ){

    var type = units[i];
    unitTypeToLoader( type, images.COLOR_RED );
    unitTypeToLoader( type, images.COLOR_GREEN );
    unitTypeToLoader( type, images.COLOR_BLUE );
    unitTypeToLoader( type, images.COLOR_BLACK_MASK );
  }

  var props = game.getListOfPropertyTypes();
  for( var i=0,e=props.length; i<e; i++ ){

    var type = props[i];
    propertyImageToLoader( type, images.COLOR_RED );
    propertyImageToLoader( type, images.COLOR_GREEN );
    propertyImageToLoader( type, images.COLOR_BLUE );
    propertyImageToLoader( type, images.COLOR_NEUTRAL );

    if( util.DEBUG ){
      util.logInfo("loading images for",type);
    }
  }

  var tiles = game.getListOfTileTypes();
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

  tileImageToLoader( "UNIT_STAT_AMMO" );
  tileImageToLoader( "UNIT_STAT_FUEL" );
  tileImageToLoader( "UNIT_STAT_CAPTURE" );
  tileImageToLoader( "UNIT_STAT_HEART" );
  tileImageToLoader( "UNIT_STAT_LOADEDUNKNOWN" );
  tileImageToLoader( "UNIT_STAT_LOADS" );

  var checkImageLoadingStatus = function(){

    // CHECK THEM
    for( var i=0,e=_loadingImages.length; i<e; i+=4 ){

      // NOT ALL IMAGES ARE LOADED BREAK
      if( _loadingImages[i].complete !== true ){
        return false;
      }
    }

    if( util.DEBUG ){
      util.logInfo("images loaded, adding them to client layer");
    }

    // ALL IMAGES ARE LOADED, ADD THEM TO IMAGE DATA BASE
    for( var i=0,e=_loadingImages.length; i<e; i+=4 ){

      var type  = _loadingImages[i+1];
      var code  = _loadingImages[i+2];
      var color = _loadingImages[i+3];
      switch( code ){


        case images.IMAGE_CODE_IDLE :
          images.CodeIdleImages[color][type]         = _loadingImages[i];
          break;

        case images.IMAGE_CODE_STATELESS :
          images.CodeStatelessImages[color][type]    = _loadingImages[i];
          break;

        case images.IMAGE_CODE_IDLE_INVERTED :
          images.CodeIdleInvertedImages[color][type] = _loadingImages[i];
          break;

        case images.IMAGE_CODE_LEFT :
          images.CodeLeftImages[color][type]         = _loadingImages[i];
          break;

        case images.IMAGE_CODE_RIGHT :
          images.CodeRightImages[color][type]        = _loadingImages[i];
          break;

        case images.IMAGE_CODE_DOWN :
          images.CodeDownImages[color][type]         = _loadingImages[i];
          break;

        case images.IMAGE_CODE_UP :
          images.CodeUpImages[color][type]           = _loadingImages[i];
          break;

        default: util.logError("unknown image state code ",code );
      }
    }

    // remove helper
    _loadingImages.splice(0);

    if( util.DEBUG ) util.logInfo("images successfully loaded");

    return true;
  };

  function loadIt(){
    if(!checkImageLoadingStatus() ) setTimeout( loadIt, 100 );
    else startClient();
  }
  loadIt();
});