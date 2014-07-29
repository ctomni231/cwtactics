var constants = require("../constants");

// Renders the cursor to the UI layer.
//
exports.eraseCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * constants.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * constants.TILE_BASE;

  // clear cursor at old position
  ctx.clearRect(
    x - constants.TILE_BASE,
    y - constants.TILE_BASE,
    constants.TILE_BASE * 3,
    constants.TILE_BASE * 3
  );
};

// Renders the cursor to the UI layer.
//
exports.renderCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var cursorImg = cwt.Image.sprites.CURSOR.getImage(0);
  var h = constants.TILE_BASE / 2;
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * constants.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * constants.TILE_BASE;

  // render cursor at new position
  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};