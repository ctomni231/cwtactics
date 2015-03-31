package org.wolftec.cwtactics.game.action.engine;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.renderer.UserInterfaceLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
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
