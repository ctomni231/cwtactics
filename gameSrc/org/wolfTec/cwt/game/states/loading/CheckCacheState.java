package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.persistence.FileDescriptor;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class CheckCacheState implements State {

  @Injected
  private VirtualFilesystem storage;

  @Override
  public void update(int delta, InputData input) {
    storage.readFile(EngineGlobals.STORAGE_PARAMETER_CACHED_CONTENT, (FileDescriptor<Boolean> entry) -> {
      if (entry.value) {
        changeState(LoadAssetsState.class);
      } else {
        changeState(GrabAssetsState.class);
      }
    });
  }
}