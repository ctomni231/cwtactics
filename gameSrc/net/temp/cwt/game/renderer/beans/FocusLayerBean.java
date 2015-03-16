package net.temp.cwt.game.renderer.beans;

import net.temp.EngineGlobals;
import net.temp.wolfTecEngine.components.PostConstruct;
import net.temp.wolfTecEngine.renderer.Direction;
import net.temp.wolfTecEngine.renderer.layer.GraphicLayer;
import net.temp.wolfTecEngine.renderer.layer.LayerFrameTime;
import net.temp.wolfTecEngine.renderer.layer.LayerFrames;
import net.temp.wolfTecEngine.renderer.layer.LayerIndex;
import net.temp.wolfTecEngine.renderer.sprite.Sprite;
import net.temp.wolfTecEngine.renderer.sprite.SpriteManager;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
@LayerIndex(EngineGlobals.LAYER_FOCUS)
@LayerFrames(EngineGlobals.LAYER_FOCUS_FRAMES)
@LayerFrameTime(EngineGlobals.LAYER_FOCUS_FRAMETIME)
public class FocusLayerBean extends GraphicLayer {

  @Injected
  private SpriteManager sprites;
  
  private Canvas temporaryCanvas;

  @PostConstruct
  public void init() {
    temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");
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
    while (n < 7) {
      tmpContext.clearRect(0, 0, cv.width, cv.height);

      // copy visible content to temp canvas
      tmpContext.drawImage(getLayer(n), scx, scy, w, h, sx, sy, w, h);

      clear(n);
      getContext(n).drawImage(temporaryCanvas, 0, 0);

      n++;
    }
  }

  @Override
  public void onSetScreenPosition(int x, int y, int offsetX, int offsetY) {
    CanvasRenderingContext2D ctx;
    int scx;
    int scy;
    int scw;
    int sch;
    int tcx;
    int tcy;
    int tcw;
    int tch;

    Sprite sprite = sprites.getSprite("FOCUS");
    Element spriteImg = sprite.getImage(org.wolftec.cwtactics.test.gameWorkflowData.focusMode);

    int oy = y;
    int ye;
    for (int xe = x + w; x < xe; x++) {
      for (y = oy, ye = y + h; y < ye; y++) {

        if (org.wolftec.cwtactics.test.gameWorkflowData.selection.getValue(x, y) >= 0) {

          // render all phases
          int n = 0;
          while (n < 7) {

            ctx = getContext(n);

            scx = EngineGlobals.TILE_BASE * n;
            scy = 0;
            scw = EngineGlobals.TILE_BASE;
            sch = EngineGlobals.TILE_BASE;
            tcx = (x - offsetX) * EngineGlobals.TILE_BASE;
            tcy = (y - offsetY) * EngineGlobals.TILE_BASE;
            tcw = EngineGlobals.TILE_BASE;
            tch = EngineGlobals.TILE_BASE;

            ctx.globalAlpha = 0.6;

            ctx.drawImage(spriteImg, scx, scy, scw, sch, tcx, tcy, tcw, tch);

            ctx.globalAlpha = 1;

            n++;
          }
        }
      }
    }
  }
}
