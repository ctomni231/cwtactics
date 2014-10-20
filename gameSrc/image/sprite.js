"use strict";

var constants = require("./constants");

/**
 *
 * @param {Number} indexes
 * @constructor
 */
exports.Sprite = function (indexes) {
    this.images = [];

    while (indexes > 0) {
        this.images.push(null);
        indexes--;
    }
};

exports.Sprite.prototype = {

    /**
     *
     * @returns {Number}
     */
    getNumberOfImages: function () {
        return this.images.length;
    },

    /**
     *
     * @param index
     * @param image
     */
    setImage: function (index, image) {
        if (constants.DEBUG) assert(index >= 0 && index < this.images.length);
        this.images[index] = image;
    },

    /**
     *
     * @param index
     * @returns {exports.Sprite}
     */
    getImage: function (index) {
        return this.images[index];
    }
};

/**
 *
 * @param {exports.Sprite} sprite
 * @returns {string}
 */
exports.Sprite.toJSON = function (sprite) {
    if (constants.DEBUG) assert(sprite instanceof exports.Sprite);

    var data = [];
    for (var i = 0, e = sprite.images.length; i < e; i++) {
        data[i] = Base64Helper.canvasToBase64(sprite.images[i]);
    }

    return JSON.stringify(data);
};

/**
 * Loads a sprite from the cache.
 *
 * @param {string} spriteData
 * @returns {exports.Sprite}
 */
exports.Sprite.fromJSON = function (spriteData) {
    if (typeof spriteData === "string") {
        spriteData = JSON.parse(spriteData);
    }

    var sprite = new exports.Sprite(spriteData.length);
    var data = sprite.images;
    for (var i = 0, e = spriteData.length; i < e; i++) {
        data[i] = Base64Helper.base64ToImage(spriteData[i]);
    }

    return sprite;
};