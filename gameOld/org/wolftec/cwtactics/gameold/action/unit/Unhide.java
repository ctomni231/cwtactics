package org.wolftec.cwtactics.gameold.action.unit;

import org.wolftec.cwtactics.gameold.action.Action;
import org.wolftec.cwtactics.gameold.action.ActionItem;
import org.wolftec.cwtactics.gameold.action.ActionType;
import org.wolftec.cwtactics.gameold.action.TileData;
import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Tile;
import org.wolftec.cwtactics.gameold.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@Constructed
public class Unhide implements Action {

  @Injected
  private GameManager gameround;

  @Override
  public ActionType getActionType() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    Unit unit = source.unit;
    return unit.type.stealth && unit.hidden;
  }

  @Override
  public void invoke(ActionItem data) {
    gameround.units.$get(data.p1).hidden = false;
  }
}
