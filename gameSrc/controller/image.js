/**
 * @namespace
 */
cwt.Image = {

  /**
   * @constant
   */
  TYPE_UNIT: 0,

  /**
   * @constant
   */
  TYPE_PROPERTY: 1,

  /**
   * @constant
   */
  TYPE_TILE: 2,

  /**
   * @constant
   */
  TYPE_ANIMATED_TILE: 3,

  /**
   * @constant
   */
  TYPE_ANIMATED_TILE_WITH_VARIANTS: 4,

  /**
   * @constant
   */
  TYPE_MISC: 10,

  /**
   * @constant
   */
  TYPE_IMAGE: 99,

  /**
   * Color schema for a unit sprite.
   *
   * @constant
   */
  UNIT_INDEXES: {
    RED: 0,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    BLACK_MASK: 8,
    colors: 6
  },

  /**
   * Color schema for a property sprite.
   *
   * @constant
   */
  PROPERTY_INDEXES: {
    RED: 0,
    GRAY: 1,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    BLACK_MASK: 8,
    colors: 4
  },

  /**
   * @type {cwt.Sprite[]}
   */
  sprites: {},

  /**
   *
   * @param type
   * @param sprite
   * @param callback
   */
  saveSpriteToCache: function (type, sprite, callback) {
    if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.ArmySprite || sprite instanceof cwt.Sprite);

    // extract data
    var data = (sprite instanceof cwt.ArmySprite) ? cwt.ArmySprite.toJSON(sprite) : cwt.Sprite.toJSON(sprite);

    // save it
    cwt.Storage.assetsStorage.set(type, data, callback);
  },

  /**
   *
   * @param type
   * @param path
   * @param callback
   */
  loadSprite: function (type, path, imgType, callback) {
    cwt.Storage.assetsStorage.get(type, function (obj) {
      if (obj.value) {
        // is in the cache
        this.sprites[type] = this.jSONtoColoredSprite_(obj.value);
        callback();

      } else {
        // not in the cache
        var img = new Image();
        img.src = path;

        img.onload = function () {
          var sprite;

          switch (imgType) {
            case cwt.Image.TYPE_UNIT:
              sprite = cwt.Image.createUnitSprites();
              break;

            case cwt.Image.TYPE_PROPERTY:
              sprite = cwt.Image.createPropertySprites();
              break;

            case cwt.Image.TYPE_TILE:
              sprite = cwt.Image.createTileSprites();
              break;
          }

          // save image in the cache
          cwt.Image.saveSpriteToCache(type, sprite, callback);
        };

        // failed to load the image data
        img.onerror = function () {
          throw Error("could not load image for " + type + " at location " + path);
        };
      }
    });
  },

  createUnitSprites: function () {
    // crop idle, left, up, down

    // flip idle and left

    // colorize all
  },

  createPropertySprites: function () {

    // colorize it
  },

  createTileSprites: function () {
    // crop all tiles
  },

  /**
   * Draws a part of an image to a new canvas.
   *
   * @param {Image|HTMLCanvasElement} image image object
   * @param {number} sx source x coordinate
   * @param {number} sy source y coordinate
   * @param {number} w width
   * @param {number} h height
   * @return {HTMLCanvasElement}
   */
  cropImage: function (image, sx, sy, w, h) {
    var nCanvas = document.createElement('canvas');
    var nContext = nCanvas.getContext('2d');

    nCanvas.height = w;
    nCanvas.width = h;

    nContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);

    return /** @type {HTMLCanvasElement} */ nCanvas;
  },

  /**
   * Flips an image.
   *
   * BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
   *
   * @param {Image|HTMLCanvasElement} image
   * @param {boolean} flipH
   * @param {boolean} flipV
   * @return {HTMLCanvasElement}
   */
  flipImage: function (image, flipH, flipV) {
    var scaleH = flipH ? -1 : 1;
    var scaleV = flipV ? -1 : 1;
    var posX = flipH ? image.width * -1 : 0;
    var posY = flipV ? image.height * -1 : 0;

    // target canvas
    var nCanvas = document.createElement('canvas');
    var nContext = nCanvas.getContext('2d');

    nCanvas.height = image.height;
    nCanvas.width = image.width;

    // transform it
    nContext.save();
    nContext.scale(scaleH, scaleV);
    nContext.drawImage(image, posX, posY, image.width, image.height);
    nContext.restore();

    return /** @type {HTMLCanvasElement} */ nCanvas;
  },

  getImageDataArray: function (image) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    return canvasContext.getImageData(0, 0, imgW, imgH).data;
  },

  getUnitColorData: (function () {
    var v = null;
    return function () {
      if (!v) v = view.imageProcessor_getImageDataArray(
        view.getInfoImageForType(view.IMG_COLOR_MAP_UNITS_ID)
      );

      return v;
    };
  })(),

  getPropertyColorData: (function () {
    var v = null;
    return function () {
      if (!v) v = view.imageProcessor_getImageDataArray(
        view.getInfoImageForType(view.IMG_COLOR_MAP_PROPERTIES_ID)
      );

      return v;
    };
  })(),

  /**
   *
   * @param image
   * @return {HTMLElement}
   */
  createBlackMask: function (image) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    // create target canvas
    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var xi = (y * 4) * imgPixels.width + x * 4;
        var oA = imgPixels.data[xi + 3];

        // if pixel is not transparent, then fill it with black
        if (oA > 0) {
          imgPixels.data[xi  ] = 0;
          imgPixels.data[xi + 1] = 0;
          imgPixels.data[xi + 2] = 0;
        }
      }
    }

    // write changes back
    canvasContext.putImageData(imgPixels, 0, 0);

    return canvas;
  },

  /**
   * Changes colors in an assets object by given replacement color maps and returns a new assets object (html5 canvas).
   *
   * @param image
   * @param colorData
   * @param numColors
   * @param oriIndex
   * @param replaceIndex
   * @return {HTMLElement}
   */
  replaceColors: function (image, colorData, numColors, oriIndex, replaceIndex) {
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    // create target canvas
    var imgW = image.width;
    var imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;
    canvasContext.drawImage(image, 0, 0);
    var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

    var oriStart = (oriIndex * 4) * numColors;
    var replStart = (replaceIndex * 4) * numColors;
    for (var y = 0; y < imgPixels.height; y++) {
      for (var x = 0; x < imgPixels.width; x++) {
        var xi = (y * 4) * imgPixels.width + x * 4;

        var oR = imgPixels.data[xi  ];
        var oG = imgPixels.data[xi + 1];
        var oB = imgPixels.data[xi + 2];
        for (var n = 0, ne = (numColors * 4); n < ne; n += 4) {

          var sR = colorData[oriStart + n  ];
          var sG = colorData[oriStart + n + 1];
          var sB = colorData[oriStart + n + 2];

          if (sR === oR && sG === oG && sB === oB) {

            var r = replStart + n;
            var rR = colorData[r  ];
            var rG = colorData[r + 1];
            var rB = colorData[r + 2];
            imgPixels.data[xi  ] = rR;
            imgPixels.data[xi + 1] = rG;
            imgPixels.data[xi + 2] = rB;
          }
        }
      }
    }

    // write changes back
    canvasContext.putImageData(imgPixels, 0, 0);

    return canvas;
  },

  /**
   * Doubles the size of an assets by using the scale2x algorithm.
   *
   * @param image
   * @return {HTMLElement}
   */
  scale2x: function (image) {
    var imgW = image.width;
    var imgH = image.height;
    var oR, oG, oB;
    var uR, uG, uB;
    var dR, dG, dB;
    var rR, rG, rB;
    var lR, lG, lB;
    var xi;
    var t0R, t0G, t0B;
    var t1R, t1G, t1B;
    var t2R, t2G, t2B;
    var t3R, t3G, t3B;

    // create target canvas
    var canvasS = document.createElement("canvas");
    var canvasSContext = canvasS.getContext("2d");
    canvasS.width = imgW;
    canvasS.height = imgH;
    canvasSContext.drawImage(image, 0, 0);
    var imgPixelsS = canvasSContext.getImageData(0, 0, imgW, imgH);

    // create target canvas
    var canvasT = document.createElement("canvas");
    var canvasTContext = canvasT.getContext("2d");
    canvasT.width = imgW * 2;
    canvasT.height = imgH * 2;
    var imgPixelsT = canvasTContext.getImageData(0, 0, imgW * 2, imgH * 2);

    // scale it
    for (var y = 0; y < imgPixelsS.height; y++) {
      for (var x = 0; x < imgPixelsS.width; x++) {

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // grab source pixels
        //

        // grab center
        xi = (y * 4) * imgPixelsS.width + x * 4;
        oR = imgPixelsS.data[xi ];
        oG = imgPixelsS.data[xi + 1];
        oB = imgPixelsS.data[xi + 2];

        // grab left
        if (x > 0) {
          xi = (y * 4) * imgPixelsS.width + (x - 1) * 4;
          lR = imgPixelsS.data[xi ];
          lG = imgPixelsS.data[xi + 1];
          lB = imgPixelsS.data[xi + 2];
        }
        else {
          lR = oR;
          lG = oG;
          lB = oB;
        }

        // grab up
        if (y > 0) {
          xi = ((y - 1) * 4) * imgPixelsS.width + (x) * 4;
          uR = imgPixelsS.data[xi ];
          uG = imgPixelsS.data[xi + 1];
          uB = imgPixelsS.data[xi + 2];
        }
        else {
          uR = oR;
          uG = oG;
          uB = oB;
        }

        // grab down
        if (x < imgPixelsS.height - 1) {
          xi = ((y + 1) * 4) * imgPixelsS.width + (x) * 4;
          dR = imgPixelsS.data[xi ];
          dG = imgPixelsS.data[xi + 1];
          dB = imgPixelsS.data[xi + 2];
        }
        else {
          dR = oR;
          dG = oG;
          dB = oB;
        }

        // grab right
        if (x < imgPixelsS.width - 1) {
          xi = (y * 4) * imgPixelsS.width + (x + 1) * 4;
          rR = imgPixelsS.data[xi ];
          rG = imgPixelsS.data[xi + 1];
          rB = imgPixelsS.data[xi + 2];
        }
        else {
          rR = oR;
          rG = oG;
          rB = oB;
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // calculates target pixels
        //

        // E0 = E; E1 = E; E2 = E; E3 = E;
        t0R = oR;
        t0G = oG;
        t0B = oB;
        t1R = oR;
        t1G = oG;
        t1B = oB;
        t2R = oR;
        t2G = oG;
        t2B = oB;
        t3R = oR;
        t3G = oG;
        t3B = oB;

        // if (B != H && D != F)
        if (( uR !== dR || uG !== dG || uB !== dB ) && ( lR !== rR || lG !== rG || lB !== rB )) {

          // E0 = D == B ? D : E;
          if (uR === lR && uG === lG && uB === lB) {
            t0R = lR;
            t0G = lG;
            t0B = lB;
          }

          // E1 = B == F ? F : E;
          if (uR === rR && uG === rG && uB === rB) {
            t1R = rR;
            t1G = rG;
            t1B = rB;
          }

          // E2 = D == H ? D : E;
          if (lR === dR && lG === dG && lB === dB) {
            t2R = lR;
            t2G = lG;
            t2B = lB;
          }

          // E3 = H == F ? F : E;
          if (dR === rR && dG === rG && dB === rB) {
            t3R = rR;
            t3G = rG;
            t3B = rB;
          }
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // write pixels to target canvas
        //

        xi = ((y * 2) * 4) * imgPixelsT.width + (x * 2) * 4;
        imgPixelsT.data[xi + 0] = t0R;
        imgPixelsT.data[xi + 1] = t0G;
        imgPixelsT.data[xi + 2] = t0B;
        imgPixelsT.data[xi + 4] = t1R;
        imgPixelsT.data[xi + 5] = t1G;
        imgPixelsT.data[xi + 6] = t1B;

        xi = ((y * 2 + 1) * 4) * imgPixelsT.width + (x * 2) * 4;
        imgPixelsT.data[xi + 0] = t2R;
        imgPixelsT.data[xi + 1] = t2G;
        imgPixelsT.data[xi + 2] = t2B;
        imgPixelsT.data[xi + 4] = t3R;
        imgPixelsT.data[xi + 5] = t3G;
        imgPixelsT.data[xi + 6] = t3B;
      }
    }

    // write changes back to the canvas
    canvasTContext.putImageData(imgPixelsT, 0, 0);

    canvasS = null;
    return canvasT;
  }

};