package org.wolftec.cwtactics.gameold.action.engine;

import org.wolftec.cwtactics.gameold.action.Action;
import org.wolftec.cwtactics.gameold.action.ActionItem;
import org.wolftec.cwtactics.gameold.action.ActionType;
import org.wolftec.cwtactics.gameold.renderer.BackgroundLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@Constructed
public class DrawRandomBackground implements Action {

  @Injected
  private BackgroundLayerBean ui;

  @Override
  public ActionType getActionType() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void invoke(ActionItem data) {
    ui.renderRandomBackground();
  }

}
