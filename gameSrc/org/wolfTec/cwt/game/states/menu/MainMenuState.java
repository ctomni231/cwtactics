package org.wolfTec.cwt.game.states.menu;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.statemachine.MenuState;

@Bean
public class MainMenuState implements MenuState {

  @Override
  public void keyAction() {
    changeState(MainMenuState.class);
  }

}
