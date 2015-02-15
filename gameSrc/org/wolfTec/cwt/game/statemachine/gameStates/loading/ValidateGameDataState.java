package org.wolfTec.cwt.game.statemachine.gameStates.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;

@Bean
public class ValidateGameDataState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_VALIDATE_ASSETS;
  }

  @Injected
  private StorageBean storage;

  @Override
  public void enter() {
    log.info("Validating game data");
  }
  
  @Override
  public void update(int delta, InputData input) {
  }

}
