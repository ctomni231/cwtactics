package org.wolftec.cwt.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.input.InputManager;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.jslix.ImageLibrary;
import org.wolftec.cwt.renderer.GraphicManager;

public class NoneState extends AbstractState {

  private Log          log;
  private InputManager input;

  @Override
  public void onEnter(StateFlowData transition) {
    setupDevKeys();
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    transition.setTransitionTo("LoadingState");
  }

  private void setupDevKeys() {
    log.info("setup development input mapping");
    input.setButtonMapping("ENTER", GameActions.BUTTON_A);
    input.setButtonMapping("CTRL", GameActions.BUTTON_B);
    input.setButtonMapping("ARROW LEFT", GameActions.BUTTON_LEFT);
    input.setButtonMapping("ARROW RIGHT", GameActions.BUTTON_RIGHT);
    input.setButtonMapping("ARROW UP", GameActions.BUTTON_UP);
    input.setButtonMapping("ARROW DOWN", GameActions.BUTTON_DOWN);
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
}
