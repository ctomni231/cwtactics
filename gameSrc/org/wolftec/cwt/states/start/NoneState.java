package org.wolftec.cwt.states.start;

import org.wolftec.cwt.input.InputData;
import org.wolftec.cwt.states.State;

public class NoneState implements State {

  private boolean backgroundDrawn;

  @Override
  public Class<? extends State> update(int delta, InputData lastInput) {
    return backgroundDrawn ? LoadingState.class : null;
  }

  @Override
  public void render(int delta) {
    if (!backgroundDrawn) {
      var ctx = renderer.layerBG.getContext(constants.INACTIVE);

      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);

      backgroundDrawn = true;
    }
  }
}
