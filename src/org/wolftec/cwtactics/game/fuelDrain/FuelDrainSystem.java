package org.wolftec.cwtactics.game.fuelDrain;

import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.sysobject.Asserter;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.LoadUnitType;
import org.wolftec.cwtactics.game.event.TurnStart;
import org.wolftec.cwtactics.game.event.UnitDestroyed;
import org.wolftec.cwtactics.game.move.FuelDepot;

public class FuelDrainSystem implements System, LoadUnitType, TurnStart {

  private Asserter              asserter;

  private UnitDestroyed         destroyEvent;

  private Components<FuelDrain> drainers;
  private Components<FuelDepot> fuels;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    FuelDrain drain = drainers.acquireWithRootData(entity, data);
    asserter.inspectValue("FuelDrain.daily of " + entity, drain.daily).isIntWithinRange(1, 99);
  }

  @Override
  public void onTurnStart(String player, int turn) {
    drainers.each((entity, drain) -> {
      FuelDepot fuel = fuels.get(entity);

      fuel.amount -= drain.daily;
      if (fuel.amount <= 0) {
        destroyEvent.onUnitDestroyed(entity);
      }
    });
  }
}
