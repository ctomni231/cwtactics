package org.wolfTec.cwt.game.gfx;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.gfx.annotations.LayerFrameTime;
import org.wolfTec.wolfTecEngine.gfx.annotations.LayerFrames;
import org.wolfTec.wolfTecEngine.gfx.annotations.LayerIndex;
import org.wolfTec.wolfTecEngine.gfx.model.GraphicLayer;
import org.wolfTec.wolfTecEngine.gfx.model.Sprite;

/**
 * Background layer contains the background image of the screen. It's visible in
 * the menu and on maps which are smaller than the screen.
 */
@Bean
@LayerIndex(EngineGlobals.LAYER_BG)
@LayerFrames(EngineGlobals.LAYER_BG_FRAMES)
@LayerFrameTime(EngineGlobals.LAYER_BG_FRAMETIME)
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
