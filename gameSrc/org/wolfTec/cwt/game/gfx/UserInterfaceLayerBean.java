package org.wolfTec.cwt.game.gfx;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.gfx.Camera;
import org.wolfTec.wolfTecEngine.gfx.SpriteManagerBean;

@Bean
public class UserInterfaceLayerBean extends Camera {

  @Injected
  private SpriteManagerBean sprites;

  @Override
  public int getZIndex() {
    return 6;
  }

  @Override
  public String getLayerCanvasId() {
    return "canvas_layer_UI";
  }

  /**
   * Renders the cursor to the UI layer.
   */
  public void eraseCursor() {
    Element cursorImg = sprites.getSprite("CURSOR").getImage(0);
    CanvasRenderingContext2D ctx = getContext(EngineGlobals.INACTIVE_ID);
    int h = JSGlobal.parseInt(EngineGlobals.TILE_BASE / 2, 10);
    x = (x - screenOffsetX) * EngineGlobals.TILE_BASE;
    y = (y - screenOffsetY) * EngineGlobals.TILE_BASE;

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
    CanvasRenderingContext2D ctx = getContext(EngineGlobals.INACTIVE_ID);
    int h = JSGlobal.parseInt(EngineGlobals.TILE_BASE / 2, 10);
    x = (x - screenOffsetX) * EngineGlobals.TILE_BASE;
    y = (y - screenOffsetY) * EngineGlobals.TILE_BASE;

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
    Canvas canvas = getLayer(EngineGlobals.INACTIVE_ID);
    JSObjectAdapter.$js("canvas.style.cursor = ''");
  }

  /**
   * Hides the native browser cursor.
   */
  public void hideNativeCursor() {
    Canvas canvas = getLayer(EngineGlobals.INACTIVE_ID);
    JSObjectAdapter.$js("canvas.style.cursor = 'none'");
  }
}
