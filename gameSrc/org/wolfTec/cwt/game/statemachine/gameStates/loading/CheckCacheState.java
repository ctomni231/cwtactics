package org.wolfTec.cwt.game.statemachine.gameStates.loading;

import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean public class CheckCacheState extends LoadingState {

  @Injected private StorageBean storage;
  
  @Override public String getId() {
    return "CHECK_LOADING";
  }
  
  @Override public void update(int delta, InputData input) {
    storage.get(Constants.STORAGE_PARAMETER_CACHED_CONTENT, (StorageEntry<Boolean> entry) -> {
      // entry.value
    });
  }

}
