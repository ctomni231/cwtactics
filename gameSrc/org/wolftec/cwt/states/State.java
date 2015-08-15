package org.wolftec.cwt.states;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Maybe;

public interface State extends Injectable {

  public static final Maybe<Class<? extends State>> NO_TRANSITION = Maybe.of(null);

  /**
   * Called when the state will be leaved.
   */
  default void onExit() {

  }

  /**
   * Called when the state will be entered.
   */
  default void onEnter() {

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
  default Maybe<Class<? extends State>> update(int delta, InputManager input) {
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
  default void render(int delta, GraphicManager graphic) {
    CanvasRenderingContext2D ctx = graphic.mainCtx;

    ctx.fillStyle = "#CEF6D8";
    ctx.fillRect(0, 0, graphic.absoluteScreenWidth(), graphic.absoluteScreenHeight());

    ctx.font = "24pt Arial";
    ctx.fillStyle = "#1C1C1C";
    ctx.fillText("STATE: " + ClassUtil.getClassName(this), 30, 60, 400);
  }
}
