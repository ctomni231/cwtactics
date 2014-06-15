"use strict";

/**
 * Renders the cursor to the UI layer.
 */
cwt.MapRenderer.eraseCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

  // clear cursor at old position
  ctx.clearRect(
    x - cwt.TILE_BASE,
    y - cwt.TILE_BASE,
    cwt.TILE_BASE * 3,
    cwt.TILE_BASE * 3
  );
};

/**
 * Renders the cursor to the UI layer.
 */
cwt.MapRenderer.renderCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var cursorImg = cwt.Image.sprites.CURSOR.getImage(0);
  var h = cwt.TILE_BASE / 2;
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

  // render cursor at new position
  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};

// **unitAnimationHalfStep_ (private)**
//
cwt.MapRenderer.unitAnimationHalfStep_ = false;

// **curTime_ (private)**
//
cwt.MapRenderer.curTime_ = 0;

// **indexUnitAnimation (readOnly)**
//
cwt.MapRenderer.indexUnitAnimation = 0;

// **indexMapAnimation (readOnly)**
//
cwt.MapRenderer.indexMapAnimation = 0;

// **indexFocus (readOnly)**
//
cwt.MapRenderer.indexFocus = 0;

// **indexFocusTime (readOnly)**
//
cwt.MapRenderer.indexFocusTime = 0;

/**
 *
 * @param {number} delta
 */
cwt.MapRenderer.evaluateCycle = function (delta, focusActive) {
  var index;

  if (focusActive) {
    this.indexFocusTime += delta;

    if (this.indexFocusTime >= 120) {
      this.indexFocusTime = 0;

      this.indexFocus++;
      if (this.indexFocus >= 7) {
        this.indexFocus = 0;
      }

      cwt.Screen.layerFocus.renderLayer(this.indexFocus);
    }
  }

  this.curTime_ += delta;
  if (this.curTime_ > 150) {
    this.curTime_ = 0;

    // calc unit animation layer step
    this.unitAnimationHalfStep_ = !this.unitAnimationHalfStep_;
    if (!this.unitAnimationHalfStep_) {

      index = this.indexUnitAnimation + 1;
      if (index === 3) {
        index = 0;
      }

      // render unit animation layer
      cwt.Screen.layerUnit.renderLayer(index);
      this.indexUnitAnimation = index;
    }

    // map animation layer
    index = this.indexMapAnimation + 1;
    if (index === 8) {
      index = 0;
    }

    // render map animation layer
    cwt.Screen.layerMap.renderLayer(index);
    this.indexMapAnimation = index;
  }
};
cwt.MapRenderer.renderFocusOnScreen = function (selection) {
  var x = cwt.Screen.offsetX;
  var y = cwt.Screen.offsetY;
  var w = (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH;
  var h = (cwt.Map.height < cwt.SCREEN_HEIGHT) ? cwt.Map.height : cwt.SCREEN_HEIGHT;

  this.renderFocus(x, y, w, h, selection);
};

cwt.MapRenderer.renderFocus = function (ox, oy, w, h, selection) {
  var sprite = cwt.Image.sprites.FOCUS.getImage(0);

  var n = 0;
  while (n < 7) {
    var effects = cwt.Screen.layerFocus;

    effects.clear(n);
    var ctx = effects.getContext(n);

    ctx.globalAlpha = 0.6;

    var x = ox;
    for (var xe = x + w; x < xe; x++) {
      var y = oy;
      for (var ye = y + h; y < ye; y++) {

        if (selection.getValue(x, y) >= 0) {

          var scx = cwt.TILE_BASE * n;
          var scy = 0;
          var scw = cwt.TILE_BASE;
          var sch = cwt.TILE_BASE;
          var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
          var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE;
          var tcw = cwt.TILE_BASE;
          var tch = cwt.TILE_BASE;

          ctx.drawImage(
            sprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
          );
        }
      }
    }

    ctx.globalAlpha = 1;

    n++;
  }
};

cwt.MapRenderer.shiftFocus = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerFocus, 7, false);
};/**
 *
 * @namespace
 */
cwt.MapRenderer = {};

cwt.MapRenderer.shiftLayer = function (code, layer, steps, selfDraw) {
  var tmpCanvas = this.getTempCanvas();
  var tmpContext = tmpCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = layer.w;
  var h = layer.h;
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      scx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      sx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_UP:
      scy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      sy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < steps) {

    if (selfDraw === true) {
      layer.getContext(n).drawImage(
        layer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
      );

    } else {
      tmpContext.clearRect(0, 0, layer.w, layer.h);

      // copy visible content to temp canvas
      tmpContext.drawImage(
        layer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
      )

      // clear original canvas
      layer.clear(n);

      // copy visible content back to the original canvas
      layer.getContext(n).drawImage(tmpCanvas, 0, 0);

    }

    n++;
  }
};/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param range
 */
cwt.MapRenderer.renderFogCircle = function (x, y, range) {
  this.renderFogRect(x, y, range, range, true);
};

/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param {boolean?} circle
 */
cwt.MapRenderer.renderFogRect = function (x, y, w, h, circle) {
  if (arguments.length === 4) circle = false;
  var data = cwt.Map.data;
  var layer = cwt.Screen.layerFog.getContext(0);
  var cx, cy, range;

  if (circle) {

    // prepare meta data for the circle center and the pseudo-circle search field
    cx = x;
    cy = y;
    x -= w;
    y -= h;
    range = w;
    w += w;
    h += w;

  } else {

    // clear area in background layer as rectangle only in rectangle mode
    layer.clearRect(
      (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
      (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
      w * cwt.TILE_BASE,
      h * cwt.TILE_BASE
    );
  }

  // render
  var oy = y;
  for (var xe = x + w; x < xe; x++) {
    y = oy;
    for (var ye = y + h; y < ye; y++) {
      var distance;

      if (circle) {
        distance = cwt.Map.getDistance(x, y, cx, cy);
        if (!cwt.Map.isValidPosition(x, y) || distance) {
          continue;
        }

        // clear position
        layer.clearRect(
          (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
          (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
          cwt.TILE_BASE,
          cwt.TILE_BASE
        );
      }

      var tile = data[x][y];
      if (tile.visionClient === 0) {

        var sprite = null;
        if (tile.property) {
          sprite = cwt.Image.sprites[tile.property.type.ID].getImage(
            cwt.Sprite.PROPERTY_SHADOW_MASK
          );
        } else {
          sprite = cwt.Image.sprites[tile.type.ID].getImage(
            tile.variant * cwt.Sprite.TILE_STATES + cwt.Sprite.TILE_SHADOW
          );
        }

        var scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        var scy = 0;
        var scw = cwt.TILE_BASE;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        var tcw = cwt.TILE_BASE;
        var tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        layer.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );
      } else {

        // fix overlays on all tiles that are at the max range in the circle mode
        if (circle) {
          if (distance === range) {

            // top check
            if (y <= cy) {
              this.fixOverlayFog_(x, y, true);
            }

            // bottom check
            if (y >= cy) {
              this.fixOverlayFog_(x, y, false);
            }
          }
        }
      }
    }
  }

  // fix overlay top and bottom in the rectangle mode
  if (!circle) {

  }

  this.renderFogBackgroundLayer();
};

cwt.MapRenderer.fixOverlayFog_ = function (x, y, isTop) {
  if (isTop) {

  } else {

  }
};

/**
 *
 */
cwt.MapRenderer.renderFogBackgroundLayer = function () {
  cwt.Screen.layerFog.getContext().globalAlpha = 0.35;
  cwt.Screen.layerFog.renderLayer(0);
  cwt.Screen.layerFog.getContext().globalAlpha = 1;
};

/**
 *
 * Note: this one clears the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftFog = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerFog, 1, false);
  this.renderFogBackgroundLayer();
};/**
 *
 * @param {number} x
 * @param {number} y
 */
cwt.MapRenderer.renderTile = function (x, y) {
  this.renderTiles(x,y,1,1,false);

  // draw overlay of the bottom tile
  if (y < cwt.Map.height-1) {
    this.renderTiles(x,y+1,1,1,true);
  }
};

cwt.MapRenderer.renderTileOverlayRow = function () {
  cwt.MapRenderer.renderTiles(
    cwt.Screen.offsetX,
    cwt.Screen.offsetY+1,
    (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH,
    1,
    true
  );
};

cwt.MapRenderer.renderTiles = function (x, oy, w, h, overlayDraw) {
  if (arguments.length === 4) overlayDraw = false;
  var mapData = cwt.Map.data;
  var mapLayer = cwt.Screen.layerMap;
  var ctx;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;
  var tile;
  var sprite, propSprite;
  var state;

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      tile = mapData[x][y];
      sprite = cwt.Image.sprites[tile.type.ID].getImage(tile.variant * cwt.Sprite.TILE_STATES);

      // grab property status before loop (calc it one instead of eight times)
      if (tile.property) {
        if (tile.property.owner) {
          switch (tile.property.owner.id) {
            case 0:
              state = cwt.Sprite.PROPERTY_RED;
              break;

            case 1:
              state = cwt.Sprite.PROPERTY_BLUE;
              break;

            case 2:
              state = cwt.Sprite.PROPERTY_GREEN;
              break;

            case 3:
              state = cwt.Sprite.PROPERTY_YELLOW;
              break;
          }
        } else {
          state = cwt.Sprite.PROPERTY_NEUTRAL;
        }

        propSprite = cwt.Image.sprites[tile.property.type.ID].getImage(state);
      }

      // render all phases
      var n = 0;
      while (n < 8) {
        ctx = mapLayer.getContext(n);

        scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        scy = 0;
        scw = cwt.TILE_BASE;
        sch = cwt.TILE_BASE * 2;
        tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        tcw = cwt.TILE_BASE;
        tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        if (overlayDraw) {
          sch = sch - cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        // render tile
        ctx.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );

        // render property
        if (tile.property) {
          scx = cwt.TILE_BASE * (parseInt(n / 2, 10));

          ctx.drawImage(
            propSprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
          );
        }

        n++;
      }
    }
  }
};

/**
 *
 * Note: this one does not clear the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftTiles = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerMap, 8, true);
};/**
 *
 * NOTE: does not clear the area before update
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
cwt.MapRenderer.renderUnits = function (x, oy, w, h) {
  var mapData = cwt.Map.data;
  var layer = cwt.Screen.layerUnit;
  var halfTileBase = parseInt(cwt.TILE_BASE / 2,10);

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      var tile = mapData[x][y];
      if (tile.visionClient === 0) continue;

      var unit = tile.unit;
      if (!unit) continue;

      var state;
      switch (unit.owner.id) {
        case 0:
          state = cwt.Sprite.UNIT_RED;
          break;

        case 1:
          state = cwt.Sprite.UNIT_BLUE;
          break;

        case 2:
          state = cwt.Sprite.UNIT_GREEN;
          break;

        case 3:
          state = cwt.Sprite.UNIT_YELLOW;
          break;
      }

      // inverted ?
      if (unit.owner.id % 2 === 0) {
        state += cwt.Sprite.UNIT_STATE_IDLE_INVERTED;
      }

      var sprite = cwt.Image.sprites[unit.type.ID].getImage(state);
      var n = 0;
      while (n < 3) {
        var ctx = layer.getContext(n);

        var scx = (cwt.TILE_BASE * 2) * n;
        var scy = 0;
        var scw = cwt.TILE_BASE * 2;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x-cwt.Screen.offsetX) * cwt.TILE_BASE - halfTileBase;
        var tcy = (y-cwt.Screen.offsetY) * cwt.TILE_BASE - halfTileBase;
        var tcw = cwt.TILE_BASE + cwt.TILE_BASE;
        var tch = cwt.TILE_BASE + cwt.TILE_BASE;

        ctx.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );

        n++;
      }

    }
  }
};

/**
 *
 * Note: this one clears the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftUnits = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerUnit, 3, false);
};cwt.MapRenderer.MENU_ELEMENTS_MAX = 10;

/**
 * @constant
 * @type {number}
 */
cwt.MapRenderer.MENU_ENTRY_WIDTH = 10 * cwt.TILE_BASE;
/**
 * @constant
 * @type {number}
 */
cwt.MapRenderer.MENU_ENTRY_HEIGHT = 2 * cwt.TILE_BASE;

cwt.MapRenderer.layoutGenericMenu_ = new cwt.UIPositionableButtonGroup();

cwt.MapRenderer.$afterLoad = function () {

  // generate elements
  cwt.repeat(cwt.MapRenderer.MENU_ELEMENTS_MAX, function (i) {
    cwt.MapRenderer.layoutGenericMenu_.addElement(new cwt.UIField(
      0,
      i * 32,
      cwt.MapRenderer.MENU_ENTRY_WIDTH,
      cwt.MapRenderer.MENU_ENTRY_HEIGHT,
      "KEY_" + i,
      8,
      cwt.UIField.STYLE_NORMAL,

      // logic will be handled by the state machine
      cwt.emptyFunction
    ))
  });
};

/**
 * Renders the menu to the background layer of the UI canvas.
 *
 * @param {cwt.InterfaceMenu} menu
 */
cwt.MapRenderer.prepareMenu = function (menu) {
  var gfxMenu = cwt.MapRenderer.layoutGenericMenu_;
  var select = menu.getSelectedIndex();
  var numElements = menu.getSize();

  gfxMenu.setMenuPosition(
    parseInt((cwt.Screen.width / 2) - cwt.MapRenderer.MENU_ENTRY_WIDTH / 2, 10),
    parseInt((cwt.Screen.height / 2) - ((numElements * cwt.MapRenderer.MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i=0; i < cwt.MapRenderer.MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = cwt.Localization.forKey(menu.getContent(i));

      // set style
      gfxMenu.elements[i].style = (
        (numElements === 1 ? cwt.UIField.STYLE_NORMAL :
        (i === 0 ? cwt.UIField.STYLE_NEW :
        (i === numElements-1 ? cwt.UIField.STYLE_ESW : cwt.UIField.STYLE_EW)))
      );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  this.renderMenu(menu);
};

cwt.MapRenderer.renderMenu = function (menu) {
  cwt.MapRenderer.layoutGenericMenu_.draw(cwt.Screen.layerUI.getContext(0));
};/**
 *
 */
cwt.MapRenderer.renderScreen = function () {
  var time;

  if (cwt.DEBUG) time = (new Date()).getTime();

  var x = cwt.Screen.offsetX;
  var y = cwt.Screen.offsetY;
  var w = (cwt.Map.width < cwt.SCREEN_WIDTH)? cwt.Map.width : cwt.SCREEN_WIDTH;
  var h = (cwt.Map.height < cwt.SCREEN_HEIGHT)? cwt.Map.height : cwt.SCREEN_HEIGHT;

  this.renderTiles(x, y, w, h);
  this.renderUnits(x, y, w, h);

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);

  this.renderFogRect(x, y, w, h);

  if (cwt.DEBUG) console.log("rendered the complete screen (" + ((new Date()).getTime() - time) + "ms)");
};

/**
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftMap = function (code, selection) {
  var time;

  if (cwt.DEBUG) time = (new Date()).getTime();

  var fx = cwt.Screen.offsetX;
  var fy = cwt.Screen.offsetY;
  var fw = cwt.SCREEN_WIDTH;
  var fh = cwt.SCREEN_HEIGHT;

  // extract needed data for the shift process
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      fx += cwt.SCREEN_WIDTH - 1;
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_UP:
      fy += cwt.SCREEN_HEIGHT - 1;
      fh = 1;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      fh = 1;
      break;
  }

  // shift screen
  this.shiftTiles(code);
  this.shiftUnits(code);
  this.shiftFog(code);
  if (cwt.Gameflow.globalData.focusActive) this.shiftFocus(code);

  // fill created hole
  this.renderTiles(fx, fy, fw, fh);
  this.renderUnits(fx, fy, fw, fh);
  this.renderFogRect(fx, fy, fw, fh);
  if (cwt.Gameflow.globalData.focusActive) this.renderFocus(fx, fy, fw, fh, selection);

  // fix overlay when screen moves down
  if (code === cwt.Move.MOVE_CODES_DOWN) {
    this.renderTileOverlayRow();
  }

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);
  if (cwt.Gameflow.globalData.focusActive) cwt.Screen.layerFocus.renderLayer(this.indexFocus);

  if (cwt.DEBUG) console.log("shifted the screen (" + ((new Date()).getTime() - time) + "ms)");
};/**
 * @type {null|HTMLCanvasElement}
 * @private
 */
cwt.MapRenderer.tmpCanv_ = null;

/**
 * Returns a temporary canvas (singleton)
 *
 * @return {HTMLCanvasElement}
 */
cwt.MapRenderer.getTempCanvas = function () {
  if (!this.tmpCanv_) {
    this.tmpCanv_ = document.createElement("canvas");
    this.tmpCanv_.width = cwt.Screen.width;
    this.tmpCanv_.height = cwt.Screen.height;
  }

  return this.tmpCanv_;
};