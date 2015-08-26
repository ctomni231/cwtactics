package org.wolftec.cwt.states;

import org.wolftec.cwt.system.Option;

public class StateTransition {

  private Class<? extends AbstractState> previousState;
  private Class<? extends AbstractState> nextState;

  public void setTransitionFrom(Class<? extends AbstractState> nullableState) {
    previousState = nullableState;
  }

  public void setTransitionTo(Class<? extends AbstractState> nullableState) {
    nextState = nullableState;
  }

  public Option<Class<? extends AbstractState>> getNextState() {
    return Option.ofNullable(nextState);
  }

  public Option<Class<? extends AbstractState>> getPreviousState() {
    return Option.ofNullable(previousState);
  }

}
