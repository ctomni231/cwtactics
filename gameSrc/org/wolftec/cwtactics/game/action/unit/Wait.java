package org.wolftec.cwtactics.game.action.unit;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.action.TileData;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.renderer.UnitLayerBean;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class Wait implements Action {

  @Injected
  private GameManager gameround;

  @Injected
  private UnitLayerBean gfxUnit;

  @Override
  public ActionType getActionType() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    return true;
  }

  @Override
  public void invoke(ActionItem data) {
    // TODO full re-render.. maybe a little bit to much huh ?
    gameround.units.$get(data.p1).canAct = false;
    gfxUnit.onFullScreenRender();
  }
}
