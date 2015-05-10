package org.wolftec.cwtactics.gameold.action.engine;

import org.wolftec.cwtactics.gameold.action.Action;
import org.wolftec.cwtactics.gameold.action.ActionItem;
import org.wolftec.cwtactics.gameold.action.ActionType;
import org.wolftec.cwtactics.gameold.renderer.UserInterfaceLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@Constructed
public class DrawTooltip implements Action {

  @Injected
  private UserInterfaceLayerBean ui;

  @Override
  public ActionType getActionType() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void invoke(ActionItem data) {
    // TODO Auto-generated method stub

  }

}
