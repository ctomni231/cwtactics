package org.wolftec.cwtactics.game.state;

import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.game.renderer.UserInterfaceLayerBean;
import org.wolftec.cwtactics.system.input.InputManager;
import org.wolftec.cwtactics.system.state.State;
import org.wolftec.cwtactics.system.state.StateManager;

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
