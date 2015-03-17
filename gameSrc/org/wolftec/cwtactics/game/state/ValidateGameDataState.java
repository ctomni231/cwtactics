package org.wolftec.cwtactics.game.state;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.system.input.LiveInputManager;
import org.wolftec.cwtactics.system.state.State;
import org.wolftec.cwtactics.system.state.StateManager;
import org.wolftec.log.Logger;
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
  public void update(StateManager stm, LiveInputManager input, int delta) {
  }

}
