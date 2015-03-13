package net.temp.cwt.game.states.menu;

import net.temp.EngineGlobals;
import net.temp.cwt.game.renderer.beans.UserInterfaceLayerBean;
import net.temp.cwt.game.states.InputAction;
import net.temp.wolfTecEngine.audio.AudioManager;
import net.temp.wolfTecEngine.input.InputManager;
import net.temp.wolfTecEngine.localization.Localization;
import net.temp.wolfTecEngine.statemachine.MenuState;
import net.temp.wolfTecEngine.statemachine.StateManager;

import org.wolftec.core.ConvertUtility;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

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
