package org.wolftec.cwt.controller.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.view.GraphicManager;
import org.wolftec.cwt.view.input.InputService;

public class NoneState extends State {

  private Log log;
  private InputService input;

  @Override
  public void onEnter(StateFlowData transition) {
    setupDevKeys();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input) {
    transition.setTransitionTo("CheckSystemState");
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.font = "24pt Arial";

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60, 400);

    ctx.fillStyle = "#610B0B";
    ctx.fillText("- Development Version -", 40, 100, 400);
  }

  private void setupDevKeys() {
    log.info("setup development input mapping");
    input.setButtonMapping("ENTER", GameActionConstants.BUTTON_A);
    input.setButtonMapping("CTRL", GameActionConstants.BUTTON_B);
    input.setButtonMapping("ARROW LEFT", GameActionConstants.BUTTON_LEFT);
    input.setButtonMapping("ARROW RIGHT", GameActionConstants.BUTTON_RIGHT);
    input.setButtonMapping("ARROW UP", GameActionConstants.BUTTON_UP);
    input.setButtonMapping("ARROW DOWN", GameActionConstants.BUTTON_DOWN);
  }
}
