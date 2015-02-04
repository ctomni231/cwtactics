package net.wolfTec.wtEngine.renderer.layers;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.renderer.ScreenLayer;
import net.wolfTec.wtEngine.renderer.Sprite;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

@Namespace("cwt") public class BackgroundLayerBean extends ScreenLayer {

  public void setBackground (Sprite bg) {
    CanvasRenderingContext2D ctx = getContext(Constants.INACTIVE_ID);

    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, cv.width, cv.height);
  }
  
  @Override public int getZIndex() {
    return 0;
  }

}
