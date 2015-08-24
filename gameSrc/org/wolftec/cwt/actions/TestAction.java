package org.wolftec.cwt.actions;

import org.wolftec.cwt.core.Action;
import org.wolftec.cwt.core.ActionData;
import org.wolftec.cwt.core.ActionType;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.system.Log;

public class TestAction implements Action {

  private Log log;

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data) {
    log.info("DATA P5:" + data.p5);
    data.p5++;
  }

  @Override
  public boolean isDataEvaluationCompleted(ActionData data) {
    return data.p5 >= 4;
  }

  @Override
  public void renderByData(int delta, GraphicManager gfx, ActionData data) {
    gfx.mainCtx.fillStyle = "gray";
    gfx.mainCtx.fillRect(100, 300, 300, 100);
    gfx.mainCtx.fillStyle = "black";
    gfx.mainCtx.fillText("ACTION IT: " + data.p5, 110, 310, 280);
  }

}
