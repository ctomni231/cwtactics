package org.wolftec.cwt.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.input.InputService;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.base.AbstractState;
import org.wolftec.cwt.states.base.GameActions;
import org.wolftec.cwt.states.base.StateFlowData;

public class NoneState extends AbstractState
{

  private Log          log;
  private InputService input;

  @Override
  public void onEnter(StateFlowData transition)
  {
    setupDevKeys();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputService input)
  {
    transition.setTransitionTo("CheckSystemState");
  }

  @Override
  public void render(int delta, GraphicManager gfx)
  {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.font = "24pt Arial";

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60, 400);

    ctx.fillStyle = "#610B0B";
    ctx.fillText("- Development Version -", 40, 100, 400);
  }

  private void setupDevKeys()
  {
    log.info("setup development input mapping");
    input.setButtonMapping("ENTER", GameActions.BUTTON_A);
    input.setButtonMapping("CTRL", GameActions.BUTTON_B);
    input.setButtonMapping("ARROW LEFT", GameActions.BUTTON_LEFT);
    input.setButtonMapping("ARROW RIGHT", GameActions.BUTTON_RIGHT);
    input.setButtonMapping("ARROW UP", GameActions.BUTTON_UP);
    input.setButtonMapping("ARROW DOWN", GameActions.BUTTON_DOWN);
  }
}
