package net.temp.cwt.game.states.loading;

import net.temp.wolfTecEngine.input.InputManager;
import net.temp.wolfTecEngine.logging.Logger;
import net.temp.wolfTecEngine.statemachine.State;
import net.temp.wolfTecEngine.statemachine.StateManager;

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
