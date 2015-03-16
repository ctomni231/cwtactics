package org.wolftec.cwtactics.game.state;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.game.persistence.GameLoadingManager;
import org.wolftec.cwtactics.system.state.State;
import org.wolftec.cwtactics.system.state.StateManager;
import org.wolftec.log.Logger;

@ManagedComponent
public class LoadAssetsState implements State {

  @ManagedConstruction
  private Logger log;

  @Injected
  private GameLoadingManager loader;

  @Override
  public void enter(StateManager stm) {
    loader.start(filePath -> {
      showFileToCopy(filePath);
    }, () -> {
      stm.changeToStateClass(ValidateGameDataState.class);
    });
  }

  private void showFileToCopy(String filePath) {
    // TODO render file name
  }
}
