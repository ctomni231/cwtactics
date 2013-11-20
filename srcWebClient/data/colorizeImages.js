controller.colorizeImages = util.singleLazyCall(function( err, baton ){
  if( DEBUG ) util.log("colorize images");
  
  baton.take();
  
  try{
    
    var imageData = model.data_graphics;
    
    var UNIT_INDEXES = {
      BLACK_MASK:8,
      RED:0,
      BLUE:3,
      GREEN:4,
      colors:6
    };
    
    var PROPERTY_INDEXES = {
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
    function getImageDataArray( image ){
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      
      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage( image, 0, 0);
      return canvasContext.getImageData(0, 0, imgW, imgH).data;
    }
    
    // Changes colors in an image object by given replacement color
    // maps and returns a new image object (html5 canvas).
    //
    function replaceColors( image, colorData, numColors, oriIndex, replaceIndex ,tp ){
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      
      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage( image, 0, 0);
      var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
      
      var oriStart = (oriIndex*4)*numColors;
      var replStart = (replaceIndex*4)*numColors;
      
      var replaced = 0;
      var t = true;
      for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
          var xi = (y * 4) * imgPixels.width + x * 4;
          
          var oR = imgPixels.data[xi  ];
          var oG = imgPixels.data[xi+1];
          var oB = imgPixels.data[xi+2];
          for( var n=0,
              ne=(numColors*4); n<ne; n+=4 ){
            
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
              
              replaced++;
            }
          }
        }
      }
      
      // util.log("replaced",replaced,"pixels for the type",tp);
      // write changes back
      canvasContext.putImageData(imgPixels, 0, 0 );
      return canvas;
    }
    
    function blackifyColors( image ){
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      
      var imgW = image.width;
      var imgH = image.height;
      canvas.width = imgW;
      canvas.height = imgH;
      canvasContext.drawImage( image, 0, 0);
      var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);
      
      var t = true;
      for(var y = 0; y < imgPixels.height; y++){
        for(var x = 0; x < imgPixels.width; x++){
          var xi = (y * 4) * imgPixels.width + x * 4;
          var oA = imgPixels.data[xi+3];
          if( oA > 0 ){
            imgPixels.data[xi  ] = 0;
            imgPixels.data[xi+1] = 0;
            imgPixels.data[xi+2] = 0;
          }
        }
      }
      
      // util.log("replaced",replaced,"pixels for the type",tp);
      // write changes back
      canvasContext.putImageData(imgPixels, 0, 0 );
      return canvas;
    }
    
    var UNIT_STATES = [
      view.IMAGE_CODE_IDLE,
      view.IMAGE_CODE_IDLE_INVERTED,
      view.IMAGE_CODE_DOWN,
      view.IMAGE_CODE_UP,
      view.IMAGE_CODE_RIGHT,
      view.IMAGE_CODE_LEFT
    ];
    
    // EXTRACT PROPERTY COLORS
    var IMG_MAP_PROP = getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_PROPERTIES_ID )
    );
    
    var IMG_MAP_UNIT = getImageDataArray(
      view.getInfoImageForType( view.IMG_COLOR_MAP_UNITS_ID )
    );
    
    // FOR EVERY UNIT
    var unitTypes = imageData.units;
    for( var i=0,e=unitTypes.length; i<e; i++ ){
      var tp = unitTypes[i][0];
      
      for( var si=0,se=UNIT_STATES.length; si<se; si++ ){
        
        var cCode = UNIT_STATES[si];
        var redPic = view.getUnitImageForType(tp,cCode,view.COLOR_RED);

        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.BLUE,
            tp
          ),
          tp,cCode,view.COLOR_BLUE
        );

        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.GREEN,
            tp
          ),
          tp,cCode,view.COLOR_GREEN
        );

        view.setUnitImageForType(
          replaceColors(
            redPic, 
            IMG_MAP_UNIT,
            UNIT_INDEXES.colors,
            UNIT_INDEXES.RED, 
            UNIT_INDEXES.BLACK_MASK,
            tp
          ),
          tp,cCode,view.COLOR_BLACK_MASK
        );
      }
    }
    
    // FOR EVERY PROPERTY
    var propTypes = imageData.properties;
    for( var i=0,e=propTypes.length; i<e; i++ ){
      var tp = propTypes[i][0];
      
      var redPic = view.getPropertyImageForType(tp,view.COLOR_RED);

      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.BLUE
        ),
        tp,view.COLOR_BLUE
      );

      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED,
          PROPERTY_INDEXES.GREEN
        ),
        tp,view.COLOR_GREEN
      );

      view.setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.GRAY
        ),
        tp,view.COLOR_NEUTRAL
      );

      /*      
      .setPropertyImageForType(
        replaceColors(
          redPic, 
          IMG_MAP_PROP,
          PROPERTY_INDEXES.colors,
          PROPERTY_INDEXES.RED, 
          PROPERTY_INDEXES.BLACK_MASK
        ),
        tp,.COLOR_BLACK_MASK
      );
      */

      view.setPropertyImageForType(
        blackifyColors( redPic ),
        tp,view.COLOR_BLACK_MASK
      );
    }
    
    // FOR EVERY TILE
    var tileTypes = imageData.tiles;
    for( var i=0,e=tileTypes.length; i<e; i++ ){
      var tp = tileTypes[i][0];
      var redPic = view.getTileImageForType(tp);

      view.setTileShadowImageForType(
        blackifyColors( redPic ), 
        tp
      );
    }
    
    baton.pass(false);
  } catch( e ) {
    assert(false,"failed to colorize images ("+e+")");
  }
});
