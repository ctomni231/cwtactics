package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.cwt.game.persistence.beans.GameLoadingManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;

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
