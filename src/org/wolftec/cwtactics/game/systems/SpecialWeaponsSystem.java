package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.components.FireAble;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.DamageUnit;
import org.wolftec.cwtactics.game.events.gameround.FireRocket;
import org.wolftec.cwtactics.game.events.loading.LoadPropertyType;

public class SpecialWeaponsSystem implements System, FireRocket, LoadPropertyType {

  private Asserter             asserter;

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

  @Override
  public void onLoadPropertyType(String entity, Object data) {
    if (firables.isComponentInRootData(data)) {
      FireAble suicide = firables.acquireWithRootData(entity, data);
      asserter.inspectValue("FireAble.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
      asserter.inspectValue("FireAble.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
      asserter.inspectValue("FireAble.changesType of " + entity, suicide.changesType).whenNotNull(() -> {
        asserter.isEntityId();
      });
    }
  }
}
