/** @constant */
view.IMAGE_CODE_IDLE          = "IDLE";

/** @constant */
view.IMAGE_CODE_IDLE_INVERTED = "IDLE_R";

/** @constant */
view.IMAGE_CODE_RIGHT         = "RIGHT";

/** @constant */
view.IMAGE_CODE_LEFT          = "LEFT";

/** @constant */
view.IMAGE_CODE_UP            = "UP";

/** @constant */
view.IMAGE_CODE_DOWN          = "DOWN";

/** @constant */
view.IMAGE_CODE_STATELESS     = "STATELESS";

/** @constant */
view.COLOR_RED                = "RED";

/** @constant */
view.COLOR_GREEN              = "GREEN";

/** @constant */
view.COLOR_BLUE               = "BLUE";

/** @constant */
view.COLOR_YELLOW             = "YELLOW";

/** @constant */
view.COLOR_BLACK_MASK         = "BLACK_MASK";

/** @constant */
view.COLOR_NEUTRAL            = "GRAY";

/** @constant */
view.COLOR_NONE               = "NONE";

/** @constant */
view.IMG_COLOR_MAP_PROPERTIES_ID = "IMG_MAP_PROPERTY";

/** @constant */
view.IMG_COLOR_MAP_UNITS_ID = "IMG_MAP_UNIT";

/** Contains all stateless commands. */
view.CodeStatelessview    = {
  RED:{}, 
  BLUE:{}, 
  YELLOW: {}, 
  GREEN:{},
  BLACK_MASK:{},
  NONE:{}, 
  GRAY:{}
};

view.overlayImages = {};

view.animatedTiles = {};

/** Contains all idle commands. */
view.CodeIdleview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all inverted idle commands. */
view.CodeIdleInvertedview = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeRightview        = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeLeftview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeUpview           = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/** Contains all left looking (moving) commands. */
view.CodeDownview         = { RED:{}, BLUE:{}, YELLOW: {}, GREEN:{}, BLACK_MASK:{} };

/**
 * Registers an image for an object type.
 *
 * @param image
 * @param type
 * @param state
 * @param color
 */
view.setImageForType = function( image, type, state, color ){

  // DEFAULT VALUES
  if( state === undefined ) state = view.IMAGE_CODE_STATELESS;
  if( color === undefined ) color = view.COLOR_NONE;

  // WHICH CODE
  switch( state ){

    case view.IMAGE_CODE_IDLE :
      view.CodeIdleview[color][type]         = image;
      break;

    case view.IMAGE_CODE_STATELESS :
      view.CodeStatelessview[color][type]    = image;
      break;

    case view.IMAGE_CODE_IDLE_INVERTED :
      view.CodeIdleInvertedview[color][type] = image;
      break;

    case view.IMAGE_CODE_LEFT :
      view.CodeLeftview[color][type]         = image;
      break;

    case view.IMAGE_CODE_RIGHT :
      view.CodeRightview[color][type]        = image;
      break;

    case view.IMAGE_CODE_DOWN :
      view.CodeDownview[color][type]         = image;
      break;

    case view.IMAGE_CODE_UP :
      view.CodeUpview[color][type]           = image;
      break;

    default: assert(false,"unknown image state code ",state );
  }
};

view.setUnitImageForType = view.setImageForType;

view.setPropertyImageForType = function( image, type, color ){
  view.setImageForType( image, type, view.IMAGE_CODE_STATELESS, color );
};

view.setTileImageForType = function( image, type ){
  view.setImageForType(
    image, type,
    view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

view.setTileShadowImageForType = function( image, type ){
  view.setImageForType(
    image, type,
    view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK
  );
};

view.setInfoImageForType = function( image, type ){
  view.setImageForType(
    image, type,
    view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

/**
 * Returns the html image object for the given object type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
view.getImageForType = function( type, code, color ){
  switch( code ){

    case view.IMAGE_CODE_IDLE :
      return view.CodeIdleview[color][type];

    case view.IMAGE_CODE_IDLE_INVERTED :
      return view.CodeIdleInvertedview[color][type];

    case view.IMAGE_CODE_LEFT :
      return view.CodeLeftview[color][type];

    case view.IMAGE_CODE_RIGHT :
      return view.CodeRightview[color][type];

    case view.IMAGE_CODE_DOWN :
      return view.CodeDownview[color][type];

    case view.IMAGE_CODE_UP :
      return view.CodeUpview[color][type];

    case view.IMAGE_CODE_STATELESS :
      return view.CodeStatelessview[color][type];

    default: assert(false,"unknown image state code ",code );
  }
};

/**
 * Returns the html image/canvas object for the given unit type in the given color
 * shema and state.
 *
 * @param type
 * @param code
 * @param color
 */
view.getUnitImageForType = view.getImageForType;

/**
 * Returns the html image/canvas object for the given property type in the
 * given color shema.
 *
 * @param type
 * @param color
 */
view.getPropertyImageForType = function( type, color ){
  return view.getImageForType( type, view.IMAGE_CODE_STATELESS, color );
};

/**
 * Returns the html image/canvas object for the given tile type in the
 * given color shema.
 *
 * @param type
 */
view.getTileImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};

view.getTileShadowImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_BLACK_MASK
  );
};

/**
 * Returns the html image/canvas object for the given info image type in the
 * given color shema.
 *
 * @param type
 */
view.getInfoImageForType = function( type ){
  return view.getImageForType(
    type, view.IMAGE_CODE_STATELESS, view.COLOR_NONE
  );
};