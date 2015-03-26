package org.wolftec.cwtactics.game.renderer;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.layergfx.GraphicLayer;
import org.wolftec.wPlay.layergfx.Sprite;

/**
 * Background layer contains the background image of the screen. It's visible in
 * the menu and on maps which are smaller than the screen.
 */
@ManagedComponent
public class BackgroundLayerBean extends GraphicLayer {

  @Override
  public int getIndex() {
    return EngineGlobals.LAYER_BG;
  }

  @Override
  public int getNumberOfFrames() {
    return EngineGlobals.LAYER_BG_FRAMES;
  }

  @Override
  public int getFrameTime() {
    return EngineGlobals.LAYER_BG_FRAMETIME;
  }

  /**
   * Renders a background image.
   * 
   * @param bg
   */
  public void renderBackgroundImage(Sprite bg) {
    clearDrawCanvas();

    // TODO stretch while protecting aspect ratio
    bg.drawStrechedSprite(0, ctx, 0, 0, cv.width, cv.height);
  }

}
