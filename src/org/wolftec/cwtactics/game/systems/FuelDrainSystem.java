package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.FuelDrain;
import org.wolftec.cwtactics.game.components.MovingSupplies;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.TurnStarts;
import org.wolftec.cwtactics.game.events.gameround.UnitDestroyed;

public class FuelDrainSystem implements System, TurnStarts {

  private UnitDestroyed              destroyEvent;

  private Components<FuelDrain>      drainers;
  private Components<MovingSupplies> fuels;

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
