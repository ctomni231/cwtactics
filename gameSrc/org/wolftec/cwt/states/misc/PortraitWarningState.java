package org.wolftec.cwt.states.misc;

import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.system.Option;

public class PortraitWarningState extends AbstractState {

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
    return NO_TRANSITION;
  }
}
