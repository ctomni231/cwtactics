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

  @Injected
  private MenuUtil menuHlp;

  @Override
  public void createLayout(StateManager stm, UiInputHandler input, UiContainer root) {
    UiContainer menu = menuHlp.createContainer(root, "20% 20% 80% 80%");
    menuHlp.createTransitionButton(menu, input, "main.versus", "0 0 100% 25%", SkirmishMapSelectState.class);
    menuHlp.createTransitionButton(menu, input, "main.test.rain", "0 25% 100% 25%", null);
    menuHlp.createTransitionButton(menu, input, "main.test.weather", "0 50% 100% 25%", null);
    menuHlp.createTransitionButton(menu, input, "main.options", "0 75% 100% 25%", OptionsMainState.class);
    menuHlp.registerMenuHandler(stm, input, StartScreenState.class);
  }
}
