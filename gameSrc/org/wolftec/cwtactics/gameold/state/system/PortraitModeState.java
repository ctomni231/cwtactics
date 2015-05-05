package org.wolftec.cwtactics.gameold.state.system;

import org.wolftec.cwtactics.gameold.renderer.UserInterfaceLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.input.LiveInputManager;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

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
  public void update(StateManager stm, LiveInputManager input, int delta) {
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
