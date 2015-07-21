package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.FireAble;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.DamageUnit;
import org.wolftec.cwtactics.game.events.gameround.FireRocket;

public class SpecialWeaponsSystem implements System, FireRocket {

  private DamageUnit           damageEvent;

  private Components<FireAble> firables;
  private Components<Position> positions;
  private Components<Living>   livings;

  @Override
  public void onFireRocket(String silo, String firer, int tx, int ty) {
    FireAble fireAble = firables.get(silo);

    positions.each((entity, pos) -> {
      if (livings.has(entity)) {
        int diffX = Math.abs(pos.x - tx);
        int diffY = Math.abs(pos.y - ty);
        if (diffX + diffY <= fireAble.range) {
          damageEvent.onDamageUnit(entity, fireAble.damage, 10);
        }
      }
    });
  }
}
