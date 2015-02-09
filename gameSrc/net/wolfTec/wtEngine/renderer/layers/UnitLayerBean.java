package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Direction;
import net.wolfTec.wtEngine.model.GameMapBean;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.model.Tile;
import net.wolfTec.wtEngine.model.Unit;
import net.wolfTec.wtEngine.renderer.AnimatedLayer;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.Sprite;
import net.wolfTec.wtEngine.renderer.SpriteIndexBean;
import net.wolfTec.wtEngine.renderer.SpriteManagerBean;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

@Bean public class UnitLayerBean extends ScreenLayer implements AnimatedLayer {

  @Injected private SpriteManagerBean sprites;
  @Injected private SpriteIndexBean spriteIndexes;
  @Injected private GameRoundBean gameround;

  private Canvas temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");

  @Override public int getZIndex() {
    return 3;
  }
  
  @Override public int getSubStates() {
    return 3;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Unit";
  }
  
  private int hiddenUnitId;

  /** */
  public void setHiddenUnitId(int unitId) {
    hiddenUnitId = unitId;
  }
  
  @Override public boolean isDoubleStepAnimated() {
    return true;
  }

  @Override public void onScreenShift(Direction dir, int offsetX, int offsetY, int amount, int scale) {
    CanvasRenderingContext2D tmpContext = temporaryCanvas.getContext("2d");

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
    while (n < 3) {
      tmpContext.clearRect(0, 0, cv.width, cv.height);

      // copy visible content to temporary canvas
      tmpContext.drawImage(getLayer(n), scx, scy, w, h, sx, sy, w, h);

      // clear original canvas
      clear(n);

      // copy visible content back to the original canvas
      getContext(n).drawImage(temporaryCanvas, 0, 0);

      n++;
    }
  }

  @Override public void onSetScreenPosition(int x, int oy, int offsetX, int offsetY) {
    int halfTileBase = JSGlobal.parseInt(Constants.TILE_BASE / 2, 10);
    Unit hiddenUnit = (hiddenUnitId != Constants.INACTIVE_ID ? gameround.getUnit(hiddenUnitId) : null);

    for (int xe = x + w; x < xe; x++) {
      for (int y = oy, ye = y + h; y < ye; y++) {
        Tile tile = gameround.getMap().getTile(x, y);
        if (tile.visionClient == 0) {
          continue;
        }

        Unit unit = tile.unit;
        if (unit == null || hiddenUnit == unit) continue;

        Sprite unitSprite = sprites.getSprite(unit.getType().ID);

        // grab color
        int state = Constants.INACTIVE_ID;
        switch (unit.getOwner().id) {
          case 0:
            state = spriteIndexes.UNIT_RED;
            break;

          case 1:
            state = spriteIndexes.UNIT_BLUE;
            break;

          case 2:
            state = spriteIndexes.UNIT_GREEN;
            break;

          case 3:
            state = spriteIndexes.UNIT_YELLOW;
            break;
        }

        // do we need to render an inverted image
        int shadowState = Constants.INACTIVE_ID;
        if (unit.getOwner().id % 2 == 0) {
          state += spriteIndexes.UNIT_STATE_IDLE_INVERTED;
          shadowState = spriteIndexes.UNIT_SHADOW_MASK + spriteIndexes.UNIT_STATE_IDLE_INVERTED;
        } else {
          shadowState = spriteIndexes.UNIT_SHADOW_MASK;
        }
        Element shadowSprite = unitSprite.getImage(shadowState);

        boolean used = !unit.isCanAct();
        Element sprite = unitSprite.getImage(state);
        int n = 0;
        while (n < 3) {
          CanvasRenderingContext2D ctx = getContext(n);

          int scx = (Constants.TILE_BASE * 2) * n;
          int scy = 0;
          int scw = Constants.TILE_BASE * 2;
          int sch = Constants.TILE_BASE * 2;
          int tcx = (x - offsetX) * Constants.TILE_BASE - halfTileBase;
          int tcy = (y - offsetY) * Constants.TILE_BASE - halfTileBase;
          int tcw = Constants.TILE_BASE + Constants.TILE_BASE;
          int tch = Constants.TILE_BASE + Constants.TILE_BASE;

          ctx.drawImage(sprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);

          if (used) {
            ctx.globalAlpha = 0.35;
            ctx.drawImage(shadowSprite, scx, scy, scw, sch, tcx, tcy, tcw, tch);
            ctx.globalAlpha = 1;
          }

          n++;
        }

      }
    }
  }
  
  @Override public void onFullScreenRender() {
    int x = screenOffsetX;
    int y = screenOffsetY;
    int w = (gameround.getMapWidth() < Constants.SCREEN_WIDTH) ? gameround.getMapWidth() : Constants.SCREEN_WIDTH;
    int h = (gameround.getMapHeight() < Constants.SCREEN_HEIGHT) ? gameround.getMapHeight() : Constants.SCREEN_HEIGHT;

    clearAll();

    renderUnits(x, y, w, h);
    renderLayer(indexUnitAnimation);
  }
}