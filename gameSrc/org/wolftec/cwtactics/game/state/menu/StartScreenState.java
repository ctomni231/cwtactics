package org.wolftec.cwtactics.game.state.menu;

import org.wolftec.core.ConvertUtility;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.renderer.UserInterfaceLayerBean;
import org.wolftec.cwtactics.game.state.InputAction;
import org.wolftec.cwtactics.system.audio.AudioManager;
import org.wolftec.cwtactics.system.input.LiveInputManager;
import org.wolftec.cwtactics.system.state.MenuState;
import org.wolftec.cwtactics.system.state.StateManager;
import org.wolftec.i18n.LocalizationManager;

@ManagedComponent
public class StartScreenState implements MenuState {

  @Injected
  private AudioManager audio;

  @Injected
  private LocalizationManager localization;

  @Injected
  private UserInterfaceLayerBean ui;

  private int timeLeft;
  private int maxTooltips;
  private String activeAdvice;

  @Override
  public void enter(StateManager stm) {
    timeLeft = 0;
    maxTooltips = ConvertUtility.strToInt(localization.solveKey("TOOLTIPS"));

    // TODO random background
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
