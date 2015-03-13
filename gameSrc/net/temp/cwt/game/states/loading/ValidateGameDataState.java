package net.temp.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class ValidateGameDataState implements State {

  @ManagedConstruction
  private Logger log;

  @Injected
  private VirtualFilesystemManager storage;

  @Override
  public void enter(StateManager stm) {
    log.info("Validating game data");
  }

  @Override
  public void update(StateManager stm, InputManager input, int delta) {
  }

}
