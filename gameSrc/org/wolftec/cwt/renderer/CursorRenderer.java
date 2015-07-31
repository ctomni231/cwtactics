package org.wolftec.cwt.renderer;

public class CursorRenderer {

//Renders the cursor to the UI layer.
//
exports.eraseCursor = function (layer, offsetX, offsetY, cursorX, cursorY) {
 var ctx = layer.getContext();
 var x = (cursorX - offsetX) * constants.TILE_BASE;
 var y = (cursorY - offsetY) * constants.TILE_BASE;

 // clear cursor at old position
 ctx.clearRect(
   x - constants.TILE_BASE,
   y - constants.TILE_BASE,
   constants.TILE_BASE * 3,
   constants.TILE_BASE * 3
 );
};

//Renders the cursor to the UI layer.
//
exports.renderCursor = function (layer, offsetX, offsetY, cursorX, cursorY) {
 var cursorImg = image.sprites["CURSOR"].getImage(0);
 var ctx = layer.getContext();
 var h = constants.TILE_BASE / 2;
 var x = (cursorX - offsetX) * constants.TILE_BASE;
 var y = (cursorY - offsetY) * constants.TILE_BASE;

 // render cursor at new position
 ctx.drawImage(cursorImg, x - h, y - h);
 ctx.drawImage(cursorImg, x + h + h, y + h + h);
 ctx.drawImage(cursorImg, x + h + h, y - h);
 ctx.drawImage(cursorImg, x - h, y + h + h);
};

//Shows the native browser cursor.
//
exports.showNativeCursor = function (layer) {
 layer.getLayer().style.cursor = "";
};

//Hides the native browser cursor.
//
exports.hideNativeCursor = function (layer) {
 layer.getLayer().style.cursor = "none";
};

exports.renderPath = function (layer, offsetX, offsetY, x, y, path) {
 var arrowSprite = image.sprites["ARROW"];
 var oX;
 var oY;
 var tX;
 var tY;
 var pic;
 for (var i = 0, e = path.size; i < e; i++) {

   oX = x;
   oY = y;

   switch (path.data[i]) {

     case move.MOVE_CODES_DOWN:
       y++;
       break;

     case move.MOVE_CODES_UP:
       y--;
       break;

     case move.MOVE_CODES_LEFT:
       x--;
       break;

     case move.MOVE_CODES_RIGHT:
       x++;
       break;
   }


   // NEXT TILE
   if (path.size <= i + 1) {
     tX = -1;
     tY = -1;
   } else {
     switch (path.data[i + 1]) {

       case move.MOVE_CODES_UP :
         tX = x;
         tY = y - 1;
         break;

       case move.MOVE_CODES_RIGHT :
         tX = x + 1;
         tY = y;
         break;

       case move.MOVE_CODES_DOWN :
         tX = x;
         tY = y + 1;
         break;

       case move.MOVE_CODES_LEFT :
         tX = x - 1;
         tY = y;
         break;
     }
   }

   // TARGET TILE
   if (tX == -1) {
     switch (path.data[i]) {

       case move.MOVE_CODES_UP:
         pic = arrowSprite.getImage(image.Sprite.DIRECTION_N);
         break;

       case move.MOVE_CODES_RIGHT :
         pic = arrowSprite.getImage(image.Sprite.DIRECTION_E);
         break;

       case move.MOVE_CODES_DOWN :
         pic = arrowSprite.getImage(image.Sprite.DIRECTION_S);
         break;

       case move.MOVE_CODES_LEFT :
         pic = arrowSprite.getImage(image.Sprite.DIRECTION_W);
         break;
     }
   } else {

     var diffX = Math.abs(tX - oX);
     var diffY = Math.abs(tY - oY);

     // IN THE MIDDLE OF THE WAY
     if (diffX === 2) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_WE);

     } else if (diffY === 2) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_NS);

     } else if ((tX < x && oY > y) || (oX < x && tY > y)) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_SW);

     } else if ((tX < x && oY < y) || (oX < x && tY < y)) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_NW);

     } else if ((tX > x && oY < y) || (oX > x && tY < y)) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_NE);

     } else if ((tX > x && oY > y) || (oX > x && tY > y)) {
       pic = arrowSprite.getImage(image.Sprite.DIRECTION_SE);

     } else {
       assert(false,
         "illegal move arrow state",
         "old (", oX, ",", oY, ")",
         "current (", x, ",", y, ")",
         "next (", tX, ",", tY, ")",
         "path (", path, ")"
       );

       continue;
     }
   }

   if (x >= 0 && y >= 0) {
     layer.getContext(0).drawImage(
       pic,
       (x - offsetX) * constants.TILE_BASE,
       (y - offsetY) * constants.TILE_BASE
     );
   }
 }
};
}
