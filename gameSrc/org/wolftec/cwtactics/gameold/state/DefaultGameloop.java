package org.wolftec.cwtactics.gameold.state;

import org.wolftec.cwtactics.gameold.action.ActionManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wPlay.input.GamepadBackend;
import org.wolftec.wPlay.input.LiveInputManager;
import org.wolftec.wPlay.state.GameloopHandlerBak;
import org.wolftec.wPlay.state.State;
import org.wolftec.wPlay.state.StateManager;

@Constructed
public class DefaultGameloop implements GameloopHandlerBak {

  @Injected
  private LiveInputManager input;

  @Injected
  private ActionManager action;

  @Injected
  private GamepadBackend gamepad;

  @Override
  public void update(StateManager manager, int delta) {
    State actState = manager.activeState;
    if (!actState.immediate() && action.hasQueuedActions()) {
      action.invokeNextAction();
      return;
    }

    gamepad.update(delta);

    actState.update(manager, input, delta);
    actState.render(delta);
  }

}
