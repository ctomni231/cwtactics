package org.wolfTec.cwt.game.statemachine.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.persistence.StorageEntry;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class CheckCacheState extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_CHECK_CACHE;
  }

  @Injected
  private StorageBean storage;

  @Override
  public void update(int delta, InputData input) {
    storage.get(EngineGlobals.STORAGE_PARAMETER_CACHED_CONTENT, (StorageEntry<Boolean> entry) -> {
      statemachine.changeState(entry.value ? EngineGlobals.STATE_LOAD_ASSETS
          : EngineGlobals.STATE_GRAB_ASSETS);
    });
  }

}
