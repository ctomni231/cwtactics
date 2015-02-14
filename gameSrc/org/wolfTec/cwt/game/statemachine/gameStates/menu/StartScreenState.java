package org.wolfTec.cwt.game.statemachine.gameStates.menu;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.audio.AudioBean;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.localization.LocalizationBean;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.renderer.layers.UserInterfaceLayerBean;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.utility.ConvertUtility;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
public class StartScreenState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_VALIDATE_ASSETS;
  }

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
  public void keyAction() {
    statemachine.changeState(EngineGlobals.STATE_MAIN_MENU);
  }

  @Override
  public void update(int delta, InputData input) {
    super.update(delta, input);
    
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
