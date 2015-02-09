package net.wolfTec.cwt.statemachine.gameStates.loading;

import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.input.InputData;
import net.wolfTec.cwt.persistence.StorageBean;
import net.wolfTec.cwt.persistence.StorageEntry;
import net.wolfTec.cwt.statemachine.State;

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
