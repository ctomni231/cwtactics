package org.wolfTec.cwt.game.renderer.layers;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.renderer.ScreenLayer;
import org.wolfTec.cwt.game.renderer.Sprite;
import org.wolfTec.cwt.utility.beans.Bean;

@Bean
public class BackgroundLayerBean extends ScreenLayer {

  @Override
  public int getZIndex() {
    return 0;
  }

  @Override
  public String getLayerCanvasId() {
    return "canvas_layer_Background";
  }

  public void setBackground(Sprite bg) {
    CanvasRenderingContext2D ctx = getContext(EngineGlobals.INACTIVE_ID);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, cv.width, cv.height);
  }

}
