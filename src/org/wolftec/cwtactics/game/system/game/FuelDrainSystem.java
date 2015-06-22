package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.FuelDrain;
import org.wolftec.cwtactics.game.components.Movable;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;
import org.wolftec.cwtactics.game.event.actions.TurnEvents;

public class FuelDrainSystem implements ConstructedClass, LoadEntityEvent, TurnEvents {

  private EntityManager em;
  private EventEmitter ev;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, FuelDrain.class, (drain) -> {
          asserter.inspectValue("FuelDrain.daily of " + entity, drain.daily).isIntWithinRange(1, 99);
        });
        break;
    }
  }

  @Override
  public void onTurnStart(String player, int turn) {
    JsUtil.forEachArrayValue(em.getEntitiesWithComponentType(FuelDrain.class), (index, entity) -> {
      FuelDrain drain = em.getComponent(entity, FuelDrain.class);
      Movable mover = em.getComponent(entity, Movable.class);

      mover.fuel -= drain.daily;

      if (mover.fuel <= 0) {
        ev.publish(UnitDestroyedEvent.class).onUnitDestroyed(entity);
      }
    });
  }
}
