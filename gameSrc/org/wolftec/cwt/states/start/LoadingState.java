package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.State;

public class LoadingState implements State {

  @Override
  public Class<? extends State> update(int delta, InputManager input) {
    return LoadingState.class;
  }

  @Override
  public void render(int delta, GraphicManager graphic) {
  }
}
