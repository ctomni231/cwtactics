package org.wolftec.cwtactics.game.state.system;

import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wPlay.loading.ElementLoadedListener;
import org.wolftec.wPlay.loading.GameLoadingManager;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

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
