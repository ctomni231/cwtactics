package org.wolftec.wPlay.state;

import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.gui.UiInputHandler;
import org.wolftec.wPlay.input.LiveInputManager;

public interface MenuState extends State {

  @Override
  default void init(StateManager stm) {
    UiElement root = new UiContainer().styleByQuery("0px 0px 100% 100%");
    UiInputHandler input = new UiInputHandler();

    createLayout(stm, input, (UiContainer) root);
  }

  void createLayout(StateManager stm, UiInputHandler input, UiContainer root);

  @Override
  default void update(StateManager stm, LiveInputManager input, int delta) {

  }
}
