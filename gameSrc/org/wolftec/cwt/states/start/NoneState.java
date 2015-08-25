package org.wolftec.cwt.states.start;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.system.Option;

public class NoneState extends AbstractState {

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
    return Option.of(LoadingState.class);
  }

  @Override
  public void render(int delta) {
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
