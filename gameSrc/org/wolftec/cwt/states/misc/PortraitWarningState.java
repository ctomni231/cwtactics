package org.wolftec.cwt.states.misc;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.system.Maybe;

public class PortraitWarningState extends AbstractState {

  @Override
  public Maybe<Class<? extends AbstractState>> update(int delta) {
    return NO_TRANSITION;
  }
}
