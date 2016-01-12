package org.wolftec.cwt.renderer;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;

/**
 * Base class which holds a reference to the game canvas.
 * 
 */
public class GraphicManager implements ManagedClass, Configurable
{

  private static final String CANVAS_RENDER_CONTEXT = "2d";
  private static final String CANVAS_ID             = "gameCanvas";

  private Log log;

  public Canvas                   mainCanvas;
  public CanvasRenderingContext2D mainCtx;

  public Canvas                   bufferCanvas;
  public CanvasRenderingContext2D bufferCtx;

  private Configuration cfgAnimatedMap;

  @Override
  public void onConstruction()
  {
    log.info("constructing canvas manager");

    mainCanvas = (Canvas) Global.window.document.getElementById(CANVAS_ID);
    mainCtx = mainCanvas.getContext(CANVAS_RENDER_CONTEXT);

    bufferCanvas = (Canvas) Global.window.document.createElement("canvas");
    bufferCtx = bufferCanvas.getContext(CANVAS_RENDER_CONTEXT);

    cfgAnimatedMap = new Configuration("app.gfx.map.animated", 0, 1, 1);
  }

  public int absoluteScreenHeight()
  {
    return mainCanvas.height;
  }

  public int absoluteScreenWidth()
  {
    return mainCanvas.width;
  }

  public int convertPointToTile(int point)
  {
    log.warn("convertPointToTile isn't implemented yet");
    return 0;
  }

  public void clearBuffer()
  {
    bufferCtx.clearRect(0, 0, absoluteScreenWidth(), absoluteScreenHeight());
  }

  /**
   * Copies the content of the buffer canvas into the main canvas.
   */
  public void flushBuffer()
  {
    mainCtx.drawImage(bufferCanvas, 0, 0, absoluteScreenWidth(), absoluteScreenHeight());
  }
}
