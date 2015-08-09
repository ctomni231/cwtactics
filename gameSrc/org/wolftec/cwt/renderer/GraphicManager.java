package org.wolftec.cwt.renderer;

import org.stjs.javascript.Global;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Log;

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

  @Override
  public void onConstruction() {
    log.info("constructing canvas manager");

    mainCanvas = (Canvas) Global.window.document.getElementById(CANVAS_ID);
    mainCtx = mainCanvas.getContext(CANVAS_RENDER_CONTEXT);
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
}
