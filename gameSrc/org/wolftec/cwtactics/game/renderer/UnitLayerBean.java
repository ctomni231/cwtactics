package org.wolftec.cwtactics.game.renderer;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.layergfx.DirectionUtil.Direction;
import org.wolftec.wPlay.layergfx.GraphicLayer;
import org.wolftec.wPlay.layergfx.Sprite;
import org.wolftec.wPlay.layergfx.SpriteManager;

@ManagedComponent
public class UnitLayerBean extends GraphicLayer {

  @Injected
  private SpriteManager sprites;

  @Injected
  private GameManager gameround;

  private Canvas temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");
  public int hiddenUnitId;

  @Override
  public int getIndex() {
    return EngineGlobals.LAYER_UNIT;
  }

  @Override
  public int getNumberOfFrames() {
    return EngineGlobals.LAYER_UNIT_FRAMES;
  }

  @Override
  public int getFrameTime() {
    return EngineGlobals.LAYER_UNIT_FRAMETIME;
  }

  /** */
  public void setHiddenUnitId(int unitId) {
    hiddenUnitId = unitId;
  }

  @Override
  public void onScreenShift(Direction dir, int offsetX, int offsetY, int amount, int scale) {
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

  @Override
  public void onSetScreenPosition(int x, int oy, int offsetX, int offsetY) {
    int halfTileBase = JSGlobal.parseInt(EngineGlobals.TILE_BASE / 2, 10);
    Unit hiddenUnit = (hiddenUnitId != EngineGlobals.INACTIVE_ID ? gameround.getUnit(hiddenUnitId) : null);

    for (int xe = x + w; x < xe; x++) {
      for (int y = oy, ye = y + h; y < ye; y++) {
        Tile tile = gameround.getTile(x, y);
        if (tile.visionClient == 0) {
          continue;
        }

        Unit unit = tile.unit;
        if (unit == null || hiddenUnit == unit) continue;

        Sprite unitSprite = sprites.getSprite(unit.getType().ID);

        // grab color
        int state = EngineGlobals.INACTIVE_ID;
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
        int shadowState = EngineGlobals.INACTIVE_ID;
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

          int scx = (EngineGlobals.TILE_BASE * 2) * n;
          int scy = 0;
          int scw = EngineGlobals.TILE_BASE * 2;
          int sch = EngineGlobals.TILE_BASE * 2;
          int tcx = (x - offsetX) * EngineGlobals.TILE_BASE - halfTileBase;
          int tcy = (y - offsetY) * EngineGlobals.TILE_BASE - halfTileBase;
          int tcw = EngineGlobals.TILE_BASE + EngineGlobals.TILE_BASE;
          int tch = EngineGlobals.TILE_BASE + EngineGlobals.TILE_BASE;

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

  @Override
  public void onFullScreenRender() {
    int x = screenOffsetX;
    int y = screenOffsetY;
    int w = (gameround.getMapWidth() < EngineGlobals.SCREEN_WIDTH) ? gameround.getMapWidth() : EngineGlobals.SCREEN_WIDTH;
    int h = (gameround.getMapHeight() < EngineGlobals.SCREEN_HEIGHT) ? gameround.getMapHeight() : EngineGlobals.SCREEN_HEIGHT;

    clearAll();

    renderUnits(x, y, w, h);
    renderLayer(indexUnitAnimation);
  }
}
