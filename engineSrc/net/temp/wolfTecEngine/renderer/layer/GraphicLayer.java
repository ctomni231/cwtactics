package net.temp.wolfTecEngine.renderer.layer;

import net.temp.wolfTecEngine.renderer.screen.DirectionUtil.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.core.BrowserUtil;
import org.wolftec.core.Internal;

public abstract class GraphicLayer {

  protected Canvas cv;
  protected CanvasRenderingContext2D ctx;
  protected Array<Canvas> imageData;

  /**
   * 
   * @return
   */
  @Deprecated
  public abstract int getIndex();

  /**
   * 
   * @return the amount of frames in the graphic layer
   */
  @Deprecated
  public abstract int getNumberOfFrames();

  /**
   * 
   * @return time in ms per frame (should be a multiple of 16ms)
   */
  @Deprecated
  public abstract int getFrameTime();

  /**
   * 
   * @param canvasId
   * @param frames
   * @param width
   * @param height
   */
  @Internal
  protected void initialize(int width, int height) {
    this.cv = BrowserUtil.createDomElement("canvas");
    this.cv.width = width;
    this.cv.height = height;
    this.ctx = this.cv.getContext("2d");

    this.imageData = JSCollections.$array();
    for (int i = 0; i < getNumberOfFrames(); i++) {
      this.imageData.push(BrowserUtil.createDomElement("canvas"));
    }
    
    this.clearAll();
  }

  public void clearDrawCanvas() {
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
  }

  /**
   * Clears the layer with the given index.
   *
   * @param index
   *          index of the layer
   */
  public void clearDrawCanvasAt(int sx, int sy, int sw, int sh) {
    this.ctx.clearRect(sx, sy, sw, sh);
  }

  public void loadStateIntoDrawCanvas(int state) {
    this.clearDrawCanvas();
    this.ctx.drawImage(this.imageData.$get(state), 0, 0);
  }

  public void saveDrawCanvasAsState(int state) {
    CanvasRenderingContext2D sCtx = this.imageData.$get(state).getContext("2d");
    sCtx.clearRect(0, 0, this.cv.width, this.cv.height);
    sCtx.drawImage(this.cv, 0, 0);
    this.clearDrawCanvas();
  }

  public CanvasRenderingContext2D getRenderingContext() {
    return this.ctx;
  }

  @Internal
  public void onScreenShift(Direction dir, int offsetX, int offsetY, int amount, int scale) {

  }

  @Internal
  public void onFullScreenRender() {

  }

  @Internal
  public void onSetScreenPosition(int x, int y, int offsetX, int offsetY) {

  }

  /**
   * Clears the layer with the given index.
   *
   * @param index
   *          index of the layer
   */
  public void clear(int state) {
    this.imageData.$set(state, null);
  }

  /**
   * Clears all background layers including the front layer.
   */
  public void clearAll() {
    for (int i = 0; i < getNumberOfFrames(); i++) {
      this.imageData.$set(i, null);
    }
  }

  /**
   * 
   * @param state
   * @return
   */
  public Canvas getImage(int state) {
    return this.imageData.$get(state);
  }
}
