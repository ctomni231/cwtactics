package org.wolfTec.cwt.game.statemachine.gameStates.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.wolfTecEngine.audio.AudioBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;

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
