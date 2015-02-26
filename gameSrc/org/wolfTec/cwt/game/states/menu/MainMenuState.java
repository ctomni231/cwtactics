package org.wolfTec.cwt.game.states.menu;

import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.statemachine.beans.StateMachineBean;
import org.wolfTec.wolfTecEngine.statemachine.model.MenuState;

@Bean
public class MainMenuState implements MenuState {

  @Override
  public void keyAction(StateMachineBean stm) {
    stm.changeToStateClass(MainMenuState.class);
  }

}
