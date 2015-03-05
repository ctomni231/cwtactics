package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.managed.Injected;
import org.wolfTec.managed.ManagedComponent;
import org.wolfTec.vfs.Vfs;
import org.wolfTec.wolfTecEngine.components.CreatedType;
import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;

@ManagedComponent
public class ValidateGameDataState implements State {

  @CreatedType
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
