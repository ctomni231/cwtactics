package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Created;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.persistence.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class GrabAssetsState implements State {

  @Created("{name=$beanName}")
  private Logger log;
  
  @Injected
  private VirtualFilesystem storage;
  
  private boolean completed;
  
  @Override
  public void enter() {
    log.info("grabbing game data from game data server");
  }

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {
    
    if (completed) {
      stm.changeToStateClass(LoadAssetsState.class);
    }
  }

}
