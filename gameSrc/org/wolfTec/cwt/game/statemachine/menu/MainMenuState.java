package org.wolfTec.cwt.game.statemachine.menu;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.audio.AudioBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.statemachine.MenuState;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class MainMenuState extends MenuState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_MAIN_MENU;
  }

  @Override
  public void keyAction() {
    statemachine.changeState(EngineGlobals.STATE_MAIN_MENU);
  }

}
