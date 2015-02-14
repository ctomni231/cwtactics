package org.wolfTec.cwt.game.statemachine.gameStates.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.audio.AudioBean;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
public class MainMenuState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_MAIN_MENU;
  }

  @Override
  public void keyAction() {
    statemachine.changeState(EngineGlobals.STATE_MAIN_MENU);
  }

}
