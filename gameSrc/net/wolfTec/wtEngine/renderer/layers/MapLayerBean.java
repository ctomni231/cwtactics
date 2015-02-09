package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Direction;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.Tile;
import net.wolfTec.wtEngine.renderer.AnimatedLayer;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.SpriteIndexBean;
import net.wolfTec.wtEngine.renderer.SpriteManagerBean;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

@Bean public class MapLayerBean extends ScreenLayer implements AnimatedLayer {

  @Injected private SpriteManagerBean sprites;
  @Injected private SpriteIndexBean spriteIndexes;
  @Injected private GameRoundBean gameround;

  @Override public int getSubStates() {
    return 8;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Map";
  }

  @Override public void onScreenShift(Direction dir, int offsetX, int offsetY, int amount, int scale) {

    // calculate meta data for shift
    int sx = 0;
    int sy = 0;
    int scx = 0;
    int scy = 0;
    int w = cv.width;
    int h = cv.height;
    switch (dir) {
      case LEFT:
        scx += Constants.TILE_BASE;
        w -= Constants.TILE_BASE;
        break;

      case RIGHT:
        sx += Constants.TILE_BASE;
        w -= Constants.TILE_BASE;
        break;

      case UP:
        scy += Constants.TILE_BASE;
        h -= Constants.TILE_BASE;
        break;

      case DOWN:
        sy += Constants.TILE_BASE;
        h -= Constants.TILE_BASE;
        break;
    }

    // update background layers
    int n = 0;
    while (n < 8) {
      getContext(n).drawImage(getLayer(n), scx, scy, w, h, sx, sy, w, h);

      n++;
    }
  }

  @Override public void onSetScreenPosition(int x, int y, int offsetX, int offsetY) {

  }

  @Override public int getZIndex() {
    return 1;
  }

  /** */
  private void renderTile(int x, int y) {
    int offsetX = screenOffsetX;
    int offsetY = screenOffsetY;

    renderTiles(cv, offsetX, offsetY, x, y, 1, 1, false);

    // draw overlay of the bottom tile
    if (y < gameround.getMapHeight() - 1) {
      renderTiles(cv, offsetX, offsetY, x, y + 1, 1, 1, true);
    }
  }

  /** */
  private void renderTileOverlayRow() {
    renderTiles(screenOffsetX, screenOffsetY, screenOffsetX, screenOffsetY + 1,
        (gameround.getMapWidth() < Constants.SCREEN_WIDTH) ? gameround.getMapWidth()
            : Constants.SCREEN_WIDTH, 1, true);
  }

  /** */
  private void renderTiles(int x, int oy, int w, int h, int offsetX, int offsetY,
      boolean overlayDraw) {
    CanvasRenderingContext2D ctx;
    int scx;
    int scy;
    int scw;
    int sch;
    int tcx;
    int tcy;
    int tcw;
    int tch;
    Tile tile;
    Element sprite = null;
    Element propSprite = null;
    int state;

    for (int xe = x + w; x < xe; x++) {
      for (int y = oy, ye = y + h; y < ye; y++) {
        tile = gameround.getMap().getTile(x, y);
        sprite = sprites.getSprite(tile.type.ID).getImage(tile.variant * spriteIndexes.TILE_STATES);

        // grab property status before loop (calculate it one instead of eight
        // times)
        if (tile.property != null) {
          state = Constants.INACTIVE_ID;

          if (tile.property.owner != null) {
            switch (tile.property.owner.id) {
              case 0:
                state = spriteIndexes.PROPERTY_RED;
                break;

              case 1:
                state = spriteIndexes.PROPERTY_BLUE;
                break;

              case 2:
                state = spriteIndexes.PROPERTY_GREEN;
                break;

              case 3:
                state = spriteIndexes.PROPERTY_YELLOW;
                break;
            }
          } else {
            state = spriteIndexes.PROPERTY_NEUTRAL;
          }

          propSprite = sprites.getSprite(tile.property.type.ID).getImage(state);
        }

        // render all phases
        int n = 0;
        while (n < 8) {
          ctx = getContext(n);

          scx = sprites.isLongAnimatedSprite(tile.type.ID) ? Constants.TILE_BASE * n : 0;
          scy = 0;
          scw = Constants.TILE_BASE;
          sch = Constants.TILE_BASE * 2;
          tcx = (x - offsetX) * Constants.TILE_BASE;
          tcy = (y - offsetY) * Constants.TILE_BASE - Constants.TILE_BASE;
          tcw = Constants.TILE_BASE;
          tch = Constants.TILE_BASE * 2;

          if (tcy < 0) {
            scy = scy + Constants.TILE_BASE;
            sch = sch - Constants.TILE_BASE;
            tcy = tcy + Constants.TILE_BASE;
            tch = tch - Constants.TILE_BASE;
          }

          if (overlayDraw) {
            sch = sch - Constants.TILE_BASE;
            tch = tch - Constants.TILE_BASE;
          }

          // render tile
          ctx.drawImage(sprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);

          // render property
          if (tile.property != null) {
            scx = Constants.TILE_BASE * (JSGlobal.parseInt(n / 2, 10));

            ctx.drawImage(propSprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);
          }

          n++;
        }
      }
    }
  }
}
