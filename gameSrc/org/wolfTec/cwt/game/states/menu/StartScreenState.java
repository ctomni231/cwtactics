package org.wolfTec.cwt.game.states.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gfx.UserInterfaceLayerBean;
import org.wolfTec.wolfTecEngine.audio.AudioBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.localization.LocalizationBean;
import org.wolfTec.wolfTecEngine.statemachine.MenuState;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;
import org.wolfTec.wolfTecEngine.util.ConvertUtility;

@Bean
public class StartScreenState implements MenuState {

  @Injected
  private AudioBean audio;

  @Injected
  private LocalizationBean localization;

  @Injected
  private UserInterfaceLayerBean ui;

  private int timeLeft;
  private int maxTooltips;
  private String activeAdvice;

  @Override
  public void enter() {
    timeLeft = 0;
    maxTooltips = ConvertUtility.strToInt(localization.solveKey("TOOLTIPS"));

    // TODO random background
  }

  @Override
  public void exit() {

    // grab ability to play sounds from an iOS device by playing an empty sound
    // in an user interaction event (exit will be invoked here after the user
    // presses the A-Button on the start screen)
    audio.playNullSound();
  }

  @Override
  public void keyAction(StateMachineBean stm) {
    stm.changeToStateClass(MainMenuState.class);
  }

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {
    evalInput(stm, input);

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
