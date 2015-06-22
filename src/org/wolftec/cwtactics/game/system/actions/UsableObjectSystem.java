package org.wolftec.cwtactics.game.system.actions;

import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Usable;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.actions.TurnEvents;
import org.wolftec.cwtactics.game.event.actions.UsabilityEvents;

public class UsableObjectSystem implements ConstructedClass, UsabilityEvents, TurnEvents {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

  @Override
  public void onWait(String unit) {
    em.getComponent(unit, Usable.class).canAct = false;
    ev.publish(UsabilityEvents.class).onUnitGettingUnusable(unit);
  }

  @Override
  public void onTurnEnd(String player) {
    log.info("making all objects unusable");

    JsUtil.forEachArrayValue(em.getEntitiesWithComponentType(Usable.class), (index, entity) -> {
      em.getComponent(entity, Usable.class).canAct = false;
    });
  }

  @Override
  public void onTurnStart(String player, int turn) {
    log.info("making objects of the turn owner usable");

    JsUtil.forEachArrayValue(em.getEntitiesWithComponentType(Usable.class), (index, entity) -> {
      if (em.getComponent(entity, Owner.class).owner == player) {
        em.getComponent(entity, Usable.class).canAct = true;
        ev.publish(UsabilityEvents.class).onUnitGettingUsable(entity);
      }
    });
  }
}
