cwtwc.imageTypeMap = {};

cwtwc.imageListMap = {
  RED:   [],
  GREEN: [],
  BLUE:  [],
  BLACK_MASK:  [],
  GRAY:  [],
  RED_FLIPPED:   [],
  GREEN_FLIPPED: [],
  BLUE_FLIPPED:  [],
  BLACK_MASK_FLIPPED:  [],
  GRAY_FLIPPED:  []
};

/**
 * Color maps for different target color shemas.
 */
cwtwc.imgColorReplacementMapProperty = {

  GRAY:[
    120,104,120,
    152,136,200,
    192,192,200,
    240,232,208,
    248,248,240
  ],

  RED:[
    255,255,0,
    184,64,120,
    224,80,56,
    248,208,136,
    248,248,248
  ],

  BLACK_MASK:[
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0
  ],

  BLUE:[
    255,255,0,
    104,72,224,
    120,112,248,
    136,208,248,
    184,248,248
  ],

  GREEN:[
    255,255,0,
    64,160,104,
    80,200,88,
    128,232,120,
    168,248,168
  ]
}

/**
 * Color maps for different target color shemas.
 */
cwtwc.imgColorReplacementMap = {

  /** @constant */
          // "#381818","#980038","#E00008","#F82800","#F85800","#F89870","#F8C880"
  RED:    [ 56,24,24,
            152,0,56,
            224,0,8,
            248,40,0,
            248,88,0,
            248,152,112,
            248,200,128,
            255,239,95 ],

  /** @constant */
          // "#182818","#088048","#08A830","#10D028","#28F028","#88F880","#C8F8C0"
  GREEN:  [ 24,40,24,
            8,128,72,
            8,168,48,
            16,208,40,
            40,240,40,
            136,248,128,
            200,248,192,
            255,239,95 ],

  BLACK_MASK:[
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0
  ],

  /** @constant */
          // "#181840","#2820C0","#0068E8","#0098F0","#40B8F0","#68E0F8","#B8F0F8"
  BLUE:   [ 24,24,64,
            40,32,192,
            0,104,232,
            0,152,240,
            64,184,240,
            104,224,248,
            184,240,248,
            255,239,95 ]
};

/**
 *
 * @param key
 * @param img
 * @param w
 * @param h
 * @param tiles
 * @param sx
 * @param sy
 * @param overlay
 */
cwtwc.registerImage = function( key, img, w, h, tiles, sx, sy, overlay, property ){

  // register image for loading
  var index = cwtwc.imageListMap.RED.indexOf(img);
  if( index === -1 ){
    index = cwtwc.imageListMap.RED.length;
    cwtwc.imageListMap.RED.push( img );
  }

  if( property === true ){
    property = 1;
  }
  else property = 0;

  // register image type
  cwtwc.imageTypeMap[ key ] = [
    index,
    w, h,
    tiles,
    sx, sy,
    overlay, 0,
    property
  ];
};

/**
 * @private
 */
cwtwc._imagesLoaded = function(){

  for(var i = 0, e= cwtwc.imageListMap.RED.length; i <e; i++) {
    if( !cwtwc.imageListMap.RED[i].complete ){
      return false;
    }
  }

  return true;
};

cwtwc.imageLoadingStatus = StateMachine.create({

  initial: 'off',

  error: function( eventName, from, to, args, errorCode, errorMessage, e ){
    if( cwt.DEBUG ) cwt.info("error in image loading status, e:{0}", e.messages);
    return "";
  },

  events: [
    { name: 'init', from: 'off',         to: 'loadImages' },
    { name: 'next', from: 'loadImages',  to: 'filterColor' },
    { name: 'next', from: 'filterColor', to: 'filterHq' },
    { name: 'next', from: 'filterHq',    to: 'ready' }
  ],

  callbacks: {

    onloadImages: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("loading images");

      function waitLoaded(){

        // wait unit all images are loaded
        if( !cwtwc._imagesLoaded() === true ){
          setTimeout( waitLoaded, 50 );
        }
        else{
          if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
          cwtwc.imageLoadingStatus.next();
        }
      }

      setTimeout( waitLoaded, 50 );
    },

    /**
     * Filters images with the own color filter.
     */
    onfilterColor: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("filtering images with custom colors");

      function flip( image ){
        return image;
        var canvas = document.createElement('canvas');
        var canvasHLP = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');
        var canvasContextHLP = canvas.getContext('2d');

        //canvasContext.translate( image.width , 0);
        //canvasContextHLP.translate( 32, 0 );
        //canvasContextHLP.scale( -1, 1);
        //canvasContext.scale(-1, 1);
        //canvasContext.drawImage( image , 0, 0);

        canvasHLP.width = 32;
        canvasHLP.height = image.height;
        canvas.width = image.width;
        canvas.height = image.height;

        // TODO to make it looking shiny take 4x3 pairs
        // TODO replace it with a solution later
        var num = parseInt(image.width/32,10);
        for( var i=0; i<num; i++ ){
          canvasContextHLP.clearRect( 0,0, 32, image.height );
          canvasContextHLP.drawImage( image, i*32, 0, 32, image.height, 0, 0, 32, image.height );
          canvasContext.drawImage( canvasHLP, 0, 0, 32, image.height, i*32, 0, 32, image.height );
         // canvasContext.drawImage( image, i*32, 0, 32, image.height, i*32, 0, 32, image.height );
        }

        // canvasContext.drawImage( image, 0, 0 );

        return canvas;
      }

      function replaceColors( image, oriColors, replColors ){
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


            for( var n=0,ne=oriColors.length; n<ne; n+=3 ){

              // compare red, green and blue color values
              if( imgPixels.data[xi]   ===  oriColors[n]   &&
                  imgPixels.data[xi+1] ===  oriColors[n+1] &&
                  imgPixels.data[xi+2] ===  oriColors[n+2]
                ){
                
                // replace them by new values
                imgPixels.data[xi]   = replColors[n];
                imgPixels.data[xi+1] = replColors[n+1];
                imgPixels.data[xi+2] = replColors[n+2];
              }
            }
          }
        }

        // write changes back
        canvasContext.putImageData(imgPixels, 0, 0 );
        return canvas;
      }

      var keys = Object.keys( cwtwc.imageTypeMap );
      var indexesProperties = []; // i=8
      for( var i=0,e=keys.length; i<e; i++ ){
        if( cwtwc.imageTypeMap[ keys[i] ][8] === 1 ){
          indexesProperties.push( cwtwc.imageTypeMap[ keys[i] ][0] );
        }
      }

      var imgMap = cwtwc.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        if( indexesProperties.indexOf(i) !== -1 ){
          var colorMap = cwtwc.imgColorReplacementMapProperty;

          imgMap.BLUE[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLUE );
          imgMap.GREEN[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GREEN );
          imgMap.BLACK_MASK[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLACK_MASK );
          imgMap.GRAY[i]          = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GRAY );
          imgMap.BLUE_FLIPPED[i]  = null;
          imgMap.GREEN_FLIPPED[i] = null;
          imgMap.BLACK_MASK_FLIPPED[i] = null;
          imgMap.RED_FLIPPED[i] = null;
          imgMap.GRAY_FLIPPED[i]  = null;
        }
        else{
          var colorMap = cwtwc.imgColorReplacementMap;

          imgMap.BLUE[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLUE );
          imgMap.GREEN[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GREEN );
          imgMap.BLACK_MASK[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLACK_MASK );
          imgMap.GRAY[i] = null;
          imgMap.BLUE_FLIPPED[i]  = flip(imgMap.BLUE[i]);
          imgMap.GREEN_FLIPPED[i] = flip(imgMap.GREEN[i]);
          imgMap.RED_FLIPPED[i] = flip(imgMap.RED[i]);
          imgMap.BLACK_MASK_FLIPPED[i] = flip(imgMap.BLACK_MASK[i]);
          imgMap.GRAY_FLIPPED[i]  = null;
        }
      }

      if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
      cwtwc.imageLoadingStatus.next();
    },

    /**
     * Filters images with the HqX filter.
     */
    onfilterHq: function(){
      var t = new Date().getTime();
      if( cwt.DEBUG ) cwt.info("scaling up");
      
      function scale( image ){
        var canvas = document.createElement("canvas");
        var canvasContext = canvas.getContext("2d");

        var imgW = image.width*2;
        var imgH = image.height*2;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage( image, 0, 0, imgW, imgH );
        
        return canvas;
      }
      
      var imgMap = cwtwc.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.RED[i] = scale( imgMap.RED[i] );
        imgMap.BLUE[i] = scale( imgMap.BLUE[i] );
        imgMap.GREEN[i] = scale( imgMap.GREEN[i] );
        if( imgMap.GRAY[i] !== null ) imgMap.GRAY[i] = scale( imgMap.GRAY[i] );
        if( imgMap.BLACK_MASK[i] !== null ) imgMap.BLACK_MASK[i] = scale( imgMap.BLACK_MASK[i] );
        if( imgMap.BLACK_MASK_FLIPPED[i] !== null ) imgMap.BLACK_MASK_FLIPPED[i] = scale( imgMap.BLACK_MASK_FLIPPED[i] );
        if( imgMap.RED_FLIPPED[i] !== null ) imgMap.RED_FLIPPED[i] = scale( imgMap.RED_FLIPPED[i] );
        if( imgMap.GREEN_FLIPPED[i] !== null ) imgMap.GREEN_FLIPPED[i] = scale( imgMap.GREEN_FLIPPED[i] );
        if( imgMap.BLUE_FLIPPED[i] !== null ) imgMap.BLUE_FLIPPED[i] = scale( imgMap.BLUE_FLIPPED[i] );
      }      
      
/*
      if( cwt.DEBUG ) cwt.log.info("filtering images with hqX");

      var imgMap = cwt.client.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.RED[i] = hqx( imgMap.RED[i], 2 );
        imgMap.BLUE[i] = hqx( imgMap.BLUE[i], 2 );
        imgMap.GREEN[i] = hqx( imgMap.GREEN[i], 2 );
      }
*/
      if( cwt.DEBUG ) cwt.info("needed {0}ms",( new Date().getTime()-t));
      cwtwc.imageLoadingStatus.next();
    }
  }
})