package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;
import org.wolfTec.wolfTecEngine.vfs.Vfs;

@ManagedComponent
public class ValidateGameDataState implements State {

  @ManagedConstruction
  private Logger log;

  @Injected
  private Vfs storage;

  @Override
  public void enter(StateManager stm) {
    log.info("Validating game data");
  }

  @Override
  public void update(StateManager stm, InputManager input, int delta) {
  }

}
