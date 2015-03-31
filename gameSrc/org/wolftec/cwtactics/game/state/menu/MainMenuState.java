package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.cwtactics.game.renderer.GuiButtonRenderer;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.gui.MenuUtil;
import org.wolftec.wPlay.gui.UiContainer;
import org.wolftec.wPlay.gui.UiInputHandler;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public class MainMenuState implements MenuState {

  @Injected
  private GuiButtonRenderer buttonRenderer;

  @Override
  public void createLayout(StateManager stm, UiInputHandler input, UiContainer root) {
    UiContainer menu = MenuUtil.createContainer(root, null, "20% 20% 80% 80%");
    MenuUtil.createTransitionButton(menu, input, buttonRenderer, "main.versus", "0 0 100% 25%", SkirmishMapSelectState.class);
    MenuUtil.createTransitionButton(menu, input, buttonRenderer, "main.test.rain", "0 25% 100% 25%", null); // TODO
    MenuUtil.createTransitionButton(menu, input, buttonRenderer, "main.test.weather", "0 50% 100% 25%", null); // TODO
    MenuUtil.createTransitionButton(menu, input, buttonRenderer, "main.options", "0 75% 100% 25%", OptionsMainState.class);
    MenuUtil.registerMenuHandler(stm, input, StartScreenState.class);
  }
}
