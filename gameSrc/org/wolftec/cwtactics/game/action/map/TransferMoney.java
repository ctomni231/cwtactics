package org.wolftec.cwtactics.game.action.map;

import org.wolftec.cwtactics.game.action.Action;
import org.wolftec.cwtactics.game.action.ActionItem;
import org.wolftec.cwtactics.game.action.ActionType;
import org.wolftec.cwtactics.game.action.TileData;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Player;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.logic.TransferLogic;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class TransferMoney implements Action {

  @Injected
  private GameManager gameround;

  @Injected
  private TransferLogic transfer;

  @Override
  public ActionType getActionType() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean isEnabled(Tile source, TileData sourceMeta, Tile target, TileData targetMeta) {
    return true;
  }

  @Override
  public void invoke(ActionItem data) {
    Player p1 = gameround.players.$get(data.p1);
    Player p2 = gameround.players.$get(data.p2);
    int money = data.p3;
    transfer.transferMoney(p1, p2, money);
  }
}
