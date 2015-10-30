package org.wolftec.cwt.states.misc;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.renderer.jslix.ImageLibrary;
import org.wolftec.wTec.log.Log;
import org.wolftec.wTec.state.AbstractState;
import org.wolftec.wTec.state.StateFlowData;
import org.wolftec.cwt.renderer.GraphicManager;

/* TempState.java
 * 
 * A temporary class made to test out the game without causing any damage to the existing classes.
 * This class will be used to understand the engine flow and how to use classes within the engine.
 * It may also be a dumping ground to experimental actions.
 * 
 * 2015.09.10
 */
public class TempState extends AbstractState {

  private Log log;

  @Override
  public void onEnter(StateFlowData transition) {

    // This stores the image in a "<img id="image" .... >
    ImageLibrary.store("../image/background/MinuteWars.png");
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    // ctx.font = "24pt Arial";

    // ctx.fillStyle = "#CEF6D8";
    // ctx.fillRect(0, 0, gfx.absoluteScreenWidth(),
    // gfx.absoluteScreenHeight());

    // ctx.fillStyle = "#1C1C1C";
    // ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60,
    // 400);

    // ctx.fillStyle = "#610B0B";
    // ctx.fillText("- Development Version -", 40, 100, 400);

    ctx.drawImage(ImageLibrary.pull(), 100, 100);
    // ctx.drawImage(ImageLibrary.pull(), 100, 100, 400, 300);
    // ctx.drawImage(ImageLibrary.pull(), 100, 100, 400, 300, 0, 0, 400, 300);

    // JSObjectAdapter.$js("var image = document.getElementById('image')");
    // JSObjectAdapter.$js("ctx.drawImage(image, 100, 100)");
  }

}
