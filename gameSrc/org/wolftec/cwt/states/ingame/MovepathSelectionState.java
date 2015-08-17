package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.Maybe;

public class MovepathSelectionState implements State {

  private UserInteractionData data;

  @Override
  public void onEnter(Maybe<Class<? extends State>> previous) {

  }

  @Override
  public void onExit() {
    // TODO Auto-generated method stub
    State.super.onExit();
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    // TODO Auto-generated method stub
    return State.super.update(delta, input);
  }
}
