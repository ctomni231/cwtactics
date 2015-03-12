package org.wolfTec.cwt.game.renderer.beans;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gamelogic.MoveCode;
import org.wolfTec.cwt.game.gamemodel.bean.GameRoundBean;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.wolfTecEngine.renderer.layer.GraphicLayer;
import org.wolfTec.wolfTecEngine.renderer.sprite.SpriteManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
public class FogLayerBean extends GraphicLayer {

  @Injected
  private SpriteManager sprites;
  
  @Injected
  private GameRoundBean gameround;

  private Canvas temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");

  @Override
  public int getZIndex() {
    return 2;
  }

  @Override
  public String getLayerCanvasId() {
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
      layer.clearRect((x - offsetX) * EngineGlobals.TILE_BASE, (y - offsetY)
          * EngineGlobals.TILE_BASE, w * EngineGlobals.TILE_BASE, h * EngineGlobals.TILE_BASE);
    }

    // render
    int oy = y;
    for (int xe = x + w; x < xe; x++) {
      y = oy;
      for (int ye = y + h; y < ye; y++) {
        int distance;

        if (circle) {
          distance = gameround.getDistance(x, y, cx, cy);
          if (!gameround.getMap().isValidPosition(x, y) || distance > range) {
            continue;
          }

          // clear position
          layer.clearRect((x - offsetX) * EngineGlobals.TILE_BASE, (y - offsetY)
              * EngineGlobals.TILE_BASE, EngineGlobals.TILE_BASE, EngineGlobals.TILE_BASE);
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

          int scx = sprites.isLongAnimatedSprite(tile.type.ID) ? EngineGlobals.TILE_BASE
              * animation.indexMapAnimation : 0;
          int scy = 0;
          int scw = EngineGlobals.TILE_BASE;
          int sch = EngineGlobals.TILE_BASE * 2;
          int tcx = (x - offsetX) * EngineGlobals.TILE_BASE;
          int tcy = (y - offsetY) * EngineGlobals.TILE_BASE - EngineGlobals.TILE_BASE;
          int tcw = EngineGlobals.TILE_BASE;
          int tch = EngineGlobals.TILE_BASE * 2;

          if (tcy < 0) {
            scy = scy + EngineGlobals.TILE_BASE;
            sch = sch - EngineGlobals.TILE_BASE;
            tcy = tcy + EngineGlobals.TILE_BASE;
            tch = tch - EngineGlobals.TILE_BASE;
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
    getContext(EngineGlobals.INACTIVE_ID).globalAlpha = 0.35;
    renderState(0);
    getContext(EngineGlobals.INACTIVE_ID).globalAlpha = 1;
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
