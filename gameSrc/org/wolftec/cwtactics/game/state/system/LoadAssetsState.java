package org.wolftec.cwtactics.game.state.system;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.system.loading.ElementLoadedListener;
import org.wolftec.cwtactics.system.loading.GameLoadingManager;
import org.wolftec.cwtactics.system.state.State;
import org.wolftec.cwtactics.system.state.StateManager;
import org.wolftec.log.Logger;

@ManagedComponent
public class LoadAssetsState implements State, ElementLoadedListener {

  @ManagedConstruction
  private Logger log;

  @Injected
  private GameLoadingManager loader;

  @Override
  public void onLoadingElement(String element) {
    showFileToCopy(element);
  }

  @Override
  public void enter(StateManager stm) {
    loader.loadData(() -> stm.changeToStateClass(ValidateGameDataState.class));
  }

  private void showFileToCopy(String filePath) {
    // TODO render file name
  }
}
