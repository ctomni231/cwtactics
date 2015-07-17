package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.MovingSupplies;
import org.wolftec.cwtactics.game.components.FuelDrain;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.TurnStarts;
import org.wolftec.cwtactics.game.events.gameround.UnitDestroyed;
import org.wolftec.cwtactics.game.events.loading.LoadUnitType;

public class FuelDrainSystem implements System, LoadUnitType, TurnStarts {

  private Asserter              asserter;

  private UnitDestroyed         destroyEvent;

  private Components<FuelDrain> drainers;
  private Components<MovingSupplies> fuels;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (drainers.isComponentInRootData(data)) {
      FuelDrain drain = drainers.acquireWithRootData(entity, data);
      asserter.inspectValue("FuelDrain.daily of " + entity, drain.daily).isIntWithinRange(1, 99);
    }
  }

  @Override
  public void onTurnStarts(String player, int turn) {
    drainers.each((entity, drain) -> {
      MovingSupplies fuel = fuels.get(entity);

      fuel.fuel -= drain.daily;
      if (fuel.fuel <= 0) {
        destroyEvent.onUnitDestroyed(entity);
      }
    });
  }
}
