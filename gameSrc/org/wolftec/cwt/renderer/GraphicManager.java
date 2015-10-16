package org.wolftec.cwt.renderer;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.Log;
import org.wolftec.cwt.core.ioc.Injectable;

/**
 * Base class which holds a reference to the game canvas.
 * 
 */
public class GraphicManager implements Injectable {

  private static final String     CANVAS_RENDER_CONTEXT = "2d";
  private static final String     CANVAS_ID             = "gameCanvas";

  private Log                     log;

  public Canvas                   mainCanvas;
  public CanvasRenderingContext2D mainCtx;

  public Canvas                   bufferCanvas;
  public CanvasRenderingContext2D bufferCtx;

  @Override
  public void onConstruction() {
    log.info("constructing canvas manager");

    mainCanvas = (Canvas) Global.window.document.getElementById(CANVAS_ID);
    mainCtx = mainCanvas.getContext(CANVAS_RENDER_CONTEXT);

    bufferCanvas = (Canvas) Global.window.document.createElement("canvas");
    bufferCtx = bufferCanvas.getContext(CANVAS_RENDER_CONTEXT);
  }

  public int absoluteScreenHeight() {
    return mainCanvas.height;
  }

  public int absoluteScreenWidth() {
    return mainCanvas.width;
  }

  public int convertPointToTile(int point) {
    return 0; // TODO
  }

  public void clearBuffer() {
    bufferCtx.clearRect(0, 0, absoluteScreenWidth(), absoluteScreenHeight());
  }

  /**
   * Copies the content of the buffer canvas into the main canvas.
   */
  public void flushBuffer() {
    mainCtx.drawImage(bufferCanvas, 0, 0, absoluteScreenWidth(), absoluteScreenHeight());
  }
}
