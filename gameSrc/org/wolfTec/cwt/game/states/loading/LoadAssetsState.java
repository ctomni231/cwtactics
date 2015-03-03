package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.cwt.game.persistence.beans.GameLoadingManager;
import org.wolfTec.wolfTecEngine.beans.CreatedType;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.ManagedComponent;
import org.wolfTec.wolfTecEngine.beans.ThisSafe;
import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateManager;

@ManagedComponent
public class LoadAssetsState implements State {

  @CreatedType
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
