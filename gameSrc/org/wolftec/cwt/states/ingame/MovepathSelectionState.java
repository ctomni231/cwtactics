package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.Option;

public class MovepathSelectionState extends AbstractState {

  private UserInteractionData data;

  @Override
  public void onEnter(Option<Class<? extends AbstractState>> previous) {

  }

  @Override
  public void onExit() {
  }

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
    return NO_TRANSITION;
  }
}
