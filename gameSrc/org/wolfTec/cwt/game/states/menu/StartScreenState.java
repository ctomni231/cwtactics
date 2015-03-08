package org.wolfTec.cwt.game.states.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.renderer.beans.UserInterfaceLayerBean;
import org.wolfTec.cwt.game.states.InputAction;
import org.wolfTec.wolfTecEngine.audio.AudioManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.localization.Localization;
import org.wolfTec.wolfTecEngine.statemachine.MenuState;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;
import org.wolfTec.wolfTecEngine.util.ConvertUtility;

@ManagedComponent
public class StartScreenState implements MenuState {

  @Injected
  private AudioManager audio;

  @Injected
  private Localization localization;

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
  public void update(StateManager stm, InputManager input, int delta) {
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
