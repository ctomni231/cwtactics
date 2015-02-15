package org.wolfTec.cwt.game.renderer.layers;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.Direction;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.renderer.AnimatedLayer;
import org.wolfTec.cwt.game.renderer.ScreenLayer;
import org.wolfTec.cwt.game.renderer.SpriteIndexBean;
import org.wolfTec.cwt.game.renderer.SpriteManagerBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;

@Bean
public class MapLayerBean extends ScreenLayer implements AnimatedLayer {

  @Injected
  private SpriteManagerBean sprites;
  @Injected
  private SpriteIndexBean spriteIndexes;
  @Injected
  private GameRoundBean gameround;

  @Override
  public int getSubStates() {
    return 8;
  }

  @Override
  public String getLayerCanvasId() {
    return "canvas_layer_Map";
  }

  @Override
  public void onScreenShift(Direction dir, int offsetX, int offsetY, int amount, int scale) {

    // calculate meta data for shift
    int sx = 0;
    int sy = 0;
    int scx = 0;
    int scy = 0;
    int w = cv.width;
    int h = cv.height;
    switch (dir) {
      case LEFT:
        scx += EngineGlobals.TILE_BASE;
        w -= EngineGlobals.TILE_BASE;
        break;

      case RIGHT:
        sx += EngineGlobals.TILE_BASE;
        w -= EngineGlobals.TILE_BASE;
        break;

      case UP:
        scy += EngineGlobals.TILE_BASE;
        h -= EngineGlobals.TILE_BASE;
        break;

      case DOWN:
        sy += EngineGlobals.TILE_BASE;
        h -= EngineGlobals.TILE_BASE;
        break;
    }

    // update background layers
    int n = 0;
    while (n < 8) {
      getContext(n).drawImage(getLayer(n), scx, scy, w, h, sx, sy, w, h);

      n++;
    }
  }

  @Override
  public void onSetScreenPosition(int x, int y, int offsetX, int offsetY) {

  }

  @Override
  public int getZIndex() {
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
        (gameround.getMapWidth() < EngineGlobals.SCREEN_WIDTH) ? gameround.getMapWidth()
            : EngineGlobals.SCREEN_WIDTH, 1, true);
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
          state = EngineGlobals.INACTIVE_ID;

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

          scx = sprites.isLongAnimatedSprite(tile.type.ID) ? EngineGlobals.TILE_BASE * n : 0;
          scy = 0;
          scw = EngineGlobals.TILE_BASE;
          sch = EngineGlobals.TILE_BASE * 2;
          tcx = (x - offsetX) * EngineGlobals.TILE_BASE;
          tcy = (y - offsetY) * EngineGlobals.TILE_BASE - EngineGlobals.TILE_BASE;
          tcw = EngineGlobals.TILE_BASE;
          tch = EngineGlobals.TILE_BASE * 2;

          if (tcy < 0) {
            scy = scy + EngineGlobals.TILE_BASE;
            sch = sch - EngineGlobals.TILE_BASE;
            tcy = tcy + EngineGlobals.TILE_BASE;
            tch = tch - EngineGlobals.TILE_BASE;
          }

          if (overlayDraw) {
            sch = sch - EngineGlobals.TILE_BASE;
            tch = tch - EngineGlobals.TILE_BASE;
          }

          // render tile
          ctx.drawImage(sprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);

          // render property
          if (tile.property != null) {
            scx = EngineGlobals.TILE_BASE * (JSGlobal.parseInt(n / 2, 10));

            ctx.drawImage(propSprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);
          }

          n++;
        }
      }
    }
  }
}
