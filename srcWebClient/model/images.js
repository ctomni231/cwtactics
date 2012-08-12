cwt.client.imageTypeMap = {};

cwt.client.imageListMap = {
  RED:   [],
  GREEN: [],
  BLUE:  []
};

/**
 * Color maps for different target color shemas.
 */
cwt.client.imgColorReplacementMap = {

  /** @constant */
          // "#381818","#980038","#E00008","#F82800","#F85800","#F89870","#F8C880"
  RED:    [ 56,24,24,
            152,0,56,
            224,0,8,
            248,40,0,
            248,88,0,
            248,152,112,
            248,200,128 ],

  /** @constant */
          // "#182818","#088048","#08A830","#10D028","#28F028","#88F880","#C8F8C0"
  GREEN:  [ 24,40,24,
            8,128,72,
            8,168,48,
            16,208,40,
            40,240,40,
            136,248,128,
            200,248,192 ],

  /** @constant */
          // "#181840","#2820C0","#0068E8","#0098F0","#40B8F0","#68E0F8","#B8F0F8"
  BLUE:   [ 24,24,64,
            40,32,192,
            0,104,232,
            0,152,240,
            64,184,240,
            104,224,248,
            184,240,248 ]
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
cwt.client.registerImage = function( key, img, w, h, tiles, sx, sy, overlay ){

  // register image for loading
  var index = this.imageListMap.RED.indexOf(img);
  if( index === -1 ){
    index = this.imageListMap.RED.length;
    this.imageListMap.RED.push( img );
  }

  // register image type
  this.imageTypeMap[ key ] = [ index, w, h, tiles, sx, sy, overlay, 0 ];
};

/**
 * @private
 */
cwt.client._imagesLoaded = function(){

  for(var i = 0, e= this.imageListMap.RED.length; i <e; i++) {
    if( !this.imageListMap.RED[i].complete ){
      return false;
    }
  }

  return true;
};

cwt.client.imageLoadingStatus = StateMachine.create({

  initial: 'off',

  error: function( eventName, from, to, args, errorCode, errorMessage ){
    if( cwt.DEBUG ) cwt.log.info("error in image loading status, state: {0}, message: {1}", to, errorMessage);
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
      if( cwt.DEBUG ) cwt.log.info("loading images");

      function waitLoaded(){

        // wait unit all images are loaded
        if( !cwt.client._imagesLoaded() === true ){
          setTimeout( waitLoaded, 500 );
        }
        else{
          cwt.client.imageLoadingStatus.next();
        }
      }

      setTimeout( waitLoaded, 500 );
    },

    /**
     * Filters images with the own color filter.
     */
    onfilterColor: function(){
      if( cwt.DEBUG ) cwt.log.info("filtering images with custom colors");

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

              if( imgPixels.data[xi]   ===  oriColors[n]   &&
                  imgPixels.data[xi+1] ===  oriColors[n+1] &&
                  imgPixels.data[xi+2] ===  oriColors[n+2]
                ){

                imgPixels.data[xi]   = replColors[n];
                imgPixels.data[xi+1] = replColors[n+1];
                imgPixels.data[xi+2] = replColors[n+2];
              }
            }
          }
        }

        canvasContext.putImageData(imgPixels, 0, 0 );
        return canvas;
      }

      var imgMap = cwt.client.imageListMap;
      var colorMap = cwt.client.imgColorReplacementMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.BLUE[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.BLUE );
        imgMap.GREEN[i] = replaceColors( imgMap.RED[i], colorMap.RED, colorMap.GREEN );
      }

      cwt.client.imageLoadingStatus.next();
    },

    /**
     * Filters images with the HqX filter.
     */
    onfilterHq: function(){
      if( cwt.DEBUG ) cwt.log.info("filtering images with hqX");

      var imgMap = cwt.client.imageListMap;
      for( var i=0,e=imgMap.RED.length; i<e; i++ ){

        imgMap.RED[i] = hqx( imgMap.RED[i], 2 );
        imgMap.BLUE[i] = hqx( imgMap.BLUE[i], 2 );
        imgMap.GREEN[i] = hqx( imgMap.GREEN[i], 2 );
      }

      cwt.client.imageLoadingStatus.next();
    }
  }
})