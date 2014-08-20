"use strict";

var move = require("../logic/move");
var image = require("../image");
var model = require("../model");
var assert = require("../system/functions").assert;
var renderer = require("../renderer");
var animation = require("../renderer/animation");
var circBuff = require("../system/circularBuffer");
var constants = require("../constants");

var SPRITE_BOX_LENGTH = constants.TILE_BASE + constants.TILE_BASE;
var HALF_SPRITE_BOX_LENGTH = constants.TILE_BASE / 2;
var MOVE_TILES_PER_SECOND = (constants.TILE_BASE * 8);

var removeUnitFromLayer;

var unitPosX;
var unitPosY;
var dustPostX;
var dustPostY;
var unitId;

var movePathIndex;
var movePath = new circBuff.CircularBuffer(constants.MAX_SELECTION_RANGE);

var isClientVisible;

var animationShift;
var unitSprite;
var dustSprite;
var dustAnimTime;
var dustAnimStep;
var imageColorState;
var dustImageDirectionState;
var unitImageDirectionState;

var assertIsInIdle = function () {
  assert(unitId === constants.INACTIVE);
  assert(unitPosX === constants.INACTIVE);
  assert(unitPosY === constants.INACTIVE);
  assert(movePath.size === 0);
};

var updateAnimation = function (delta) {
  animationShift += ( delta / 1000 ) * MOVE_TILES_PER_SECOND;

  // update move animation timer
  if (dustAnimStep !== -1) {
    dustAnimTime += delta;
    if (dustAnimTime > 30) {
      dustAnimStep++;
      dustAnimTime = 0;
      if (dustAnimStep === 3) {
        dustAnimStep = -1;
      }
    }
  }

  // shift reached next tile
  if (animationShift > constants.TILE_BASE) {
    dustPostX = unitPosX;
    dustPostY = unitPosY;
    dustAnimTime = 0;
    dustAnimStep = 0;

    // update animation position
    switch (movePath[ movePathIndex ]) {
      case move.MOVE_CODES_UP :
        unitPosY--;
        dustImageDirectionState = image.Sprite.DIRECTION_UP;
        unitImageDirectionState = image.Sprite.UNIT_STATE_UP;
        break;

      case move.MOVE_CODES_RIGHT :
        unitPosX++;
        dustImageDirectionState = image.Sprite.DIRECTION_RIGHT;
        unitImageDirectionState = image.Sprite.UNIT_STATE_RIGHT;
        break;

      case move.MOVE_CODES_DOWN :
        unitPosY++;
        dustImageDirectionState = image.Sprite.DIRECTION_DOWN;
        unitImageDirectionState = image.Sprite.UNIT_STATE_DOWN;
        break;

      case move.MOVE_CODES_LEFT :
        unitPosX--;
        dustImageDirectionState = image.Sprite.DIRECTION_LEFT;
        unitImageDirectionState = image.Sprite.UNIT_STATE_LEFT;
        break;
    }

    movePathIndex++;

    animationShift -= constants.TILE_BASE;

    if (movePathIndex === movePath.length || movePath[movePathIndex] === constants.INACTIVE) {
      this.changeState("INGAME_IDLE");
    }
  }
};

// This function cleans the unit from the unit layer.
//
var eraseUnitFromUnitLayer = function () {
  renderer.setHiddenUnitId(unitId);
  renderer.renderUnitsOnScreen();
};

// This function cleans the last animation step picture from the effects layer.
//
var eraseLastPicture = function (ctx) {
  var x = (unitPosX - 1 - renderer.screenOffsetX);
  var y = (unitPosY - 1 - renderer.screenOffsetY);
  var w = (unitPosY + 1 - renderer.screenOffsetX);
  var h = (unitPosY + 1 - renderer.screenOffsetY);

  // check boundaries
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (w === model.mapWidth) w -= 1;
  if (h === model.mapHeight) h -= 1;

  ctx.clearRect(
    x * constants.TILE_BASE,
    y * constants.TILE_BASE,
    (w - x) * constants.TILE_BASE,
    (h - y) * constants.TILE_BASE
  );
};

// This function renders the current animation step picture to the effects layer.
//
var renderNewPicture = function (ctx) {

  // check client visibility for the unit and the given tile
  if (!isClientVisible && !model.mapData[unitPosX][unitPosY].visionClient <= 0) {
    return;
  }

  var tx = (( unitPosX ) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;
  var ty = (( unitPosY ) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;

  // ADD SHIFT
  switch (movePath[ movePathIndex ]) {
    case move.MOVE_CODES_UP: ty -= animationShift; break;
    case move.MOVE_CODES_LEFT: tx -= animationShift; break;
    case move.MOVE_CODES_RIGHT: tx += animationShift; break;
    case move.MOVE_CODES_DOWN: ty += animationShift; break;
  }

  // drawing unit
  ctx.drawImage(
    unitSprite.getImage(imageColorState + unitImageDirectionState),
    SPRITE_BOX_LENGTH * animation.indexUnitAnimation, 0,
    SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH,
    tx, ty,
    SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
  );

  // drawing dust
  if (dustAnimStep !== -1) {
    ctx.drawImage(
      dustSprite.getImage(dustImageDirectionState),
      SPRITE_BOX_LENGTH * dustAnimStep, 0,
      SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH,
      (( dustPostX ) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH,
      (( dustPostX ) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH,
      SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
    );
  }
};

exports.prepareMove = function (uid, x, y, movePath) {
  var unit = model.units[uid];

  // grab unit color state
  switch (unit.owner.id) {
    case 0:
      imageColorState = image.Sprite.UNIT_RED;
      break;

    case 1:
      imageColorState = image.Sprite.UNIT_BLUE;
      break;

    case 2:
      imageColorState = image.Sprite.UNIT_GREEN;
      break;

    case 3:
      imageColorState = image.Sprite.UNIT_YELLOW;
      break;
  }

  unitPosX = x;
  unitPosY = y;
  unitId = uid;
  isClientVisible = unit.owner.clientVisible;
  unitSprite = image.sprites[unit.type.ID];

  circBuff.copyBuffer(movePath, movePath);
};

exports.state = {
  id: "ANIMATION_MOVE",

  enter: function () {
    assertIsInIdle();

    // grab dust image lazy
    if (dustSprite) dustSprite = image.sprites["DUST"];

    removeUnitFromLayer = true;
  },

  exit: function () {
    isClientVisible = constants.INACTIVE;
    unitId = constants.INACTIVE;
    unitPosX = constants.INACTIVE;
    unitPosY = constants.INACTIVE;
    dustPostX = -1;
    dustPostY = -1;
    movePathIndex = 0;
    animationShift = 0;
    dustAnimTime = -1;
    dustAnimStep = -1;
    unitSprite = null;
    movePath.clear();
    renderer.setHiddenUnitId(constants.INACTIVE);
  },

  update: function (delta) {
    updateAnimation.call(this, delta);
  },

  render: function (delta) {
    var ctx = renderer.layerEffects.getContext(0);

    // the unit has to be removed from the unit layer during the animation
    if (removeUnitFromLayer) {
      eraseUnitFromUnitLayer(ctx);
      removeUnitFromLayer = false;
    }

    eraseLastPicture(ctx, delta);
    renderNewPicture(ctx, delta);

    renderer.layerEffects.renderLayer(0);
  }
};

// reset data
exports.state.exit();