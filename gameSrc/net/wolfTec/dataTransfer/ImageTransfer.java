package net.wolfTec.dataTransfer;

import net.wolfTec.renderer.Sprite;

import org.stjs.javascript.functions.Callback0;

public class ImageTransfer {

	public static final String IMAGE_KEY = "GFX_";

/**
 *
 * @param type
 * @param sprite
 * @param callback
 */
	public void transferImageToStorage (String type, Sprite sprite, Callback0 callback) {
    var data = image.Sprite.toJSON(sprite);
    storage.set(type, data, callback);
}

/**
 *
 * @param type
 * @param path
 * @param imgType
 * @param callback
 */
public void transferImageFromStorage (String type, String path, Object imgType, Callback0 callback) {
    storage.get(type, function (obj) {
        if (obj.value) {
            // is in the cache
            image.sprites[type] = this.jSONtoColoredSprite_(obj.value);
            callback();

        } else {
            // not in the cache
            var img = new Image();
            img.src = path;

            img.onload = function () {
                var sprite;

                switch (imgType) {
                    case image.TYPE_UNIT:
                        sprite = cwt.Image.createUnitSprites();
                        break;

                    case image.TYPE_PROPERTY:
                        sprite = cwt.Image.createPropertySprites();
                        break;

                    case image.TYPE_TILE:
                        sprite = cwt.Image.createTileSprites();
                        break;
                }

                // saveGameConfig image in the cache
                exports.transferImagesToStorage(type, sprite, callback);
            };

            // failed to loadGameConfig the image data
            img.onerror = function () {
                require("../error").raiseError("could not loadGameConfig image for " + type + " at location " + path, "");
            };
        }
    });
}

/**
 *
 * @param callback
 */
public void transferAllImagesToStorage (Callback0 callback) {
    if (constants.DEBUG) console.log("persist all images in the cache");

    var stuff = [];

    Object.keys(image.sprites).forEach(function (key) {
        stuff.push(function (next) {
            storage.set(IMAGE_KEY + key, image.Sprite.toJSON(image.sprites[key]), function () {
                next();
            });
        });
    });

    async.sequence(stuff, function () {
        if (constants.DEBUG) console.log("completed image persist process");
        callback();
    });
}

/**
 *
 * @param callback
 */
public void transferAllImagesFromRemote (Callback0 callback) {

    function getImageDataArray(image) {
        var canvas = document.createElement("canvas");
        var canvasContext = canvas.getContext("2d");

        var imgW = image.width;
        var imgH = image.height;
        canvas.width = imgW;
        canvas.height = imgH;
        canvasContext.drawImage(image, 0, 0);

        return canvasContext.getImageData(0, 0, imgW, imgH).data;
    }

    /**
     * Changes colors in an assets object by given replacement color maps and returns a new
     * assets object (html5 canvas).
     *
     * @param image
     * @param colorData
     * @param numColors
     * @param oriIndex
     * @param replaceIndex
     * @returns {HTMLElement}
     */
    function replaceColors(image, colorData, numColors, oriIndex, replaceIndex) {
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
    }

    /**
     *
     * @param image
     * @returns {HTMLElement}
     */
    function createBlackMask(image) {
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
    }

    /**
     * Draws a part of an image to a new canvas.
     *
     * @param image
     * @param sx
     * @param sy
     * @param w
     * @param h
     * @returns {HTMLElement}
     */
    function cropImage(image, sx, sy, w, h) {
        var nCanvas = document.createElement('canvas');
        var nContext = nCanvas.getContext('2d');

        nCanvas.width = w;
        nCanvas.height = h;

        nContext.drawImage(image, sx, sy, w, h, 0, 0, w, h);

        return nCanvas;
    }

    /**
     * Flips an image.
     *
     * BASED ON http://jsfiddle.net/pankajparashar/KwDhX/
     *
     * @param image
     * @param flipH
     * @param flipV
     * @returns {HTMLElement}
     */
    function flipImage(image, flipH, flipV) {
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
        nContext.saveGameConfig();
        nContext.scale(scaleH, scaleV);
        nContext.drawImage(image, posX, posY, image.width, image.height);
        nContext.restore();

        return nCanvas;
    }

    /**
     * Doubles the size of an assets by using the scale2x algorithm.
     *
     * @param image
     * @returns {HTMLElement}
     * @inner
     */
    function scale2x(image) {
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

    //
    //
    // @inner
    // @param sprite
    // @param state
    // @param rImg
    // @param bImg
    // @param gImg
    // @param yImg
    // @param startX
    //
    function cropUnitState(sprite, state, rImg, bImg, gImg, yImg, startX) {
        sprite.setImage(image.Sprite.UNIT_RED + state, cropImage(rImg, startX, 0, 96, 32));
        sprite.setImage(image.Sprite.UNIT_BLUE + state, cropImage(bImg, startX, 0, 96, 32));
        sprite.setImage(image.Sprite.UNIT_GREEN + state, cropImage(gImg, startX, 0, 96, 32));
        sprite.setImage(image.Sprite.UNIT_YELLOW + state, cropImage(yImg, startX, 0, 96, 32));
        sprite.setImage(image.Sprite.UNIT_SHADOW_MASK + state,
            createBlackMask(sprite.getImage(image.Sprite.UNIT_RED + state)));
    }

    //
    //
    // @inner
    // @param sprite
    // @param state
    // @param rImg
    // @param bImg
    // @param gImg
    // @param yImg
    // @param startX
    //
    function cropUnitStateInverted(sprite, state, rImg, bImg, gImg, yImg, startX) {
        // TODO: bug flips whole image, but it would be correct to flip every state
        sprite.setImage(image.Sprite.UNIT_RED + state, flipImage(cropImage(rImg, startX, 0, 96, 32), true, false));
        sprite.setImage(image.Sprite.UNIT_BLUE + state, flipImage(cropImage(bImg, startX, 0, 96, 32), true, false));
        sprite.setImage(image.Sprite.UNIT_GREEN + state, flipImage(cropImage(gImg, startX, 0, 96, 32), true, false));
        sprite.setImage(image.Sprite.UNIT_YELLOW + state, flipImage(cropImage(yImg, startX, 0, 96, 32), true, false));
        sprite.setImage(image.Sprite.UNIT_SHADOW_MASK + state,
            createBlackMask(sprite.getImage(image.Sprite.UNIT_RED + state)));
    }

    function cropAndRotate(image, sx, sy, w, rotation) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var hw = w / 2;

        if (constants.DEBUG) assert(hw % 1 === 0);

        canvas.height = w;
        canvas.width = w;

        // transform
        context.saveGameConfig();
        context.translate(hw, hw);
        context.rotate(rotation * Math.PI / 180);
        context.translate(-hw, -hw);

        // draw
        context.drawImage(image, sx, sy, w, w, 0, 0, w, w);

        context.restore();

        return canvas;
    }

    function grabImage(path, key, callback) {
        if (constants.DEBUG) console.log("going to loadGameConfig image " + path + " for key " + key);

        var image = new Image();

        if (constants.DEBUG) {
            image.onload = function () {
                console.log("successfully loaded image " + path + " for key " + key);
                callback.apply(this, arguments);
            };
        } else {
            image.onload = callback;
        }


        image.src = constants.MOD_PATH + path;
        image.key = key;
    }

    var unitColorData;
    var propertyColorData;
    var unitColStat = image.UNIT_INDEXES;
    var propColStat = image.PROPERTY_INDEXES;

    var graphics = require("../dataTransfer/mod").getMod().graphics;

    var stuff = [];

    function addToPushLoop(path, key, callback) {
        stuff.push(function (next) {
            grabImage(path, key, function () {
                callback(this, next);
            });
        });
    }

    // grab color map images
    stuff.push(
        function (next) {
            grabImage(graphics.COLOR_MAP[0], null, function () {
                propertyColorData = getImageDataArray(this);
                next();
            });
        },
        function (next) {
            grabImage(graphics.COLOR_MAP[1], null, function () {
                unitColorData = getImageDataArray(this);
                next();
            });
        }
    );

    // grab unit images
    Object.keys(graphics.UNITS).forEach(function (key) {
        stuff.push(function (next) {
            var path = graphics.UNITS[key];
            grabImage(path, key, function () {
                var sprite = new image.Sprite(image.Sprite.UNIT_STATES);

                var red = this;
                var blue;
                var green;
                var yellow;

                // create colored sprite maps
                blue = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.BLUE);
                green = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.GREEN);
                yellow = replaceColors(red, unitColorData, unitColStat.colors, unitColStat.RED, unitColStat.YELLOW);

                // crop out target states as single images
                cropUnitState(sprite, image.Sprite.UNIT_STATE_IDLE, red, blue, green, yellow, 0);
                cropUnitState(sprite, image.Sprite.UNIT_STATE_UP, red, blue, green, yellow, 96);
                cropUnitState(sprite, image.Sprite.UNIT_STATE_DOWN, red, blue, green, yellow, 192);
                cropUnitState(sprite, image.Sprite.UNIT_STATE_LEFT, red, blue, green, yellow, 288);
                cropUnitStateInverted(sprite, image.Sprite.UNIT_STATE_IDLE_INVERTED, red, blue, green, yellow, 0);
                cropUnitStateInverted(sprite, image.Sprite.UNIT_STATE_RIGHT, red, blue, green, yellow, 288);

                // register sprite
                image.sprites[this.key] = sprite;
                next();
            });
        });
    });

    // grab tile images
    Object.keys(graphics.TILES).forEach(function (key) {
        var value = graphics.TILES[key];
        var sprite;

        // special graphic data for tiles
        if (value[value.length - 2] === true) {
            image.longAnimatedTiles[key] = true;
        }
        if (value[value.length - 1] === true) {
            image.overlayTiles[key] = true;
        }

        if (value.length === 3) { // single variant tile
            sprite = new image.Sprite(image.Sprite.TILE_STATES);
            stuff.push(function (next) {
                grabImage(value[0], key, function () {
                    sprite.setImage(0, this);
                    sprite.setImage(1, createBlackMask(this));
                    next();
                });
            });

        } else { // multi variant tile
            sprite = new image.Sprite(value[2].length * image.Sprite.TILE_STATES);

            variants.registerVariantInfo(key, value[0], value[1]);

            for (var i = 0, e = value[2].length; i < e; i++) {
                addToPushLoop(value[2][i], i * 2, function (img, next) {
                    sprite.setImage(img.key, img);
                    sprite.setImage(img.key + 1, createBlackMask(img));
                    next();
                });
            }
        }

        image.sprites[key] = sprite;
    });

    // grab property images
    Object.keys(graphics.PROPERTIES).forEach(function (key) {
        stuff.push(function (next) {
            var path = graphics.PROPERTIES[key];
            grabImage(path, key, function () {
                var sprite = new image.Sprite(image.Sprite.PROPERTY_STATES);

                var red = this;
                var blue;
                var green;
                var yellow;
                var neutral;
                var shadow;

                blue = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.BLUE);
                green = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.GREEN);
                yellow = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.YELLOW);
                neutral = replaceColors(red, propertyColorData, propColStat.colors, propColStat.RED, propColStat.GRAY);
                shadow = createBlackMask(red);

                sprite.setImage(image.Sprite.PROPERTY_RED, red);
                sprite.setImage(image.Sprite.PROPERTY_BLUE, blue);
                sprite.setImage(image.Sprite.PROPERTY_GREEN, green);
                sprite.setImage(image.Sprite.PROPERTY_YELLOW, yellow);
                sprite.setImage(image.Sprite.PROPERTY_NEUTRAL, neutral);
                sprite.setImage(image.Sprite.PROPERTY_SHADOW_MASK, shadow);

                // register sprite
                image.sprites[this.key] = sprite;
                next();
            });
        });
    });

    // grab arrow images
    stuff.push(function (next) {
        var path = graphics.ARROW;
        grabImage(path, "ARROW", function () {
            var sprite = new image.Sprite(10);

            var arrowMap = this;

            sprite.setImage(image.Sprite.DIRECTION_N, cropImage(arrowMap, 0, 0, 16, 16));
            sprite.setImage(image.Sprite.DIRECTION_S, cropAndRotate(arrowMap, 0, 0, 16, 180));
            sprite.setImage(image.Sprite.DIRECTION_W, cropAndRotate(arrowMap, 0, 0, 16, 270));
            sprite.setImage(image.Sprite.DIRECTION_E, cropAndRotate(arrowMap, 0, 0, 16, 90));
            sprite.setImage(image.Sprite.DIRECTION_SW, cropAndRotate(arrowMap, 32, 0, 16, 90));
            sprite.setImage(image.Sprite.DIRECTION_SE, cropImage(arrowMap, 32, 0, 16, 16));
            sprite.setImage(image.Sprite.DIRECTION_NW, cropAndRotate(arrowMap, 32, 0, 16, 180));
            sprite.setImage(image.Sprite.DIRECTION_NE, cropAndRotate(arrowMap, 32, 0, 16, 270));
            sprite.setImage(image.Sprite.DIRECTION_NS, cropImage(arrowMap, 16, 0, 16, 16));
            sprite.setImage(image.Sprite.DIRECTION_WE, cropAndRotate(arrowMap, 16, 0, 16, 90));

            // register sprite
            image.sprites[this.key] = sprite;
            next();
        });
    });

    // grab dust images
    stuff.push(function (next) {
        var path = graphics.DUST;
        grabImage(path, "DUST", function () {
            var sprite = new image.Sprite(4);

            var imgMap = this;

            sprite.setImage(image.Sprite.DIRECTION_LEFT, cropImage(imgMap, 0, 0, 96, 32));
            sprite.setImage(image.Sprite.DIRECTION_UP, cropImage(imgMap, 96, 0, 96, 32));
            sprite.setImage(image.Sprite.DIRECTION_DOWN, cropImage(imgMap, 192, 0, 96, 32));
            sprite.setImage(image.Sprite.DIRECTION_RIGHT, cropImage(imgMap, 288, 0, 96, 32));

            // register sprite
            image.sprites[this.key] = sprite;
            next();
        });
    });

    // grab rocket fly images
    stuff.push(function (next) {
        var path = graphics.ROCKET_FLY;
        grabImage(path, "ROCKET_FLY", function () {
            var sprite = new image.Sprite(2);

            sprite.setImage(image.Sprite.DIRECTION_UP, this);
            sprite.setImage(image.Sprite.DIRECTION_DOWN, cropAndRotate(this, 0, 0, 24, 180));

            // register sprite
            image.sprites[this.key] = sprite;
            next();
        });
    });

    // grab other images
    Object.keys(graphics.OTHERS).forEach(function (key) {
        var value = graphics.OTHERS[key];
        var sprite;

        if (typeof value === "string") {
            sprite = new image.Sprite(1);

            stuff.push(function (next) {      // single image sprite
                grabImage(value, key, function () {
                    sprite.setImage(0, this);
                    image.sprites[this.key] = sprite;
                    next();
                });
            });
        } else {                            // multi image sprite
            sprite = new image.Sprite(value.length);

            for (var i = 0, e = value.length; i < e; i++) {
                addToPushLoop(value[i], i, function (img, next) {
                    sprite.setImage(img.key, img);
                    next();
                });
            }
        }

        image.sprites[key] = sprite;
    });

    async.sequence(stuff, function () {
        callback();
    });
}

//
//
// @param {Function} callback
//
public void transferAllImagesFromStorage (Callback0 callback) {
    var graphics = require("../dataTransfer/mod").getMod().graphics;

    var stuff = [];

    //
    // @inner
    // @param key
    //
    function loadKey(key) {
        var realKey = key.slice(IMAGE_KEY.length);
        stuff.push(function (next) {
            debug.logInfo("grab sprite " + key + " from cache");

            storage.get(key, function (value) {
                if (constants.DEBUG) assert(value);

                image.sprites[realKey] = image.Sprite.fromJSON(value);
                next();
            });
        });
    }

    // loadGameConfig all possible audio (except music) keys from the storage into the RAM
    storage.keys(function (keys) {
        for (var i = 0, e = keys.length; i < e; i++) {
            var key = keys[i];
            if (key.indexOf(IMAGE_KEY) === 0) {
                loadKey(key);
            }
        }

        // grab tile variant information
        Object.keys(graphics.TILES).forEach(function (key) {
            var value = graphics.TILES[key];

            // special graphic data for tiles
            if (value[value.length - 2] === true) {
                image.longAnimatedTiles[key] = true;
            }
            if (value[value.length - 1] === true) {
                image.overlayTiles[key] = true;
            }

            if (value.length !== 3) { // multi variant tile
                variants.registerVariantInfo(key, value[0], value[1]);
            }
        });

        utility.sequence(stuff, function () {
            callback();
        });
    });
}
}
