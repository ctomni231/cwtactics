package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class ValidateGameDataState implements State {

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
