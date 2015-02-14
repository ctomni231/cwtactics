package org.wolfTec.cwt.game.statemachine.gameStates.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
public class GrabAssetsState extends State {

  private boolean completed;
  
  @Override
  public String getId() {
    return EngineGlobals.STATE_GRAB_ASSETS;
  }

  @Injected
  private StorageBean storage;
  
  @Override
  public void enter() {
    log.info("grabbing game data from game data server");
  }

  @Override
  public void update(int delta, InputData input) {
    
    if (completed) {
      statemachine.changeState(EngineGlobals.STATE_LOAD_ASSETS);
    }
  }

}
