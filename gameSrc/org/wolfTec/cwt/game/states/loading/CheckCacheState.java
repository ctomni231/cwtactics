package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.persistence.StorageEntry;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class CheckCacheState implements State {

  @Injected
  private StorageBean storage;

  @Override
  public void update(int delta, InputData input) {
    storage.get(EngineGlobals.STORAGE_PARAMETER_CACHED_CONTENT, (StorageEntry<Boolean> entry) -> {
      if (entry.value) {
        changeState(LoadAssetsState.class);
      } else {
        changeState(GrabAssetsState.class);
      }
    });
  }
}