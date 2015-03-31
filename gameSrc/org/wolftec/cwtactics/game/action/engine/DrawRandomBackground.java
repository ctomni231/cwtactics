package org.wolftec.cwtactics.game.action.engine;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.renderer.BackgroundLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
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
