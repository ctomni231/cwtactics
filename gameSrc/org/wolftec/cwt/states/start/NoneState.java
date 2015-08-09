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

    ctx.font = "24pt Arial";

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, graphic.absoluteScreenWidth(), graphic.absoluteScreenHeight());

    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60, 400);

    ctx.fillStyle = "#610B0B";
    ctx.fillText("- Development Version -", 40, 100, 400);
  }
}
