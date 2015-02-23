package org.wolfTec.cwt.game.states.generic;

import org.wolfTec.cwt.game.gfx.UserInterfaceLayerBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.statemachine.State;
import org.wolfTec.wolfTecEngine.statemachine.StateMachineBean;

@Bean
public class PortraitModeState implements State {

  @Injected
  private UserInterfaceLayerBean ui;

  private String lastStateId;
  private boolean rendered;

  @Override
  public void enter() {
    lastStateId = null;
  }

  @Override
  public void update(StateMachineBean stm, int delta, InputData input) {
    boolean isLandscape = false;

    // go back to the last state when the device is back in landscape mode
    // --> don't fire enter event when changing back to the last state
    if (isLandscape) {
      stm.setState(this.lastStateId, false);
    }
  }

  @Override
  public void render(int delta) {
    if (!rendered) {
      rendered = true;
    }
  }
}
