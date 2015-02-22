package org.wolfTec.cwt.game.gfx;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.gfx.GraphicLayer;
import org.wolfTec.wolfTecEngine.gfx.Sprite;

/**
 * Background layer contains the background image of the screen. It's visible in
 * the menu and on maps which are smaller than the screen.
 */
@Bean
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

  public void renderBackgroundImage(Sprite bg) {
    clearDrawCanvas();
    
    // TODO stretch while protecting aspect ratio
    bg.drawStrechedSprite(0, ctx, 0, 0, cv.width, cv.height); 
  }

}
