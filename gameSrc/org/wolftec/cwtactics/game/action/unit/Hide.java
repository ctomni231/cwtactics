package org.wolftec.cwtactics.game.action.unit;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.action.TileData;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class Hide implements Action {

  @Injected
  private GameManager gameround;

  @Override
  public ActionType getActionType() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    Unit unit = source.unit;
    return unit.type.stealth && !unit.hidden;
  }

  @Override
  public void invoke(ActionItem data) {
    gameround.units.$get(data.p1).hidden = true;
  }
}
