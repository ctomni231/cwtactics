package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class GrabAssetsState implements State {

  private boolean completed;
  
  @Injected
  private VirtualFilesystem storage;
  
  @Override
  public void enter() {
    log.info("grabbing game data from game data server");
  }

  @Override
  public void update(int delta, InputData input) {
    
    if (completed) {
      changeState(LoadAssetsState.class);
    }
  }

}
