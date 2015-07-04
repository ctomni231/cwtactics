package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.ComponentHolder;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.Usable;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.game.TurnEvents;
import org.wolftec.cwtactics.game.event.game.UsabilityEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

@SyntheticType
public class UsableObjectSystem implements ConstructedClass, UsabilityEvents, TurnEvents, ActionEvents {

  private Log log;

  private UsabilityEvents usabilityEvents;
  private ActionEvents actionEvents;

  private ComponentHolder<Owner> owners;
  private ComponentHolder<Usable> usables;
  private ComponentHolder<Position> positions;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(FLAG_SOURCE_UNIT_TO) == 1) {
      actionEvents.addAction("wait", true);
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "wait") {
      String unit = positions.find((entity, pos) -> EntityId.isUnitEntity(entity) && pos.x == x && pos.y == y);
      usabilityEvents.onWait(unit);
    }
  }

  @Override
  public void onWait(String unit) {
    usables.get(unit).canAct = false;
    usabilityEvents.onUnitGettingUnusable(unit);
  }

  @Override
  public void onTurnEnd(String player) {
    log.info("making all objects unusable");
    usables.each((entity, usable) -> usable.canAct = false);
  }

  @Override
  public void onTurnStart(String player, int turn) {
    log.info("making objects of the turn owner usable");
    usables.each((entity, usable) -> {
      if (owners.get(entity).owner == player) {
        usable.canAct = false;
        usabilityEvents.onUnitGettingUsable(entity);
      }
    });
  }
}
