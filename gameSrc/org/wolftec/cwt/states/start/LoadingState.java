package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputData;
import org.wolftec.cwt.states.State;

public class LoadingState implements State {

  @Override
  public Class<? extends State> update(int delta, InputData lastInput) {
    return null;
  }

  @Override
  public void render(int delta) {
  }
}
