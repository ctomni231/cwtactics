package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Direction;
import net.wolfTec.wtEngine.renderer.AnimatedLayer;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.Sprite;
import net.wolfTec.wtEngine.renderer.SpriteManagerBean;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.BeanFactory;
import org.wolfTec.utility.BeanInitializationListener;

public class FocusLayerBean extends ScreenLayer implements BeanInitializationListener, AnimatedLayer {

  private SpriteManagerBean sprites;
  private Canvas temporaryCanvas;

  @Override public int getSubStates() {
    return 7;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Focus";
  }
  
  @Override public void onEngineInit(BeanFactory engine) {
    temporaryCanvas = (Canvas) Global.window.document.createElement("canvas");
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
    while (n < 7) {
      tmpContext.clearRect(0, 0, cv.width, cv.height);

      // copy visible content to temp canvas
      tmpContext.drawImage(getLayer(n), scx, scy, w, h, sx, sy, w, h);

      clear(n);
      getContext(n).drawImage(temporaryCanvas, 0, 0);

      n++;
    }
  }

  @Override public void onSetScreenPosition(int x, int y, int offsetX, int offsetY) {
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
    Element spriteImg = sprite.getImage(net.wolfTec.gameWorkflowData.focusMode);

    int oy = y;
    int ye;
    for (int xe = x + w; x < xe; x++) {
      for (y = oy, ye = y + h; y < ye; y++) {

        if (net.wolfTec.gameWorkflowData.selection.getValue(x, y) >= 0) {

          // render all phases
          int n = 0;
          while (n < 7) {

            ctx = getContext(n);

            scx = Constants.TILE_BASE * n;
            scy = 0;
            scw = Constants.TILE_BASE;
            sch = Constants.TILE_BASE;
            tcx = (x - offsetX) * Constants.TILE_BASE;
            tcy = (y - offsetY) * Constants.TILE_BASE;
            tcw = Constants.TILE_BASE;
            tch = Constants.TILE_BASE;

            ctx.globalAlpha = 0.6;

            ctx.drawImage(spriteImg, scx, scy, scw, sch, tcx, tcy, tcw, tch);

            ctx.globalAlpha = 1;

            n++;
          }
        }
      }
    }
  }

  @Override public int getZIndex() {
    return 4;
  }
}
