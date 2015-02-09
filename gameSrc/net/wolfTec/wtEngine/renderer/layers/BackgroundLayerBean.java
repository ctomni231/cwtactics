package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.Sprite;

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
