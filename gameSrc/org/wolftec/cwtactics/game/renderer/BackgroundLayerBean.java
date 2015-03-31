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

  public void renderRandomBackground() {
    // TODO
  }

  public void renderBackground(Sprite image) {
    clearDrawCanvas();

    // TODO stretch while protecting aspect ratio
    image.drawStrechedSpriteByIndex(0, ctx, 0, 0, cv.width, cv.height);
  }

}
