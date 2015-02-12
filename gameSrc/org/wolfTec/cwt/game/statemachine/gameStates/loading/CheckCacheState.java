package org.wolfTec.cwt.game.statemachine.gameStates.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
public class CheckCacheState extends LoadingState {

  @Override
  public String getId() {
    return EngineGlobals.STATE_CHECK_CACHE;
  }

  @Injected
  private StorageBean storage;

  @Override
  public void update(int delta, InputData input) {
    storage.get(EngineGlobals.STORAGE_PARAMETER_CACHED_CONTENT, (StorageEntry<Boolean> entry) -> {
      // entry.value
      });
  }

}
