package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Usable;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.TurnEnd;
import org.wolftec.cwtactics.game.events.gameround.TurnStarts;
import org.wolftec.cwtactics.game.events.gameround.UnitGettingUnusable;
import org.wolftec.cwtactics.game.events.gameround.UnitGettingUsable;
import org.wolftec.cwtactics.game.events.gameround.Wait;

@SyntheticType
public class UsableSystem implements System, Wait, TurnEnd, TurnStarts {

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
  public void onTurnStarts(String player, int turn) {
    log.info("making objects of the turn owner usable");
    usables.each((entity, usable) -> {
      if (owners.get(entity).owner == player) {
        usable.canAct = false;
        beUsableEvent.onUnitGettingUsable(entity);
      }
    });
  }
}
