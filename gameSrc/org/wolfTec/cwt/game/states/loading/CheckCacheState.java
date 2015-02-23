package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.persistence.FileDescriptor;
import org.wolfTec.wolfTecEngine.persistence.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class CheckCacheState implements State {

  @Injected
  private VirtualFilesystem storage;

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {
    storage.readFile(null, (FileDescriptor<Boolean> entry) -> { // TODO
      if (entry.value) {
        stm.changeToStateClass(LoadAssetsState.class);
      } else {
        stm.changeToStateClass(GrabAssetsState.class);
      }
    });
  }
}