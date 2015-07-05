package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.FuelDepot;
import org.wolftec.cwtactics.game.components.game.FuelDrain;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.game.lifecycle.UnitDestroyed;
import org.wolftec.cwtactics.game.event.game.turn.TurnStart;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;

public class FuelDrainSystem implements System, LoadUnitType, TurnStart {

  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, FuelDrain.class, (drain) -> {
      asserter.inspectValue("FuelDrain.daily of " + entity, drain.daily).isIntWithinRange(1, 99);
    });
  }

  @Override
  public void onTurnStart(String player, int turn) {
    JsUtil.forEachArrayValue(em.getEntitiesWithComponentType(FuelDrain.class), (index, entity) -> {
      FuelDrain drain = em.getComponent(entity, FuelDrain.class);
      FuelDepot fuel = em.getComponent(entity, FuelDepot.class);

      fuel.amount -= drain.daily;

      if (fuel.amount <= 0) {
        ev.publish(UnitDestroyed.class).onUnitDestroyed(entity);
      }
    });
  }
}
