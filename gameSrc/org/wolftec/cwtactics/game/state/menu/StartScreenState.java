package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.renderer.BackgroundLayerBean;
import org.wolftec.cwtactics.game.renderer.UserInterfaceLayerBean;
import org.wolftec.cwtactics.game.state.InputAction;
import org.wolftec.wCore.core.ConvertUtility;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.i18n.LocalizationManager;
import org.wolftec.wPlay.audio.AudioManager;
import org.wolftec.wPlay.gui.UiContainer;
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

  private int timeLeft;
  private int maxTooltips;
  private String activeAdvice;

  @Override
  public void createLayout(UiContainer root, OptionsBuilderFactory options) {

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
    if (input.isActionPressed(InputAction.A) || input.isActionPressed(InputAction.B)) {
      stm.changeToStateClass(MainMenuState.class);
      return;
    }

    timeLeft--;
    if (timeLeft < 0) {
      // TODO set activeAdvice
      int randomIndex = ConvertUtility.floatToInt((float) Math.random() * maxTooltips) + 1;
      activeAdvice = localization.solveKey("TOOLTIPS_" + randomIndex);

      timeLeft = EngineGlobals.START_SCREEN_TOOLTIP_TIME;
    }
  }

  @Override
  public void render(int delta) {
  }
}
