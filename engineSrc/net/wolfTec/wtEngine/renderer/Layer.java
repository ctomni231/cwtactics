package net.wolfTec.wtEngine.renderer;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

@Namespace("wtEngine") public class Layer {
 
  public int getIndex() {
    return 0;
  }
  
  public int numberOfAnimationSteps() {
    return 0;
  }
  
  public CanvasRenderingContext2D getContext(int layer) {
    return null;
  }
  
  public void renderScreen(ScreenBean screen) {
    
  }
  
  // renderScreenShift(direction, amount) 
}
