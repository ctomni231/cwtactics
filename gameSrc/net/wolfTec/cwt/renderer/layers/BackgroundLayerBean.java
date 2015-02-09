package net.wolfTec.cwt.renderer.layers;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.renderer.ScreenLayer;
import net.wolfTec.cwt.renderer.Sprite;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.utility.Bean;

@Bean public class BackgroundLayerBean extends ScreenLayer {
  
  @Override public int getZIndex() {
    return 0;
  }

  @Override public String getLayerCanvasId() {
    return "canvas_layer_Background";
  }
  
  public void setBackground (Sprite bg) {
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, cv.width, cv.height);
  }

}
