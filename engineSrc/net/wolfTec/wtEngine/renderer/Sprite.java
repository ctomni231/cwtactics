package net.wolfTec.wtEngine.renderer;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Canvas;

@Namespace("wtEngine") public class Sprite {
  
  public Canvas graphic;
  public int getNumberFrames() {
    return 0;
  }
  public int spriteHeight;
  public int spriteWidth;
  public int offsetX;
  public int offsetY;
  public int height;
  public int width;
  
  public boolean isOverlaySprite() {
    return false;
  }
  
  public void drawIntoLayer(Layer layer, int x, int y, int scale) {
    
  }
  
  public void drawStepIntoLayer(Layer layer, int x, int y, int scale, int step) {
    
  }
}
