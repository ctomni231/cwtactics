package org.wolftec.cwtactics.game.system.game;

import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwtactics.engine.bitset.BitSet;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.EventEmitter;
import org.wolftec.cwtactics.game.components.game.Owner;
import org.wolftec.cwtactics.game.components.game.Position;
import org.wolftec.cwtactics.game.components.game.Usable;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.game.TurnEvents;
import org.wolftec.cwtactics.game.event.game.UsabilityEvents;
import org.wolftec.cwtactics.game.event.ui.ActionEvents;

@SyntheticType
public class UsableObjectSystem implements ConstructedClass, UsabilityEvents, TurnEvents, ActionEvents {

  private Log log;
  private EntityManager em;
  private EventEmitter ev;

  // TODO support this by injected vars ==> event emitter
  private UsabilityEvents usabilityEvents;
  private ActionEvents actionEvents;

  @Override
  public void onBuildActions(int x, int y, String tile, String property, String unit, BitSet flags) {
    if (flags.get(FLAG_SOURCE_UNIT_TO) == 1) {
      actionEvents.onAddAction("wait", true);
    }
  }

  @Override
  public void onInvokeAction(String action, int x, int y, int tx, int ty) {
    if (action == "wait") {
      String unit = em.getEntityByFilter(Position.class, (em, entity, pos) -> EntityId.isUnitEntity(entity) && pos.x == x && pos.y == y);

      // TODO support this by injected vars
      usabilityEvents.onWait(unit);
    }
  }

  @Override
  public void onWait(String unit) {
    em.getComponent(unit, Usable.class).canAct = false;
    ev.publish(UsabilityEvents.class).onUnitGettingUnusable(unit);
  }

  @Override
  public void onTurnEnd(String player) {
    log.info("making all objects unusable");

    em.forEachComponentOfType(Usable.class, (em, entity, usable) -> {
      em.getComponent(entity, Usable.class).canAct = false;
    });
  }

  @Override
  public void onTurnStart(String player, int turn) {
    log.info("making objects of the turn owner usable");

    em.forEachComponentOfType(Usable.class, (em, entity, usable) -> {
      if (em.getComponent(entity, Owner.class).owner == player) {
        em.getComponent(entity, Usable.class).canAct = true;
        ev.publish(UsabilityEvents.class).onUnitGettingUsable(entity);
      }
    });
  }
}
