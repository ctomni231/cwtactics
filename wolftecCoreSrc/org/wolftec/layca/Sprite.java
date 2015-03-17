package org.wolftec.layca;

import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.core.ConvertUtility;

/**
 * 
 */
public class Sprite {

  private Canvas graphic;
  private SpriteSizeMetrics size;

  /**
   * 
   * @return true when the sprite overlays
   */
  public boolean isOverlaySprite() {
    return false;
  }

  public Sprite(Canvas canvas, SpriteSizeMetrics size) {
    this.graphic = canvas;
    this.size = size;
  }

  /**
   * 
   * @param index
   * @param ctx
   * @param tx
   * @param ty
   */
  public void drawSprite(String id, CanvasRenderingContext2D ctx, int tx, int ty) {
    int sx = ConvertUtility.floatToInt(size.tileIndex.$get(id) % size.tileWidth);
    int sy = 0; 
    
    // TODO support of table like sprite sheets 

    ctx.drawImage(graphic, sx * size.tileWidth, sy * size.tileHeight, tx, ty);
  }

  /**
   * 
   * @param index
   * @param ctx
   * @param tx
   * @param ty
   */
  public void drawStrechedSprite(String id, CanvasRenderingContext2D ctx, int tx, int ty,
      int width, int height) {

    int sx = ConvertUtility.floatToInt(size.tileIndex.$get(id) % size.tileWidth);
    int sy = 0; 
    
    // TODO support of table like sprite sheets
    
    ctx.drawImage(graphic, sx * size.tileWidth, sy * size.tileHeight, size.tileWidth,
        size.tileHeight, tx, ty, width, height);
  }
}
