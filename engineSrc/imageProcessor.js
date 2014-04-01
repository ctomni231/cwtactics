
//
//
view.imageProcessor_colorizeUnit = util.scoped(function(){

  var UNIT_STATES = [
    view.IMAGE_CODE_IDLE,
    view.IMAGE_CODE_IDLE_INVERTED,
    view.IMAGE_CODE_DOWN,
    view.IMAGE_CODE_UP,
    view.IMAGE_CODE_RIGHT,
    view.IMAGE_CODE_LEFT
  ];

  return function(tp){
    if( this.DEBUG ) util.log("colorize type",tp);

    for( var si=0,se=UNIT_STATES.length; si<se; si++ ){

      var cCode = UNIT_STATES[si];
      var redPic = view.getUnitImageForType(tp,cCode,view.COLOR_RED);
      var IMG_MAP_UNIT = view.imageProcessor_getUnitColorData();
      var UNIT_INDEXES = view.imageProcessor_UNIT_INDEXES;

      view.setUnitImageForType(
        view.imageProcessor_replaceColors(
          redPic,
          IMG_MAP_UNIT,
          UNIT_INDEXES.colors,
          UNIT_INDEXES.RED,
          UNIT_INDEXES.BLUE
        ),
        tp,cCode,view.COLOR_BLUE
      );

      view.setUnitImageForType(
        view.imageProcessor_replaceColors(
          redPic,
          IMG_MAP_UNIT,
          UNIT_INDEXES.colors,
          UNIT_INDEXES.RED,
          UNIT_INDEXES.GREEN
        ),
        tp,cCode,view.COLOR_GREEN
      );

      view.setUnitImageForType(
        view.imageProcessor_replaceColors(
          redPic,
          IMG_MAP_UNIT,
          UNIT_INDEXES.colors,
          UNIT_INDEXES.RED,
          UNIT_INDEXES.YELLOW
        ),
        tp,cCode,view.COLOR_YELLOW
      );

      view.setUnitImageForType(
        view.imageProcessor_convertToBlackMask(redPic),
        tp,cCode,view.COLOR_BLACK_MASK
      );
    }
  };
});

//
//
view.imageProcessor_colorizeProperty = function(tp){
  if( this.DEBUG ) util.log("colorize type",tp);

  var redPic = view.getPropertyImageForType(tp,view.COLOR_RED);
  var IMG_MAP_PROP = view.imageProcessor_getPropertyColorData();
  var PROPERTY_INDEXES = view.imageProcessor_PROPERTY_INDEXES;

  view.setPropertyImageForType(
    view.imageProcessor_replaceColors(
      redPic,
      IMG_MAP_PROP,
      PROPERTY_INDEXES.colors,
      PROPERTY_INDEXES.RED,
      PROPERTY_INDEXES.BLUE
    ),
    tp,view.COLOR_BLUE
  );

  view.setPropertyImageForType(
    view.imageProcessor_replaceColors(
      redPic,
      IMG_MAP_PROP,
      PROPERTY_INDEXES.colors,
      PROPERTY_INDEXES.RED,
      PROPERTY_INDEXES.GREEN
    ),
    tp,view.COLOR_GREEN
  );

  view.setPropertyImageForType(
    view.imageProcessor_replaceColors(
      redPic,
      IMG_MAP_PROP,
      PROPERTY_INDEXES.colors,
      PROPERTY_INDEXES.RED,
      PROPERTY_INDEXES.YELLOW
    ),
    tp,view.COLOR_YELLOW
  );

  view.setPropertyImageForType(
    view.imageProcessor_replaceColors(
      redPic,
      IMG_MAP_PROP,
      PROPERTY_INDEXES.colors,
      PROPERTY_INDEXES.RED,
      PROPERTY_INDEXES.GRAY
    ),
    tp,view.COLOR_NEUTRAL
  );

  view.setPropertyImageForType(
    view.imageProcessor_convertToBlackMask( redPic ),
    tp,view.COLOR_BLACK_MASK
  );
};

//
//
view.imageProcessor_colorizeTile = function(tp){
  if( this.DEBUG ) util.log("colorize type",tp);

  view.setTileShadowImageForType(
    view.imageProcessor_convertToBlackMask(
      view.getTileImageForType(tp)
    ), tp
  );
};

// Crops the sprite of an misc type.
//
view.imageProcessor_cropMiscSprite = function( miscType ){
  if( miscType.length > 2 ){

    if( this.DEBUG ) util.log("crop misc sprite",miscType[0]);

    // CUT
    var img = view.getInfoImageForType( miscType[0] );

    var  nCanvas = document.createElement('canvas');
    var nContext = nCanvas.getContext('2d');

    if( miscType.length > 6 ){
      if( miscType[6] === true ){

        //TODO FIX THAT
        nCanvas.height = 32;
        nCanvas.width  = 32*3;

        nCanvas = view.imageProcessor_flipImage( nCanvas, true, false);

        nContext = nCanvas.getContext('2d');
      }
      else if( miscType[6] === false ){

        //TODO FIX THAT
        nCanvas.height = 32;
        nCanvas.width  = 32*3;

        nCanvas = view.imageProcessor_flipImage( nCanvas, false, true);

        nContext = nCanvas.getContext('2d');
      }
      else if( miscType.length > 7 && miscType[7] === 3 ){

        nCanvas.height = 24;
        nCanvas.width  = 24;
        nContext.save();
        nContext.translate(8,8);
        nContext.rotate( miscType[6] * Math.PI/180);
        nContext.translate(-8,-8);
      }
      else{

        nCanvas.height = 16;
        nCanvas.width  = 16;
        nContext.save();
        nContext.translate(8,8);
        nContext.rotate( miscType[6] * Math.PI/180);
        nContext.translate(-8,-8);
      }
    }
    else{
      nCanvas.height = 16;
      nCanvas.width  = 16;
    }

    if( miscType.length > 6 && miscType[6] === true ){
      // TODO FIX THAT
      nContext.drawImage(
        img,
        miscType[2], miscType[3],
        miscType[4], miscType[5],
        0, 0,
        32*3, 32
      );
    }
    else if( miscType.length > 7 && miscType[7] === 3 ){
      // TODO FIX THAT
      nContext.drawImage(
        img,
        miscType[2], miscType[3],
        miscType[4], miscType[5],
        0, 0,
        24,24
      );
    }
    else{
      nContext.drawImage(
        img,
        miscType[2], miscType[3],
        miscType[4], miscType[5],
        0, 0,
        16, 16
      );
    }

    if( miscType.length > 6 ){
      nContext.restore();
    }

    view.setInfoImageForType( nCanvas, miscType[0] );
  }
};

// Crops the sprite of an unit type.
//
view.imageProcessor_cropUnitSprite = function( tp ){
  if( this.DEBUG ) util.log("crop unit sprite",tp);

  var nCanvas;
  var nContext;
  var red = view.COLOR_RED;
  var img = view.getUnitImageForType( tp, view.IMAGE_CODE_IDLE, red );

  // LEFT
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 0, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_IDLE, red );

  // LEFT INVERTED
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 0, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType(
    view.imageProcessor_flipImage( nCanvas, true, false), tp,
    view.IMAGE_CODE_IDLE_INVERTED, red
  );

  // MOVE LEFT
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 32*9, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_LEFT, red );

  // MOVE LEFT INVERTED
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 32*9, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType(
    view.imageProcessor_flipImage( nCanvas, true, false), tp,
    view.IMAGE_CODE_RIGHT, red
  );

  // MOVE UP
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 32*3, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_UP, red );

  // MOVE DOWN
  nCanvas = document.createElement('canvas');
  nCanvas.height = 32;
  nCanvas.width  = 32*3;
  nContext = nCanvas.getContext('2d');
  nContext.drawImage( img, 32*6, 0, 32*3, 32, 0, 0, 32*3, 32 );
  view.setUnitImageForType( nCanvas, tp, view.IMAGE_CODE_DOWN, red );

  if( this.DEBUG ) util.log("cropped unit sprite");
};

