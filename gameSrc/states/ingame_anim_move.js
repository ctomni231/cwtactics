"use strict";

var move = require("../logic/move");
var image = require("../image");
var model = require("../model");
var assert = require("../system/functions").assert;
var renderer = require("../renderer");
var animation = require("../renderer/animation");
var circBuff = require("../system/circularBuffer");
var constants = require("../constants");
var Timer = require("../system/timer").Timer;

var SPRITE_BOX_LENGTH = constants.TILE_BASE + constants.TILE_BASE;
var HALF_SPRITE_BOX_LENGTH = constants.TILE_BASE / 2;
var TILES_PER_MS = (8 * constants.TILE_BASE / 1000);

var removeUnitFromLayer;

var unitStartX;
var unitStartY;
var unitPosX;
var unitPosY;
var dustPostX;
var dustPostY;
var unitId;

var movePathIndex;
var moveCode;
var movePath = new circBuff.CircularBuffer(constants.MAX_SELECTION_RANGE);

var isClientVisible;

var animationShift;
var unitSprite;
var unitImage;
var dustSprite;
var dustImage;
var dustAnimTime;
var dustAnimStep;
var imageColorState;
var dustImageDirectionState;
var unitImageDirectionState;

var dustTimerTime = 0;
var dustTimerStep = 0;
var dustTimer = new Timer(3, 30);

var assertIsInIdle = function() {
  assert(unitId === constants.INACTIVE);
  assert(unitPosX === constants.INACTIVE);
  assert(unitPosY === constants.INACTIVE);
  assert(movePath.size === 0);
};

var updateImageStates = function() {
  moveCode = movePath.get(movePathIndex);
  switch (moveCode) {
    case move.MOVE_CODES_UP:
      dustImageDirectionState = image.Sprite.DIRECTION_UP;
      unitImageDirectionState = image.Sprite.UNIT_STATE_UP;
      break;

    case move.MOVE_CODES_RIGHT:
      dustImageDirectionState = image.Sprite.DIRECTION_RIGHT;
      unitImageDirectionState = image.Sprite.UNIT_STATE_RIGHT;
      break;

    case move.MOVE_CODES_DOWN:
      dustImageDirectionState = image.Sprite.DIRECTION_DOWN;
      unitImageDirectionState = image.Sprite.UNIT_STATE_DOWN;
      break;

    case move.MOVE_CODES_LEFT:
      dustImageDirectionState = image.Sprite.DIRECTION_LEFT;
      unitImageDirectionState = image.Sprite.UNIT_STATE_LEFT;
      break;
  }

  unitImage = unitSprite.getImage(imageColorState + unitImageDirectionState);
  dustImage = dustSprite.getImage(dustImageDirectionState);
};

var updateAnimation = function(delta) {
  // if (delta > 16) console.log("tooo slooooow " + delta);

  var next = delta * TILES_PER_MS;
  if (next < 1) next = 1;
  animationShift += next;

  // update move animation timer
  // dustTimer.evalTime(delta);
  dustTimerTime += delta;
  if (dustTimerTime > 30) {
    dustTimerStep += 1;
    dustTimerTime = 0;

    if (dustTimerStep === 3) {
      dustTimerStep = 0;
    }
  }

  // shift reached next tile
  if (animationShift > constants.TILE_BASE) {
    dustPostX = unitPosX;
    dustPostY = unitPosY;
    dustTimerStep = 0;
    dustTimerTime = 0;

    var oldMoveCode = moveCode;

    // update animation position
    switch (moveCode) {
      case move.MOVE_CODES_UP:
        unitPosY--;
        break;
      case move.MOVE_CODES_DOWN:
        unitPosY++;
        break;
      case move.MOVE_CODES_RIGHT:
        unitPosX++;
        break;
      case move.MOVE_CODES_LEFT:
        unitPosX--;
        break;
    }

    movePathIndex++;
    if (movePathIndex >= movePath.size) {
      return true;
    }

    updateImageStates();

    animationShift = (oldMoveCode != moveCode) ? 0 : (animationShift - constants.TILE_BASE);
  }

  return false;
};

// This function cleans the unit from the unit layer.
//
var eraseUnitFromUnitLayer = function() {
  renderer.setHiddenUnitId(unitId);
  renderer.renderUnitsOnScreen();
};

// This function cleans the last animation step picture from the effects layer.
//
var eraseLastPicture = function(ctx) {
  var x = (unitPosX - 2 - renderer.screenOffsetX);
  var y = (unitPosY - 2 - renderer.screenOffsetY);
  var w = (unitPosX + 2 - renderer.screenOffsetX);
  var h = (unitPosY + 2 - renderer.screenOffsetY);

  // check boundaries
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (w === model.mapWidth) w -= 1;
  if (h === model.mapHeight) h -= 1;

  ctx.clearRect(
    x * constants.TILE_BASE,
    y * constants.TILE_BASE, (w - x) * constants.TILE_BASE, (h - y) * constants.TILE_BASE
  );
};

// This function renders the current animation step picture to the effects layer.
//
var renderNewPicture = function(ctx) {

  // check client visibility for the unit and the given tile
  if (!isClientVisible && !model.mapData[unitPosX][unitPosY].visionClient <= 0) {
    return;
  }

  var tx = ((unitPosX - renderer.screenOffsetX) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;
  var ty = ((unitPosY - renderer.screenOffsetY) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;

  // ADD SHIFT
  switch (moveCode) {
    case move.MOVE_CODES_UP:
      ty -= animationShift;
      break;
    case move.MOVE_CODES_DOWN:
      ty += animationShift;
      break;
    case move.MOVE_CODES_LEFT:
      tx -= animationShift;
      break;
    case move.MOVE_CODES_RIGHT:
      tx += animationShift;
      break;
  }

  // drawing unit
  ctx.drawImage(
    unitImage,
    SPRITE_BOX_LENGTH * animation.indexUnitAnimation, 0,
    SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH,
    tx, ty,
    SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
  );

  // drawing dust
  if (dustPostX !== constants.INACTIVE) {
    ctx.drawImage(
      dustImage,
      SPRITE_BOX_LENGTH * dustAnimStep, 0,
      SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH, ((dustPostX - renderer.screenOffsetX) * constants.TILE_BASE) -
      HALF_SPRITE_BOX_LENGTH, ((dustPostY - renderer.screenOffsetY) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH,
      SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
    );
  }
};

exports.prepareMove = function(uid, x, y, unitMovePath) {
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
  unitStartX = x;
  unitStartY = y;
  unitId = uid;
  isClientVisible = unit.owner.clientVisible;
  unitSprite = image.sprites[unit.type.ID];

  dustTimerStep = 0;
  dustTimerTime = 0;

  circBuff.copyBuffer(unitMovePath, movePath);

  movePathIndex = 0;
  updateImageStates();
};

exports.state = {
  id: "ANIMATION_MOVE",
  next: "INGAME_IDLE",

  enter: function() {
    assertIsInIdle();

    renderer.layerEffects.clearAll();

    // grab dust image lazy
    if (!dustSprite) dustSprite = image.sprites["DUST"];

    removeUnitFromLayer = true;
  },

  exit: function() {
    renderer.layerEffects.clear();

    isClientVisible = constants.INACTIVE;
    unitId = constants.INACTIVE;
    unitPosX = constants.INACTIVE;
    unitPosY = constants.INACTIVE;
    unitStartX = constants.INACTIVE;
    unitStartY = constants.INACTIVE;
    dustPostX = -1;
    dustPostY = -1;
    movePathIndex = 0;
    animationShift = 0;
    dustAnimTime = -1;
    dustAnimStep = -1;
    unitSprite = null;
    movePath.clear();

    renderer.setHiddenUnitId(constants.INACTIVE);
    renderer.renderUnitsOnScreen();
  },

  update: [
    function(delta) {
      if (updateAnimation(delta)) {
        var vision = model.units[unitId].type.vision;

        renderer.renderFogCircle(unitStartX, unitStartY, vision);
        renderer.renderFogCircle(unitPosX, unitPosY, vision);

        renderer.renderFogBackgroundLayer();

        return true;
      }
      return false;
    }
  ],

  render: function(delta) {
    var ctx = renderer.layerEffects.getContext(0);

    // the unit has to be removed from the unit layer during the animation
    if (removeUnitFromLayer) {
      eraseUnitFromUnitLayer();
      removeUnitFromLayer = false;
    }

    eraseLastPicture(ctx);
    renderNewPicture(ctx);

    renderer.layerEffects.renderLayer(0);
  }
};

// reset data
exports.state.exit();
