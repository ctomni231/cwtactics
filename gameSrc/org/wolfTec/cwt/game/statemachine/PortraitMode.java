package org.wolfTec.cwt.game.statemachine;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.renderer.layers.UserInterfaceLayerBean;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.input.InputData;
import org.wolfTec.wolfTecEngine.statemachine.State;

@Bean
public class PortraitMode extends State {

  @Override
  public String getId() {
    return EngineGlobals.STATE_PORTRAIT;
  }

  @Injected
  private UserInterfaceLayerBean ui;

  private String lastStateId;
  private boolean rendered;

  @Override
  public void enter() {
    lastStateId = null;
  }

  @Override
  public void update(int delta, InputData input) {
    boolean isLandscape = false;

    // go back to the last state when the device is back in landscape mode
    // --> don't fire enter event when changing back to the last state
    if (isLandscape) {
      statemachine.setState(this.lastStateId, false);
    }
  }

  @Override
  public void render(int delta) {
    if (!rendered) {
      CanvasRenderingContext2D ctxUI = ui.getContext(EngineGlobals.INACTIVE_ID);

      ui.clear(EngineGlobals.INACTIVE_ID);

      rendered = true;
    }
  }
}
