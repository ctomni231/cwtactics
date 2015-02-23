package org.wolfTec.cwt.game.states.menu;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.statemachine.MenuState;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class MainMenuState implements MenuState {

  @Override
  public void keyAction(StateMachineBean stm) {
    stm.changeToStateClass(MainMenuState.class);
  }

}
