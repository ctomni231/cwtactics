package org.wolfTec.cwt.game.renderer.layers;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.renderer.ScreenLayer;
import org.wolfTec.cwt.game.renderer.SpriteManagerBean;
import org.wolfTec.cwt.utility.Bean;
import org.wolfTec.cwt.utility.Injected;

@Bean public class UserInterfaceLayerBean extends ScreenLayer {

  @Injected private SpriteManagerBean sprites;

  @Override public int getZIndex() {
    return 6;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_UI";
  }

  /**
   * Renders the cursor to the UI layer.
   */
  public void eraseCursor() {
    Element cursorImg = sprites.getSprite("CURSOR").getImage(0);
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);
    int h = JSGlobal.parseInt(Constants.TILE_BASE / 2, 10);
    x = (x - screenOffsetX) * Constants.TILE_BASE;
    y = (y - screenOffsetY) * Constants.TILE_BASE;

    // render cursor at new position
    ctx.drawImage(cursorImg, x - h, y - h);
    ctx.drawImage(cursorImg, x + h + h, y + h + h);
    ctx.drawImage(cursorImg, x + h + h, y - h);
    ctx.drawImage(cursorImg, x - h, y + h + h);
  }

  /**
   * Renders the cursor to the UI layer.
   */
  public void renderCursor() {
    Element cursorImg = sprites.getSprite("CURSOR").getImage(0);
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);
    int h = JSGlobal.parseInt(Constants.TILE_BASE / 2, 10);
    x = (x - screenOffsetX) * Constants.TILE_BASE;
    y = (y - screenOffsetY) * Constants.TILE_BASE;

    // render cursor at new position
    ctx.drawImage(cursorImg, x - h, y - h);
    ctx.drawImage(cursorImg, x + h + h, y + h + h);
    ctx.drawImage(cursorImg, x + h + h, y - h);
    ctx.drawImage(cursorImg, x - h, y + h + h);
  }

  /**
   * Shows the native browser cursor.
   */
  public void showNativeCursor() {
    Canvas canvas = getLayer(Constants.INACTIVE_ID);
    JSObjectAdapter.$js("canvas.style.cursor = ''");
  }

  /**
   * Hides the native browser cursor.
   */
  public void hideNativeCursor() {
    Canvas canvas = getLayer(Constants.INACTIVE_ID);
    JSObjectAdapter.$js("canvas.style.cursor = 'none'");
  }
}
