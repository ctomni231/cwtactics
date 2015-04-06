package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.gui.UiButtonRenderer;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public class MainMenuState extends MenuState {

  @Injected
  private UiButtonRenderer buttonRenderer;

  @Override
  public void createLayout(StateManager stm) {
    UiContainer menu = createContainer(root, null, "20% 20% 80% 80%");
    createTransitionButton(menu, buttonRenderer, "main.versus", "0 0 100% 25%", SkirmishMapSelectState.class);
    createTransitionButton(menu, buttonRenderer, "main.test.rain", "0 25% 100% 25%", null); // TODO
    createTransitionButton(menu, buttonRenderer, "main.test.weather", "0 50% 100% 25%", null); // TODO
    createTransitionButton(menu, buttonRenderer, "main.options", "0 75% 100% 25%", OptionsMainState.class);
    registerMenuHandler(stm, StartScreenState.class);
  }
}
