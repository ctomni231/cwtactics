package org.wolftec.cwt.states;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Maybe;

public class AbstractState implements Injectable {

  public static final Maybe<Class<? extends AbstractState>> NO_TRANSITION = Maybe.of(null);

  protected InputManager                            input;
  protected GraphicManager                          gfx;

  /**
   * Called when the state will be leaved.
   */
  public void onExit() {

  }

  /**
   * Called when the state will be entered.
   */
  public void onEnter(Maybe<Class<? extends AbstractState>> previous) {

  }

  /**
   * Called at first in a new frame.
   * 
   * @param delta
   *          time since the last frame
   * @param input
   *          input manager which allows access to the currently pressed input
   *          buttons
   * @return
   */
  public Maybe<Class<? extends AbstractState>> update(int delta) {
    return NO_TRANSITION;
  }

  /**
   * Called after update to render the changes.
   * 
   * @param delta
   *          time since the last frame
   * @param canvas
   *          graphic manager instance which gives access to the game canvas
   */
  public void render(int delta) {
    CanvasRenderingContext2D ctx = gfx.mainCtx;

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

    ctx.font = "24pt Arial";
    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("STATE: " + ClassUtil.getClassName(this), 30, 60, 400);
  }
}
