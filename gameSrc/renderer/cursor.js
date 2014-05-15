/**
 * Erases the cursor to the UI layer.
 */
cwt.MapRenderer.eraseCursor = function () {
  cwt.Screen.layerUI.getContext().clearRect(
    (cwt.Cursor.x - cwt.Screen.offsetX - 1) * cwt.TILE_BASE,
    (cwt.Cursor.y - cwt.Screen.offsetY - 1) * cwt.TILE_BASE,
    cwt.TILE_BASE * 3,
    cwt.TILE_BASE * 3
  );
};

/**
 * Renders the cursor to the UI layer.
 */
cwt.MapRenderer.drawCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var cursorImg = cwt.Image.sprites.CURSOR.getImage(0);

  var h = cwt.TILE_BASE / 2;
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};