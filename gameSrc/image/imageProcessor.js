// Color schema for a unit sprite.
//
view.imageProcessor_UNIT_INDEXES = {
  BLACK_MASK:8,
  RED:0,
  BLUE:3,
  GREEN:4,
  YELLOW:5,
  colors:6
};

// Color schema for a property sprite.
//
view.imageProcessor_PROPERTY_INDEXES = {
  RED:0,
  GRAY:1,
  BLUE:3,
  GREEN:4,
  YELLOW:5,
  BLACK_MASK:8,
  colors:4
};

//
//
view.imageProcessor_getPropertyColorData = util.scoped(function(){
  var v = null;
  return function(){
    if( !v ) v = view.imageProcessor_getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_PROPERTIES_ID )
    );

    return v;
  };
});

//
//
view.imageProcessor_getUnitColorData = util.scoped(function(){
  var v = null;
  return function(){
    if( !v ) v = view.imageProcessor_getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_UNITS_ID )
    );

    return v;
  };
});

//
//
view.imageProcessor_getImageDataArray = function( image ){
  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");

  var imgW = image.width;
  var imgH = image.height;
  canvas.width = imgW;
  canvas.height = imgH;
  canvasContext.drawImage( image, 0, 0);
  return canvasContext.getImageData(0, 0, imgW, imgH).data;
}

// Flips an image.
//
// BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
//
view.imageProcessor_flipImage = function( image, flipH, flipV ){
  var scaleH = flipH ? -1 : 1;
  var scaleV = flipV ? -1 : 1;
  var posX = flipH ? image.width * -1 : 0;
  var posY = flipV ? image.height * -1 : 0;

  // target canvas
  var nCanvas = document.createElement('canvas');
  nCanvas.height = image.height;
  nCanvas.width  = image.width;
  var nContext = nCanvas.getContext('2d');

  // transform it
  nContext.save();
  nContext.scale(scaleH, scaleV);
  nContext.drawImage(image, posX, posY, image.width, image.height);
  nContext.restore();

  return nCanvas;
};

//
//
view.imageProcessor_convertToBlackMask = function( image ){
  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");

  // create target canvas
  var imgW = image.width;
  var imgH = image.height;
  canvas.width = imgW;
  canvas.height = imgH;
  canvasContext.drawImage( image, 0, 0);
  var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

  for(var y = 0; y < imgPixels.height; y++){
    for(var x = 0; x < imgPixels.width; x++){
      var xi = (y * 4) * imgPixels.width + x * 4;
      var oA = imgPixels.data[xi+3];

      // if pixel is not transparent, then fill it with black
      if( oA > 0 ){
        imgPixels.data[xi  ] = 0;
        imgPixels.data[xi+1] = 0;
        imgPixels.data[xi+2] = 0;
      }
    }
  }

  // write changes back
  canvasContext.putImageData(imgPixels, 0, 0 );

  return canvas;
};

// Changes colors in an image object by given replacement color
// maps and returns a new image object (html5 canvas).
//
view.imageProcessor_replaceColors = function(image, colorData, numColors, oriIndex, replaceIndex){
  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");

  // create target canvas
  var imgW = image.width;
  var imgH = image.height;
  canvas.width = imgW;
  canvas.height = imgH;
  canvasContext.drawImage( image, 0, 0);
  var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

  var oriStart = (oriIndex*4)*numColors;
  var replStart = (replaceIndex*4)*numColors;
  for(var y = 0; y < imgPixels.height; y++){
    for(var x = 0; x < imgPixels.width; x++){
      var xi = (y * 4) * imgPixels.width + x * 4;

      var oR = imgPixels.data[xi  ];
      var oG = imgPixels.data[xi+1];
      var oB = imgPixels.data[xi+2];
      for( var n=0, ne=(numColors*4); n<ne; n+=4 ){

        var sR = colorData[oriStart+n  ];
        var sG = colorData[oriStart+n+1];
        var sB = colorData[oriStart+n+2];

        if( sR === oR && sG === oG && sB === oB ){

          var r = replStart+n;
          var rR = colorData[r  ];
          var rG = colorData[r+1];
          var rB = colorData[r+2];
          imgPixels.data[xi  ] = rR;
          imgPixels.data[xi+1] = rG;
          imgPixels.data[xi+2] = rB;
        }
      }
    }
  }

  // write changes back
  canvasContext.putImageData(imgPixels, 0, 0 );

  return canvas;
};

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
    if( DEBUG ) util.log("colorize type",tp);

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
  if( DEBUG ) util.log("colorize type",tp);

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
  if( DEBUG ) util.log("colorize type",tp);

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

    if( DEBUG ) util.log("crop misc sprite",miscType[0]);

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
  if( DEBUG ) util.log("crop unit sprite",tp);

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

  if( DEBUG ) util.log("cropped unit sprite");
};

// Doubles the size of an image by using the scale2x algorithm.
//
view.imageProcessor_scale2x = function( image ){
  var imgW = image.width;
  var imgH = image.height;
  var oR,oG,oB;
  var uR,uG,uB;
  var dR,dG,dB;
  var rR,rG,rB;
  var lR,lG,lB;
  var xi;
  var t0R,t0G,t0B;
  var t1R,t1G,t1B;
  var t2R,t2G,t2B;
  var t3R,t3G,t3B;
  
  // create target canvas
  var canvasS = document.createElement("canvas");
  var canvasSContext = canvasS.getContext("2d");
  canvasS.width = imgW;
  canvasS.height = imgH;
  canvasSContext.drawImage( image, 0, 0);
  var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);
  
  // create target canvas
  var canvasT = document.createElement("canvas");
  var canvasTContext = canvasT.getContext("2d");
  canvasT.width = imgW*2;
  canvasT.height = imgH*2;
  var imgPixelsT = canvasTContext.getImageData(0, 0, imgW*2, imgH*2);
  
  // scale it
  for(var y = 0; y < imgPixelsS.height; y++){
    for(var x = 0; x < imgPixelsS.width; x++){
          
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // grab source pixels  
        //
        
        // grab center
        xi = (y * 4) * imgPixelsS.width + x * 4;
        oR = imgPixelsS.data[xi ];
        oG = imgPixelsS.data[xi+1];
        oB = imgPixelsS.data[xi+2];
        
        // grab left
        if( x > 0 ){
          xi = (y * 4) * imgPixelsS.width + (x-1) * 4;
          lR = imgPixelsS.data[xi ];
          lG = imgPixelsS.data[xi+1];
          lB = imgPixelsS.data[xi+2];
        }
        else{
          lR = oR;
          lG = oG;
          lB = oB;
        }
        
        // grab up
        if( y > 0 ){
          xi = ((y-1) * 4) * imgPixelsS.width + (x) * 4;
          uR = imgPixelsS.data[xi ];
          uG = imgPixelsS.data[xi+1];
          uB = imgPixelsS.data[xi+2];
        }
        else{
          uR = oR;
          uG = oG;
          uB = oB;
        }
        
        // grab down
        if( x < imgPixelsS.height-1 ){
          xi = ((y+1) * 4) * imgPixelsS.width + (x) * 4;
          dR = imgPixelsS.data[xi ];
          dG = imgPixelsS.data[xi+1];
          dB = imgPixelsS.data[xi+2];
        }
        else{
          dR = oR;
          dG = oG;
          dB = oB;
        }
        
        // grab right
        if( x < imgPixelsS.width-1 ){
          xi = (y * 4) * imgPixelsS.width + (x+1) * 4;
          rR = imgPixelsS.data[xi ];
          rG = imgPixelsS.data[xi+1];
          rB = imgPixelsS.data[xi+2];
        }
        else{
          rR = oR;
          rG = oG;
          rB = oB;
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // calculates target pixels  
        //
        
        // E0 = E; E1 = E; E2 = E; E3 = E;
        t0R = oR; t0G = oG; t0B = oB;
        t1R = oR; t1G = oG; t1B = oB;
        t2R = oR; t2G = oG; t2B = oB;
        t3R = oR; t3G = oG; t3B = oB;
        
        // if (B != H && D != F)
        if( ( uR !== dR || uG !== dG || uB !== dB ) && ( lR !== rR || lG !== rG || lB !== rB ) ){
          
          // E0 = D == B ? D : E;
          if( uR === lR && uG === lG && uB === lB ){
            t0R = lR; t0G = lG; t0B = lB;
          }
          
          // E1 = B == F ? F : E;
          if( uR === rR && uG === rG && uB === rB ){
            t1R = rR; t1G = rG; t1B = rB;
          }
          
          // E2 = D == H ? D : E;
          if( lR === dR && lG === dG && lB === dB ){
            t2R = lR; t2G = lG; t2B = lB;
          }
          
          // E3 = H == F ? F : E;
          if( dR === rR && dG === rG && dB === rB ){
            t3R = rR; t3G = rG; t3B = rB;
          }
        }
        
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // write pixels to target canvas
        //
        
        xi = ((y*2) * 4) * imgPixelsT.width + (x*2) * 4;
        imgPixelsT.data[xi+0] = t0R;
        imgPixelsT.data[xi+1] = t0G;
        imgPixelsT.data[xi+2] = t0B;
        imgPixelsT.data[xi+4] = t1R;
        imgPixelsT.data[xi+5] = t1G;
        imgPixelsT.data[xi+6] = t1B;
        
        xi = ((y*2+1) * 4) * imgPixelsT.width + (x*2) * 4;
        imgPixelsT.data[xi+0] = t2R;
        imgPixelsT.data[xi+1] = t2G;
        imgPixelsT.data[xi+2] = t2B;
        imgPixelsT.data[xi+4] = t3R;
        imgPixelsT.data[xi+5] = t3G;
        imgPixelsT.data[xi+6] = t3B;
      }
    }

  // write changes back to the canvas    
  canvasTContext.putImageData( imgPixelsT, 0, 0 );
  
  canvasS = null;
  return canvasT;
};
