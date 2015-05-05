package org.wolftec.cwtactics.gameold.state.menu;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.gameold.renderer.BackgroundLayerBean;
import org.wolftec.cwtactics.gameold.renderer.UserInterfaceLayerBean;
import org.wolftec.wCore.core.ConvertUtility;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.i18n.LocalizationManager;
import org.wolftec.wPlay.audio.AudioManager;
import org.wolftec.wPlay.gui.UiButtonRenderer;
import org.wolftec.wPlay.gui.UiTextFieldRenderer;
import org.wolftec.wPlay.gui.UiElement;
import org.wolftec.wPlay.input.LiveInputManager;
import org.wolftec.wPlay.state.MenuState;
import org.wolftec.wPlay.state.StateManager;

@ManagedComponent
public class StartScreenState extends MenuState {

  @Injected
  private AudioManager audio;

  @Injected
  private LocalizationManager localization;

  @Injected
  private UserInterfaceLayerBean ui;

  @Injected
  private BackgroundLayerBean bgLayer;

  @Injected
  private UiButtonRenderer buttonRenderer;

  @Injected
  private UiTextFieldRenderer textRenderer;

  private UiElement adviceEl;

  private int timeLeft;
  private int maxTooltips;

  @Override
  public void createLayout(StateManager mgr) {
    adviceEl = createTextField(root, textRenderer, "", "20% 20% 60% 40%");
    createActionButton(root, buttonRenderer, "button.startgame", "40% 80% 20% 10%", () -> mgr.changeToStateClass(MainMenuState.class));
  }

  @Override
  public void enter(StateManager stm) {
    timeLeft = 0;
    maxTooltips = ConvertUtility.strToInt(localization.solveKey("TOOLTIPS"));
    bgLayer.renderRandomBackground();
  }

  @Override
  public void exit(StateManager stm) {

    // grab ability to play sounds from an iOS device by playing an empty sound
    // in an user interaction event (exit will be invoked here after the user
    // presses the A-Button on the start screen)
    audio.playNullSound();
  }

  @Override
  public void update(StateManager stm, LiveInputManager input, int delta) {
    timeLeft--;
    if (timeLeft < 0) {

      int randomIndex = ConvertUtility.floatToInt((float) Math.random() * maxTooltips) + 1;
      adviceEl.data.$put("elementText", localization.solveKey("TOOLTIPS_" + randomIndex));

      timeLeft = EngineGlobals.START_SCREEN_TOOLTIP_TIME;
    }
  }

  @Override
  public void render(int delta) {
  }
}
