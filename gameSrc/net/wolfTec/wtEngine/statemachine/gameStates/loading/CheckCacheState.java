package net.wolfTec.wtEngine.statemachine.gameStates.loading;

import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.input.InputData;
import net.wolfTec.wtEngine.persistence.StorageBean;
import net.wolfTec.wtEngine.persistence.StorageEntry;
import net.wolfTec.wtEngine.statemachine.State;

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
