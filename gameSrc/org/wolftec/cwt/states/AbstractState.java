package org.wolftec.cwt.states;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Option;

public class AbstractState implements Injectable {

  public static final Option<Class<? extends AbstractState>> NO_TRANSITION = Option.empty();

  /**
   * Called when the state will be leaved.
   * 
   * @param transition
   *          transition data
   */
  public void onExit(StateTransition transition) {

  }

  /**
   * Called when the state will be entered.
   * 
   * @param transition
   *          transition data
   */
  public void onEnter(StateTransition transition) {

  }

  /**
   * Called at first in a new frame.
   * 
   * @param transition
   *          transition data
   * @param delta
   *          time since the last frame
   */
  public void update(StateTransition transition, int delta, InputProvider input) {
  }

  /**
   * Called after update to render the changes.
   * 
   * @param delta
   *          time since the last frame
   */
  public void render(int delta, GraphicManager gfx) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.font = "24pt Arial";
    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("STATE: " + ClassUtil.getClassName(this), 30, 60, 400);
  }
}
