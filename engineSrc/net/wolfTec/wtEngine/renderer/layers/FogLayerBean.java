package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.gamelogic.MoveCode;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.Tile;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.SpriteIndexBean;
import net.wolfTec.wtEngine.renderer.SpriteManagerBean;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

@Bean public class FogLayerBean extends ScreenLayer {

  @Injected private SpriteManagerBean sprites;
  @Injected private SpriteIndexBean spriteIndexes;
  @Injected private GameRoundBean gameround;

  private Canvas temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");

  @Override public int getZIndex() {
    return 2;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Fog";
  }

  public void fixOverlayFog_(int x, int y, boolean isTop) {
    if (isTop) {
    } else {
    }
  }

  /**
   * Note: one clears the area before action
   */
  public void renderFogCircle(int x, int y, int range) {
    renderFogRect(x, y, range, range, true);
  }

  /**
   * Note: one clears the area before action
   */
  public void renderFogRect(int x, int y, int w, int h, boolean circle) {
    int offsetX = screenOffsetX;
    int offsetY = screenOffsetY;
    CanvasRenderingContext2D layer = getContext(0);
    int cx;
    int cy;
    int range;

    if (circle) {

      // prepare meta data for the circle center and the pseudo-circle search
      // field
      cx = x;
      cy = y;
      x -= w;
      y -= h;
      range = w;
      w += w + 1;
      h += w + 1;

    } else {

      // clear area in background layer as rectangle only in rectangle mode
      layer.clearRect((x - offsetX) * Constants.TILE_BASE, (y - offsetY) * Constants.TILE_BASE, w
          * Constants.TILE_BASE, h * Constants.TILE_BASE);
    }

    // render
    int oy = y;
    for (int xe = x + w; x < xe; x++) {
      y = oy;
      for (int ye = y + h; y < ye; y++) {
        int distance;

        if (circle) {
          distance = gameround.getMap().getDistance(x, y, cx, cy);
          if (!gameround.getMap().isValidPosition(x, y) || distance > range) {
            continue;
          }

          // clear position
          layer.clearRect((x - offsetX) * Constants.TILE_BASE, (y - offsetY) * Constants.TILE_BASE,
              Constants.TILE_BASE, Constants.TILE_BASE);
        }

        Tile tile = data[x][y];
        if (tile.visionClient == 0) {

          Canvas sprite = null;
          if (tile.property != null) {
            sprite = sprites.getSprite(tile.property.type.ID).getImage(
                spriteIndexes.PROPERTY_SHADOW_MASK);
          } else {
            sprite = sprites.getSprite(tile.type.ID).getImage(
                tile.variant * spriteIndexes.TILE_STATES + spriteIndexes.TILE_SHADOW);
          }

          int scx = sprites.isLongAnimatedSprite(tile.type.ID) ? Constants.TILE_BASE
              * animation.indexMapAnimation : 0;
          int scy = 0;
          int scw = Constants.TILE_BASE;
          int sch = Constants.TILE_BASE * 2;
          int tcx = (x - offsetX) * Constants.TILE_BASE;
          int tcy = (y - offsetY) * Constants.TILE_BASE - Constants.TILE_BASE;
          int tcw = Constants.TILE_BASE;
          int tch = Constants.TILE_BASE * 2;

          if (tcy < 0) {
            scy = scy + Constants.TILE_BASE;
            sch = sch - Constants.TILE_BASE;
            tcy = tcy + Constants.TILE_BASE;
            tch = tch - Constants.TILE_BASE;
          }

          layer.drawImage(sprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);
        } else {

          // fix overlays on all tiles that are at the max range in the circle
          // mode
          if (circle) {
            if (distance == range) {

              // top check
              if (y <= cy) {
                fixOverlayFog_(x, y, true);
              }

              // bottom check
              if (y >= cy) {
                fixOverlayFog_(x, y, false);
              }
            }
          }
        }
      }
    }

    // fix overlay top and bottom in the rectangle mode
    if (!circle) {

    }

    renderFogBackgroundLayer();
  }

  /**
   * Note: one clears the area before action
   */
  public void renderFogBackgroundLayer() {
    getContext(Constants.INACTIVE_ID).globalAlpha = 0.35;
    renderState(0);
    getContext(Constants.INACTIVE_ID).globalAlpha = 1;
  }

  /**
   * Note: one clears the layer before action
   */
  public void shiftFog(MoveCode code) {
    CanvasRenderingContext2D tmpContext = temporaryCanvas.getContext("2d");

    // calculate meta data for shift
    int sx = 0;
    int sy = 0;
    int scx = 0;
    int scy = 0;
    int w = cv.width;
    int h = cv.height;
    switch (code) {
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

    tmpContext.clearRect(0, 0, cv.width, cv.height);

    // copy visible content to temp canvas
    tmpContext.drawImage(getLayer(0), scx, scy, w, h, sx, sy, w, h);

    // clear original canvas
    clear(0);

    // copy visible content back to the original canvas
    getContext(0).drawImage(temporaryCanvas, 0, 0);

    renderFogBackgroundLayer();
  }
}
