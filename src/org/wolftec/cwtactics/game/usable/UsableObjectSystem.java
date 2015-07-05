package org.wolftec.cwtactics.game.usable;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.core.Components;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.ActionFlags;
import org.wolftec.cwtactics.game.event.AddAction;
import org.wolftec.cwtactics.game.event.BuildActions;
import org.wolftec.cwtactics.game.event.InvokeAction;
import org.wolftec.cwtactics.game.event.TurnEnd;
import org.wolftec.cwtactics.game.event.TurnStart;
import org.wolftec.cwtactics.game.event.UnitGettingUnusable;
import org.wolftec.cwtactics.game.event.UnitGettingUsable;
import org.wolftec.cwtactics.game.event.Wait;
import org.wolftec.cwtactics.game.map.Position;
import org.wolftec.cwtactics.game.player.Owner;

@SyntheticType
public class UsableObjectSystem implements System, Wait, TurnEnd, TurnStart, BuildActions, InvokeAction {

  private Log log;

  private UnitGettingUnusable beUnusableEvent;
  private UnitGettingUsable beUsableEvent;
  private Wait waitEvent;

  private AddAction actionEvents;

  private Components<Owner> owners;
  private Components<Usable> usables;
  private Components<Position> positions;

  @Override
  public void buildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(ActionFlags.FLAG_SOURCE_UNIT_TO) == 1) {
      actionEvents.addAction("wait", true);
    }
  }

  @Override
  public void invokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "wait") {
      String unit = positions.find((entity, pos) -> EntityId.isUnitEntity(entity) && pos.x == x && pos.y == y);
      waitEvent.onWait(unit);
    }
  }

  @Override
  public void onWait(String unit) {
    usables.get(unit).canAct = false;
    beUnusableEvent.onUnitGettingUnusable(unit);
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
        beUsableEvent.onUnitGettingUsable(entity);
      }
    });
  }
}
