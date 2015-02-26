package org.wolfTec.cwt.game.states.loading;

import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.beans.annotations.Injected;
import org.wolfTec.wolfTecEngine.input.model.InputData;
import org.wolfTec.wolfTecEngine.persistence.model.FileDescriptor;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.statemachine.beans.StateMachineBean;
import org.wolfTec.wolfTecEngine.statemachine.model.State;

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