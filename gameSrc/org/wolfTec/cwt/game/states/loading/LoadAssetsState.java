package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class LoadAssetsState implements State {

  private boolean completed;
  
  @Injected
  private StorageBean storage;

  @Override
  public void enter() {
    log.info("loading game data from cache");
  }
  
  @Override
  public void update(int delta, InputData input) {
    
    if (completed) {
      changeState(ValidateGameDataState.class);
    }
  }

}
