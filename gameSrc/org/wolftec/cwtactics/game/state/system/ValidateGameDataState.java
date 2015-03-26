package org.wolftec.cwtactics.game.state.system;

import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;
import org.wolftec.wPlay.input.LiveInputManager;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

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
