// Renders the cursor to the UI layer.
//
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

// Renders the cursor to the UI layer.
//
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