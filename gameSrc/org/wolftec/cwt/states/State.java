package org.wolftec.cwt.states;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;

public interface State extends Injectable {

  /**
   * Called when the state will be leaved.
   */
  default void exit() {

  }

  /**
   * Called when the state will be entered.
   */
  default void enter() {

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
  default Class<? extends State> update(int delta, InputManager input) {
    return null;
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

  }
}
