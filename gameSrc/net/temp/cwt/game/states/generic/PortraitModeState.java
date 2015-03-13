package net.temp.cwt.game.states.generic;

import net.temp.cwt.game.renderer.beans.UserInterfaceLayerBean;
import net.temp.wolfTecEngine.input.InputManager;
import net.temp.wolfTecEngine.statemachine.State;
import net.temp.wolfTecEngine.statemachine.StateManager;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;

@ManagedComponent
public class PortraitModeState implements State {

  @Injected
  private UserInterfaceLayerBean ui;

  private String lastStateId;
  private boolean rendered;

  @Override
  public void enter(StateManager stm) {
    lastStateId = null;
  }

  @Override
  public void update(StateManager stm, InputManager input, int delta) {
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
