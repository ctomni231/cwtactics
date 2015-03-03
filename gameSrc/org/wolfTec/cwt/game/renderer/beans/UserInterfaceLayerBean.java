package org.wolfTec.cwt.game.renderer.beans;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.states.StateDataBean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.ManagedComponent;
import org.wolfTec.wolfTecEngine.renderer.GraphicLayer;
import org.wolfTec.wolfTecEngine.renderer.ScreenManager;
import org.wolfTec.wolfTecEngine.renderer.Sprite;
import org.wolfTec.wolfTecEngine.renderer.SpriteManager;

/**
 * All user interface stuff will be rendered into this layer. It's the top front
 * layer of the game screen.
 */
@ManagedComponent
public class UserInterfaceLayerBean extends GraphicLayer {

  @Injected
  private SpriteManager sprites;

  @Injected
  private ScreenManager screen;

  @Injected
  private StateDataBean stateData;

  @Override
  public int getIndex() {
    return EngineGlobals.LAYER_UI;
  }

  @Override
  public int getNumberOfFrames() {
    return EngineGlobals.LAYER_UI_FRAMES;
  }

  @Override
  public int getFrameTime() {
    return EngineGlobals.LAYER_UI_FRAMETIME;
  }

  /**
   * Renders the cursor to the UI layer.
   */
  public void eraseCursor() {
    int x = (stateData.cursorX - screen.offsetX) * EngineGlobals.TILE_BASE;
    int y = (stateData.cursorY - screen.offsetY) * EngineGlobals.TILE_BASE;
    int h = JSGlobal.parseInt(EngineGlobals.TILE_BASE / 2, 10);

    loadStateIntoDrawCanvas(0);
    clearDrawCanvasAt(x - h, y - h, 3 * h, 3 * h);
    saveDrawCanvasAsState(0);
  }

  /**
   * Renders the cursor to the UI layer.
   */
  public void renderCursor() {
    int x = (stateData.cursorX - screen.offsetX) * EngineGlobals.TILE_BASE;
    int y = (stateData.cursorY - screen.offsetY) * EngineGlobals.TILE_BASE;
    Sprite cursor = sprites.getSprite("CURSOR");
    int h = JSGlobal.parseInt(EngineGlobals.TILE_BASE / 2, 10);

    loadStateIntoDrawCanvas(0);
    cursor.drawSprite(0, ctx, x - h, y - h);
    cursor.drawSprite(0, ctx, x + h + h, y + h + h);
    cursor.drawSprite(0, ctx, x + h + h, y - h);
    cursor.drawSprite(0, ctx, x - h, y + h + h);
    saveDrawCanvasAsState(0);
  }

  /**
   * Shows the native browser cursor.
   */
  public void showNativeCursor() {
    JSObjectAdapter.$js("this.cv.style.cursor = ''");
  }

  /**
   * Hides the native browser cursor.
   */
  public void hideNativeCursor() {
    JSObjectAdapter.$js("this.cv.style.cursor = 'none'");
  }
}
