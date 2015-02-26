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
public class LoadAssetsState implements State {

  @Created("{name=$beanName}")
  private Logger log;

  @Injected
  private VirtualFilesystem storage;

  private boolean completed;

  @Override
  public void enter() {
    log.info("loading game data from cache");
  }

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {

    if (completed) {
      stm.changeToStateClass(ValidateGameDataState.class);
    }
  }

}
