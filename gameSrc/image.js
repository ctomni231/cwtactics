"use strict";

/**
 *
 * @type {number}
 */
exports.TYPE_UNIT = 0;

/**
 *
 * @type {number}
 */
exports.TYPE_PROPERTY = 1;

/**
 *
 * @type {number}
 */
exports.TYPE_TILE = 2;

/**
 *
 * @type {number}
 */
exports.TYPE_ANIMATED_TILE = 3;

/**
 *
 * @type {number}
 */
exports.TYPE_ANIMATED_TILE_WITH_VARIANTS = 4;

/**
 *
 * @type {number}
 */
exports.TYPE_MISC = 10;

/**
 *
 * @type {number}
 */
exports.TYPE_IMAGE = 99;

/**
 * Color schema for a unit sprite.
 *
 * @enum
 */
exports.UNIT_INDEXES = {
    RED: 0,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 6
};

/**
 * Color schema for a property sprite.
 *
 * @enum
 */
exports.PROPERTY_INDEXES = {
    RED: 0,
    GRAY: 1,
    BLUE: 3,
    GREEN: 4,
    YELLOW: 5,
    colors: 4
};

var SpriteClass = require("./image/sprite");

/**
 *
 * @constructor
 */
exports.Sprite = function () {
    SpriteClass.call(this);
};

exports.Sprite.toJSON = SpriteClass.toJSON;

exports.Sprite.fromJSON = SpriteClass.fromJSON;

exports.Sprite.prototype = Object.create(SpriteClass.prototype);

// TODO prevent this special sprite class by placing the index numbers directly into this module

/** @constant */
exports.Sprite.MINIMAP_2x2 = 0;

/** @constant */
exports.Sprite.MINIMAP_4x4 = 1;

/** @constant */
exports.Sprite.UNIT_STATES = 30;

/** @constant */
exports.Sprite.UNIT_RED = 0;

/** @constant */
exports.Sprite.UNIT_BLUE = 6;

/** @constant */
exports.Sprite.UNIT_GREEN = 12;

/** @constant */
exports.Sprite.UNIT_YELLOW = 18;

/** @constant */
exports.Sprite.UNIT_SHADOW_MASK = 24;

/** @constant */
exports.Sprite.UNIT_STATE_IDLE = 0;

/** @constant */
exports.Sprite.UNIT_STATE_IDLE_INVERTED = 1;

/** @constant */
exports.Sprite.UNIT_STATE_LEFT = 2;

/** @constant */
exports.Sprite.UNIT_STATE_RIGHT = 3;

/** @constant */
exports.Sprite.UNIT_STATE_UP = 4;

/** @constant */
exports.Sprite.UNIT_STATE_DOWN = 5;

/** @constant */
exports.Sprite.TILE_STATES = 2;

/** @constant */
exports.Sprite.TILE_SHADOW = 1;

/** @constant */
exports.Sprite.PROPERTY_STATES = 6;

/** @constant */
exports.Sprite.PROPERTY_RED = 0;

/** @constant */
exports.Sprite.PROPERTY_BLUE = 1;

/** @constant */
exports.Sprite.PROPERTY_GREEN = 2;

/** @constant */
exports.Sprite.PROPERTY_YELLOW = 3;

/** @constant */
exports.Sprite.PROPERTY_NEUTRAL = 4;

/** @constant */
exports.Sprite.PROPERTY_SHADOW_MASK = 5;

/** @constant */
exports.Sprite.SYMBOL_HP = 0;

/** @constant */
exports.Sprite.SYMBOL_AMMO = 1;

/** @constant */
exports.Sprite.SYMBOL_FUEL = 2;

/** @constant */
exports.Sprite.SYMBOL_LOAD = 3;

/** @constant */
exports.Sprite.SYMBOL_CAPTURE = 4;

/** @constant */
exports.Sprite.SYMBOL_ATT = 5;

/** @constant */
exports.Sprite.SYMBOL_VISION = 6;

/** @constant */
exports.Sprite.SYMBOL_MOVE = 7;

/** @constant */
exports.Sprite.SYMBOL_UNKNOWN = 8;

/** @constant */
exports.Sprite.SYMBOL_HIDDEN = 9;

/** @constant */
exports.Sprite.SYMBOL_DEFENSE = 10;

/** @constant */
exports.Sprite.SYMBOL_RANK_1 = 11;

/** @constant */
exports.Sprite.SYMBOL_RANK_2 = 12;

/** @constant */
exports.Sprite.SYMBOL_RANK_3 = 13;

/** @constant */
exports.Sprite.DIRECTION_N = 0;

/** @constant */
exports.Sprite.DIRECTION_S = 1;

/** @constant */
exports.Sprite.DIRECTION_W = 2;

/** @constant */
exports.Sprite.DIRECTION_E = 3;

/** @constant */
exports.Sprite.DIRECTION_SW = 4;

/** @constant */
exports.Sprite.DIRECTION_SE = 5;

/** @constant */
exports.Sprite.DIRECTION_NW = 6;

/** @constant */
exports.Sprite.DIRECTION_NE = 7;

/** @constant */
exports.Sprite.DIRECTION_NS = 8;

/** @constant */
exports.Sprite.DIRECTION_WE = 9;

/** @constant */
exports.Sprite.DIRECTION_ALL = 8;

/** @constant */
exports.Sprite.DIRECTION_UP = 0;

/** @constant */
exports.Sprite.DIRECTION_DOWN = 1;

/** @constant */
exports.Sprite.DIRECTION_LEFT = 2;

/** @constant */
exports.Sprite.DIRECTION_RIGHT = 3;

/** @constant */
exports.Sprite.FOCUS_MOVE = 0;

/** @constant */
exports.Sprite.FOCUS_ATTACK = 1;

/** @constant */
exports.Sprite.COLOR_MAP_PROPERTY = 0;

/** @constant */
exports.Sprite.COLOR_MAP_UNIT = 1;

/** @constant */
exports.Sprite.EXPLOSION_GROUND = 0;

/** @constant */
exports.Sprite.EXPLOSION_AIR = 1;

/** @constant */
exports.Sprite.EXPLOSION_DUST = 2;

/** @constant */
exports.Sprite.EXPLOSION_SEA = 3;

/**
 *
 */
exports.sprites = {};

/**
 *
 */
exports.overlayTiles = {};

/**
 *
 */
exports.longAnimatedTiles = {};

/**
 *
 */
exports.minimapIndex = {};