package org.wolftec.cwtactics.game.usable;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.TurnEnd;
import org.wolftec.cwtactics.game.event.gameround.TurnStart;
import org.wolftec.cwtactics.game.event.gameround.UnitGettingUnusable;
import org.wolftec.cwtactics.game.event.gameround.UnitGettingUsable;
import org.wolftec.cwtactics.game.event.gameround.Wait;
import org.wolftec.cwtactics.game.player.Owner;

@SyntheticType
public class UsableSystem implements System, Wait, TurnEnd, TurnStart {

  private Log                 log;

  private UnitGettingUnusable beUnusableEvent;
  private UnitGettingUsable   beUsableEvent;

  private Components<Owner>   owners;
  private Components<Usable>  usables;

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
