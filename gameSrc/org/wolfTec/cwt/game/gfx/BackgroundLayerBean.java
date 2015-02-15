package org.wolfTec.cwt.game.gfx;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.gfx.Camera;
import org.wolfTec.wolfTecEngine.gfx.Sprite;

@Bean
public class BackgroundLayerBean extends Camera {

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
