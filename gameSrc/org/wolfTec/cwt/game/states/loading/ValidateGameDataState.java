package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.beans.annotations.Created;
import org.wolfTec.wolfTecEngine.beans.annotations.Injected;
import org.wolfTec.wolfTecEngine.input.model.InputData;
import org.wolfTec.wolfTecEngine.logging.model.Logger;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.statemachine.beans.StateMachineBean;
import org.wolfTec.wolfTecEngine.statemachine.model.State;

@Bean
public class ValidateGameDataState implements State {

  @Created("{name=$beanName}")
  private Logger log;

  @Injected
  private VirtualFilesystem storage;

  @Override
  public void enter() {
    log.info("Validating game data");
  }

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {
  }

}
