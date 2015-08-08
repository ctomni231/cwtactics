package org.wolftec.cwt.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.State;

public class NoneState implements State {

  @Override
  public Class<? extends State> update(int delta, InputManager input) {
    return LoadingState.class;
  }

  @Override
  public void render(int delta, GraphicManager graphic) {
    CanvasRenderingContext2D ctx = graphic.mainCtx;

    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, graphic.absoluteScreenWidth(), graphic.absoluteScreenHeight());

    ctx.strokeStyle = "black";
    ctx.strokeText("CustomWars: Tactics (" + Constants.VERSION + ")", 10, 10, 400);

    ctx.strokeStyle = "red";
    ctx.strokeText("-! Development Version !-", 10, 30, 400);
  }
}
