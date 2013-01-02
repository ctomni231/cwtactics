controller.registerCommand({

  key: "cutImages",

  condition: util.FUNCTION_FALSE_RETURNER,

  action: function(){

    var BASE_SIZE = CWT_MOD_DEFAULT.graphic.baseSize;

    // UNIT
    var UNIT_IMG_H = BASE_SIZE*2;
    var UNIT_IMG_W = BASE_SIZE*2;
    var UNIT_IMG_NUM = 3;

    // PROPERTY
    var PROPERTY_IMG_H = BASE_SIZE*2;
    var PROPERTY_IMG_W = BASE_SIZE;
    var PROPERTY_IMG_NUM = 4;

    // TILE
    var TILE_IMG_H = BASE_SIZE*2;
    var TILE_IMG_W = BASE_SIZE;
    var TILE_IMG_NUM = 1;

    // STATUS IMAGE
    var STAT_IMG_H = BASE_SIZE/4;
    var STAT_IMG_W = BASE_SIZE/4;


    // BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
    function flipImage(image, flipH, flipV) {
      var scaleH = flipH ? -1 : 1,
        scaleV = flipV ? -1 : 1,
        posX = flipH ? image.width * -1 : 0,
        posY = flipV ? image.height * -1 : 0;


      var nCanvas = document.createElement('canvas');
      nCanvas.height = image.height;
      nCanvas.width  = image.width;
      var nContext = nCanvas.getContext('2d');

      nContext.save();
      nContext.scale(scaleH, scaleV);
      nContext.drawImage(image, posX, posY, image.width, image.height);
      nContext.restore();

      return nCanvas;
    }


    // ----------------------------------------------------------------------

    if( DEBUG ){ util.logInfo("cutting unit commands into single types"); }

    var unitTypes = CWT_MOD_DEFAULT.graphic.units;
    for( var i=0,e=unitTypes.length; i<e; i++ ){

      var nCanvas;
      var nContext;
      var red = view.COLOR_RED;
      var tp = unitTypes[i][0];

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
        flipImage( nCanvas, true, false), tp,
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
        flipImage( nCanvas, true, false), tp,
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

    }

    if( DEBUG ){ util.logInfo("cutting unit commands into single types done"); }

    // ----------------------------------------------------------------------

    if( DEBUG ){ util.logInfo("cutting misc into single types"); }

    var misc = CWT_MOD_DEFAULT.graphic.misc;
    for( var i=0,e=misc.length; i<e; i++ ){
      var miscType = misc[i];
      if( miscType.length > 2 ){

        // CUT
        var img = view.getInfoImageForType( miscType[0] );

        nCanvas = document.createElement('canvas');
        nCanvas.height = 16;
        nCanvas.width  = 16;
        nContext = nCanvas.getContext('2d');

        if( miscType.length > 6 ){
          nContext.save();
          nContext.translate(8,8);
          nContext.rotate( miscType[6] * Math.PI/180);
          nContext.translate(-8,-8);
        }

        nContext.drawImage(
          img,
          miscType[2], miscType[3],
          miscType[4], miscType[5],
          0, 0,
          16, 16
        );

        if( miscType.length > 6 ){
          nContext.restore();
        }

        view.setInfoImageForType( nCanvas, miscType[0] );
      }
    }

    if( DEBUG ){ util.logInfo("cutting misc into single types done"); }
  }
});