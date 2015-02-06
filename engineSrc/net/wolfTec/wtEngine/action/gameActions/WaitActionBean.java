package net.wolfTec.wtEngine.action.gameActions;

import net.wolfTec.wtEngine.action.Action;
import net.wolfTec.wtEngine.action.ActionData;
import net.wolfTec.wtEngine.model.GameRoundBean;
import net.wolfTec.wtEngine.renderer.layers.UnitLayerBean;

public class WaitActionBean implements Action {

  private GameRoundBean gameround;
  private UnitLayerBean unitLayer;
  
  @Override public String getId() {
    return "wait";
  }

  @Override public void call(ActionData data) {
    gameround.getUnit(data.p1).setCanAct(false);
    // TODO full re-render.. maybe a little bit to much huh ?
    unitLayer.onFullScreenRender();
  }
}
